import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PaymentInitiatedEventData } from '../events/payment-initiated.event';
import { PaymentAttributes, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';
import { PaymentRepository } from '@payments/domain/repositories/payment.repository';

interface SagaState {
  sagaId: string;
  paymentId: string;
  currentStep: SagaStep;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  compensationActions: CompensationAction[];
  startedAt: Date;
  metadata: Record<string, unknown>;
}

enum SagaStep {
  INITIATED = 'INITIATED',
  ANTIFRAUD_CHECK = 'ANTIFRAUD_CHECK',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  AUTHORIZATION = 'AUTHORIZATION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

interface CompensationAction {
  step: SagaStep;
  compensate: () => Promise<void>;
  compensating: boolean;
}

interface BackoffConfig {
  baseDelay: number;
  maxDelay: number;
  jitterFactor: number;
  maxRetries: number;
}

@Injectable()
export class PaymentSaga implements OnModuleInit {
  private readonly logger = new Logger(PaymentSaga.name);
  private readonly activeSagas: Map<string, SagaState> = new Map();
  private readonly backoffConfig: BackoffConfig = {
    baseDelay: 1000,
    maxDelay: 30000,
    jitterFactor: 0.3,
    maxRetries: 5,
  };

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  public onModuleInit(): void {
    this.logger.log('PaymentSaga initialized with exponential backoff and jitter');
  }

  @OnEvent('payment.initiated')
  public async handlePaymentInitiated(event: PaymentInitiatedEventData): Promise<void> {
    const sagaId = event.sagaId || `saga-${event.paymentId}-${Date.now()}`;
    this.logger.log(`Starting saga ${sagaId} for payment ${event.paymentId}`);

    const sagaState: SagaState = {
      sagaId,
      paymentId: event.paymentId,
      currentStep: SagaStep.INITIATED,
      retryCount: 0,
      maxRetries: this.backoffConfig.maxRetries,
      compensationActions: [],
      startedAt: new Date(),
      metadata: { correlationId: event.correlationId, ...event.metadata },
    };

    this.activeSagas.set(sagaId, sagaState);

    try {
      await this.executeAntifraudCheck(sagaState, event);
    } catch (error) {
      await this.handleSagaFailure(sagaState, error as Error);
    }
  }

  public async compensatePayment(paymentId: string, failureReason: string): Promise<void> {
    this.logger.log(`Compensating payment ${paymentId}: ${failureReason}`);
    
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.FAILED, failureReason);
    await this.paymentRepository.save(payment);

    const failedEvent = PaymentDomainEventFactory.createPaymentFailedEvent(
      payment,
      failureReason,
    );
    this.eventEmitter.emit('payment.failed', failedEvent);
  }

  public async retryWithBackoff(paymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found for retry`);
    }

    if (payment.retryCount >= this.backoffConfig.maxRetries) {
      throw new Error('Maximum retry attempts reached');
    }

    const delay = this.calculateBackoffWithJitter(payment.retryCount);
    this.logger.log(`Retrying payment ${paymentId} after ${delay}ms (attempt ${payment.retryCount + 1})`);

    payment.incrementRetry();
    await this.paymentRepository.save(payment);

    await new Promise(resolve => setTimeout(resolve, delay));

    await this.handlePaymentInitiated({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      senderAccountId: payment.senderAccountId,
      receiverAccountId: payment.receiverAccountId,
      idempotencyKey: payment.idempotencyKey,
      description: payment.description,
      metadata: payment.metadata,
      requestedBy: payment.requestedBy,
      timestamp: new Date(),
      correlationId: payment.id,
      sagaId: `saga-${payment.id}-retry`,
    });
  }

  public async handleAntifraudResult(event: { paymentId: string; approved: boolean; riskScore?: number; reason?: string }): Promise<void> {
    this.logger.log(`Handling antifraud result for payment ${event.paymentId}: approved=${event.approved}`);

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    if (event.approved) {
      payment.transitionTo(PaymentStatus.ANTIFRAUD_APPROVED, 'Antifraud check passed');
      await this.paymentRepository.save(payment);
      
      const riskEvent = PaymentDomainEventFactory.createPaymentRiskAssessedEvent(
        payment.toPlainObject(),
        'LOW',
        event.riskScore || 0.15,
      );
      this.eventEmitter.emit('payment.risk.assessed', riskEvent);
    } else {
      payment.transitionTo(PaymentStatus.FAILED, event.reason || 'Antifraud check failed');
      await this.paymentRepository.save(payment);
      
      const failedEvent = PaymentDomainEventFactory.createPaymentFailedEvent(
        payment,
        event.reason || 'Antifraud check failed',
      );
      this.eventEmitter.emit('payment.failed', failedEvent);
    }
  }

  public async handleRiskAssessment(event: { paymentId: string; riskLevel: string; score: number }): Promise<void> {
    this.logger.log(`Handling risk assessment for payment ${event.paymentId}: level=${event.riskLevel}, score=${event.score}`);

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    if (event.riskLevel === 'LOW' || event.score < 30) {
      payment.transitionTo(PaymentStatus.AUTHORIZED, 'Risk assessment passed - low risk');
      await this.paymentRepository.save(payment);
      
      const authEvent = PaymentDomainEventFactory.createPaymentAuthorizedEvent(
        payment.toPlainObject(),
        'AUTHORIZED',
        `AUTH_TOKEN_${Date.now()}`,
      );
      this.eventEmitter.emit('payment.authorized', authEvent);
    } else {
      payment.transitionTo(PaymentStatus.FAILED, `High risk: ${event.riskLevel} (score: ${event.score})`);
      await this.paymentRepository.save(payment);
      
      const failedEvent = PaymentDomainEventFactory.createPaymentFailedEvent(
        payment,
        `High risk: ${event.riskLevel}`,
      );
      this.eventEmitter.emit('payment.failed', failedEvent);
    }
  }

  public async handlePaymentCompletion(event: { paymentId: string; transactionId?: string }): Promise<void> {
    this.logger.log(`Handling payment completion for payment ${event.paymentId}`);

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.COMPLETED, 'Payment processed successfully');
    await this.paymentRepository.save(payment);
    
    const completedEvent = PaymentDomainEventFactory.createPaymentCompletedEvent(payment.toPlainObject());
    this.eventEmitter.emit('payment.completed', completedEvent);
  }

  private async executeAntifraudCheck(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing antifraud check for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.ANTIFRAUD_CHECK;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.ANTIFRAUD_CHECK,
      compensate: async () => {
        this.logger.warn(`Compensating antifraud check for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.FAILED, 'Antifraud check failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const antifraudEvent = PaymentDomainEventFactory.createPaymentAntifraudCheckedEvent(
      payment.toPlainObject(),
      true,
      'PASSED',
    );
    this.eventEmitter.emit('payment.antifraud.checked', antifraudEvent);

    await this.executeRiskAssessment(sagaState, event);
  }

  private async executeRiskAssessment(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing risk assessment for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.RISK_ASSESSMENT;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.RISK_ASSESSMENT,
      compensate: async () => {
        this.logger.warn(`Compensating risk assessment for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.FAILED, 'Risk assessment failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const riskEvent = PaymentDomainEventFactory.createPaymentRiskAssessedEvent(
      payment.toPlainObject(),
      'LOW',
      0.15,
    );
    this.eventEmitter.emit('payment.risk.assessed', riskEvent);

    await this.executeAuthorization(sagaState, event);
  }

  private async executeAuthorization(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing authorization for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.AUTHORIZATION;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.AUTHORIZATION,
      compensate: async () => {
        this.logger.warn(`Compensating authorization for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.CANCELLED, 'Authorization failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const authEvent = PaymentDomainEventFactory.createPaymentAuthorizedEvent(
      payment.toPlainObject(),
      'AUTHORIZED',
      'AUTH_TOKEN_123',
    );
    this.eventEmitter.emit('payment.authorized', authEvent);

    await this.completePayment(sagaState, event);
  }

  private async completePayment(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Completing payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.COMPLETED;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.COMPLETED, 'Payment processed successfully');
    await this.paymentRepository.save(payment);

    const completedEvent = PaymentDomainEventFactory.createPaymentCompletedEvent(payment.toPlainObject());
    this.eventEmitter.emit('payment.completed', completedEvent);

    this.logger.log(`Saga ${sagaState.sagaId} completed successfully for payment ${event.paymentId}`);
    this.activeSagas.delete(sagaState.sagaId);
  }

  private async handleSagaFailure(sagaState: SagaState, error: Error): Promise<void> {
    this.logger.error(`Saga ${sagaState.sagaId} failed: ${error.message}`, error.stack);
    sagaState.lastError = error.message;
    sagaState.currentStep = SagaStep.FAILED;

    if (sagaState.retryCount < sagaState.maxRetries) {
      const delay = this.calculateBackoffWithJitter(sagaState.retryCount);
      this.logger.log(`Saga ${sagaState.sagaId}: Retrying in ${delay}ms (attempt ${sagaState.retryCount + 1}/${sagaState.maxRetries})`);

      setTimeout(async () => {
        sagaState.retryCount++;
        try {
          await this.retryFromLastStep(sagaState);
        } catch (retryError) {
          await this.handleSagaFailure(sagaState, retryError as Error);
        }
      }, delay);
    } else {
      await this.executeCompensation(sagaState);
    }
  }

  private calculateBackoffWithJitter(retryCount: number): number {
    const exponentialDelay = this.backoffConfig.baseDelay * Math.pow(2, retryCount);
    const cappedDelay = Math.min(exponentialDelay, this.backoffConfig.maxDelay);
    const jitter = cappedDelay * this.backoffConfig.jitterFactor * Math.random();
    return Math.floor(cappedDelay + jitter);
  }

  private async retryFromLastStep(sagaState: SagaState): Promise<void> {
    const payment = await this.paymentRepository.findById(sagaState.paymentId);
    if (!payment) {
      throw new Error(`Payment ${sagaState.paymentId} not found for retry`);
    }

    switch (sagaState.currentStep) {
      case SagaStep.ANTIFRAUD_CHECK:
        await this.executeAntifraudCheck(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      case SagaStep.RISK_ASSESSMENT:
        await this.executeRiskAssessment(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      case SagaStep.AUTHORIZATION:
        await this.executeAuthorization(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      default:
        throw new Error(`Cannot retry from step: ${sagaState.currentStep}`);
    }
  }

  private async executeCompensation(sagaState: SagaState): Promise<void> {
    this.logger.error(`Saga ${sagaState.sagaId}: Executing compensation for payment ${sagaState.paymentId}`);
    sagaState.currentStep = SagaStep.COMPENSATING;

    const reversedActions = [...sagaState.compensationActions].reverse();

    for (const action of reversedActions) {
      if (!action.compensating) {
        try {
          action.compensating = true;
          await action.compensate();
        } catch (compensateError) {
          this.logger.error(`Compensation failed for step ${action.step}: ${(compensateError as Error).message}`);
        }
      }
    }

    sagaState.currentStep = SagaStep.COMPENSATED;
    this.logger.warn(`Saga ${sagaState.sagaId} compensation completed for payment ${sagaState.paymentId}`);
    this.activeSagas.delete(sagaState.sagaId);
  }

  public getSagaState(sagaId: string): SagaState | undefined {
    return this.activeSagas.get(sagaId);
  }

  public getActiveSagasCount(): number {
    return this.activeSagas.size;
  }
}