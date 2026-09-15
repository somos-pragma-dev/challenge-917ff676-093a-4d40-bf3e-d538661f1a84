import { PaymentMethod, Currency } from '../../../common/dto/payment-request.dto';

export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  ANTIFRAUD_CHECKING = 'ANTIFRAUD_CHECKING',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  AUTHORIZED = 'AUTHORIZED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentAttributes {
  id: string;
  idempotencyKey: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  merchantId?: string;
  terminalId?: string;
  channel?: string;
  payerEmail?: string;
  payerPhone?: string;
  metadata?: Record<string, unknown>;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
}

export class PaymentEntity implements PaymentAttributes {
  id: string;
  idempotencyKey: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  merchantId?: string;
  terminalId?: string;
  channel?: string;
  payerEmail?: string;
  payerPhone?: string;
  metadata?: Record<string, unknown>;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;

  constructor(attributes: Partial<PaymentAttributes>) {
    Object.assign(this, {
      id: attributes.id || crypto.randomUUID(),
      idempotencyKey: attributes.idempotencyKey,
      payerId: attributes.payerId,
      payeeId: attributes.payeeId,
      amount: attributes.amount,
      currency: attributes.currency || Currency.USD,
      paymentMethod: attributes.paymentMethod,
      status: attributes.status || PaymentStatus.PENDING,
      description: attributes.description,
      merchantId: attributes.merchantId,
      terminalId: attributes.terminalId,
      channel: attributes.channel,
      payerEmail: attributes.payerEmail,
      payerPhone: attributes.payerPhone,
      metadata: attributes.metadata || {},
      priority: attributes.priority ?? 5,
      createdAt: attributes.createdAt || new Date(),
      updatedAt: attributes.updatedAt || new Date(),
      completedAt: attributes.completedAt,
      failureReason: attributes.failureReason,
      retryCount: attributes.retryCount || 0,
      maxRetries: attributes.maxRetries || 3,
    });
  }

  canTransitionTo(newStatus: PaymentStatus): boolean {
    const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.INITIATED, PaymentStatus.CANCELLED],
      [PaymentStatus.INITIATED]: [PaymentStatus.ANTIFRAUD_CHECKING, PaymentStatus.FAILED],
      [PaymentStatus.ANTIFRAUD_CHECKING]: [PaymentStatus.RISK_ASSESSMENT, PaymentStatus.FAILED],
      [PaymentStatus.RISK_ASSESSMENT]: [PaymentStatus.AUTHORIZED, PaymentStatus.FAILED],
      [PaymentStatus.AUTHORIZED]: [PaymentStatus.PROCESSING, PaymentStatus.CANCELLED],
      [PaymentStatus.PROCESSING]: [PaymentStatus.COMPLETED, PaymentStatus.FAILED],
      [PaymentStatus.COMPLETED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.FAILED]: [PaymentStatus.PENDING],
      [PaymentStatus.CANCELLED]: [],
      [PaymentStatus.REFUNDED]: [],
    };
    return allowedTransitions[this.status]?.includes(newStatus) ?? false;
  }

  transitionTo(newStatus: PaymentStatus, reason?: string): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid state transition from ${this.status} to ${newStatus}`,
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
    if (reason) {
      this.failureReason = reason;
    }
    if (newStatus === PaymentStatus.COMPLETED) {
      this.completedAt = new Date();
    }
  }

  isRetriable(): boolean {
    return (
      this.retryCount < this.maxRetries &&
      (this.status === PaymentStatus.FAILED || this.status === PaymentStatus.PENDING)
    );
  }

  incrementRetry(): void {
    if (!this.isRetriable()) {
      throw new Error('Payment cannot be retried - max retries exceeded');
    }
    this.retryCount++;
    this.updatedAt = new Date();
  }

  validateAmountLimits(minAmount: number, maxAmount: number): boolean {
    return this.amount >= minAmount && this.amount <= maxAmount;
  }

  calculateFee(feePercentage: number): number {
    return Math.round(this.amount * feePercentage * 100) / 100;
  }

  toPlainObject(): PaymentAttributes {
    return { ...this };
  }
}