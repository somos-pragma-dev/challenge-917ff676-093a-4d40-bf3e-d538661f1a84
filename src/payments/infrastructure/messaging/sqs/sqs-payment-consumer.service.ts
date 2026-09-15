import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, ChangeMessageVisibilityCommand, SQSMessage } from '@aws-sdk/client-sqs';
import { PaymentAttributes } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEvent } from '@payments/domain/events/payment-domain.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface SqsConsumerConfig {
  queueUrl: string;
  maxNumberOfMessages: number;
  waitTimeSeconds: number;
  visibilityTimeout: number;
  batchSize: number;
}

@Injectable()
export class SqsPaymentConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsPaymentConsumerService.name);
  private client: SQSClient;
  private config: SqsConsumerConfig;
  private isProcessing = false;
  private isShuttingDown = false;
  private readonly pollingInterval: number;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.client = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      } : undefined,
    });

    this.config = {
      queueUrl: process.env.SQS_PAYMENT_QUEUE_URL || `https://sqs.us-east-1.amazonaws.com/123456789012/payment-events.fifo`,
      maxNumberOfMessages: parseInt(process.env.SQS_MAX_MESSAGES || '10', 10),
      waitTimeSeconds: parseInt(process.env.SQS_WAIT_TIME || '20', 10),
      visibilityTimeout: parseInt(process.env.SQS_VISIBILITY_TIMEOUT || '300', 10),
      batchSize: parseInt(process.env.SQS_BATCH_SIZE || '10', 10),
    };

    this.pollingInterval = parseInt(process.env.SQS_POLLING_INTERVAL || '1000', 10);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing SQS Payment Consumer');
    this.logger.debug(`Consumer config: ${JSON.stringify(this.config)}`);
    this.startPolling();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down SQS Payment Consumer');
    this.isShuttingDown = true;
    await this.waitForProcessingToComplete();
    await this.client.destroy();
  }

  private async waitForProcessingToComplete(): Promise<void> {
    const maxWaitTime = 30000;
    const checkInterval = 500;
    let waitedTime = 0;

    while (this.isProcessing && waitedTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waitedTime += checkInterval;
    }

    if (this.isProcessing) {
      this.logger.warn('Forcing shutdown while messages were still being processed');
    }
  }

  private startPolling(): void {
    setInterval(() => this.poll(), this.pollingInterval);
  }

  private async poll(): Promise<void> {
    if (this.isProcessing || this.isShuttingDown) {
      return;
    }

    this.isProcessing = true;

    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.config.queueUrl,
        MaxNumberOfMessages: this.config.maxNumberOfMessages,
        WaitTimeSeconds: this.config.waitTimeSeconds,
        VisibilityTimeout: this.config.visibilityTimeout,
        MessageAttributeNames: ['All'],
        AttributeNames: ['All'],
      });

      const response = await this.client.send(command);
      const messages = response.Messages || [];

      if (messages.length > 0) {
        this.logger.debug(`Received ${messages.length} messages`);
        await this.processMessages(messages);
      }
    } catch (error) {
      this.logger.error(`Error polling SQS: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processMessages(messages: SQSMessage[]): Promise<void> {
    for (const message of messages) {
      try {
        await this.processMessage(message);
        await this.deleteMessage(message);
      } catch (error) {
        this.logger.error(`Error processing message ${message.MessageId}: ${error}`);
        await this.handleFailedMessage(message, error);
      }
    }
  }

  private async processMessage(message: SQSMessage): Promise<void> {
    const body = JSON.parse(message.Body || '{}') as PaymentDomainEvent;
    const eventType = message.MessageAttributes?.eventType?.StringValue;
    const paymentId = message.MessageAttributes?.paymentId?.StringValue;

    this.logger.log(`Processing event ${eventType} for payment ${paymentId}`);

    const eventHandlers: Record<string, (event: PaymentDomainEvent, paymentId: string) => Promise<void>> = {
      'PaymentInitiated': this.handlePaymentInitiated.bind(this),
      'PaymentAntifraudChecked': this.handlePaymentAntifraudChecked.bind(this),
      'PaymentRiskAssessed': this.handlePaymentRiskAssessed.bind(this),
      'PaymentAuthorized': this.handlePaymentAuthorized.bind(this),
      'PaymentCompleted': this.handlePaymentCompleted.bind(this),
      'PaymentFailed': this.handlePaymentFailed.bind(this),
      'PaymentCancelled': this.handlePaymentCancelled.bind(this),
      'PaymentRefunded': this.handlePaymentRefunded.bind(this),
    };

    const handler = eventHandlers[eventType || ''];
    if (handler) {
      await handler(body, paymentId || '');
    } else {
      this.logger.warn(`Unknown event type: ${eventType}`);
    }
  }

  private async handlePaymentInitiated(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.initiated', { paymentId, event });
  }

  private async handlePaymentAntifraudChecked(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.antifraud.checked', { paymentId, event });
  }

  private async handlePaymentRiskAssessed(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.risk.assessed', { paymentId, event });
  }

  private async handlePaymentAuthorized(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.authorized', { paymentId, event });
  }

  private async handlePaymentCompleted(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.completed', { paymentId, event });
  }

  private async handlePaymentFailed(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.failed', { paymentId, event });
  }

  private async handlePaymentCancelled(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.cancelled', { paymentId, event });
  }

  private async handlePaymentRefunded(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.refunded', { paymentId, event });
  }

  private async deleteMessage(message: SQSMessage): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.config.queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    });

    await this.client.send(command);
    this.logger.debug(`Deleted message ${message.MessageId}`);
  }

  private async handleFailedMessage(message: SQSMessage, error: unknown): Promise<void> {
    const retryCount = this.getRetryCount(message);
    const maxRetries = 5;

    if (retryCount < maxRetries) {
      const visibilityCommand = new ChangeMessageVisibilityCommand({
        QueueUrl: this.config.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
        VisibilityTimeout: Math.pow(2, retryCount) * 30,
      });

      await this.client.send(visibilityCommand);
      this.logger.warn(`Message ${message.MessageId} will be retried in ${Math.pow(2, retryCount) * 30}s (retry ${retryCount + 1}/${maxRetries})`);
    } else {
      this.logger.error(`Message ${message.MessageId} exceeded max retries, moving to dead letter queue`);
      await this.moveToDeadLetterQueue(message);
    }
  }

  private getRetryCount(message: SQSMessage): number {
    const attributes = message.Attributes || {};
    const approximateReceiveCount = parseInt(attributes.ApproximateReceiveCount || '0', 10);
    return approximateReceiveCount - 1;
  }

  private async moveToDeadLetterQueue(message: SQSMessage): Promise<void> {
    const dlqUrl = this.config.queueUrl.replace('.fifo', '-dlq.fifo');
    this.logger.warn(`Would move message to DLQ: ${dlqUrl}`);
  }

  getConfig(): SqsConsumerConfig {
    return this.config;
  }

  isHealthy(): boolean {
    return !this.isShuttingDown;
  }
}