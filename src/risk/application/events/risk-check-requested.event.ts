import { DomainEvent } from '@payments/domain/events/payment-domain.event';

export interface RiskCheckRequestedEvent extends DomainEvent {
  eventType: 'RiskCheckRequested';
  paymentId: string;
  amount: number;
  currency: string;
  merchantId: string;
  customerId: string;
  customerEmail: string;
  customerIpAddress: string;
  billingCountry: string;
  cardBin: string;
  transactionType: 'card_present' | 'card_not_present' | 'recurring' | 'moto';
  riskScore: number | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | null;
  checkCompletedAt: Date | null;
  checkFailedAt: Date | null;
  failureReason: string | null;
  requestedAt: Date;
  idempotencyKey: string;
}

export interface RiskCheckResult {
  paymentId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendation: 'approve' | 'review' | 'decline';
  checkedAt: Date;
}

export interface RiskFactor {
  type: 'velocity' | 'geolocation' | 'amount' | 'history' | 'device' | 'behavioral';
  score: number;
  weight: number;
  description: string;
  triggered: boolean;
}

export function createRiskCheckRequestedEvent(
  paymentId: string,
  amount: number,
  currency: string,
  merchantId: string,
  customerId: string,
  customerEmail: string,
  customerIpAddress: string,
  billingCountry: string,
  cardBin: string,
  transactionType: 'card_present' | 'card_not_present' | 'recurring' | 'moto',
  idempotencyKey: string,
): RiskCheckRequestedEvent {
  return {
    eventType: 'RiskCheckRequested',
    eventId: `risk-${paymentId}-${Date.now()}`,
    occurredOn: new Date(),
    paymentId,
    amount,
    currency,
    merchantId,
    customerId,
    customerEmail,
    customerIpAddress,
    billingCountry,
    cardBin,
    transactionType,
    riskScore: null,
    riskLevel: null,
    checkCompletedAt: null,
    checkFailedAt: null,
    failureReason: null,
    requestedAt: new Date(),
    idempotencyKey,
  };
}

export function createRiskCheckResultEvent(
  paymentId: string,
  riskScore: number,
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  factors: RiskFactor[],
  recommendation: 'approve' | 'review' | 'decline',
): RiskCheckResult {
  return {
    paymentId,
    riskScore,
    riskLevel,
    factors,
    recommendation,
    checkedAt: new Date(),
  };
}