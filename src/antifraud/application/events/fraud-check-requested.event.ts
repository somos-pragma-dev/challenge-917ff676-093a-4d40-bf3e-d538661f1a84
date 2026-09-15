import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum FraudCheckType {
  TRANSACTION = 'TRANSACTION',
  ACCOUNT = 'ACCOUNT',
  CUSTOMER = 'CUSTOMER',
}

export enum FraudCheckPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export enum FraudCheckSource {
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  SCHEDULED_AUDIT = 'SCHEDULED_AUDIT',
  EXTERNAL_WEBHOOK = 'EXTERNAL_WEBHOOK',
}

export class FraudCheckAmount {
  @IsNumber()
  readonly value: number;

  @IsEnum(['USD', 'EUR', 'GBP', 'MXN', 'BRL'])
  readonly currency: string;

  constructor(value: number, currency: string) {
    this.value = value;
    this.currency = currency;
  }
}

export class FraudCheckPaymentMethod {
  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly lastFourDigits?: string;

  @IsOptional()
  @IsString()
  readonly cardBrand?: string;

  @IsOptional()
  @IsString()
  readonly walletId?: string;

  constructor(type: string, lastFourDigits?: string, cardBrand?: string, walletId?: string) {
    this.type = type;
    this.lastFourDigits = lastFourDigits;
    this.cardBrand = cardBrand;
    this.walletId = walletId;
  }
}

export class FraudCheckCustomer {
  @IsString()
  readonly customerId: string;

  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  readonly accountAgeDays?: number;

  @IsOptional()
  @IsNumber()
  readonly transactionCountLast30Days?: number;

  constructor(
    customerId: string,
    email: string,
    phoneNumber?: string,
    accountAgeDays?: number,
    transactionCountLast30Days?: number,
  ) {
    this.customerId = customerId;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.accountAgeDays = accountAgeDays;
    this.transactionCountLast30Days = transactionCountLast30Days;
  }
}

export class FraudCheckRequestedEvent {
  @IsUUID('4')
  readonly eventId: string;

  @IsUUID('4')
  readonly correlationId: string;

  @IsUUID('4')
  readonly paymentId: string;

  @IsEnum(FraudCheckType)
  readonly checkType: FraudCheckType;

  @IsEnum(FraudCheckPriority)
  readonly priority: FraudCheckPriority;

  @IsEnum(FraudCheckSource)
  readonly source: FraudCheckSource;

  @ValidateNested()
  @Type(() => FraudCheckAmount)
  readonly amount: FraudCheckAmount;

  @ValidateNested()
  @Type(() => FraudCheckPaymentMethod)
  readonly paymentMethod: FraudCheckPaymentMethod;

  @ValidateNested()
  @Type(() => FraudCheckCustomer)
  readonly customer: FraudCheckCustomer;

  @IsOptional()
  @IsString()
  readonly merchantId?: string;

  @IsOptional()
  @IsString()
  readonly merchantCategoryCode?: string;

  @IsOptional()
  @IsString()
  readonly billingCountry?: string;

  @IsOptional()
  @IsString()
  readonly shippingCountry?: string;

  @IsOptional()
  @IsDateString()
  readonly requestedAt?: string;

  @IsOptional()
  @IsNumber()
  readonly retryCount?: number;

  @IsOptional()
  @IsString()
  readonly idempotencyKey?: string;

  constructor(
    eventId: string,
    correlationId: string,
    paymentId: string,
    checkType: FraudCheckType,
    priority: FraudCheckPriority,
    source: FraudCheckSource,
    amount: FraudCheckAmount,
    paymentMethod: FraudCheckPaymentMethod,
    customer: FraudCheckCustomer,
    merchantId?: string,
    merchantCategoryCode?: string,
    billingCountry?: string,
    shippingCountry?: string,
    requestedAt?: string,
    retryCount?: number,
    idempotencyKey?: string,
  ) {
    this.eventId = eventId;
    this.correlationId = correlationId;
    this.paymentId = paymentId;
    this.checkType = checkType;
    this.priority = priority;
    this.source = source;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.customer = customer;
    this.merchantId = merchantId;
    this.merchantCategoryCode = merchantCategoryCode;
    this.billingCountry = billingCountry;
    this.shippingCountry = shippingCountry;
    this.requestedAt = requestedAt;
    this.retryCount = retryCount;
    this.idempotencyKey = idempotencyKey;
  }

  static create(
    correlationId: string,
    paymentId: string,
    amount: FraudCheckAmount,
    paymentMethod: FraudCheckPaymentMethod,
    customer: FraudCheckCustomer,
    options?: {
      merchantId?: string;
      merchantCategoryCode?: string;
      billingCountry?: string;
      shippingCountry?: string;
      idempotencyKey?: string;
    },
  ): FraudCheckRequestedEvent {
    const eventId = crypto.randomUUID();
    const requestedAt = new Date().toISOString();
    
    return new FraudCheckRequestedEvent(
      eventId,
      correlationId,
      paymentId,
      FraudCheckType.TRANSACTION,
      FraudCheckPriority.NORMAL,
      FraudCheckSource.PAYMENT_INITIATED,
      amount,
      paymentMethod,
      customer,
      options?.merchantId,
      options?.merchantCategoryCode,
      options?.billingCountry,
      options?.shippingCountry,
      requestedAt,
      0,
      options?.idempotencyKey,
    );
  }
}