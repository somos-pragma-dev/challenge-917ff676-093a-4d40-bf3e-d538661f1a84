import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { EachMessagePayload, Kafka, Consumer, ConsumerRunConfig } from 'kafkajs';
import { ConfigType } from '@nestjs/config';
import { FraudCheckRequestedEvent } from '../../application/events/fraud-check-requested.event';
import { FraudCheckService } from '../../application/services/fraud-check.service';
import { FraudCheckResponse } from '../../domain/models/fraud-check-response.model';

const KAFKA_CONSUMER_GROUP = 'fraud-check-consumer-group';
const FRAUD_CHECK_TOPIC = 'payment.fraud-check.requested';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE_MS = 1000;

export interface KafkaConsumerConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
}

@Injectable()
export class KafkaFraudConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaFraudConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;
  private readonly messageBuffer: Map<string, FraudCheckRequestedEvent> = new Map();
  private processingLock = false;

  constructor(
    @Inject(forwardRef(() => FraudCheckService))
    private readonly fraudCheckService: FraudCheckService,
    private readonly kafkaConfig: { brokers: string[] },
  ) {
    this.kafka = new Kafka({
      clientId: 'fraud-check-consumer',
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
        factor: 2,
        multiplier: 2,
      },
      connectionTimeout: 10000,
      authenticationTimeout: 10000,
    });

    this.consumer = this.kafka.consumer({
      groupId: KAFKA_CONSUMER_GROUP,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxWaitTimeInMs: 5000,
      maxBytes: 10485760,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
    this.logger.log('Módulo de consumidor Kafka para fraude inicializado correctamente');
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
    this.logger.log('Módulo de consumidor Kafka para fraude detenido correctamente');
  }

  private async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Conexión al cluster de Kafka establecida');
    } catch (error) {
      this.logger.error('Error al conectar con el cluster de Kafka', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Desconexión del cluster de Kafka completada');
      } catch (error) {
        this.logger.error('Error al desconectar del cluster de Kafka', error);
      }
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic: FRAUD_CHECK_TOPIC,
        fromBeginning: false,
      });
      this.logger.log(`Suscrito al topic: ${FRAUD_CHECK_TOPIC}`);
    } catch (error) {
      this.logger.error(`Error al suscribirse al topic ${FRAUD_CHECK_TOPIC}`, error);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    const consumerConfig: ConsumerRunConfig = {
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
      partitionsConsumedConcurrently: 3,
    };

    await this.consumer.run(consumerConfig);
    this.logger.log('Consumer de Kafka iniciado y procesando mensajes');
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const messageKey = message.key?.toString();
    const messageValue = message.value?.toString();

    if (!messageValue) {
      this.logger.warn('Mensaje recibido sin contenido, ignorando');
      return;
    }

    this.logger.log(
      `Procesando mensaje del topic ${topic}, partición ${partition}, offset ${message.offset}`,
    );

    try {
      const fraudCheckEvent: FraudCheckRequestedEvent = JSON.parse(messageValue);
      
      if (this.messageBuffer.has(fraudCheckEvent.correlationId)) {
        this.logger.warn(
          `Mensaje duplicado detectado para correlationId: ${fraudCheckEvent.correlationId}, ignorando`,
        );
        return;
      }

      this.messageBuffer.set(fraudCheckEvent.correlationId, fraudCheckEvent);

      const response = await this.processFraudCheck(fraudCheckEvent);
      
      this.logger.log(
        `Verificación antifraude completada para paymentId: ${fraudCheckEvent.paymentId}, ` +
        `resultado: ${response.approved ? 'APROBADO' : 'RECHAZADO'}`,
      );

      this.messageBuffer.delete(fraudCheckEvent.correlationId);
    } catch (error) {
      this.logger.error(
        `Error al procesar mensaje de antifraude: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      
      await this.handleProcessingError(messageKey, messageValue, error);
    }
  }

  private async processFraudCheck(
    event: FraudCheckRequestedEvent,
  ): Promise<FraudCheckResponse> {
    const result = await this.fraudCheckService.performFraudCheck(event);
    return result;
  }

  private async handleProcessingError(
    messageKey: string | undefined,
    messageValue: string,
    error: unknown,
  ): Promise<void> {
    const eventData = JSON.parse(messageValue) as FraudCheckRequestedEvent;
    const retryCount = (eventData.retryCount || 0) + 1;

    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      this.logger.error(
        `Máximo de reintentos alcanzado para el mensaje con correlationId: ${eventData.correlationId}. ` +
        `Enviando a cola de mensajes fallidos.`,
      );
      await this.sendToDeadLetterQueue(eventData, error);
      return;
    }

    const delayMs = this.calculateRetryDelay(retryCount);
    this.logger.log(
      `Reintentando procesamiento en ${delayMs}ms para correlationId: ${eventData.correlationId} ` +
      `(intento ${retryCount}/${MAX_RETRY_ATTEMPTS})`,
    );

    setTimeout(async () => {
      try {
        const retryEvent = {
          ...eventData,
          retryCount,
        };
        await this.fraudCheckService.scheduleRetry(retryEvent, delayMs);
      } catch (retryError) {
        this.logger.error(
          `Error al programar reintento para correlationId: ${eventData.correlationId}`,
          retryError,
        );
      }
    }, delayMs);
  }

  private calculateRetryDelay(attemptNumber: number): number {
    const exponentialDelay = RETRY_DELAY_BASE_MS * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return Math.floor(exponentialDelay + jitter);
  }

  private async sendToDeadLetterQueue(
    event: FraudCheckRequestedEvent,
    error: unknown,
  ): Promise<void> {
    const deadLetterMessage = {
      originalEvent: event,
      error: error instanceof Error ? error.message : 'Unknown error',
      failedAt: new Date().toISOString(),
      retryCount: event.retryCount || 0,
    };

    try {
      const producer = this.kafka.producer();
      await producer.connect();
      await producer.send({
        topic: 'payment.fraud-check.dead-letter',
        messages: [
          {
            key: event.correlationId,
            value: JSON.stringify(deadLetterMessage),
            headers: {
              'original-topic': FRAUD_CHECK_TOPIC,
              'failure-reason': error instanceof Error ? error.message : 'Unknown error',
            },
          },
        ],
      });
      await producer.disconnect();
      this.logger.log(
        `Mensaje enviado a cola de mensajes fallidos para correlationId: ${event.correlationId}`,
      );
    } catch (dlqError) {
      this.logger.error(
        `Error al enviar mensaje a la cola de mensajes fallidos: ${dlqError}`,
      );
    }
  }

  async pauseConsumption(): Promise<void> {
    await this.consumer.pause([{ topic: FRAUD_CHECK_TOPIC }]);
    this.logger.log('Consumo de mensajes pausado');
  }

  async resumeConsumption()::
 Promise<void> {
    await this.consumer.resume([{ topic: FRAUD_CHECK_TOPIC }]);
    this.logger.log('Consumo de mensajes reanudado');
  }

  getConsumerStatus(): { connected: boolean; bufferedMessages: number } {
    return {
      connected: this.isConnected,
      bufferedMessages: this.messageBuffer.size,
    };
  }
}