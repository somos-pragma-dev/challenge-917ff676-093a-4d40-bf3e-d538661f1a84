import { PaymentStatus, PaymentAttributes } from '../entities/payment.entity';
import { PaymentMethod, Currency } from '../../../common/dto/payment-request.dto';

export interface DomainEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  occurredAt: Date;
  version: number;
  payload: Record<string, unknown>;
}

export interface PaymentInitiatedEvent extends DomainEvent {
  eventType: 'PaymentInitiated';
  payload: {
    paymentId: string;
    idempotencyKey: string;
    payerId: string;
    payeeId: string;
    amount: number;
    currency: Currency;
    paymentMethod: PaymentMethod;
    priority: number;
  };
}

export interface PaymentAntifraudCheckedEvent extends DomainEvent {
  eventType: 'PaymentAntifraudChecked';
  payload: {
    paymentId: string;
    antifraudResult: 'APPROVED' | 'REJECTED' | 'REVIEW';
    antifraudScore: number;
    antifraudTransactionId: string;
  };
}

export interface PaymentRiskAssessedEvent extends DomainEvent {
  eventType: 'PaymentRiskAssessed';
  payload: {
    paymentId: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskScore: number;
    riskTransactionId: string;
  };
}

export interface PaymentAuthorizedEvent extends DomainEvent {
  eventType: 'PaymentAuthorized';
  payload: {
    paymentId: string;
    authorizationCode: string;
  };
}

export interface PaymentCompletedEvent extends DomainEvent {
  eventType: 'PaymentCompleted';
  payload: {
    paymentId: string;
    completionTimestamp: string;
    finalAmount: number;
  };
}

export interface PaymentFailedEvent extends DomainEvent {
  eventType: 'PaymentFailed';
  payload: {
    paymentId: string;
    failureReason: string;
    retryable: boolean;
    retryCount: number;
  };
}

export interface PaymentCancelledEvent extends DomainEvent {
  eventType: 'PaymentCancelled';
  payload: {
    paymentId: string;
    cancellationReason: string;
  };
}

export interface PaymentRefundedEvent extends DomainEvent {
  eventType: 'PaymentRefunded';
  payload: {
    paymentId: string;
    refundAmount: number;
    refundReason: string;
  };
}

export type PaymentDomainEvent =
  | PaymentInitiatedEvent
  | PaymentAntifraudCheckedEvent
  | PaymentRiskAssessedEvent
  | PaymentAuthorizedEvent
  | PaymentCompletedEvent
  | PaymentFailedEvent
  | PaymentCancelledEvent
  | PaymentRefundedEvent;

export class PaymentDomainEventFactory {
  static createPaymentInitiatedEvent(payment: PaymentAttributes): PaymentInitiatedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: payment.id,
      eventType: 'PaymentInitiated',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId: payment.id,
        idempotencyKey: payment.idempotencyKey,
        payerId: payment.payerId,
        payeeId: payment.payeeId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        priority: payment.priority,
      },
    };
  }

  static createPaymentAntifraudCheckedEvent(
    paymentId: string,
    result: 'APPROVED' | 'REJECTED' | 'REVIEW',
    score: number,
    transactionId: string,
  ): PaymentAntifraudCheckedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: paymentId,
      eventType: 'PaymentAntifraudChecked',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId,
        antifraudResult: result,
        antifraudScore: score,
        antifraudTransactionId: transactionId,
      },
    };
  }

  static createPaymentRiskAssessedEvent(
    paymentId: string,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
    score: number,
    transactionId: string,
  ): PaymentRiskAssessedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: paymentId,
      eventType: 'PaymentRiskAssessed',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId,
        riskLevel,
        riskScore: score,
        riskTransactionId: transactionId,
      },
    };
  }

  static createPaymentCompletedEvent(payment: PaymentAttributes): PaymentCompletedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: payment.id,
      eventType: 'PaymentCompleted',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId: payment.id,
        completionTimestamp: new Date().toISOString(),
        finalAmount: payment.amount,
      },
    };
  }

  static createPaymentFailedEvent(
    paymentId: string,
    reason: string,
    retryable: boolean,
    retryCount: number,
  ): PaymentFailedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: paymentId,
      eventType: 'PaymentFailed',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId,
        failureReason: reason,
        retryable,
        retryCount,
      },
    };
  }
}