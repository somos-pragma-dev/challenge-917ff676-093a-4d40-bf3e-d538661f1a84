import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from '@payments/infrastructure/persistence/postgresql/payment.repository';
import { PaymentEntity, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PaymentRepository', () => {
  let repository: PaymentRepository;
  let mockTypeormRepository: jest.Mocked<Repository<PaymentEntity>>;

  const mockPaymentEntity = {
    id: 'pay-123',
    amount: 1000,
    currency: 'USD',
    status: PaymentStatus.PENDING,
    idempotencyKey: 'idem-123',
    customerId: 'cust-456',
    merchantId: 'merch-789',
    retryCount: 0,
    failureReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTypeormRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<PaymentEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRepository,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<PaymentRepository>(PaymentRepository);
  });

  describe('findById', () => {
    it('debe recuperar un pago por su ID', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);

      const result = await repository.findById('pay-123');

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'pay-123' },
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe('pay-123');
    });

    it('debe retornar null si el pago no existe', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('debe incluir relaciones si se especifican', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);

      await repository.findById('pay-123', { relations: ['metadata'] });

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['metadata'],
        }),
      );
    });
  });

  describe('findByIdempotencyKey', () => {
    it('debe buscar por clave de idempotencia', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);

      const result = await repository.findByIdempotencyKey('idem-123');

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'idem-123' },
      });
      expect(result?.idempotencyKey).toBe('idem-123');
    });
  });

  describe('save', () => {
    it('debe persistir un nuevo pago', async () => {
      const newPayment = {
        amount: 500,
        currency: 'EUR',
        customerId: 'cust-new',
        merchantId: 'merch-new',
        status: PaymentStatus.PENDING,
        idempotencyKey: 'idem-new',
      };

      const createdEntity = { ...mockPaymentEntity, ...newPayment };
      
      mockTypeormRepository.create.mockReturnValue(createdEntity as PaymentEntity);
      mockTypeormRepository.save.mockResolvedValue(createdEntity as PaymentEntity);

      const result = await repository.save(newPayment);

      expect(mockTypeormRepository.create).toHaveBeenCalledWith(newPayment);
      expect(mockTypeormRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toBeDefined();
    });

    it('debe actualizar un pago existente', async () => {
      const updatedData = { status: PaymentStatus.COMPLETED };
      const updatedEntity = { ...mockPaymentEntity, ...updatedData };

      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);
      mockTypeormRepository.save.mockResolvedValue(updatedEntity as PaymentEntity);

      const result = await repository.save({ id: 'pay-123', ...updatedData });

      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(PaymentStatus.COMPLETED);
    });
  });

  describe('updateStatus', () {
    it('debe actualizar el estado de un pago', async () => {
      mockTypeormRepository.update.mockResolvedValue({ affected: 1 } as any);

      await repository.updateStatus('pay-123', PaymentStatus.COMPLETED);

      expect(mockTypeormRepository.update).toHaveBeenCalledWith(
        'pay-123',
        expect.objectContaining({
          status: PaymentStatus.COMPLETED,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('debe incluir razón de fallo si se proporciona', async () => {
      mockTypeormRepository.update.mockResolvedValue({ affected: 1 } as any);

      await repository.updateStatus(
        'pay-123',
        PaymentStatus.FAILED,
        'Insufficient funds',
      );

      expect(mockTypeormRepository.update).toHaveBeenCalledWith(
        'pay-123',
        expect.objectContaining({
          status: PaymentStatus.FAILED,
          failureReason: 'Insufficient funds',
        }),
      );
    });

    it('debe lanzar error si no afecta ninguna fila', async () => {
      mockTypeormRepository.update.mockResolvedValue({ affected: 0 } as any);

      await expect(
        repository.updateStatus('non-existent', PaymentStatus.COMPLETED),
      ).rejects.toThrow('Payment not found');
    });
  });

  describe('findByStatus', () => {
    it('debe buscar pagos por estado', async () => {
      const pendingPayments = [
        mockPaymentEntity,
        { ...mockPaymentEntity, id: 'pay-124' },
      ];

      mockTypeormRepository.find.mockResolvedValue(pendingPayments as PaymentEntity[]);

      const result = await repository.findByStatus(PaymentStatus.PENDING);

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: { status: PaymentStatus.PENDING },
      });
      expect(result).toHaveLength(2);
    });

    it('debe aplicar filtros adicionales', async () => {
      mockTypeormRepository.find.mockResolvedValue([mockPaymentEntity] as PaymentEntity[]);

      await repository.findByStatus(PaymentStatus.PENDING, {
        createdAfter: new Date('2024-01-01'),
      });

      expect(mockTypeormRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: PaymentStatus.PENDING,
          }),
        }),
      );
    });
  });

  describe('findByCustomerId', () => {
    it('debe recuperar pagos de un cliente', async () => {
      const customerPayments = [mockPaymentEntity];

      mockTypeormRepository.find.mockResolvedValue(customerPayments as PaymentEntity[]);

      const result = await repository.findByCustomerId('cust-456');

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: { customerId: 'cust-456' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });

    it('debe permitir paginación', async () => {
      mockTypeormRepository.find.mockResolvedValue([] as PaymentEntity[]);

      await repository.findByCustomerId('cust-456', { limit: 10, offset: 0 });

      expect(mockTypeormRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0,
        }),
      );
    });
  });

  describe('delete', () => {
    it('debe eliminar un pago por su ID', async () => {
      mockTypeormRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('pay-123');

      expect(mockTypeormRepository.delete).toHaveBeenCalledWith('pay-123');
    });

    it('debe lanzar error si la eliminación falla', async () => {
      mockTypeormRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Failed to delete payment',
      );
    });
  });

  describe('transaction', () => {
    it('debe ejecutar operaciones dentro de una transacción', async () => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockResolvedValue(mockPaymentEntity),
        },
      };

      mockTypeormRepository.manager = mockQueryRunner.manager as any;

      const result = await repository.transaction(async (manager) => {
        return manager.save(mockPaymentEntity);
      });

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('debe hacer rollback si la transacción falla', async () => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockRejectedValue(new Error('Transaction failed')),
        },
      };

      mockTypeormRepository.manager = mockQueryRunner.manager as any;

      await expect(
        repository.transaction(async (manager) => {
          throw new Error('Transaction failed');
        }),
      ).rejects.toThrow('Transaction failed');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });