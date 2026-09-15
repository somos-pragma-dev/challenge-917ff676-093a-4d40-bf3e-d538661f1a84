import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity, PaymentAttributes, PaymentStatus, PaymentOrmEntity } from '@payments/domain/entities/payment.entity';
import { PaymentRepository, PaymentFilter } from '@payments/domain/repositories/payment.repository';

@Injectable()
export class PaymentPostgresRepository implements PaymentRepository {
  private readonly logger = new Logger(PaymentPostgresRepository.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly ormRepository: Repository<PaymentOrmEntity>,
  ) {}

  async findById(id: string): Promise<PaymentAttributes | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.toAttributes(entity) : null;
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<PaymentAttributes | null> {
    const entity = await this.ormRepository.findOne({ where: { idempotencyKey } });
    return entity ? this.toAttributes(entity) : null;
  }

  async save(payment: PaymentAttributes): Promise<PaymentAttributes> {
    const entity = this.ormRepository.create(payment as PaymentOrmEntity);
    const saved = await this.ormRepository.save(entity);
    return this.toAttributes(saved);
  }

  async update(payment: PaymentAttributes): Promise<PaymentAttributes> {
    const saved = await this.ormRepository.save(payment as PaymentOrmEntity);
    return this.toAttributes(saved);
  }

  async findByFilter(filter: PaymentFilter): Promise<PaymentAttributes[]> {
    const query = this.ormRepository.createQueryBuilder('payment');
    
    if (filter.status && filter.status.length > 0) {
      query.andWhere('payment.status IN (:...statuses)', { statuses: filter.status });
    }
    if (filter.customerId) {
      query.andWhere('payment.customerId = :customerId', { customerId: filter.customerId });
    }
    if (filter.merchantId) {
      query.andWhere('payment.merchantId = :merchantId', { merchantId: filter.merchantId });
    }
    if (filter.fromDate) {
      query.andWhere('payment.createdAt >= :fromDate', { fromDate: filter.fromDate });
    }
    if (filter.toDate) {
      query.andWhere('payment.createdAt <= :toDate', { toDate: filter.toDate });
    }
    if (filter.minAmount) {
      query.andWhere('payment.amount >= :minAmount', { minAmount: filter.minAmount });
    }
    if (filter.maxAmount) {
      query.andWhere('payment.amount <= :maxAmount', { maxAmount: filter.maxAmount });
    }
    
    query.orderBy('payment.createdAt', 'DESC');
    
    if (filter.limit) {
      query.take(filter.limit);
    }
    if (filter.offset) {
      query.skip(filter.offset);
    }
    
    const entities = await query.getMany();
    return entities.map(e => this.toAttributes(e));
  }

  async countByFilter(filter: PaymentFilter): Promise<number> {
    const query = this.ormRepository.createQueryBuilder('payment');
    
    if (filter.status && filter.status.length > 0) {
      query.andWhere('payment.status IN (:...statuses)', { statuses: filter.status });
    }
    if (filter.customerId) {
      query.andWhere('payment.customerId = :customerId', { customerId: filter.customerId });
    }
    if (filter.merchantId) {
      query.andWhere('payment.merchantId = :merchantId', { merchantId: filter.merchantId });
    }
    if (filter.fromDate) {
      query.andWhere('payment.createdAt >= :fromDate', { fromDate: filter.fromDate });
    }
    if (filter.toDate) {
      query.andWhere('payment.createdAt <= :toDate', { toDate: filter.toDate });
    }
    if (filter.minAmount) {
      query.andWhere('payment.amount >= :minAmount', { minAmount: filter.minAmount });
    }
    if (filter.maxAmount) {
      query.andWhere('payment.amount <= :maxAmount', { maxAmount: filter.maxAmount });
    }
    
    return query.getCount();
  }

  async findAll(filter: PaymentFilter): Promise<PaymentAttributes[]> {
    return this.findByFilter(filter);
  }

  async count(filter: PaymentFilter): Promise<number> {
    return this.countByFilter(filter);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  private toAttributes(entity: PaymentOrmEntity): PaymentAttributes {
    return entity as PaymentAttributes;
  }
}