import { Test, TestingModule } from '@nestjs/testing';
import { PaymentOutboxRepository } from '@payments/infrastructure/persistence/dynamodb/payment-outbox.repository';
import { PaymentStatus } from '@payments/domain/entities/payment.entity';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb');

describe('PaymentOutboxRepository', () => {
  let repository: PaymentOutboxRepository;
  let mockDynamoDBClient: jest.Mocked<DynamoDBClient>;

  const mockOutboxEvent = {
    id: 'outbox-event-1',
    aggregateId: 'pay-123',
    aggregateType: 'Payment',
    eventType: 'PaymentInitiated',
    payload: JSON.stringify({
      paymentId: 'pay-123',
      amount: 1000,
      currency: 'USD',
    }),
    metadata: JSON.stringify({
      correlationId: 'corr-123',
      causationId: 'cmd-123',
    }),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    processedAt: null,
    retryCount: 0,
  };

  beforeEach(async () => {
    mockDynamoDBClient = {
      send: jest.fn(),
    } as unknown as jest.Mocked<DynamoDBClient>;

    (DynamoDBClient as jest.Mock).mockImplementation(() => mockDynamoDBClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentOutboxRepository,
        {
          provide: 'DYNAMODB_CLIENT',
          useValue: mockDynamoDBClient,
        },
      ],
    }).compile();

    repository = module.get<PaymentOutboxRepository>(PaymentOutboxRepository);
  });

  describe('save', () => {
    it('debe persistir un evento en el outbox', async () => {
      const eventToSave = {
        aggregateId: 'pay-456',
        aggregateType: 'Payment',
        eventType: 'PaymentCompleted',
        payload: { paymentId: 'pay-456', amount: 500 },
        metadata: { correlationId: 'corr-456' },
      };

      mockDynamoDBClient.send.mockResolvedValue({} as any);
      (marshall as jest.Mock).mockReturnValue(eventToSave);

      const result = await repository.save(eventToSave);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
      expect(result).toBeDefined();
    });

    it('debe lanzar error si la persistencia falla', async () => {
      const eventToSave = {
        aggregateId: 'pay-789',
        aggregateType: 'Payment',
        eventType: 'PaymentFailed',
        payload: { paymentId: 'pay-789' },
        metadata: {},
      };

      mockDynamoDBClient.send.mockRejectedValue(
        new Error('DynamoDB connection error'),
      );

      await expect(repository.save(eventToSave)).rejects.toThrow(
        'DynamoDB connection error',
      );
    });
  });

  describe('findPending', () => {
    it('debe recuperar eventos pendientes del outbox', async () => {
      const pendingEvents = [mockOutboxEvent];
      
      mockDynamoDBClient.send.mockResolvedValue({
        Items: pendingEvents.map(item => marshall(item)),
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      const result = await repository.findPending(10);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(QueryCommand),
      );
      expect(result).toHaveLength(1);
      expect(result[0].aggregateId).toBe('pay-123');
    });

    it('debe retornar array vacío si no hay eventos pendientes', async () => {
      mockDynamoDBClient.send.mockResolvedValue({
        Items: undefined,
      } as any);

      const result = await repository.findPending(10);

      expect(result).toEqual([]);
    });

    it('debe limitar la cantidad de eventos recuperados', async () => {
      mockDynamoDBClient.send.mockResolvedValue({
        Items: [marshall(mockOutboxEvent)],
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      await repository.findPending(5);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            limit: 5,
          }),
        }),
      );
    });
  });

  describe('markAsProcessed', () => {
    it('debe marcar un evento como procesado', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      await repository.markAsProcessed('outbox-event-1');

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
    });

    it('debe actualizar el campo processedAt con la fecha actual', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      const beforeTime = new Date();
      await repository.markAsProcessed('outbox-event-1');
      const afterTime = new Date();

      const updateCall = mockDynamoDBClient.send.mock.calls[0][0];
      const updateInput = updateCall.input;
      
      expect(updateInput.UpdateExpression).toContain('processedAt');
      expect(updateInput.ExpressionAttributeValues[':processedAt']).toBeDefined();
    });

    it('debe incrementar el retryCount si se procesa con delay', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      await repository.markAsProcessed('outbox-event-1', true);

      const updateCall = mockDynamoDBClient.send.mock.calls[0][0];
      const updateInput = updateCall.input;

      expect(updateInput.UpdateExpression).toContain('retryCount');
    });
  });

  describe('findByAggregateId', () => {
    it('debe recuperar eventos por ID del agregado', async () => {
      const eventsForAggregate = [
        { ...mockOutboxEvent, eventType: 'PaymentInitiated' },
        { ...mockOutboxEvent, eventType: 'PaymentCompleted', id: 'outbox-2' },
      ];

      mockDynamoDBClient.send.mockResolvedValue({
        Items: eventsForAggregate.map(item => marshall(item)),
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      const result = await repository.findByAggregateId('pay-123');

      expect(result).toHaveLength(2);
      expect(result[0].aggregateId).toBe('pay-123');
    });
  });

  describe('findByEventType', () => {
    it('debe filtrar eventos por tipo', async () => {
      mockDynamoDBClient.send.mockResolvedValue({
        Items: [marshall(mockOutboxEvent)],
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      const result = await repository.findByEventType('PaymentInitiated');

      expect(result).toHaveLength(1);
      expect(result[0].eventType).toBe('PaymentInitiated');
    });
  });

  describe('deleteOldEvents', () => {
    it('debe eliminar eventos procesados mayores a la fecha especificada', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      await repository.deleteOldEvents(cutoffDate);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
    });
  });
});