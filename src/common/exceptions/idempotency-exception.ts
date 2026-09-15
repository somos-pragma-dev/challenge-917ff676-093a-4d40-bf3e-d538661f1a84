import { HttpException, HttpStatus } from '@nestjs/common';

export class IdempotencyException extends HttpException {
  private readonly idempotencyKey: string;
  private readonly originalPaymentId: string | undefined;
  private readonly timestamp: Date;

  constructor(
    idempotencyKey: string,
    message: string = 'Conflicto de idempotencia detectado',
    originalPaymentId?: string,
  ) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message,
        idempotencyKey,
        originalPaymentId,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
    this.idempotencyKey = idempotencyKey;
    this.originalPaymentId = originalPaymentId;
    this.timestamp = new Date();
    this.name = 'IdempotencyException';
  }

  getIdempotencyKey(): string {
    return this.idempotencyKey;
  }

  getOriginalPaymentId(): string | undefined {
    return this.originalPaymentId;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.getStatus(),
      idempotencyKey: this.idempotencyKey,
      originalPaymentId: this.originalPaymentId,
      timestamp: this.timestamp.toISOString(),
    };
  }

  static fromExistingError(
    idempotencyKey: string,
    existingPaymentId: string,
  ): IdempotencyException {
    return new IdempotencyException(
      idempotencyKey,
      `Ya existe una solicitud con la clave de idempotencia: ${idempotencyKey}`,
      existingPaymentId,
    );
  }

  static fromDuplicateRequest(
    idempotencyKey: string,
    paymentId: string,
  ): IdempotencyException {
    return new IdempotencyException(
      idempotencyKey,
      'La solicitud ya fue procesada anteriormente. No se permiten duplicados.',
      paymentId,
    );
  }

  static fromExpiredKey(idempotencyKey: string): IdempotencyException {
    return new IdempotencyException(
      idempotencyKey,
      'La clave de idempotencia ha expirado y no puede ser reutilizada.',
    );
  }
}