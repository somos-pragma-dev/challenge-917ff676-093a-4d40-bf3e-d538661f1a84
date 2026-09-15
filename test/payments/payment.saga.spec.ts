import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSaga } from '@payments/application/sagas/payment.saga';
import { PaymentInitiatedEvent } from '@payments/application/events/payment-initiated.event';
import { PaymentStatus } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';
import { IdempotencyException } from '@common/exceptions/idempotency-exception';
import { BackoffUtil } from '@common/utils/backoff-util';

describe('PaymentSaga', () => {
  let saga: PaymentSaga;
  let mockPaymentRepository: any;
  let mockOutboxRepository: any;
  let mockKafkaProducer: any;
  let mockSqsProducer: any;

  const mockPayment = {
    id: 'pay-123',
    amount: 1000,
    currency: 'USD',
    status: PaymentStatus.PENDING,
    idempotencyKey: 'idem-123',
    customerId: 'cust-456',
    merchantId: 'merch-789',
    retryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockPaymentRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      updateStatus: jest.fn(),
    };

    mockOutboxRepository = {
      save: jest.fn(),
      findPending: jest.fn(),
      markAsProcessed: jest.fn(),
    };

    mockKafkaProducer = {
      publish: jest.fn(),
    };

    mockSqsProducer = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentSaga,
        { provide: 'PaymentRepository', useValue: mockPaymentRepository },
        { provide: 'PaymentOutboxRepository', useValue: mockOutboxRepository },
        { provide: 'KafkaPaymentProducerService', useValue: mockKafkaProducer },
        { provide: 'SqsPaymentProducerService', useValue: mockSqsProducer },
      ],
    }).compile();

    saga = module.get<PaymentSaga>(PaymentSaga);
  });

  describe('handlePaymentInitiated', () => {
    it('debe iniciar el flujo de la saga correctamente', async () => {
      const event = PaymentDomainEventFactory.createPaymentInitiatedEvent(mockPayment);
      
      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-1' });
      mockKafkaProducer.publish.mockResolvedValue(undefined);

      await saga.handlePaymentInitiated(event);

      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(mockPayment.id);
      expect(mockOutboxRepository.save).toHaveBeenCalled();
      expect(mockKafkaProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'PaymentInitiated' }),
      );
    });

    it('debe lanzar IdempotencyException si la clave ya existe', async () => {
      const event = PaymentDomainEventFactory.createPaymentInitiatedEvent(mockPayment);
      
      mockPaymentRepository.findById.mockRejectedValue(
        new IdempotencyException('Duplicate idempotency key'),
      );

      await expect(saga.handlePaymentInitiated(event)).rejects.toThrow(
        IdempotencyException,
      );
    });
  });

  describe('compensatePayment', () => {
    it('debe ejecutar la compensación correctamente', async () => {
      const failedPayment = {
        ...mockPayment,
        status: PaymentStatus.FAILED,
        failureReason: 'Antifraud check failed',
      };

      mockPaymentRepository.findById.mockResolvedValue(failedPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue(failedPayment);
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-2' });

      await saga.compensatePayment(failedPayment.id, 'Antifraud check failed');

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        failedPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
      expect(mockOutboxRepository.save).toHaveBeenCalled();
    });

    it('debe revertir al estado anterior si la compensación falla', async () => {
      const originalStatus = PaymentStatus.PENDING;
      const paymentWithBackup = {
        ...mockPayment,
        previousStatus: originalStatus,
      };

      mockPaymentRepository.findById.mockResolvedValue(paymentWithBackup);
      mockPaymentRepository.updateStatus.mockRejectedValue(
        new Error('Compensation failed'),
      );

      await expect(
        saga.compensatePayment(mockPayment.id, 'Test failure'),
      ).rejects.toThrow('Compensation failed');

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
    });
  });

  describe('retryWithBackoff', () => {
    it('debe usar backoff exponencial con jitter para reintentos', async () => {
      const paymentWithRetry = {
        ...mockPayment,
        retryCount: 2,
        lastRetryAt: new Date(Date.now() - 60000),
      };

      mockPaymentRepository.findById.mockResolvedValue(paymentWithRetry);
      mockPaymentRepository.save.mockResolvedValue(paymentWithRetry);

      const delay = BackoffUtil.calculateExponentialBackoff(paymentWithRetry.retryCount);
      
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThan(31000);

      await saga.retryWithBackoff(paymentWithRetry.id);

      expect(mockPaymentRepository.save).toHaveBeenCalled();
    });

    it('debe no reintentar si se alcanza el límite máximo', async () => {
      const paymentAtLimit = {
        ...mockPayment,
        retryCount: 5,
      };

      mockPaymentRepository.findById.mockResolvedValue(paymentAtLimit);

      await expect(saga.retryWithBackoff(paymentAtLimit.id)).rejects.toThrow(
        'Maximum retry attempts reached',
      );
    });
  });

  describe('handleAntifraudResult', () => {
    it('debe continuar el flujo si antifraude aprueba', async () => {
      const approvedEvent = {
        paymentId: mockPayment.id,
        approved: true,
        riskScore: 0.2,
      };

      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.ANTIFRAUD_APPROVED,
      });
      mockKafkaProducer.publish.mockResolvedValue(undefined);

      await saga.handleAntifraudResult(approvedEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.ANTIFRAUD_APPROVED,
        expect.any(String),
      );
    });

    it('debe compensar si antifraude rechaza', async () => {
      const rejectedEvent = {
        paymentId: mockPayment.id,
        approved: false,
        reason: 'High risk transaction',
      };

      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.FAILED,
      });
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-3' });

      await saga.handleAntifraudResult(rejectedEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
      expect(mockOutboxRepository.save).toHaveBeenCalled();
    });
  });

  describe('handleRiskAssessment', () => {
    it('debe autorizar el pago si el riesgo es bajo', async () => {
      const lowRiskEvent = {
        paymentId: mockPayment.id,
        riskLevel: 'LOW',
        score: 15,
      };

      mockPaymentRepository.findById.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.ANTIFRAUD_APPROVED,
      });
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.AUTHORIZED,
      });
      mockKafkaProducer.publish.mockResolvedValue(undefined);

      await saga.handleRiskAssessment(lowRiskEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.AUTHORIZED,
        expect.any(String),
      );
    });

    it('debe rechazar el pago si el riesgo es alto', async () => {
      const highRiskEvent = {
        paymentId: mockPayment.id,
        riskLevel: 'HIGH',
        score: 85,
      };

      mockPaymentRepository.findById.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.ANTIFRAUD_APPROVED,
      });
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.FAILED,
      });
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-4' });

      await saga.handleRiskAssessment(highRiskEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
    });
  });

  describe('handlePaymentCompletion', () => {
    it('debe completar el pago exitosamente', async () => {
      const completedEvent = {
        paymentId: mockPayment.id,
        transactionId: 'txn-abc123',
      };

      mockPaymentRepository.findById.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.AUTHORIZED,
      });
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.COMPLETED,
      });
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-5' });

      await saga.handlePaymentCompletion(completedEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.COMPLETED,
        expect.any(String),
      );
    });
  });
});