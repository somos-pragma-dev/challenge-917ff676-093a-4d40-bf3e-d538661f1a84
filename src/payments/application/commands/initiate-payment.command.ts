import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsUUID, Min, Max, IsObject } from 'class-validator';
import { PaymentMethod, Currency } from '@common/dto/payment-request.dto';

export interface InitiatePaymentCommandData {
  paymentId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  senderAccountId: string;
  receiverAccountId: string;
  idempotencyKey: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  requestedBy: string;
}

export class InitiatePaymentCommand {
  @IsUUID()
  @IsNotEmpty()
  public readonly paymentId: string;

  @IsNumber()
  @Min(0.01)
  @Max(999999.99)
  public readonly amount: number;

  @IsEnum(Currency)
  public readonly currency: Currency;

  @IsEnum(PaymentMethod)
  public readonly paymentMethod: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  public readonly senderAccountId: string;

  @IsString()
  @IsNotEmpty()
  public readonly receiverAccountId: string;

  @IsString()
  @IsNotEmpty()
  public readonly idempotencyKey: string;

  @IsString()
  @IsOptional()
  public readonly description?: string;

  @IsObject()
  @IsOptional()
  public readonly metadata?: Record<string, unknown>;

  @IsString()
  @IsNotEmpty()
  public readonly requestedBy: string;

  constructor(data: InitiatePaymentCommandData) {
    this.paymentId = data.paymentId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.paymentMethod = data.paymentMethod;
    this.senderAccountId = data.senderAccountId;
    this.receiverAccountId = data.receiverAccountId;
    this.idempotencyKey = data.idempotencyKey;
    this.description = data.description;
    this.metadata = data.metadata;
    this.requestedBy = data.requestedBy;
  }

  public toCommandData(): InitiatePaymentCommandData {
    return {
      paymentId: this.paymentId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      senderAccountId: this.senderAccountId,
      receiverAccountId: this.receiverAccountId,
      idempotencyKey: this.idempotencyKey,
      description: this.description,
      metadata: this.metadata,
      createdAt: new Date(),
      requestedBy: this.requestedBy,
    };
  }

  public static fromRequest(
    paymentId: string,
    amount: number,
    currency: Currency,
    paymentMethod: PaymentMethod,
    senderAccountId: string,
    receiverAccountId: string,
    idempotencyKey: string,
    requestedBy: string,
    description?: string,
    metadata?: Record<string, unknown>,
  ): InitiatePaymentCommand {
    return new InitiatePaymentCommand({
      paymentId,
      amount,
      currency,
      paymentMethod,
      senderAccountId,
      receiverAccountId,
      idempotencyKey,
      description,
      metadata,
      createdAt: new Date(),
      requestedBy,
    });
  }
}