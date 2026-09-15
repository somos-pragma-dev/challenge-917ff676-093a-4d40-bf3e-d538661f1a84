import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, AttributeValue } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DomainEvent } from '@payments/domain/events/payment-domain.event';

export interface OutboxRecord {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: string;
  createdAt: string;
  processedAt?: string;
  retryCount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  errorMessage?: string;
}

export interface OutboxFilter {
  status?: 'PENDING' | 'PROCESSED' | 'FAILED';
  aggregateId?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

@Injectable()
export class PaymentOutboxRepository {
  private readonly client: DynamoDBClient;
  private readonly tableName: string;
  private readonly logger = new Logger(PaymentOutboxRepository.name);

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    const endpoint = process.env.DYNAMODB_ENDPOINT;
    
    this.client = new DynamoDBClient({
      region,
      ...(endpoint && { endpoint }),
      tls: !endpoint,
    });
    
    this.tableName = process.env.OUTBOX_TABLE_NAME || 'payment-outbox';
  }

  async save(event: DomainEvent, aggregateId: string): Promise<OutboxRecord> {
    const record: OutboxRecord = {
      id: `outbox-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      aggregateId,
      eventType: event.eventName,
      payload: JSON.stringify(event),
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'PENDING',
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(record),
      ConditionExpression: 'attribute_not_exists(id)',
    });

    try {
      await this.client.send(command);
      this.logger.log(`Outbox record saved: ${record.id} for aggregate ${aggregateId}`);
      return record;
    } catch (error) {
      this.logger.error(`Failed to save outbox record: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findPending(limit: number = 100): Promise<OutboxRecord[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: '#status = :status AND retryCount < :maxRetries',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: marshall({
        ':status': 'PENDING',
        ':maxRetries': 5,
      }),
      Limit: limit,
    });

    try {
      const result = await this.client.send(command);
      return (result.Items || []).map((item) => unmarshall(item) as OutboxRecord);
    } catch (error) {
      this.logger.error(`Failed to fetch pending outbox records: ${error.message}`, error.stack);
      throw error;
    }
  }

  async markAsProcessed(id: string): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
      UpdateExpression: 'SET #status = :status, processedAt = :processedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: marshall({
        ':status': 'PROCESSED',
        ':processedAt': new Date().toISOString(),
      }),
    });

    try {
      await this.client.send(command);
      this.logger.log(`Outbox record marked as processed: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to mark outbox record as processed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async markAsFailed(id: string, errorMessage: string): Promise<void> {
    const getCommand = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });

    const current = await this.client.send(getCommand);
    const currentRecord = current.Item ? unmarshall(current.Item) as OutboxRecord : null;
    
    if (!currentRecord) {
      throw new Error(`Outbox record not found: ${id}`);
    }

    const newRetryCount = currentRecord.retryCount + 1;
    const newStatus = newRetryCount >= 5 ? 'FAILED' : 'PENDING';

    const updateCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
      UpdateExpression: 'SET #status = :status, retryCount = :retryCount, errorMessage = :errorMessage',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: marshall({
        ':status': newStatus,
        ':retryCount': newRetryCount,
        ':errorMessage': errorMessage,
      }),
    });

    try {
      await this.client.send(updateCommand);
      this.logger.warn(`Outbox record marked as failed: ${id}, retry ${newRetryCount}, status: ${newStatus}`);
    } catch (error) {
      this.logger.error(`Failed to mark outbox record as failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByAggregateId(aggregateId: string): Promise<OutboxRecord[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'aggregateId = :aggregateId',
      ExpressionAttributeValues: marshall({
        ':aggregateId': aggregateId,
      }),
    });

    try {
      const result = await this.client.send(command);
      return (result.Items || []).map((item) => unmarshall(item) as OutboxRecord);
    } catch (error) {
      this.logger.error(`Failed to fetch outbox records by aggregateId: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteOldRecords(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffIso = cutoffDate.toISOString();

    let deletedCount = 0;
    let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

    do {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#status = :status AND createdAt < :cutoff',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: marshall({
          ':status': 'PROCESSED',
          ':cutoff': cutoffIso,
        }),
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 100,
      });

      const result = await this.client.send(command);
      
      if (result.Items && result.Items.length > 0) {
        for (const item of result.Items) {
          const record = unmarshall(item) as OutboxRecord;
          const deleteCommand = new UpdateItemCommand({
            TableName: this.tableName,
            Key: marshall({ id: record.id }),
            UpdateExpression: 'SET #status = :deleted',
            ExpressionAttributeNames: {
              '#status': 'status',
            },
            ExpressionAttributeValues: marshall({
              ':deleted': 'DELETED',
            }),
          });
          await this.client.send(deleteCommand);
          deletedCount++;
        }
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    this.logger.log(`Marked ${deletedCount} old outbox records as DELETED`);
    return deletedCount;
  }
}