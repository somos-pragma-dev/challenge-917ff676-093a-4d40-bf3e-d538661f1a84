import { PaymentAttributes, PaymentStatus } from '../entities/payment.entity';

export interface PaymentFilter {
  status?: PaymentStatus[];
  customerId?: string;
  merchantId?: string;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
}

export interface PaymentRepository {
  findById(id: string): Promise<PaymentAttributes | null>;
  findByIdempotencyKey(idempotencyKey: string): Promise<PaymentAttributes | null>;
  save(payment: PaymentAttributes): Promise<PaymentAttributes>;
  update(payment: PaymentAttributes): Promise<PaymentAttributes>;
  findByFilter(filter: PaymentFilter): Promise<PaymentAttributes[]>;
  countByFilter(filter: PaymentFilter): Promise<number>;
  findAll(filter: PaymentFilter): Promise<PaymentAttributes[]>;
  count(filter: PaymentFilter): Promise<number>;
  delete(id: string): Promise<void>;
}

export class PaymentRepositoryService implements PaymentRepository {
  async findById(id: string): Promise<PaymentAttributes | null> {
    throw new Error('Method not implemented');
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<PaymentAttributes | null> {
    throw new Error('Method not implemented');
  }

  async save(payment: PaymentAttributes): Promise<PaymentAttributes> {
    throw new Error('Method not implemented');
  }

  async update(payment: PaymentAttributes): Promise<PaymentAttributes> {
    throw new Error('Method not implemented');
  }

  async findByFilter(filter: PaymentFilter): Promise<PaymentAttributes[]> {
    throw new Error('Method not implemented');
  }

  async countByFilter(filter: PaymentFilter): Promise<number> {
    throw new Error('Method not implemented');
  }

  async findAll(filter: PaymentFilter): Promise<PaymentAttributes[]> {
    return this.findByFilter(filter);
  }

  async count(filter: PaymentFilter): Promise<number> {
    return this.countByFilter(filter);
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented');
  }
}