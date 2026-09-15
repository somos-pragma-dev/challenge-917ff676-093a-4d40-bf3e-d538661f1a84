import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus, BadRequestException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { PaymentRequestDto, PaymentStatusQueryDto, PaymentListQueryDto } from '@common/dto/payment-request.dto';
import { PaymentStatus } from '@payments/domain/entities/payment.entity';
import { PaymentRepository } from '@payments/domain/repositories/payment.repository';
import { InitiatePaymentCommand } from '@payments/application/commands/initiate-payment.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async initiatePayment(@Body() paymentRequest: PaymentRequestDto): Promise<{ paymentId: string; status: string }> {
    this.logger.log(`Iniciando pago para orden: ${paymentRequest.orderId}`);

    if (!paymentRequest.amount || paymentRequest.amount <= 0) {
      throw new BadRequestException('El monto del pago debe ser mayor a cero');
    }

    if (!paymentRequest.orderId || paymentRequest.orderId.trim() === '') {
      throw new BadRequestException('El ID de orden es requerido');
    }

    if (!paymentRequest.paymentMethod) {
      throw new BadRequestException('El método de pago es requerido');
    }

    try {
      const command = new InitiatePaymentCommand(
        paymentRequest.orderId,
        paymentRequest.amount,
        paymentRequest.currency,
        paymentRequest.paymentMethod,
        paymentRequest.customerId,
        paymentRequest.metadata,
      );

      const paymentId = await this.commandBus.execute(command);

      this.logger.log(`Pago iniciado exitosamente: ${paymentId}`);

      return {
        paymentId,
        status: PaymentStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(`Error al iniciar pago: ${error.message}`, error.stack);
      throw new BadRequestException(`Error al procesar el pago: ${error.message}`);
    }
  }

  @Get(':paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string): Promise<{ paymentId: string; status: string; amount: number; currency: string; createdAt: Date; updatedAt: Date }> {
    this.logger.log(`Consultando estado del pago: ${paymentId}`);

    if (!paymentId || paymentId.trim() === '') {
      throw new BadRequestException('El ID de pago es requerido');
    }

    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new NotFoundException(`Pago no encontrado: ${paymentId}`);
    }

    return {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  @Get()
  async listPayments(@Query() query: PaymentListQueryDto): Promise<{ payments: Array<{ paymentId: string; status: string; amount: number; currency: string }>; total: number }> {
    this.logger.log(`Listando pagos con filtros: ${JSON.stringify(query)}`);

    const limit = query.limit || 20;
    const offset = query.offset || 0;

    const validStatuses = query.status ? [query.status] : undefined;

    const payments = await this.paymentRepository.findAll({
      status: validStatuses,
      customerId: query.customerId,
      limit,
      offset,
    });

    const total = await this.paymentRepository.count({
      status: validStatuses,
      customerId: query.customerId,
    });

    return {
      payments: payments.map(p => ({
        paymentId: p.id,
        status: p.status,
        amount: p.amount,
        currency: p.currency,
      })),
      total,
    };
  }
}