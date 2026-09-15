import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, SendMessageCommand, SendMessageCommandOutput, SendMessageBatchCommand, SendMessageBatchCommandEntry } from '@aws-sdk/client-sqs';
import { PaymentAttributes } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEvent, PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';

@Injectable()
export class SqsPaymentProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsPaymentProducerService.name);
  private client: SQSClient;
  private readonly queueUrl: string;
  private readonly queueName: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.queueName = process.env.SQS_PAYMENT_QUEUE_NAME || 'payment-events.fifo';
    this.queueUrl = process.env.SQS_PAYMENT_QUEUE_URL || `https://sqs.${this.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID || '123456789012'}/${this.queueName}`;
    this.client = new SQSClient({
      region: this.region,
      credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      } : undefined,
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Initializing SQS Payment Producer for queue: ${this.queueUrl}`);
    await this.ensureQueueExists();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing SQS Payment Producer client');
    await this.client.destroy();
  }

  private async ensureQueueExists(): Promise<void> {
    try {
      const { QueueUrl } = await this.client.send(new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: 'Health check message',
        MessageDeduplicationId: `health-check-${Date.now()}`,
        MessageGroupId: 'health-check-group',
      }));
      this.logger.debug(`Queue verified: ${QueueUrl}`);
    } catch (error) {
      this.logger.warn(`Queue may not exist or not accessible: ${error}`);
    }
  }

  async sendPaymentEvent(payment: PaymentAttributes, eventType: keyof PaymentDomainEvent): Promise<SendMessageCommandOutput> {
    const event = this.createEventForType(payment, eventType);
    const messageBody = JSON.stringify(event);
    const deduplicationId = `${payment.id}-${eventType}-${Date.now()}`;
    const messageGroupId = this.getMessageGroupId(payment);

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
      MessageDeduplicationId: deduplicationId,
      MessageGroupId: messageGroupId,
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: eventType,
        },
        paymentId: {
          DataType: 'String',
          StringValue: payment.id,
        },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });

    try {
      const result = await this.client.send(command);
      this.logger.log(`Event ${eventType} sent for payment ${payment.id}, MessageId: ${result.MessageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send event ${eventType} for payment ${payment.id}: ${error}`);
      throw error;
    }
  }

  async sendPaymentEventsBatch(payments: Array<{ payment: PaymentAttributes; eventType: keyof PaymentDomainEvent }>): Promise<void> {
    const entries: SendMessageBatchCommandEntry[] = payments.map(({ payment, eventType }) => {
      const event = this.createEventForType(payment, eventType);
      const deduplicationId = `${payment.id}-${eventType}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const messageGroupId = this.getMessageGroupId(payment);

      return {
        Id: deduplicationId.substring(0, 80),
        MessageBody: JSON.stringify(event),
        MessageDeduplicationId: deduplicationId,
        MessageGroupId: messageGroupId,
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: eventType,
          },
          paymentId: {
            DataType: 'String',
            StringValue: payment.id,
          },
          timestamp: {
            DataType: 'String',
            StringValue: new Date().toISOString(),
          },
        },
      };
    });

    const command = new SendMessageBatchCommand({
      QueueUrl: this.queueUrl,
      Entries: entries,
    });

    try {
      const result = await this.client.send(command);
      const failedCount = result.Failed?.length || 0;
      if (failedCount > 0) {
        this.logger.error(`Batch send failed for ${failedCount} messages`);
        result.Failed?.forEach(failure => {
          this.logger.error(`Failed message: ${failure.Id}, Code: ${failure.Code}, Message: ${failure.Message}`);
        });
      }
      this.logger.log(`Batch sent: ${entries.length - failedCount} successful, ${failedCount} failed`);
    } catch (error) {
      this.logger.error(`Failed to send batch: ${error}`);
      throw error;
    }
  }

  private createEventForType(payment: PaymentAttributes, eventType: keyof PaymentDomainEvent): PaymentDomainEvent {
    switch (eventType) {
      case 'PaymentInitiated':
        return PaymentDomainEventFactory.createPaymentInitiatedEvent(payment);
      case 'PaymentAntifraudChecked':
        return PaymentDomainEventFactory.createPaymentAntifraudCheckedEvent(payment, true);
      case 'PaymentRiskAssessed':
        return PaymentDomainEventFactory.createPaymentRiskAssessedEvent(payment, 'low');
      case 'PaymentAuthorized':
        return PaymentDomainEventFactory.createPaymentAuthorizedEvent(payment);
      case 'PaymentCompleted':
        return PaymentDomainEventFactory.createPaymentCompletedEvent(payment);
      case 'PaymentFailed':
        return PaymentDomainEventFactory.createPaymentFailedEvent(payment, 'Unknown error');
      case 'PaymentCancelled':
        return PaymentDomainEventFactory.createPaymentCancelledEvent(payment);
      case 'PaymentRefunded':
        return PaymentDomainEventFactory.createPaymentRefundedEvent(payment);
      default:
        return PaymentDomainEventFactory.createPaymentInitiatedEvent(payment);
    }
  }

  private getMessageGroupId(payment: PaymentAttributes): string {
    return `payment-${payment.userId}`;
  }

  getQueueUrl(): string {
    return this.queueUrl;
  }

  getClient(): SQSClient {
    return this.client;
  }
}