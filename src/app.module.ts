import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from '@payments/payments.module';
import { AntifraudModule } from '@antifraud/antifraud.module';
import { RiskModule } from '@risk/risk.module';
import { KafkaPaymentProducerService } from '@payments/infrastructure/messaging/kafka/kafka-payment-producer.service';
import { KafkaPaymentConsumerService } from '@payments/infrastructure/messaging/kafka/kafka-payment-consumer.service';
import { SqsPaymentProducerService } from '@payments/infrastructure/messaging/sqs/sqs-payment-producer.service';
import { SqsPaymentConsumerService } from '@payments/infrastructure/messaging/sqs/sqs-payment-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 100,
      verboseMemoryLeak: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'payments',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    PaymentsModule,
    AntifraudModule,
    RiskModule,
  ],
  providers: [
    KafkaPaymentProducerService,
    KafkaPaymentConsumerService,
    SqsPaymentProducerService,
    SqsPaymentConsumerService,
    {
      provide: 'MESSAGE_QUEUE_PRODUCER',
      useFactory: (kafkaProducer: KafkaPaymentProducerService, sqsProducer: SqsPaymentProducerService) => {
        const useSqs = process.env.USE_SQS === 'true';
        return useSqs ? sqsProducer : kafkaProducer;
      },
      inject: [KafkaPaymentProducerService, SqsPaymentProducerService],
    },
    {
      provide: 'MESSAGE_QUEUE_CONSUMER',
      useFactory: (kafkaConsumer: KafkaPaymentConsumerService, sqsConsumer: SqsPaymentConsumerService) => {
        const useSqs = process.env.USE_SQS === 'true';
        return useSqs ? sqsConsumer : kafkaConsumer;
      },
      inject: [KafkaPaymentConsumerService, SqsPaymentConsumerService],
    },
  ],
  exports: [
    KafkaPaymentProducerService,
    KafkaPaymentConsumerService,
    SqsPaymentProducerService,
    SqsPaymentConsumerService,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logConfiguration();
  }

  private logConfiguration(): void {
    const useSqs = process.env.USE_SQS === 'true';
    const messagingSystem = useSqs ? 'SQS FIFO' : 'Kafka';

    this.logger.log('===========================================');
    this.logger.log('Payment Event-Driven System Configuration');
    this.logger.log('===========================================');
    this.logger.log(`Messaging System: ${messagingSystem}`);
    this.logger.log(`Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'payments'}`);
    this.logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    this.logger.log(`AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    this.logger.log(`Outbox Pattern: ${process.env.OUTBOX_ENABLED !== 'false' ? 'enabled' : 'disabled'}`);
    this.logger.log(`Saga Orchestration: ${process.env.SAGA_ENABLED !== 'false' ? 'enabled' : 'disabled'}`);
    this.logger.log('===========================================');
  }
}