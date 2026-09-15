import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord, Partitioners } from 'kafkajs';
import { ConfigType } from '@nestjs/config';
import { PaymentInitiatedEvent, PaymentCompletedEvent, PaymentFailedEvent } from '@payments/domain/events/payment-domain.event';

@Injectable()
export class KafkaPaymentProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaPaymentProducerService.name);
  private kafka: Kafka;
  private producer: Producer;
  private isConnected = false;

  private readonly PAYMENT_EVENTS_TOPIC = 'payment-events';
  private readonly ANTIFRAUD_TOPIC = 'antifraud-check-requests';
  private readonly RISK_TOPIC = 'risk-check-requests';

  constructor(
    @Inject('KAFKA_CONFIG') private readonly kafkaConfig: { brokers: string[]; clientId: string },
  ) {
    this.kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log('Productor Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el productor Kafka', error.stack);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.log('Productor Kafka desconectado');
    } catch (error) {
      this.logger.error('Error al desconectar el productor Kafka', error.stack);
    }
  }

  async sendPaymentInitiatedEvent(event: PaymentInitiatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.ANTIFRAUD_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'PAYMENT_INITIATED',
            'correlation-id': event.correlationId,
            'idempotency-key': event.idempotencyKey,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento PaymentInitiated enviado para paymentId: ${event.paymentId}`);
  }

  async sendRiskCheckRequest(event: PaymentInitiatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.RISK_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'RISK_CHECK_REQUESTED',
            'correlation-id': event.correlationId,
            'idempotency-key': event.idempotencyKey,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento de verificación de riesgo enviado para paymentId: ${event.paymentId}`);
  }

  async sendPaymentCompletedEvent(event: PaymentCompletedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.PAYMENT_EVENTS_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'PAYMENT_COMPLETED',
            'correlation-id': event.correlationId,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento PaymentCompleted enviado para paymentId: ${event.paymentId}`);
  }

  async sendPaymentFailedEvent(event: PaymentFailedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.PAYMENT_EVENTS_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'PAYMENT_FAILED',
            'correlation-id': event.correlationId,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento PaymentFailed enviado para paymentId: ${event.paymentId}`);
  }

  private async sendMessage(record: ProducerRecord): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.producer.send(record);
    } catch (error) {
      this.logger.error(`Error al enviar mensaje a Kafka: ${error.message}`, error.stack);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}