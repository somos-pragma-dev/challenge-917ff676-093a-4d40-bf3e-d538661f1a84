import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RiskCheckRequestedEvent } from '@risk/application/events/risk-check-requested.event';

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
const RISK_TOPIC = process.env.KAFKA_RISK_TOPIC || 'payment.risk.check.requested';
const RISK_GROUP_ID = process.env.KAFKA_RISK_GROUP_ID || 'risk-consumer-group';

@Injectable()
export class KafkaRiskConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaRiskConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.kafka = new Kafka({
      clientId: 'risk-consumer',
      brokers: KAFKA_BROKERS,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 3000,
      authenticationTimeout: 3000,
    });
    this.consumer = this.kafka.consumer({
      groupId: RISK_GROUP_ID,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
    this.logger.log('Kafka Risk Consumer inicializado correctamente');
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log(`Conectado al broker Kafka: ${KAFKA_BROKERS.join(', ')}`);
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Desconectado del broker Kafka');
      } catch (error) {
        this.logger.error('Error al desconectar de Kafka', error);
      }
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({ topic: RISK_TOPIC, fromBeginning: false });
      this.logger.log(`Suscrito al topic: ${RISK_TOPIC}`);
    } catch (error) {
      this.logger.error(`Error al suscribirse al topic ${RISK_TOPIC}`, error);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const messageValue = message.value?.toString();
    const messageKey = message.key?.toString();

    this.logger.debug(`Mensaje recibido - Topic: ${topic}, Partition: ${partition}, Key: ${messageKey}`);

    if (!messageValue) {
      this.logger.warn('Mensaje vacío recibido, ignorando');
      return;
    }

    try {
      const event = JSON.parse(messageValue) as RiskCheckRequestedEvent;
      await this.processRiskCheckEvent(event);
      this.logger.log(`Evento de riesgo procesado exitosamente para paymentId: ${event.paymentId}`);
    } catch (error) {
      this.logger.error(`Error al procesar mensaje: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        topic,
        partition,
        offset: message.offset,
        key: messageKey,
      });
    }
  }

  private async processRiskCheckEvent(event: RiskCheckRequestedEvent): Promise<void> {
    this.logger.debug(`Procesando verificación de riesgo para paymentId: ${event.paymentId}`);
    
    if (!this.isValidRiskEvent(event)) {
      this.logger.warn(`Evento de riesgo inválido para paymentId: ${event.paymentId}`);
      return;
    }

    this.eventEmitter.emit('risk.check.requested', event);
    
    this.logger.debug(`Evento emitido: risk.check.requested para ${event.paymentId}`);
  }

  private isValidRiskEvent(event: unknown): event is RiskCheckRequestedEvent {
    if (!event || typeof event !== 'object') {
      return false;
    }
    const riskEvent = event as Partial<RiskCheckRequestedEvent>;
    return (
      typeof riskEvent.paymentId === 'string' &&
      typeof riskEvent.amount === 'number' &&
      typeof riskEvent.merchantId === 'string' &&
      typeof riskEvent.customerId === 'string' &&
      typeof riskEvent.idempotencyKey === 'string'
    );
  }

  async pauseConsumption(): Promise<void> {
    await this.consumer.pause([{ topic: RISK_TOPIC }]);
    this.logger.log(`Consumo pausado para el topic: ${RISK_TOPIC}`);
  }

  async resumeConsumption(): Promise<void> {
    await this.consumer.resume([{ topic: RISK_TOPIC }]);
    this.logger.log(`Consumo reanudado para el topic: ${RISK_TOPIC}`);
  }

  getConsumerStatus(): { connected: boolean; topic: string; groupId: string } {
    return {
      connected: this.isConnected,
      topic: RISK_TOPIC,
      groupId: RISK_GROUP_ID,
    };
  }
}