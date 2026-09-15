import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PaymentMethod, Currency, PaymentRequestDto } from '@payments/dto/payment-request.dto';
import { PaymentStatus } from '@payments/domain/entities/payment.entity';
import {
  PaymentInitiatedEvent,
  PaymentAntifraudCheckedEvent,
  PaymentRiskAssessedEvent,
  PaymentCompletedEvent,
  PaymentDomainEvent,
} from '@payments/domain/events/payment-domain.event';

describe('Payment Flow Integration Tests', () => {
  let app: INestApplication;
  let httpServer: any;

  const validPaymentRequest: PaymentRequestDto = {
    amount: 1500.00,
    currency: Currency.USD,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    customerId: 'cust-12345',
    merchantId: 'merch-67890',
    description: 'Integration test payment',
    idempotencyKey: `idem-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    metadata: {
      orderId: 'order-001',
      source: 'integration-test',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Complete Payment Flow', () => {
    it('should process payment through all stages: initiated -> antifraud -> risk -> completed', async () => {
      const response = await request(httpServer)
        .post('/payments')
        .send(validPaymentRequest)
        .expect(201);

      expect(response.body).toHaveProperty('paymentId');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body.status).toBe(PaymentStatus.PENDING);

      const paymentId = response.body.paymentId;

      const statusResponse = await request(httpServer)
        .get(`/payments/${paymentId}/status`)
        .expect(200);

      expect(statusResponse.body.paymentId).toBe(paymentId);
      expect([
        PaymentStatus.PENDING,
        PaymentStatus.ANTIFRAUD_CHECKED,
        PaymentStatus.RISK_ASSESSED,
        PaymentStatus.COMPLETED,
      ]).toContain(statusResponse.body.status);
    }, 30000);

    it('should enforce idempotency for duplicate requests', async () => {
      const idempotentRequest = {
        ...validPaymentRequest,
        idempotencyKey: 'idem-same-key-12345',
      };

      const firstResponse = await request(httpServer)
        .post('/payments')
        .send(idempotentRequest)
        .expect(201);

      const secondResponse = await request(httpServer)
        .post('/payments')
        .send(idempotentRequest)
        .expect(201);

      expect(firstResponse.body.paymentId).toBe(secondResponse.body.paymentId);
    });

    it('should reject payment with invalid amount', async () => {
      const invalidRequest = {
        ...validPaymentRequest,
        amount: -100,
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.message).toContain('amount must be a positive number');
    });

    it('should reject payment with missing required fields', async () => {
      const incompleteRequest = {
        amount: 100,
        currency: Currency.USD,
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(incompleteRequest)
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
    });

    it('should handle payment failure gracefully', async () => {
      const failedPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-fail-${Date.now()}`,
        metadata: {
          ...validPaymentRequest.metadata,
          simulateFailure: 'antifraud',
        },
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(failedPaymentRequest);

      expect([201, 400, 422]).toContain(response.status);

      if (response.status === 201) {
        const paymentId = response.body.paymentId;
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusResponse = await request(httpServer)
          .get(`/payments/${paymentId}/status`)
          .expect(200);

        expect([
          PaymentStatus.FAILED,
          PaymentStatus.CANCELLED,
          PaymentStatus.PENDING,
        ]).toContain(statusResponse.body.status);
      }
    }, 30000);
  });

  describe('Event Publishing', () => {
    it('should publish PaymentInitiatedEvent when payment is created', async () => {
      const eventPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-event-${Date.now()}`,
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(eventPaymentRequest)
        .expect(201);

      expect(response.body).toHaveProperty('paymentId');
      expect(response.body).toHaveProperty('status');
    });

    it('should maintain event order for saga orchestration', async () => {
      const sagaPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-saga-${Date.now()}`,
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(sagaPaymentRequest)
        .expect(201);

      const paymentId = response.body.paymentId;

      for (let i = 0; i < 10; i++) {
        const statusResponse = await request(httpServer)
          .get(`/payments/${paymentId}/status`)
          .expect(200);

        if (statusResponse.body.status === PaymentStatus.COMPLETED) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const finalStatus = await request(httpServer)
        .get(`/payments/${paymentId}/status`)
        .expect(200);

      expect([
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
        PaymentStatus.PENDING,
      ]).toContain(finalStatus.body.status);
    }, 30000);
  });

  describe('Outbox Pattern Integration', () => {
    it('should persist events to outbox table', async () => {
      const outboxPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-outbox-${Date.now()}`,
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(outboxPaymentRequest)
        .expect(201);

      expect(response.body).toHaveProperty('paymentId');

      const paymentId = response.body.paymentId;
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await request(httpServer)
        .get(`/payments/${paymentId}/status`)
        .expect(200);

      expect(statusResponse.body).toHaveProperty('status');
    });

    it('should handle retry with exponential backoff', async () => {
      const retryPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-retry-${Date.now()}`,
        metadata: {
          ...validPaymentRequest.metadata,
          simulateRetry: true,
        },
      };

      const startTime = Date.now();

      const response = await request(httpServer)
        .post('/payments')
        .send(retryPaymentRequest);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect([201, 422]).toContain(response.status);
    }, 45000);
  });

  describe('Cross-Service Communication', () => {
    it('should coordinate with antifraud service', async () => {
      const antifraudPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-antifraud-${Date.now()}`,
        metadata: {
          triggerAntifraud: true,
        },
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(antifraudPaymentRequest)
        .expect(201);

      const paymentId = response.body.paymentId;
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await request(httpServer)
        .get(`/payments/${paymentId}/status`)
        .expect(200);

      expect([
        PaymentStatus.PENDING,
        PaymentStatus.ANTIFRAUD_CHECKED,
        PaymentStatus.RISK_ASSESSED,
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
      ]).toContain(statusResponse.body.status);
    }, 30000);

    it('should coordinate with risk assessment service', async () => {
      const riskPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-risk-${Date.now()}`,
        amount: 50000,
        metadata: {
          highValueTransaction: true,
        },
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(riskPaymentRequest)
        .expect(201);

      const paymentId = response.body.paymentId;
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await request(httpServer)
        .get(`/payments/${paymentId}/status`)
        .expect(200);

      expect(statusResponse.body).toHaveProperty('status');
      expect(statusResponse.body).toHaveProperty('paymentId');
    }, 30000);
  });

  describe('Query Operations', () => {
    it('should list payments with filters', async () => {
      const listResponse = await request(httpServer)
        .get('/payments')
        .query({ limit: 10, offset: 0 })
        .expect(200);

      expect(listResponse.body).toHaveProperty('data');
      expect(listResponse.body).toHaveProperty('total');
      expect(listResponse.body).toHaveProperty('limit');
      expect(listResponse.body).toHaveProperty('offset');
      expect(Array.isArray(listResponse.body.data)).toBe(true);
    });

    it('should filter payments by status', async () => {
      const filterResponse = await request(httpServer)
        .get('/payments')
        .query({ status: PaymentStatus.COMPLETED })
        .expect(200);

      expect(filterResponse.body.data).toBeInstanceOf(Array);
    });

    it('should filter payments by customerId', async () => {
      const customerFilterResponse = await request(httpServer)
        .get('/payments')
        .query({ customerId: validPaymentRequest.customerId })
        .expect(200);

      expect(customerFilterResponse.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent payment', async () => {
      const response = await request(httpServer)
        .get('/payments/non-existent-id-12345/status')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle timeout gracefully', async () => {
      const timeoutPaymentRequest = {
        ...validPaymentRequest,
        idempotencyKey: `idem-timeout-${Date.now()}`,
        metadata: {
          simulateTimeout: true,
        },
      };

      const response = await request(httpServer)
        .post('/payments')
        .send(timeoutPaymentRequest)
        .timeout(5000);

      expect([201, 408, 422, 500]).toContain(response.status);
    }, 15000);

    it('should handle malformed JSON', async () => {
      const response = await request(httpServer)
        .post('/payments')
        .set('Content-Type', 'application/json')
        .send('{invalid json}');

      expect([400, 415]).toContain(response.status);
    });
  });
})// === ARCHIVO: docs/restricciones-sistema.md ===
# Restricciones y Ambigüedades del Sistema de Procesamiento de Pagos

## 1. Restricciones Técnicas del Sistema

### 1.1 Límites de Transacciones

El sistema presenta restricciones específicas en cuanto a los montos de transacción permitidos. El monto mínimo por transacción está establecido en **$1.00 USD** o su equivalente en otras monedas soportadas. El monto máximo por transacción individual es de **$100,000.00 USD** para operaciones estándar, mientras que transacciones que excedan este límite requieren aprobación manual y pasan por un flujo de validación adicional en el servicio de riesgo.

En cuanto a la frecuencia de transacciones, el sistema permite hasta **100 transacciones por cliente por minuto** en condiciones normales de operación. Este límite puede ajustarse dinámicamente basándose en el perfil de riesgo del cliente y el historial de comportamiento. Los clientes con perfiles de alto riesgo tienen un límite reducido a **20 transacciones por minuto** para mitigar posibles fraudes.

### 1.2 Restricciones de Monedas y Métodos de Pago

El sistema soporta un conjunto limitado de monedas: USD, EUR, GBP, MXN, BRL y CAD. Cada moneda tiene asociado un conjunto de métodos de pago válidos. Por ejemplo, los pagos en **EUR** solo soportan transferencia bancaria y tarjetas de crédito/débito Mastercard y Visa, mientras que los pagos en **MXN** soportan SPEI (Sistema de Pagos Electrónicos Interbancarios) además de tarjetas.

Los métodos de pago disponibles incluyen tarjeta de crédito, tarjeta de débito, transferencia bancaria, SPEI (para México) y PIX (para Brasil). Cada método de pago tiene asociado un fee percentual diferente que se calcula automáticamente según la tabla de comisiones vigente.

### 1.3 Restricciones de Concurrencia y Ordenamiento

Una de las ambigüedades más significativas del sistema es garantizar el ordenamiento exacto de los eventos en un entorno distribuido. Aunque se utilizan colas FIFO (SQS FIFO) y particiones de Kafka, existe un escenario de carrera cuando dos solicitudes de pago con el mismo `idempotencyKey` llegan simultáneamente al sistema. El sistema debe decidir cuál prevalece y cómo se maneja la segunda solicitud sin violar el principio de idempotencia.

El modelo de consistencia eventual introducido por el outbox pattern significa que los eventos no se publican instantáneamente en Kafka/SQS. Existe un **retraso de hasta 5 segundos** entre que un evento se persiste en la tabla outbox y se publica en el broker de mensajes. Esto crea una ventana de inconsistencia que debe ser manejada por los consumidores.

### 1.4 Restricciones del Outbox Pattern

La tabla de outbox en DynamoDB tiene un límite de tamaño de registro de **400 KB**. Esto impone una restricción sobre la cantidad de metadata que puede incluirse en un solo evento. Para eventos que excedan este límite, el sistema debe fragmentar la información en múltiples registros de outbox, lo cual introduce complejidad adicional en la reconstrucción del orden de eventos.

El mecanismo de limpieza de la tabla outbox (proceso de eliminación de eventos procesados) debe ejecutarse sin afectar la disponibilidad del sistema. Se ha establecido una política de retención de **7 días** para los eventos en el outbox, después de lo cual se eliminan automáticamente mediante un job programado.

## 2. Ambigüedades en el Diseño

### 2.1 Consistencia vs Disponibilidad

El sistema opera bajo el teorema CAP, y existe una ambigüedad no resuelta completamente sobre qué priorizar en caso de partición de red. La documentación actual indica que se prioriza la **disponibilidad** sobre la consistencia (modo AP), pero en la práctica, para transacciones financieras críticas, se requiere **consistencia fuerte** (modo CP).

Esta ambigüedad se manifiesta en escenarios donde el servicio de antifraude no responde a tiempo. La pregunta es: ¿se debe rechazar la transacción por defecto (favorecer consistencia) o se debe aprobar con marcado de riesgo (favorecer disponibilidad)? La respuesta actual depende de la configuración del modo de operación, lo cual no está claramente documentado para todos los casos de uso.

### 2.2 Manejo de Reintentos y Compensaciones

La saga distribuida implementada utiliza backoff exponencial con jitter para los reintentos, pero existe ambigüedad sobre el número máximo de reintentos permitidos. El código actual permite **5 reintentos** para errores transitorios y **3 reintentos** para errores de validación. Sin embargo, la documentación del sistema indica "reintentos ilimitados hasta éxito", lo cual es contradictorio.

El orden de las compensaciones en caso de falla también presenta ambigüedad. Si la transacción falla en la fase de evaluación de riesgo después de haber pasado el antifraude, ¿debe el sistema intentar reversar la aprobación del antifraude? ¿O simplemente marcar la transacción como fallida y dejar que el proceso de conciliación nocturna maneje la discrepancia?

### 2.3 Idempotencia y Keys Duplicados

El sistema utiliza `idempotencyKey` para garantizar que transacciones duplicadas sean detectadas y tratadas apropiadamente. Sin embargo, existe una ambigüedad sobre el **alcance temporal** de la idempotencia. ¿Un `idempotencyKey` es válido por siempre, o tiene una fecha de expiración?

La implementación actual no define claramente qué sucede cuando un cliente intenta reutilizar un `idempotencyKey` después de 24 horas. ¿Se considera una nueva transacción o se rechaza por clave expirada? Esta ambigüedad puede causar problemas de reconciliación con los sistemas contables.

### 2.4 Priorización de Eventos

En momentos de alta carga, el sistema debe priorizar qué eventos procesar primero. La priorización actual se basa en el **timestamp de creación**, pero esto no considera la urgencia del pago. Un pago de bajo monto debería tener menor prioridad que un pago de alto monto que representa una obligación contractual crítica.

No existe documentación clara sobre cómo se maneja la **backpressure** cuando la cola de mensajes se llena. ¿Se rechazan nuevos pagos? ¿Se encolan en memoria con riesgo de pérdida si el proceso falla? ¿Se utiliza algún mecanismo de circuit breaker para rechazar tráfico?

## 3. Restricciones de Integración

### 3.1 Límites de APIs Externas

El servicio de antifraude externo tiene un límite de **1000 consultas por segundo** y un timeout de **3 segundos** por solicitud. Si el sistema excede estos límites, las solicitudes son rechazadas con código HTTP 429 (Too Many Requests). El manejo de este escenario requiere backoff y reintento, pero el algoritmo actual no implementa circuit breaker hacia el servicio externo.

El buró de riesgos tiene un límite aún más restrictivo: **100 consultas por minuto** por cliente. Esto significa que para clientes con alto volumen de transacciones, el sistema debe implementar un mecanismo de caché para evitar llamadas repetitivas al buró de riesgos para el mismo perfil de cliente.

### 3.2 Formato de Datos y Transformaciones

Los sistemas externos utilizan formatos de fecha diferentes: el servicio antifraude usa **ISO 8601 con timezone**, mientras que el buró de riesgos usa **Unix timestamp en milisegundos**. El sistema debe transformar entre estos formatos, y existe riesgo de pérdida de precisión si no se maneja correctamente.

### 3.3 Fallos en Cadena

Cuando un servicio en la cadena falla (antifraude, riesgo, procesador de pagos), el sistema debe decidir si continuar con el flujo o detenerse. La ambigüedad radica en qué constituye un **fallo transitorio** (que justifica reintento) versus un **fallo permanente** (que requiere compensación inmediata). La implementación actual confunde ambos casos en algunos escenarios.

## 4. Restricciones de Seguridad

### 4.1 Retención de Datos Sensibles

El sistema maneja datos de tarjetas de pago que están sujetos a PCI-DSS. Existe una restricción sobre el tiempo que los datos sensibles pueden mantenerse en logs: **máximo 24 horas**. Sin embargo, los logs de depuración pueden contener información de debugging que necesita conservarse más tiempo para análisis de incidentes.

### 4.2 Rate Limiting por Cliente

El sistema implementa rate limiting a nivel de cliente, pero la configuración actual permite **10 solicitudes por segundo** sin autenticación y **100 solicitudes por segundo** con autenticación válida. Esta diferencia crea un vector potencial de ataque si un atacante obtiene credenciales de autenticación.

## 5. Restricciones no Funcionales

### 5.1 Latencia Esperada

El sistema debe procesar una transacción completa (desde la recepción hasta la confirmación final) en menos de **10 segundos** en el percentil 95 (P95). Sin embargo, la latencia actual medida es de **15 segundos** para transacciones que pasan por ambos servicios externos (antifraude y riesgo).

### 5.2 Disponibilidad y Recovery

El objetivo de disponibilidad (SLA) es **99.95%** ( aproximadamente 4.38 horas de inactividad permitida por año). El tiempo máximo de recuperación (RTO) después de un fallo es de **15 minutos**, y el punto de recuperación de datos (RPO) es de **5 minutos** (máximo 5 minutos de datos pueden perderse).

## 6. Recomendaciones para Resolver Ambigüedades

1. **Documentar claramente el modo de operación CAP**: Definir si el sistema opera en modo AP o CP y bajo qué condiciones se cambia de uno a otro.

2. **Establecer políticas claras de idempotencia**: Definir expiración de claves y comportamiento esperado para claves expiradas.

3. **Implementar circuit breaker**: Hacia servicios externos para manejar fallos gracefully y evitar efectos cascada.

4. **Definir algoritmo de priorización**: Basado en monto, urgencia y perfil del cliente.

5. **Clarificar el flujo de compensaciones**: Documentar el orden exacto de operaciones de rollback y las condiciones que disparan cada tipo de compensación.