import { PaymentMethod, Currency } from '@common/dto/payment-request.dto';
import { PaymentAttributes, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { DomainEvent } from '@payments/domain/events/payment-domain.event';

export interface PaymentInitiatedEventData {
  paymentId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  senderAccountId: string;
  receiverAccountId: string;
  idempotencyKey: string;
  description?: string;
  metadata?: Record<string, unknown>;
  requestedBy: string;
  timestamp: Date;
  correlationId: string;
  sagaId: string;
}

export class PaymentInitiatedEvent implements DomainEvent {
  public readonly eventType = 'PaymentInitiated';
  public readonly paymentId: string;
  public readonly amount: number;
  public readonly currency: Currency;
  public readonly paymentMethod: PaymentMethod;
  public readonly senderAccountId: string;
  public readonly receiverAccountId: string;
  public readonly idempotencyKey: string;
  public readonly description?: string;
  public readonly metadata?: Record<string, unknown>;
  public readonly requestedBy: string;
  public readonly timestamp: Date;
  public readonly correlationId: string;
  public readonly sagaId: string;

  constructor(data: PaymentInitiatedEventData) {
    this.paymentId = data.paymentId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.paymentMethod = data.paymentMethod;
    this.senderAccountId = data.senderAccountId;
    this.receiverAccountId = data.receiverAccountId;
    this.idempotencyKey = data.idempotencyKey;
    this.description = data.description;
    this.metadata = data.metadata;
    this.requestedBy = data.requestedBy;
    this.timestamp = data.timestamp;
    this.correlationId = data.correlationId;
    this.sagaId = data.sagaId;
  }

  public static create(data: PaymentInitiatedEventData): PaymentInitiatedEvent {
    return new PaymentInitiatedEvent(data);
  }

  public toPaymentAttributes(): Partial<PaymentAttributes> {
    return {
      id: this.paymentId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      senderAccountId: this.senderAccountId,
      receiverAccountId: this.receiverAccountId,
      status: PaymentStatus.PENDING,
      idempotencyKey: this.idempotencyKey,
      description: this.description,
      metadata: this.metadata,
      requestedBy: this.requestedBy,
      initiatedAt: this.timestamp,
      updatedAt: this.timestamp,
    };
  }

  public getSagaCorrelationId(): string {
    return this.correlationId;
  }

  public getSagaId(): string {
    return this.sagaId;
  }
}