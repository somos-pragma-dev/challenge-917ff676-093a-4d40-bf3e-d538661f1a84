import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNotEmpty,
  Min,
  Max,
  Length,
  IsEmail,
} from 'class-validator';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  WALLET = 'WALLET',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  MXN = 'MXN',
}

export class PaymentRequestDto {
  @IsUUID('4')
  @IsNotEmpty()
  idempotencyKey!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  payerId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  payeeId!: string;

  @IsNumber()
  @Min(0.01)
  @Max(999999.99)
  amount!: number;

  @IsEnum(Currency)
  currency!: Currency;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  merchantId?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  terminalId?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  channel?: string;

  @IsEmail()
  @IsOptional()
  payerEmail?: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  payerPhone?: string;

  @IsString()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  priority?: number;
}

export class PaymentStatusQueryDto {
  @IsUUID('4')
  @IsNotEmpty()
  paymentId!: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  requestId?: string;
}

export class PaymentListQueryDto {
  @IsString()
  @IsOptional()
  @Length(0, 100)
  payerId?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  payeeId?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number;
}