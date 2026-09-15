import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { PaymentInitiatedEvent, PaymentAntifraudCheckedEvent, PaymentRiskAssessedEvent, PaymentCompletedEvent, PaymentFailedEvent } from '@payments/domain/events/payment-domain.event';

@Injectable()
export class KafkaPaymentConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaPaymentConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;

  private readonly PAYMENT_EVENTS_TOPIC = 'payment-events';
  private readonly ANTIFRAUD_RESPONSES_TOPIC = 'antifraud-check-responses';
  private readonly RISK_RESPONSES_TOPIC = 'risk-check-responses';
  private readonly CONSUMER_GROUP = 'payment-service-group';

  constructor(
    @Inject('KAFKA_CONFIG') private readonly kafkaConfig: { brokers: string[]; clientId: string },
  ) {
    this.kafka = new Kafka({
      clientId: `${this.kafkaConfig.clientId}-consumer`,
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: this.CONSUMER_GROUP,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopics();
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Consumidor Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el consumidor Kafka', error.stack);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      this.logger.log('Consumidor Kafka desconectado');
    } catch (error) {
      this.logger.error('Error al desconectar el consumidor Kafka', error.stack);
    }
  }

  private async subscribeToTopics(): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic: this.PAYMENT_EVENTS_TOPIC,
        fromBeginning: false,
      });

      await this.consumer.subscribe({
        topic: this.ANTIFRAUD_RESPONSES_TOPIC,
        fromBeginning: false,
      });

      await this.consumer.subscribe({
        topic: this.RISK_RESPONSES_TOPIC,
        fromBeginning: false,
      });

      this.logger.log(`Suscrito a los topics: ${this.PAYMENT_EVENTS_TOPIC}, ${this.ANTIFRAUD_RESPONSES_TOPIC}, ${this.RISK_RESPONSES_TOPIC}`);
    } catch (error) {
      this.logger.error('Error al suscribirse a los topics', error.stack);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    this.logger.log('Consumo de mensajes iniciado');
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const eventType = message.headers?.['event-type']?.toString() || 'UNKNOWN';
    const correlationId = message.headers?.['correlation-id']?.toString() || 'unknown';

    this.logger.log(`Procesando mensaje del topic ${topic}, tipo: ${eventType}, correlationId: ${correlationId}`);

    try {
      const value = message.value?.toString();
      if (!value) {
        this.logger.warn('Mensaje vacío recibido, ignorando');
        return;
      }

      const event = JSON.parse(value);

      switch (topic) {
        case this.PAYMENT_EVENTS_TOPIC:
          await this.handlePaymentEvent(eventType, event);
          break;
        case this.ANTIFRAUD_RESPONSES_TOPIC:
          await this.handleAntifraudResponse(eventType, event);
          break;
        case this.RISK_RESPONSES_TOPIC:
          await this.handleRiskResponse(eventType, event);
          break;
        default:
          this.logger.warn(`Topic desconocido: ${topic}`);
      }

      this.logger.log(`Mensaje procesado exitosamente: ${eventType}`);
    } catch (error) {
      this.logger.error(`Error al procesar mensaje: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async handlePaymentEvent(eventType: string, event: PaymentCompletedEvent | PaymentFailedEvent): Promise<void> {
    switch (eventType) {
      case 'PAYMENT_COMPLETED':
        this.logger.log(`Pago completado: ${event.paymentId}`);
        break;
      case 'PAYMENT_FAILED':
        this.logger.log(`Pago fallido: ${event.paymentId}, razón: ${event.reason}`);
        break;
      default:
        this.logger.warn(`Tipo de evento de pago desconocido: ${eventType}`);
    }
  }

  private async handleAntifraudResponse(eventType: string, event: PaymentAntifraudCheckedEvent): Promise<void> {
    if (eventType === 'ANTIFRAUD_CHECK_COMPLETED') {
      this.logger.log(`Verificación antifraude completada para paymentId: ${event.paymentId}, aprobado: ${event.approved}`);
    } else {
      this.logger.warn(`Tipo de respuesta antifraude desconocido: ${eventType}`);
    }
  }

  private async handleRiskResponse(eventType: string, event: PaymentRiskAssessedEvent): Promise<void> {
    if (eventType === 'RISK_ASSESSMENT_COMPLETED') {
      this.logger.log(`Evaluación de riesgo completada para paymentId: ${event.paymentId}, nivel de riesgo: ${event.riskLevel}`);
    } else {
      this.logger.warn(`Tipo de respuesta de riesgo desconocido: ${eventType}`);
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}