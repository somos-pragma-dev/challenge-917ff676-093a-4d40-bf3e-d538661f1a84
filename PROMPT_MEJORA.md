# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener un ZIP con el proyecto completo y arrancable.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Archivos que la arquitectura del reto declara y no estan

Creálos con implementacion real, en la capa que les corresponde:

- `docs/restricciones-sistema.md`

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `src/payments/application/sagas/payment.saga.ts` — `CompensationAction.push`: Se invoca `push` sobre `CompensationAction`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `test/payments/payment-outbox.repository.spec.ts` — `PaymentOutboxRepository.findByEventType`: Se invoca `findByEventType` sobre `PaymentOutboxRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `test/payments/payment-outbox.repository.spec.ts` — `PaymentOutboxRepository.deleteOldEvents`: Se invoca `deleteOldEvents` sobre `PaymentOutboxRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `test/payments/payment.repository.spec.ts` — `PaymentRepository.updateStatus`: Se invoca `updateStatus` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `test/payments/payment.repository.spec.ts` — `PaymentRepository.findByStatus`: Se invoca `findByStatus` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `test/payments/payment.repository.spec.ts` — `PaymentRepository.findByCustomerId`: Se invoca `findByCustomerId` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `test/payments/payment.repository.spec.ts` — `PaymentRepository.transaction`: Se invoca `transaction` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
el comando de build o arranque canonico del stack elegido
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Contexto técnico original
Ingeniero SeniorL3 con 8+ años en backend distribuido. Stack: TypeScript, Node.js 22, Kafka, SQS FIFO, DynamoDB, PostgreSQL. Debe justificar consistencia eventual, backpressure, idempotencia, exactly-once vs at-least-once. Comparar Kafka vs SQS FIFO en al menos 4 fases del reto. Incluir manejo de compensaciones en la saga, retries con backoff exponencial + jitter, y cómo evitar thundering herd. El reto debe forzar decisiones no triviales.

### Reto
- Tema: arquitectura event-driven con outbox pattern y saga distribuida
- Seniority: senior-l3
- Tipo: practical
- Título: Implementación de arquitectura event-driven con outbox pattern y saga distribuida
- Tiempo estimado: 4 semanas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Exploración del sistema y definición de restricciones — objetivo: Identificar y documentar las restricciones y ambigüedades del sistema existente. — entregable (NO resolver): Documento que describe las restricciones y ambigüedades identificadas.
- Fase 2: Comparación de Kafka y SQS FIFO — objetivo: Comparar las ventajas y desventajas de Kafka y SQS FIFO en el contexto del sistema de procesamiento de pagos. — entregable (NO resolver): Documento que compara Kafka y SQS FIFO en diferentes fases del proceso de pagos.
- Fase 3: Implementación del outbox pattern — objetivo: Implementar el outbox pattern para garantizar la consistencia eventual en el sistema de procesamiento de pagos. — entregable (NO resolver): Implementación del outbox pattern en el sistema de procesamiento de pagos.
- Fase 4: Implementación de la saga distribuida — objetivo: Implementar una saga distribuida para manejar compensaciones y reintentos en el sistema de procesamiento de pagos. — entregable (NO resolver): Implementación de la saga distribuida en el sistema de procesamiento de pagos.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (ZIP).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Exportación en ZIP
Empaqueta todos los archivos en un único archivo ZIP descargable respetando exactamente
la estructura de rutas indicada por los marcadores.
El ZIP debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: El ZIP debe estar listo para descargar al finalizar. No preguntes si el usuario
quiere generarlo. Simplemente genera el archivo y proporciona el enlace de descarga; No debes desplegar en el chat el resumen de lo que arreglaste al Zip, solo entregalo.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del enlace de descarga del ZIP
No preguntes si el usuario quiere el ZIP: simplemente generalo siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "paths": {
      "@common/*": ["src/common/*"],
      "@payments/*": ["src/payments/*"],
      "@antifraud/*": ["src/antifraud/*"],
      "@risk/*": ["src/risk/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}

// === ARCHIVO: src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Payment Processing System running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Kafka Brokers: ${process.env.KAFKA_BROKERS || 'localhost:9092'}`);
  console.log(`SQS Queue: ${process.env.SQS_QUEUE_URL || 'not configured'}`);
}

bootstrap();

// === ARCHIVO: package.json ===
{
  "name": "payment-event-driven-system",
  "version": "1.0.0",
  "description": "Event-driven payment processing system with outbox pattern and distributed saga",
  "main": "dist/main.js",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
  },
  "dependencies": {
    "@nestjs/common": "10.4.0",
    "@nestjs/core": "10.4.0",
    "@nestjs/cqrs": "10.4.0",
    "@nestjs/event-emitter": "2.0.0",
    "@nestjs/platform-express": "10.4.0",
    "@nestjs/typeorm": "10.0.0",
    "@aws-sdk/client-sqs": "3.556.0",
    "@aws-sdk/client-dynamodb": "3.556.0",
    "kafkajs": "2.2.4",
    "dynamodb-data-mapper": "0.7.4",
    "typeorm": "0.3.20",
    "pg": "8.11.3",
    "class-validator": "0.14.1",
    "class-transformer": "0.5.1",
    "reflect-metadata": "0.2.2",
    "rxjs": "7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "10.4.0",
    "@nestjs/schematics": "10.2.0",
    "@nestjs/testing": "10.4.0",
    "@types/express": "4.17.21",
    "@types/jest": "29.5.12",
    "@types/node": "20.11.30",
    "@types/supertest": "6.0.2",
    "jest": "29.7.0",
    "supertest": "6.3.3",
    "ts-jest": "29.1.2",
    "ts-node": "10.9.2",
    "typescript": "5.5.0"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": ".",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["src/**/*.(t|j)s"],
    "coverageDirectory": "./coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@common/(.*)$": "<rootDir>/src/common/$1",
      "^@payments/(.*)$": "<rootDir>/src/payments/$1",
      "^@antifraud/(.*)$": "<rootDir>/src/antifraud/$1",
      "^@risk/(.*)$": "<rootDir>/src/risk/$1"
    }
  }
}

// === ARCHIVO: src/common/dto/payment-request.dto.ts ===
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

// === ARCHIVO: src/payments/domain/entities/payment.entity.ts ===
import { PaymentMethod, Currency } from '../../../common/dto/payment-request.dto';

export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  ANTIFRAUD_CHECKING = 'ANTIFRAUD_CHECKING',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  AUTHORIZED = 'AUTHORIZED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentAttributes {
  id: string;
  idempotencyKey: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  merchantId?: string;
  terminalId?: string;
  channel?: string;
  payerEmail?: string;
  payerPhone?: string;
  metadata?: Record<string, unknown>;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
}

export class PaymentEntity implements PaymentAttributes {
  id: string;
  idempotencyKey: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  merchantId?: string;
  terminalId?: string;
  channel?: string;
  payerEmail?: string;
  payerPhone?: string;
  metadata?: Record<string, unknown>;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;

  constructor(attributes: Partial<PaymentAttributes>) {
    Object.assign(this, {
      id: attributes.id || crypto.randomUUID(),
      idempotencyKey: attributes.idempotencyKey,
      payerId: attributes.payerId,
      payeeId: attributes.payeeId,
      amount: attributes.amount,
      currency: attributes.currency || Currency.USD,
      paymentMethod: attributes.paymentMethod,
      status: attributes.status || PaymentStatus.PENDING,
      description: attributes.description,
      merchantId: attributes.merchantId,
      terminalId: attributes.terminalId,
      channel: attributes.channel,
      payerEmail: attributes.payerEmail,
      payerPhone: attributes.payerPhone,
      metadata: attributes.metadata || {},
      priority: attributes.priority ?? 5,
      createdAt: attributes.createdAt || new Date(),
      updatedAt: attributes.updatedAt || new Date(),
      completedAt: attributes.completedAt,
      failureReason: attributes.failureReason,
      retryCount: attributes.retryCount || 0,
      maxRetries: attributes.maxRetries || 3,
    });
  }

  canTransitionTo(newStatus: PaymentStatus): boolean {
    const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.INITIATED, PaymentStatus.CANCELLED],
      [PaymentStatus.INITIATED]: [PaymentStatus.ANTIFRAUD_CHECKING, PaymentStatus.FAILED],
      [PaymentStatus.ANTIFRAUD_CHECKING]: [PaymentStatus.RISK_ASSESSMENT, PaymentStatus.FAILED],
      [PaymentStatus.RISK_ASSESSMENT]: [PaymentStatus.AUTHORIZED, PaymentStatus.FAILED],
      [PaymentStatus.AUTHORIZED]: [PaymentStatus.PROCESSING, PaymentStatus.CANCELLED],
      [PaymentStatus.PROCESSING]: [PaymentStatus.COMPLETED, PaymentStatus.FAILED],
      [PaymentStatus.COMPLETED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.FAILED]: [PaymentStatus.PENDING],
      [PaymentStatus.CANCELLED]: [],
      [PaymentStatus.REFUNDED]: [],
    };
    return allowedTransitions[this.status]?.includes(newStatus) ?? false;
  }

  transitionTo(newStatus: PaymentStatus, reason?: string): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid state transition from ${this.status} to ${newStatus}`,
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
    if (reason) {
      this.failureReason = reason;
    }
    if (newStatus === PaymentStatus.COMPLETED) {
      this.completedAt = new Date();
    }
  }

  isRetriable(): boolean {
    return (
      this.retryCount < this.maxRetries &&
      (this.status === PaymentStatus.FAILED || this.status === PaymentStatus.PENDING)
    );
  }

  incrementRetry(): void {
    if (!this.isRetriable()) {
      throw new Error('Payment cannot be retried - max retries exceeded');
    }
    this.retryCount++;
    this.updatedAt = new Date();
  }

  validateAmountLimits(minAmount: number, maxAmount: number): boolean {
    return this.amount >= minAmount && this.amount <= maxAmount;
  }

  calculateFee(feePercentage: number): number {
    return Math.round(this.amount * feePercentage * 100) / 100;
  }

  toPlainObject(): PaymentAttributes {
    return { ...this };
  }
}

// === ARCHIVO: src/payments/domain/events/payment-domain.event.ts ===
import { PaymentStatus, PaymentAttributes } from '../entities/payment.entity';
import { PaymentMethod, Currency } from '../../../common/dto/payment-request.dto';

export interface DomainEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  occurredAt: Date;
  version: number;
  payload: Record<string, unknown>;
}

export interface PaymentInitiatedEvent extends DomainEvent {
  eventType: 'PaymentInitiated';
  payload: {
    paymentId: string;
    idempotencyKey: string;
    payerId: string;
    payeeId: string;
    amount: number;
    currency: Currency;
    paymentMethod: PaymentMethod;
    priority: number;
  };
}

export interface PaymentAntifraudCheckedEvent extends DomainEvent {
  eventType: 'PaymentAntifraudChecked';
  payload: {
    paymentId: string;
    antifraudResult: 'APPROVED' | 'REJECTED' | 'REVIEW';
    antifraudScore: number;
    antifraudTransactionId: string;
  };
}

export interface PaymentRiskAssessedEvent extends DomainEvent {
  eventType: 'PaymentRiskAssessed';
  payload: {
    paymentId: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskScore: number;
    riskTransactionId: string;
  };
}

export interface PaymentAuthorizedEvent extends DomainEvent {
  eventType: 'PaymentAuthorized';
  payload: {
    paymentId: string;
    authorizationCode: string;
  };
}

export interface PaymentCompletedEvent extends DomainEvent {
  eventType: 'PaymentCompleted';
  payload: {
    paymentId: string;
    completionTimestamp: string;
    finalAmount: number;
  };
}

export interface PaymentFailedEvent extends DomainEvent {
  eventType: 'PaymentFailed';
  payload: {
    paymentId: string;
    failureReason: string;
    retryable: boolean;
    retryCount: number;
  };
}

export interface PaymentCancelledEvent extends DomainEvent {
  eventType: 'PaymentCancelled';
  payload: {
    paymentId: string;
    cancellationReason: string;
  };
}

export interface PaymentRefundedEvent extends DomainEvent {
  eventType: 'PaymentRefunded';
  payload: {
    paymentId: string;
    refundAmount: number;
    refundReason: string;
  };
}

export type PaymentDomainEvent =
  | PaymentInitiatedEvent
  | PaymentAntifraudCheckedEvent
  | PaymentRiskAssessedEvent
  | PaymentAuthorizedEvent
  | PaymentCompletedEvent
  | PaymentFailedEvent
  | PaymentCancelledEvent
  | PaymentRefundedEvent;

export class PaymentDomainEventFactory {
  static createPaymentInitiatedEvent(payment: PaymentAttributes): PaymentInitiatedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: payment.id,
      eventType: 'PaymentInitiated',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId: payment.id,
        idempotencyKey: payment.idempotencyKey,
        payerId: payment.payerId,
        payeeId: payment.payeeId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        priority: payment.priority,
      },
    };
  }

  static createPaymentAntifraudCheckedEvent(
    paymentId: string,
    result: 'APPROVED' | 'REJECTED' | 'REVIEW',
    score: number,
    transactionId: string,
  ): PaymentAntifraudCheckedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: paymentId,
      eventType: 'PaymentAntifraudChecked',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId,
        antifraudResult: result,
        antifraudScore: score,
        antifraudTransactionId: transactionId,
      },
    };
  }

  static createPaymentRiskAssessedEvent(
    paymentId: string,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
    score: number,
    transactionId: string,
  ): PaymentRiskAssessedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: paymentId,
      eventType: 'PaymentRiskAssessed',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId,
        riskLevel,
        riskScore: score,
        riskTransactionId: transactionId,
      },
    };
  }

  static createPaymentCompletedEvent(payment: PaymentAttributes): PaymentCompletedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: payment.id,
      eventType: 'PaymentCompleted',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId: payment.id,
        completionTimestamp: new Date().toISOString(),
        finalAmount: payment.amount,
      },
    };
  }

  static createPaymentFailedEvent(
    paymentId: string,
    reason: string,
    retryable: boolean,
    retryCount: number,
  ): PaymentFailedEvent {
    return {
      eventId: crypto.randomUUID(),
      aggregateId: paymentId,
      eventType: 'PaymentFailed',
      occurredAt: new Date(),
      version: 1,
      payload: {
        paymentId,
        failureReason: reason,
        retryable,
        retryCount,
      },
    };
  }
}


// === ARCHIVO: src/payments/domain/repositories/payment.repository.ts ===
import { Injectable } from '@nestjs/common';
import { PaymentAttributes, PaymentStatus } from '@payments/domain/entities/payment.entity';

export interface PaymentFilter {
  status?: PaymentStatus;
  merchantId?: string;
  customerId?: string;
  fromDate?: Date;
  toDate?: Date;
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
  delete(id: string): Promise<void>;
}

@Injectable()
export class PaymentRepositoryService implements PaymentRepository {
  async findById(id: string): Promise<PaymentAttributes | null> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<PaymentAttributes | null> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }

  async save(payment: PaymentAttributes): Promise<PaymentAttributes> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }

  async update(payment: PaymentAttributes): Promise<PaymentAttributes> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }

  async findByFilter(filter: PaymentFilter): Promise<PaymentAttributes[]> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }

  async countByFilter(filter: PaymentFilter): Promise<number> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented - delegate to infrastructure');
  }
}

// === ARCHIVO: src/payments/infrastructure/persistence/dynamodb/payment-outbox.repository.ts ===
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

// === ARCHIVO: src/payments/infrastructure/persistence/postgresql/payment.repository.ts ===
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between, FindOptionsWhere } from 'typeorm';
import { PaymentEntity, PaymentStatus, PaymentAttributes } from '@payments/domain/entities/payment.entity';
import { PaymentRepository, PaymentFilter } from '@payments/domain/repositories/payment.repository';

export interface PaymentOrmEntity {
  id: string;
  idempotencyKey: string;
  merchantId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  description?: string;
  metadata?: string;
  retryCount: number;
  lastRetryAt?: Date;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

@Injectable()
export class PaymentPostgresRepository implements PaymentRepository {
  private readonly logger = new Logger(PaymentPostgresRepository.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async findById(id: string): Promise<PaymentAttributes | null> {
    try {
      const entity = await this.paymentRepository.findOne({ where: { id } as FindOptionsWhere<PaymentEntity> });
      if (!entity) {
        return null;
      }
      return this.toAttributes(entity);
    } catch (error) {
      this.logger.error(`Failed to find payment by id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<PaymentAttributes | null> {
    try {
      const entity = await this.paymentRepository.findOne({ 
        where: { idempotencyKey } as FindOptionsWhere<PaymentEntity> 
      });
      if (!entity) {
        return null;
      }
      return this.toAttributes(entity);
    } catch (error) {
      this.logger.error(`Failed to find payment by idempotency key ${idempotencyKey}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async save(payment: PaymentAttributes): Promise<PaymentAttributes> {
    try {
      const entity = this.paymentRepository.create({
        id: payment.id,
        idempotencyKey: payment.idempotencyKey,
        merchantId: payment.merchantId,
        customerId: payment.customerId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        description: payment.description,
        metadata: payment.metadata ? JSON.stringify(payment.metadata) : undefined,
        retryCount: payment.retryCount || 0,
        lastRetryAt: payment.lastRetryAt,
        failureReason: payment.failureReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        completedAt: payment.completedAt,
      });

      const saved = await this.paymentRepository.save(entity);
      this.logger.log(`Payment saved: ${saved.id}`);
      return this.toAttributes(saved);
    } catch (error) {
      this.logger.error(`Failed to save payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(payment: PaymentAttributes): Promise<PaymentAttributes> {
    try {
      const existing = await this.paymentRepository.findOne({ 
        where: { id: payment.id } as FindOptionsWhere<PaymentEntity> 
      });
      
      if (!existing) {
        throw new Error(`Payment not found: ${payment.id}`);
      }

      existing.status = payment.status;
      existing.retryCount = payment.retryCount;
      existing.lastRetryAt = payment.lastRetryAt;
      existing.failureReason = payment.failureReason;
      existing.updatedAt = payment.updatedAt;
      
      if (payment.completedAt) {
        existing.completedAt = payment.completedAt;
      }
      
      if (payment.metadata) {
        existing.metadata = JSON.stringify(payment.metadata);
      }

      const updated = await this.paymentRepository.save(existing);
      this.logger.log(`Payment updated: ${updated.id}, status: ${updated.status}`);
      return this.toAttributes(updated);
    } catch (error) {
      this.logger.error(`Failed to update payment ${payment.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByFilter(filter: PaymentFilter): Promise<PaymentAttributes[]> {
    try {
      const where: FindOptionsWhere<PaymentEntity> = {};
      
      if (filter.status) {
        where.status = filter.status;
      }
      
      if (filter.merchantId) {
        where.merchantId = filter.merchantId;
      }
      
      if (filter.customerId) {
        where.customerId = filter.customerId;
      }

      let dateCondition: any = undefined;
      if (filter.fromDate && filter.toDate) {
        dateCondition = Between(filter.fromDate, filter.toDate);
      } else if (filter.fromDate) {
        dateCondition = MoreThanOrEqual(filter.fromDate);
      } else if (filter.toDate) {
        dateCondition = LessThanOrEqual(filter.toDate);
      }

      const entities = await this.paymentRepository.find({
        where: where,
        ...(dateCondition && { createdAt: dateCondition }),
        order: { createdAt: 'DESC' },
        take: filter.limit || 50,
        skip: filter.offset || 0,
      });

      return entities.map(entity => this.toAttributes(entity));
    } catch (error) {
      this.logger.error(`Failed to find payments by filter: ${error.message}`, error.stack);
      throw error;
    }
  }

  async countByFilter(filter: PaymentFilter): Promise<number> {
    try {
      const where: FindOptionsWhere<PaymentEntity> = {};
      
      if (filter.status) {
        where.status = filter.status;
      }
      
      if (filter.merchantId) {
        where.merchantId = filter.merchantId;
      }
      
      if (filter.customerId) {
        where.customerId = filter.customerId;
      }

      let dateCondition: any = undefined;
      if (filter.fromDate && filter.toDate) {
        dateCondition = Between(filter.fromDate, filter.toDate);
      } else if (filter.fromDate) {
        dateCondition = MoreThanOrEqual(filter.fromDate);
      } else if (filter.toDate) {
        dateCondition = LessThanOrEqual(filter.toDate);
      }

      return await this.paymentRepository.count({
        where: where,
        ...(dateCondition && { createdAt: dateCondition }),
      });
    } catch (error) {
      this.logger.error(`Failed to count payments by filter: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.paymentRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`No payment found to delete: ${id}`);
      } else {
        this.logger.log(`Payment deleted: ${id}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete payment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private toAttributes(entity: PaymentEntity): PaymentAttributes {
    return {
      id: entity.id,
      idempotencyKey: entity.idempotencyKey,
      merchantId: entity.merchantId,
      customerId: entity.customerId,
      amount: entity.amount,
      currency: entity.currency,
      paymentMethod: entity.paymentMethod,
      status: entity.status,
      description: entity.description,
      metadata: entity.metadata ? JSON.parse(entity.metadata) : undefined,
      retryCount: entity.retryCount,
      lastRetryAt: entity.lastRetryAt,
      failureReason: entity.failureReason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      completedAt: entity.completedAt,
    };
  }
}

// === ARCHIVO: src/payments/application/commands/initiate-payment.command.ts ===
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

// === ARCHIVO: src/payments/application/events/payment-initiated.event.ts ===
import { PaymentMethod, Currency } from '@common/dto/payment-request.dto';
import { PaymentAttributes, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { DomainEvent } from '@payments/domain/events/payment-domain.event';

export interface PaymentInitiatedEventData {
  paymentId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  senderAccountId: string;
  receiverAccountId: string;
  idempotencyKey: string;
  description?: string;
  metadata?: Record<string, unknown>;
  requestedBy: string;
  timestamp: Date;
  correlationId: string;
  sagaId: string;
}

export class PaymentInitiatedEvent implements DomainEvent {
  public readonly eventType = 'PaymentInitiated';
  public readonly paymentId: string;
  public readonly amount: number;
  public readonly currency: Currency;
  public readonly paymentMethod: PaymentMethod;
  public readonly senderAccountId: string;
  public readonly receiverAccountId: string;
  public readonly idempotencyKey: string;
  public readonly description?: string;
  public readonly metadata?: Record<string, unknown>;
  public readonly requestedBy: string;
  public readonly timestamp: Date;
  public readonly correlationId: string;
  public readonly sagaId: string;

  constructor(data: PaymentInitiatedEventData) {
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
    this.timestamp = data.timestamp;
    this.correlationId = data.correlationId;
    this.sagaId = data.sagaId;
  }

  public static create(data: PaymentInitiatedEventData): PaymentInitiatedEvent {
    return new PaymentInitiatedEvent(data);
  }

  public toPaymentAttributes(): Partial<PaymentAttributes> {
    return {
      id: this.paymentId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      senderAccountId: this.senderAccountId,
      receiverAccountId: this.receiverAccountId,
      status: PaymentStatus.PENDING,
      idempotencyKey: this.idempotencyKey,
      description: this.description,
      metadata: this.metadata,
      requestedBy: this.requestedBy,
      initiatedAt: this.timestamp,
      updatedAt: this.timestamp,
    };
  }

  public getSagaCorrelationId(): string {
    return this.correlationId;
  }

  public getSagaId(): string {
    return this.sagaId;
  }
}

// === ARCHIVO: src/payments/application/sagas/payment.saga.ts ===
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PaymentInitiatedEvent, PaymentInitiatedEventData } from '../events/payment-initiated.event';
import { PaymentAttributes, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';
import { PaymentRepository } from '@payments/domain/repositories/payment.repository';

interface SagaState {
  sagaId: string;
  paymentId: string;
  currentStep: SagaStep;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  compensationActions: CompensationAction[];
  startedAt: Date;
  metadata: Record<string, unknown>;
}

enum SagaStep {
  INITIATED = 'INITIATED',
  ANTIFRAUD_CHECK = 'ANTIFRAUD_CHECK',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  AUTHORIZATION = 'AUTHORIZATION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

interface CompensationAction {
  step: SagaStep;
  compensate: () => Promise<void>;
  compensating: boolean;
}

interface BackoffConfig {
  baseDelay: number;
  maxDelay: number;
  jitterFactor: number;
  maxRetries: number;
}

@Injectable()
export class PaymentSaga implements OnModuleInit {
  private readonly logger = new Logger(PaymentSaga.name);
  private readonly activeSagas: Map<string, SagaState> = new Map();
  private readonly backoffConfig: BackoffConfig = {
    baseDelay: 1000,
    maxDelay: 30000,
    jitterFactor: 0.3,
    maxRetries: 5,
  };

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  public onModuleInit(): void {
    this.logger.log('PaymentSaga initialized with exponential backoff and jitter');
  }

  @OnEvent('payment.initiated')
  public async handlePaymentInitiated(event: PaymentInitiatedEventData): Promise<void> {
    const sagaId = event.sagaId || `saga-${event.paymentId}-${Date.now()}`;
    this.logger.log(`Starting saga ${sagaId} for payment ${event.paymentId}`);

    const sagaState: SagaState = {
      sagaId,
      paymentId: event.paymentId,
      currentStep: SagaStep.INITIATED,
      retryCount: 0,
      maxRetries: this.backoffConfig.maxRetries,
      compensationActions: [],
      startedAt: new Date(),
      metadata: { correlationId: event.correlationId, ...event.metadata },
    };

    this.activeSagas.set(sagaId, sagaState);

    try {
      await this.executeAntifraudCheck(sagaState, event);
    } catch (error) {
      await this.handleSagaFailure(sagaState, error);
    }
  }

  private async executeAntifraudCheck(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing antifraud check for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.ANTIFRAUD_CHECK;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.ANTIFRAUD_CHECK,
      compensate: async () => {
        this.logger.warn(`Compensating antifraud check for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.FAILED, 'Antifraud check failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const antifraudEvent = PaymentDomainEventFactory.createPaymentAntifraudCheckedEvent(
      payment.toPlainObject(),
      true,
      'PASSED',
    );
    this.eventEmitter.emit('payment.antifraud.checked', antifraudEvent);

    await this.executeRiskAssessment(sagaState, event);
  }

  private async executeRiskAssessment(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing risk assessment for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.RISK_ASSESSMENT;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.RISK_ASSESSMENT,
      compensate: async () => {
        this.logger.warn(`Compensating risk assessment for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.FAILED, 'Risk assessment failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const riskEvent = PaymentDomainEventFactory.createPaymentRiskAssessedEvent(
      payment.toPlainObject(),
      'LOW',
      0.15,
    );
    this.eventEmitter.emit('payment.risk.assessed', riskEvent);

    await this.executeAuthorization(sagaState, event);
  }

  private async executeAuthorization(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing authorization for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.AUTHORIZATION;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.AUTHORIZATION,
      compensate: async () => {
        this.logger.warn(`Compensating authorization for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.CANCELLED, 'Authorization failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const authEvent = PaymentDomainEventFactory.createPaymentAuthorizedEvent(
      payment.toPlainObject(),
      'AUTHORIZED',
      'AUTH_TOKEN_123',
    );
    this.eventEmitter.emit('payment.authorized', authEvent);

    await this.completePayment(sagaState, event);
  }

  private async completePayment(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Completing payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.COMPLETED;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.COMPLETED, 'Payment processed successfully');
    await this.paymentRepository.save(payment);

    const completedEvent = PaymentDomainEventFactory.createPaymentCompletedEvent(payment.toPlainObject());
    this.eventEmitter.emit('payment.completed', completedEvent);

    this.logger.log(`Saga ${sagaState.sagaId} completed successfully for payment ${event.paymentId}`);
    this.activeSagas.delete(sagaState.sagaId);
  }

  private async handleSagaFailure(sagaState: SagaState, error: Error): Promise<void> {
    this.logger.error(`Saga ${sagaState.sagaId} failed: ${error.message}`, error.stack);
    sagaState.lastError = error.message;
    sagaState.currentStep = SagaStep.FAILED;

    if (sagaState.retryCount < sagaState.maxRetries) {
      const delay = this.calculateBackoffWithJitter(sagaState.retryCount);
      this.logger.log(`Saga ${sagaState.sagaId}: Retrying in ${delay}ms (attempt ${sagaState.retryCount + 1}/${sagaState.maxRetries})`);

      setTimeout(async () => {
        sagaState.retryCount++;
        try {
          await this.retryFromLastStep(sagaState);
        } catch (retryError) {
          await this.handleSagaFailure(sagaState, retryError as Error);
        }
      }, delay);
    } else {
      await this.executeCompensation(sagaState);
    }
  }

  private calculateBackoffWithJitter(retryCount: number): number {
    const exponentialDelay = this.backoffConfig.baseDelay * Math.pow(2, retryCount);
    const cappedDelay = Math.min(exponentialDelay, this.backoffConfig.maxDelay);
    const jitter = cappedDelay * this.backoffConfig.jitterFactor * Math.random();
    return Math.floor(cappedDelay + jitter);
  }

  private async retryFromLastStep(sagaState: SagaState): Promise<void> {
    const payment = await this.paymentRepository.findById(sagaState.paymentId);
    if (!payment) {
      throw new Error(`Payment ${sagaState.paymentId} not found for retry`);
    }

    switch (sagaState.currentStep) {
      case SagaStep.ANTIFRAUD_CHECK:
        await this.executeAntifraudCheck(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      case SagaStep.RISK_ASSESSMENT:
        await this.executeRiskAssessment(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      case SagaStep.AUTHORIZATION:
        await this.executeAuthorization(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      default:
        throw new Error(`Cannot retry from step: ${sagaState.currentStep}`);
    }
  }

  private async executeCompensation(sagaState: SagaState): Promise<void> {
    this.logger.error(`Saga ${sagaState.sagaId}: Executing compensation for payment ${sagaState.paymentId}`);
    sagaState.currentStep = SagaStep.COMPENSATING;

    const reversedActions = [...sagaState.compensationActions].reverse();

    for (const action of reversedActions) {
      if (!action.compensating) {
        try {
          action.compensating = true;
          await action.compensate();
        } catch (compensateError) {
          this.logger.error(`Compensation failed for step ${action.step}: ${(compensateError as Error).message}`);
        }
      }
    }

    sagaState.currentStep = SagaStep.COMPENSATED;
    this.logger.warn(`Saga ${sagaState.sagaId} compensation completed for payment ${sagaState.paymentId}`);
    this.activeSagas.delete(sagaState.sagaId);
  }

  public getSagaState(sagaId: string): SagaState | undefined {
    return this.activeSagas.get(sagaId);
  }

  public getActiveSagasCount(): number {
    return this.activeSagas.size;
  }
}

// === ARCHIVO: src/payments/infrastructure/controllers/payments.controller.ts ===
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

// === ARCHIVO: src/payments/infrastructure/messaging/kafka/kafka-payment-producer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord, Partitioners } from 'kafkajs';
import { ConfigType } from '@nestjs/config';
import { PaymentInitiatedEvent, PaymentCompletedEvent, PaymentFailedEvent } from '@payments/domain/events/payment-domain.event';

@Injectable()
export class KafkaPaymentProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaPaymentProducerService.name);
  private kafka: Kafka;
  private producer: Producer;
  private isConnected = false;

  private readonly PAYMENT_EVENTS_TOPIC = 'payment-events';
  private readonly ANTIFRAUD_TOPIC = 'antifraud-check-requests';
  private readonly RISK_TOPIC = 'risk-check-requests';

  constructor(
    @Inject('KAFKA_CONFIG') private readonly kafkaConfig: { brokers: string[]; clientId: string },
  ) {
    this.kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log('Productor Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el productor Kafka', error.stack);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.log('Productor Kafka desconectado');
    } catch (error) {
      this.logger.error('Error al desconectar el productor Kafka', error.stack);
    }
  }

  async sendPaymentInitiatedEvent(event: PaymentInitiatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.ANTIFRAUD_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'PAYMENT_INITIATED',
            'correlation-id': event.correlationId,
            'idempotency-key': event.idempotencyKey,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento PaymentInitiated enviado para paymentId: ${event.paymentId}`);
  }

  async sendRiskCheckRequest(event: PaymentInitiatedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.RISK_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'RISK_CHECK_REQUESTED',
            'correlation-id': event.correlationId,
            'idempotency-key': event.idempotencyKey,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento de verificación de riesgo enviado para paymentId: ${event.paymentId}`);
  }

  async sendPaymentCompletedEvent(event: PaymentCompletedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.PAYMENT_EVENTS_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'PAYMENT_COMPLETED',
            'correlation-id': event.correlationId,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento PaymentCompleted enviado para paymentId: ${event.paymentId}`);
  }

  async sendPaymentFailedEvent(event: PaymentFailedEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.PAYMENT_EVENTS_TOPIC,
      messages: [
        {
          key: event.paymentId,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
          headers: {
            'event-type': 'PAYMENT_FAILED',
            'correlation-id': event.correlationId,
          },
        },
      ],
    };

    await this.sendMessage(record);
    this.logger.log(`Evento PaymentFailed enviado para paymentId: ${event.paymentId}`);
  }

  private async sendMessage(record: ProducerRecord): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.producer.send(record);
    } catch (error) {
      this.logger.error(`Error al enviar mensaje a Kafka: ${error.message}`, error.stack);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}

// === ARCHIVO: src/payments/infrastructure/messaging/kafka/kafka-payment-consumer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { PaymentInitiatedEvent, PaymentAntifraudCheckedEvent, PaymentRiskAssessedEvent, PaymentCompletedEvent, PaymentFailedEvent } from '@payments/domain/events/payment-domain.event';

@Injectable()
export class KafkaPaymentConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaPaymentConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;

  private readonly PAYMENT_EVENTS_TOPIC = 'payment-events';
  private readonly ANTIFRAUD_RESPONSES_TOPIC = 'antifraud-check-responses';
  private readonly RISK_RESPONSES_TOPIC = 'risk-check-responses';
  private readonly CONSUMER_GROUP = 'payment-service-group';

  constructor(
    @Inject('KAFKA_CONFIG') private readonly kafkaConfig: { brokers: string[]; clientId: string },
  ) {
    this.kafka = new Kafka({
      clientId: `${this.kafkaConfig.clientId}-consumer`,
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: this.CONSUMER_GROUP,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopics();
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Consumidor Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el consumidor Kafka', error.stack);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      this.logger.log('Consumidor Kafka desconectado');
    } catch (error) {
      this.logger.error('Error al desconectar el consumidor Kafka', error.stack);
    }
  }

  private async subscribeToTopics(): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic: this.PAYMENT_EVENTS_TOPIC,
        fromBeginning: false,
      });

      await this.consumer.subscribe({
        topic: this.ANTIFRAUD_RESPONSES_TOPIC,
        fromBeginning: false,
      });

      await this.consumer.subscribe({
        topic: this.RISK_RESPONSES_TOPIC,
        fromBeginning: false,
      });

      this.logger.log(`Suscrito a los topics: ${this.PAYMENT_EVENTS_TOPIC}, ${this.ANTIFRAUD_RESPONSES_TOPIC}, ${this.RISK_RESPONSES_TOPIC}`);
    } catch (error) {
      this.logger.error('Error al suscribirse a los topics', error.stack);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    this.logger.log('Consumo de mensajes iniciado');
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const eventType = message.headers?.['event-type']?.toString() || 'UNKNOWN';
    const correlationId = message.headers?.['correlation-id']?.toString() || 'unknown';

    this.logger.log(`Procesando mensaje del topic ${topic}, tipo: ${eventType}, correlationId: ${correlationId}`);

    try {
      const value = message.value?.toString();
      if (!value) {
        this.logger.warn('Mensaje vacío recibido, ignorando');
        return;
      }

      const event = JSON.parse(value);

      switch (topic) {
        case this.PAYMENT_EVENTS_TOPIC:
          await this.handlePaymentEvent(eventType, event);
          break;
        case this.ANTIFRAUD_RESPONSES_TOPIC:
          await this.handleAntifraudResponse(eventType, event);
          break;
        case this.RISK_RESPONSES_TOPIC:
          await this.handleRiskResponse(eventType, event);
          break;
        default:
          this.logger.warn(`Topic desconocido: ${topic}`);
      }

      this.logger.log(`Mensaje procesado exitosamente: ${eventType}`);
    } catch (error) {
      this.logger.error(`Error al procesar mensaje: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async handlePaymentEvent(eventType: string, event: PaymentCompletedEvent | PaymentFailedEvent): Promise<void> {
    switch (eventType) {
      case 'PAYMENT_COMPLETED':
        this.logger.log(`Pago completado: ${event.paymentId}`);
        break;
      case 'PAYMENT_FAILED':
        this.logger.log(`Pago fallido: ${event.paymentId}, razón: ${event.reason}`);
        break;
      default:
        this.logger.warn(`Tipo de evento de pago desconocido: ${eventType}`);
    }
  }

  private async handleAntifraudResponse(eventType: string, event: PaymentAntifraudCheckedEvent): Promise<void> {
    if (eventType === 'ANTIFRAUD_CHECK_COMPLETED') {
      this.logger.log(`Verificación antifraude completada para paymentId: ${event.paymentId}, aprobado: ${event.approved}`);
    } else {
      this.logger.warn(`Tipo de respuesta antifraude desconocido: ${eventType}`);
    }
  }

  private async handleRiskResponse(eventType: string, event: PaymentRiskAssessedEvent): Promise<void> {
    if (eventType === 'RISK_ASSESSMENT_COMPLETED') {
      this.logger.log(`Evaluación de riesgo completada para paymentId: ${event.paymentId}, nivel de riesgo: ${event.riskLevel}`);
    } else {
      this.logger.warn(`Tipo de respuesta de riesgo desconocido: ${eventType}`);
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}

// === ARCHIVO: src/payments/infrastructure/messaging/sqs/sqs-payment-producer.service.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, SendMessageCommand, SendMessageCommandOutput, SendMessageBatchCommand, SendMessageBatchCommandEntry } from '@aws-sdk/client-sqs';
import { PaymentAttributes } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEvent, PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';

@Injectable()
export class SqsPaymentProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsPaymentProducerService.name);
  private client: SQSClient;
  private readonly queueUrl: string;
  private readonly queueName: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.queueName = process.env.SQS_PAYMENT_QUEUE_NAME || 'payment-events.fifo';
    this.queueUrl = process.env.SQS_PAYMENT_QUEUE_URL || `https://sqs.${this.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID || '123456789012'}/${this.queueName}`;
    this.client = new SQSClient({
      region: this.region,
      credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      } : undefined,
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Initializing SQS Payment Producer for queue: ${this.queueUrl}`);
    await this.ensureQueueExists();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing SQS Payment Producer client');
    await this.client.destroy();
  }

  private async ensureQueueExists(): Promise<void> {
    try {
      const { QueueUrl } = await this.client.send(new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: 'Health check message',
        MessageDeduplicationId: `health-check-${Date.now()}`,
        MessageGroupId: 'health-check-group',
      }));
      this.logger.debug(`Queue verified: ${QueueUrl}`);
    } catch (error) {
      this.logger.warn(`Queue may not exist or not accessible: ${error}`);
    }
  }

  async sendPaymentEvent(payment: PaymentAttributes, eventType: keyof PaymentDomainEvent): Promise<SendMessageCommandOutput> {
    const event = this.createEventForType(payment, eventType);
    const messageBody = JSON.stringify(event);
    const deduplicationId = `${payment.id}-${eventType}-${Date.now()}`;
    const messageGroupId = this.getMessageGroupId(payment);

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
      MessageDeduplicationId: deduplicationId,
      MessageGroupId: messageGroupId,
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: eventType,
        },
        paymentId: {
          DataType: 'String',
          StringValue: payment.id,
        },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });

    try {
      const result = await this.client.send(command);
      this.logger.log(`Event ${eventType} sent for payment ${payment.id}, MessageId: ${result.MessageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send event ${eventType} for payment ${payment.id}: ${error}`);
      throw error;
    }
  }

  async sendPaymentEventsBatch(payments: Array<{ payment: PaymentAttributes; eventType: keyof PaymentDomainEvent }>): Promise<void> {
    const entries: SendMessageBatchCommandEntry[] = payments.map(({ payment, eventType }) => {
      const event = this.createEventForType(payment, eventType);
      const deduplicationId = `${payment.id}-${eventType}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const messageGroupId = this.getMessageGroupId(payment);

      return {
        Id: deduplicationId.substring(0, 80),
        MessageBody: JSON.stringify(event),
        MessageDeduplicationId: deduplicationId,
        MessageGroupId: messageGroupId,
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: eventType,
          },
          paymentId: {
            DataType: 'String',
            StringValue: payment.id,
          },
          timestamp: {
            DataType: 'String',
            StringValue: new Date().toISOString(),
          },
        },
      };
    });

    const command = new SendMessageBatchCommand({
      QueueUrl: this.queueUrl,
      Entries: entries,
    });

    try {
      const result = await this.client.send(command);
      const failedCount = result.Failed?.length || 0;
      if (failedCount > 0) {
        this.logger.error(`Batch send failed for ${failedCount} messages`);
        result.Failed?.forEach(failure => {
          this.logger.error(`Failed message: ${failure.Id}, Code: ${failure.Code}, Message: ${failure.Message}`);
        });
      }
      this.logger.log(`Batch sent: ${entries.length - failedCount} successful, ${failedCount} failed`);
    } catch (error) {
      this.logger.error(`Failed to send batch: ${error}`);
      throw error;
    }
  }

  private createEventForType(payment: PaymentAttributes, eventType: keyof PaymentDomainEvent): PaymentDomainEvent {
    switch (eventType) {
      case 'PaymentInitiated':
        return PaymentDomainEventFactory.createPaymentInitiatedEvent(payment);
      case 'PaymentAntifraudChecked':
        return PaymentDomainEventFactory.createPaymentAntifraudCheckedEvent(payment, true);
      case 'PaymentRiskAssessed':
        return PaymentDomainEventFactory.createPaymentRiskAssessedEvent(payment, 'low');
      case 'PaymentAuthorized':
        return PaymentDomainEventFactory.createPaymentAuthorizedEvent(payment);
      case 'PaymentCompleted':
        return PaymentDomainEventFactory.createPaymentCompletedEvent(payment);
      case 'PaymentFailed':
        return PaymentDomainEventFactory.createPaymentFailedEvent(payment, 'Unknown error');
      case 'PaymentCancelled':
        return PaymentDomainEventFactory.createPaymentCancelledEvent(payment);
      case 'PaymentRefunded':
        return PaymentDomainEventFactory.createPaymentRefundedEvent(payment);
      default:
        return PaymentDomainEventFactory.createPaymentInitiatedEvent(payment);
    }
  }

  private getMessageGroupId(payment: PaymentAttributes): string {
    return `payment-${payment.userId}`;
  }

  getQueueUrl(): string {
    return this.queueUrl;
  }

  getClient(): SQSClient {
    return this.client;
  }
}

// === ARCHIVO: src/payments/infrastructure/messaging/sqs/sqs-payment-consumer.service.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, ChangeMessageVisibilityCommand, SQSMessage } from '@aws-sdk/client-sqs';
import { PaymentAttributes } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEvent } from '@payments/domain/events/payment-domain.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface SqsConsumerConfig {
  queueUrl: string;
  maxNumberOfMessages: number;
  waitTimeSeconds: number;
  visibilityTimeout: number;
  batchSize: number;
}

@Injectable()
export class SqsPaymentConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsPaymentConsumerService.name);
  private client: SQSClient;
  private config: SqsConsumerConfig;
  private isProcessing = false;
  private isShuttingDown = false;
  private readonly pollingInterval: number;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.client = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      } : undefined,
    });

    this.config = {
      queueUrl: process.env.SQS_PAYMENT_QUEUE_URL || `https://sqs.us-east-1.amazonaws.com/123456789012/payment-events.fifo`,
      maxNumberOfMessages: parseInt(process.env.SQS_MAX_MESSAGES || '10', 10),
      waitTimeSeconds: parseInt(process.env.SQS_WAIT_TIME || '20', 10),
      visibilityTimeout: parseInt(process.env.SQS_VISIBILITY_TIMEOUT || '300', 10),
      batchSize: parseInt(process.env.SQS_BATCH_SIZE || '10', 10),
    };

    this.pollingInterval = parseInt(process.env.SQS_POLLING_INTERVAL || '1000', 10);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing SQS Payment Consumer');
    this.logger.debug(`Consumer config: ${JSON.stringify(this.config)}`);
    this.startPolling();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down SQS Payment Consumer');
    this.isShuttingDown = true;
    await this.waitForProcessingToComplete();
    await this.client.destroy();
  }

  private async waitForProcessingToComplete(): Promise<void> {
    const maxWaitTime = 30000;
    const checkInterval = 500;
    let waitedTime = 0;

    while (this.isProcessing && waitedTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waitedTime += checkInterval;
    }

    if (this.isProcessing) {
      this.logger.warn('Forcing shutdown while messages were still being processed');
    }
  }

  private startPolling(): void {
    setInterval(() => this.poll(), this.pollingInterval);
  }

  private async poll(): Promise<void> {
    if (this.isProcessing || this.isShuttingDown) {
      return;
    }

    this.isProcessing = true;

    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.config.queueUrl,
        MaxNumberOfMessages: this.config.maxNumberOfMessages,
        WaitTimeSeconds: this.config.waitTimeSeconds,
        VisibilityTimeout: this.config.visibilityTimeout,
        MessageAttributeNames: ['All'],
        AttributeNames: ['All'],
      });

      const response = await this.client.send(command);
      const messages = response.Messages || [];

      if (messages.length > 0) {
        this.logger.debug(`Received ${messages.length} messages`);
        await this.processMessages(messages);
      }
    } catch (error) {
      this.logger.error(`Error polling SQS: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processMessages(messages: SQSMessage[]): Promise<void> {
    for (const message of messages) {
      try {
        await this.processMessage(message);
        await this.deleteMessage(message);
      } catch (error) {
        this.logger.error(`Error processing message ${message.MessageId}: ${error}`);
        await this.handleFailedMessage(message, error);
      }
    }
  }

  private async processMessage(message: SQSMessage): Promise<void> {
    const body = JSON.parse(message.Body || '{}') as PaymentDomainEvent;
    const eventType = message.MessageAttributes?.eventType?.StringValue;
    const paymentId = message.MessageAttributes?.paymentId?.StringValue;

    this.logger.log(`Processing event ${eventType} for payment ${paymentId}`);

    const eventHandlers: Record<string, (event: PaymentDomainEvent, paymentId: string) => Promise<void>> = {
      'PaymentInitiated': this.handlePaymentInitiated.bind(this),
      'PaymentAntifraudChecked': this.handlePaymentAntifraudChecked.bind(this),
      'PaymentRiskAssessed': this.handlePaymentRiskAssessed.bind(this),
      'PaymentAuthorized': this.handlePaymentAuthorized.bind(this),
      'PaymentCompleted': this.handlePaymentCompleted.bind(this),
      'PaymentFailed': this.handlePaymentFailed.bind(this),
      'PaymentCancelled': this.handlePaymentCancelled.bind(this),
      'PaymentRefunded': this.handlePaymentRefunded.bind(this),
    };

    const handler = eventHandlers[eventType || ''];
    if (handler) {
      await handler(body, paymentId || '');
    } else {
      this.logger.warn(`Unknown event type: ${eventType}`);
    }
  }

  private async handlePaymentInitiated(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.initiated', { paymentId, event });
  }

  private async handlePaymentAntifraudChecked(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.antifraud.checked', { paymentId, event });
  }

  private async handlePaymentRiskAssessed(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.risk.assessed', { paymentId, event });
  }

  private async handlePaymentAuthorized(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.authorized', { paymentId, event });
  }

  private async handlePaymentCompleted(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.completed', { paymentId, event });
  }

  private async handlePaymentFailed(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.failed', { paymentId, event });
  }

  private async handlePaymentCancelled(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.cancelled', { paymentId, event });
  }

  private async handlePaymentRefunded(event: PaymentDomainEvent, paymentId: string): Promise<void> {
    this.eventEmitter.emit('payment.refunded', { paymentId, event });
  }

  private async deleteMessage(message: SQSMessage): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.config.queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    });

    await this.client.send(command);
    this.logger.debug(`Deleted message ${message.MessageId}`);
  }

  private async handleFailedMessage(message: SQSMessage, error: unknown): Promise<void> {
    const retryCount = this.getRetryCount(message);
    const maxRetries = 5;

    if (retryCount < maxRetries) {
      const visibilityCommand = new ChangeMessageVisibilityCommand({
        QueueUrl: this.config.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
        VisibilityTimeout: Math.pow(2, retryCount) * 30,
      });

      await this.client.send(visibilityCommand);
      this.logger.warn(`Message ${message.MessageId} will be retried in ${Math.pow(2, retryCount) * 30}s (retry ${retryCount + 1}/${maxRetries})`);
    } else {
      this.logger.error(`Message ${message.MessageId} exceeded max retries, moving to dead letter queue`);
      await this.moveToDeadLetterQueue(message);
    }
  }

  private getRetryCount(message: SQSMessage): number {
    const attributes = message.Attributes || {};
    const approximateReceiveCount = parseInt(attributes.ApproximateReceiveCount || '0', 10);
    return approximateReceiveCount - 1;
  }

  private async moveToDeadLetterQueue(message: SQSMessage): Promise<void> {
    const dlqUrl = this.config.queueUrl.replace('.fifo', '-dlq.fifo');
    this.logger.warn(`Would move message to DLQ: ${dlqUrl}`);
  }

  getConfig(): SqsConsumerConfig {
    return this.config;
  }

  isHealthy(): boolean {
    return !this.isShuttingDown;
  }
}

// === ARCHIVO: src/app.module.ts ===
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


// === ARCHIVO: src/common/exceptions/idempotency-exception.ts ===
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

// === ARCHIVO: src/common/utils/backoff-util.ts ===

export interface BackoffOptions {
  baseDelay: number;
  maxDelay: number;
  maxRetries: number;
  jitterFactor: number;
  multiplier: number;
}

export interface BackoffResult {
  delay: number;
  attempt: number;
  shouldRetry: boolean;
  nextBackoff: number | null;
}

export const DEFAULT_BACKOFF_OPTIONS: BackoffOptions = {
  baseDelay: 1000,
  maxDelay: 30000,
  maxRetries: 5,
  jitterFactor: 0.3,
  multiplier: 2,
};

export class BackoffUtil {
  private readonly options: BackoffOptions;

  constructor(options: Partial<BackoffOptions> = {}) {
    this.options = { ...DEFAULT_BACKOFF_OPTIONS, ...options };
    this.validateOptions();
  }

  private validateOptions(): void {
    if (this.options.baseDelay <= 0) {
      throw new Error('baseDelay debe ser mayor que 0');
    }
    if (this.options.maxDelay <= 0) {
      throw new Error('maxDelay debe ser mayor que 0');
    }
    if (this.options.maxRetries < 0) {
      throw new Error('maxRetries no puede ser negativo');
    }
    if (this.options.jitterFactor < 0 || this.options.jitterFactor > 1) {
      throw new Error('jitterFactor debe estar entre 0 y 1');
    }
    if (this.options.multiplier < 1) {
      throw new Error('multiplier debe ser mayor o igual a 1');
    }
  }

  calculate(attempt: number): BackoffResult {
    if (attempt < 0) {
      throw new Error('El número de intento no puede ser negativo');
    }

    const shouldRetry = attempt < this.options.maxRetries;

    if (!shouldRetry) {
      return {
        delay: 0,
        attempt,
        shouldRetry: false,
        nextBackoff: null,
      };
    }

    const exponentialDelay = this.options.baseDelay * Math.pow(this.options.multiplier, attempt);
    const cappedDelay = Math.min(exponentialDelay, this.options.maxDelay);
    const jitter = this.calculateJitter(cappedDelay);
    const finalDelay = Math.floor(cappedDelay + jitter);

    const nextBackoff =
      attempt + 1 < this.options.maxRetries
        ? this.options.baseDelay * Math.pow(this.options.multiplier, attempt + 1)
        : null;

    return {
      delay: finalDelay,
      attempt,
      shouldRetry: true,
      nextBackoff: nextBackoff ? Math.min(nextBackoff, this.options.maxDelay) : null,
    };
  }

  private calculateJitter(delay: number): number {
    const jitterRange = delay * this.options.jitterFactor;
    const randomFactor = Math.random() * 2 - 1;
    return Math.floor(jitterRange * randomFactor);
  }

  getOptions(): Readonly<BackoffOptions> {
    return { ...this.options };
  }

  async wait(delayMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  async executeWithBackoff<T>(
    operation: (attempt: number) => Promise<T>,
    onRetry?: (attempt: number, error: Error, delay: number) => Promise<void>,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        const result = await operation(attempt);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt >= this.options.maxRetries) {
          break;
        }

        const backoffResult = this.calculate(attempt);

        if (onRetry) {
          await onRetry(attempt, lastError, backoffResult.delay);
        }

        await this.wait(backoffResult.delay);
      }
    }

    throw lastError || new Error('Operation failed after max retries');
  }

  static createDefault(): BackoffUtil {
    return new BackoffUtil();
  }

  static createForPayment(): BackoffUtil {
    return new BackoffUtil({
      baseDelay: 2000,
      maxDelay: 60000,
      maxRetries: 4,
      jitterFactor: 0.25,
      multiplier: 2,
    });
  }

  static createForAntifraud(): BackoffUtil {
    return new BackoffUtil({
      baseDelay: 1000,
      maxDelay: 30000,
      maxRetries: 3,
      jitterFactor: 0.2,
      multiplier: 2,
    });
  }

  static createForRisk(): BackoffUtil {
    return new BackoffUtil({
      baseDelay: 1500,
      maxDelay: 45000,
      maxRetries: 4,
      jitterFactor: 0.25,
      multiplier: 2,
    });
  }
}

// === ARCHIVO: src/common/aws-config.ts ===
import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { Provider } from '@nestjs/common';

export interface AwsConfigOptions {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  maxAttempts?: number;
  tls?: boolean;
}

export const DEFAULT_AWS_CONFIG: AwsConfigOptions = {
  region: 'us-east-1',
  maxAttempts: 3,
  tls: true,
};

export class AwsConfig {
  private readonly config: AwsConfigOptions;
  private sqsClient: SQSClient | null = null;
  private dynamoClient: DynamoDBClient | null = null;

  constructor(config: Partial<AwsConfigOptions> = {}) {
    this.config = { ...DEFAULT_AWS_CONFIG, ...config };
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.region || this.config.region.trim() === '') {
      throw new Error('AWS region es requerida');
    }
    if (this.config.endpoint && !this.isValidEndpoint(this.config.endpoint)) {
      throw new Error('El endpoint de AWS debe ser una URL válida');
    }
  }

  private isValidEndpoint(endpoint: string): boolean {
    try {
      new URL(endpoint);
      return true;
    } catch {
      return false;
    }
  }

  getSqsClientConfig(): SQSClientConfig {
    const config: SQSClientConfig = {
      region: this.config.region,
      maxAttempts: this.config.maxAttempts,
      tls: this.config.tls,
    };

    if (this.config.endpoint) {
      config.endpoint = this.config.endpoint;
    }

    if (this.config.accessKeyId && this.config.secretAccessKey) {
      config.credentials = {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      };
    }

    return config;
  }

  getDynamoClientConfig(): DynamoDBClientConfig {
    const config: DynamoDBClientConfig = {
      region: this.config.region,
      maxAttempts: this.config.maxAttempts,
      tls: this.config.tls,
    };

    if (this.config.endpoint) {
      config.endpoint = this.config.endpoint;
    }

    if (this.config.accessKeyId && this.config.secretAccessKey) {
      config.credentials = {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      };
    }

    return config;
  }

  getSqsClient(): SQSClient {
    if (!this.sqsClient) {
      this.sqsClient = new SQSClient(this.getSqsClientConfig());
    }
    return this.sqsClient;
  }

  getDynamoClient(): DynamoDBClient {
    if (!this.dynamoClient) {
      this.dynamoClient = new DynamoDBClient(this.getDynamoClientConfig());
    }
    return this.dynamoClient;
  }

  getRegion(): string {
    return this.config.region;
  }

  getConfig(): Readonly<AwsConfigOptions> {
    return { ...this.config };
  }

  isLocalDevelopment(): boolean {
    return !!this.config.endpoint;
  }

  async destroy(): Promise<void> {
    if (this.sqsClient) {
      await this.sqsClient.destroy();
      this.sqsClient = null;
    }
    if (this.dynamoClient) {
      await this.dynamoClient.destroy();
      this.dynamoClient = null;
    }
  }
}

export const AWS_CONFIG_TOKEN = 'AWS_CONFIG';

export const createAwsConfigProvider = (options?: Partial<AwsConfigOptions>): Provider => {
  return {
    provide: AWS_CONFIG_TOKEN,
    useFactory: () => new AwsConfig(options),
  };
};

export const createSqsClientProvider = (): Provider => {
  return {
    provide: SQSClient,
    useFactory: (awsConfig: AwsConfig) => awsConfig.getSqsClient(),
    inject: [AWS_CONFIG_TOKEN],
  };
};

export const createDynamoClientProvider = (): Provider => {
  return {
    provide: DynamoDBClient,
    useFactory: (awsConfig: AwsConfig) => awsConfig.getDynamoClient(),
    inject: [AWS_CONFIG_TOKEN],
  };
};

export const AWS_PROVIDERS = [
  createAwsConfigProvider(),
  createSqsClientProvider(),
  createDynamoClientProvider(),
];

export function getAwsConfigFromEnvironment(): AwsConfigOptions {
  return {
    region: process.env.AWS_REGION || DEFAULT_AWS_CONFIG.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    maxAttempts: DEFAULT_AWS_CONFIG.maxAttempts,
    tls: DEFAULT_AWS_CONFIG.tls,
  };
}

export function createAwsConfigFromEnvironment(): AwsConfig {
  return new AwsConfig(getAwsConfigFromEnvironment());
}


// === ARCHIVO: src/common/aws-iam-policy.json ===
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSQSOperations",
      "Effect": "Allow",
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:SendMessage",
        "sqs:GetQueueUrl",
        "sqs:GetQueueAttributes",
        "sqs:SetQueueAttributes",
        "sqs:ListQueues",
        "sqs:CreateQueue",
        "sqs:TagQueue",
        "sqs:PurgeQueue"
      ],
      "Resource": [
        "arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:payment-events.fifo",
        "arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:fraud-check-requests.fifo",
        "arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:risk-assessment-requests.fifo",
        "arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:payment-outbox.fifo",
        "arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:compensation-commands.fifo"
      ]
    },
    {
      "Sid": "AllowDynamoDBPaymentTables",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:DescribeTable",
        "dynamodb:CreateTable",
        "dynamodb:UpdateTable",
        "dynamodb:TagResource",
        "dynamodb:ListTagsOfResource"
      ],
      "Resource": [
        "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/PaymentTable",
        "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/PaymentOutboxTable",
        "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/PaymentTable/index/*",
        "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/PaymentOutboxTable/index/*"
      ]
    },
    {
      "Sid": "AllowDynamoDBStreamOperations",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:DescribeStream",
        "dynamodb:ListStreams"
      ],
      "Resource": [
        "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/PaymentOutboxTable/stream/*"
      ]
    },
    {
      "Sid": "DenySensitiveOperations",
      "Effect": "Deny",
      "Action": [
        "sqs:*",
        "dynamodb:*"
      ],
      "Resource": "*",
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    },
    {
      "Sid": "RequireEncryptedStorage",
      "Effect": "Deny",
      "Action": [
        "dynamodb:CreateTable"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "dynamodb:ServerSideEncryption": "true"
        }
      }
    }
  ],
  "Description": "Política IAM para el sistema de procesamiento de pagos con eventos. Otorga permisos específicos para operaciones de SQS FIFO y DynamoDB, incluyendo tablas de pagos, outbox y stream de eventos. Incluye restricciones de seguridad para forzar TLS y cifrado en reposo."
}

// === ARCHIVO: src/antifraud/application/events/fraud-check-requested.event.ts ===
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

// === ARCHIVO: src/antifraud/infrastructure/messaging/kafka/kafka-fraud-consumer.service.ts ===
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { EachMessagePayload, Kafka, Consumer, ConsumerRunConfig } from 'kafkajs';
import { ConfigType } from '@nestjs/config';
import { FraudCheckRequestedEvent } from '../../application/events/fraud-check-requested.event';
import { FraudCheckService } from '../../application/services/fraud-check.service';
import { FraudCheckResponse } from '../../domain/models/fraud-check-response.model';

const KAFKA_CONSUMER_GROUP = 'fraud-check-consumer-group';
const FRAUD_CHECK_TOPIC = 'payment.fraud-check.requested';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE_MS = 1000;

export interface KafkaConsumerConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
}

@Injectable()
export class KafkaFraudConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaFraudConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;
  private readonly messageBuffer: Map<string, FraudCheckRequestedEvent> = new Map();
  private processingLock = false;

  constructor(
    @Inject(forwardRef(() => FraudCheckService))
    private readonly fraudCheckService: FraudCheckService,
    private readonly kafkaConfig: { brokers: string[] },
  ) {
    this.kafka = new Kafka({
      clientId: 'fraud-check-consumer',
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
        factor: 2,
        multiplier: 2,
      },
      connectionTimeout: 10000,
      authenticationTimeout: 10000,
    });

    this.consumer = this.kafka.consumer({
      groupId: KAFKA_CONSUMER_GROUP,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxWaitTimeInMs: 5000,
      maxBytes: 10485760,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
    this.logger.log('Módulo de consumidor Kafka para fraude inicializado correctamente');
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
    this.logger.log('Módulo de consumidor Kafka para fraude detenido correctamente');
  }

  private async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Conexión al cluster de Kafka establecida');
    } catch (error) {
      this.logger.error('Error al conectar con el cluster de Kafka', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Desconexión del cluster de Kafka completada');
      } catch (error) {
        this.logger.error('Error al desconectar del cluster de Kafka', error);
      }
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic: FRAUD_CHECK_TOPIC,
        fromBeginning: false,
      });
      this.logger.log(`Suscrito al topic: ${FRAUD_CHECK_TOPIC}`);
    } catch (error) {
      this.logger.error(`Error al suscribirse al topic ${FRAUD_CHECK_TOPIC}`, error);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    const consumerConfig: ConsumerRunConfig = {
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
      partitionsConsumedConcurrently: 3,
    };

    await this.consumer.run(consumerConfig);
    this.logger.log('Consumer de Kafka iniciado y procesando mensajes');
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const messageKey = message.key?.toString();
    const messageValue = message.value?.toString();

    if (!messageValue) {
      this.logger.warn('Mensaje recibido sin contenido, ignorando');
      return;
    }

    this.logger.log(
      `Procesando mensaje del topic ${topic}, partición ${partition}, offset ${message.offset}`,
    );

    try {
      const fraudCheckEvent: FraudCheckRequestedEvent = JSON.parse(messageValue);
      
      if (this.messageBuffer.has(fraudCheckEvent.correlationId)) {
        this.logger.warn(
          `Mensaje duplicado detectado para correlationId: ${fraudCheckEvent.correlationId}, ignorando`,
        );
        return;
      }

      this.messageBuffer.set(fraudCheckEvent.correlationId, fraudCheckEvent);

      const response = await this.processFraudCheck(fraudCheckEvent);
      
      this.logger.log(
        `Verificación antifraude completada para paymentId: ${fraudCheckEvent.paymentId}, ` +
        `resultado: ${response.approved ? 'APROBADO' : 'RECHAZADO'}`,
      );

      this.messageBuffer.delete(fraudCheckEvent.correlationId);
    } catch (error) {
      this.logger.error(
        `Error al procesar mensaje de antifraude: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      
      await this.handleProcessingError(messageKey, messageValue, error);
    }
  }

  private async processFraudCheck(
    event: FraudCheckRequestedEvent,
  ): Promise<FraudCheckResponse> {
    const result = await this.fraudCheckService.performFraudCheck(event);
    return result;
  }

  private async handleProcessingError(
    messageKey: string | undefined,
    messageValue: string,
    error: unknown,
  ): Promise<void> {
    const eventData = JSON.parse(messageValue) as FraudCheckRequestedEvent;
    const retryCount = (eventData.retryCount || 0) + 1;

    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      this.logger.error(
        `Máximo de reintentos alcanzado para el mensaje con correlationId: ${eventData.correlationId}. ` +
        `Enviando a cola de mensajes fallidos.`,
      );
      await this.sendToDeadLetterQueue(eventData, error);
      return;
    }

    const delayMs = this.calculateRetryDelay(retryCount);
    this.logger.log(
      `Reintentando procesamiento en ${delayMs}ms para correlationId: ${eventData.correlationId} ` +
      `(intento ${retryCount}/${MAX_RETRY_ATTEMPTS})`,
    );

    setTimeout(async () => {
      try {
        const retryEvent = {
          ...eventData,
          retryCount,
        };
        await this.fraudCheckService.scheduleRetry(retryEvent, delayMs);
      } catch (retryError) {
        this.logger.error(
          `Error al programar reintento para correlationId: ${eventData.correlationId}`,
          retryError,
        );
      }
    }, delayMs);
  }

  private calculateRetryDelay(attemptNumber: number): number {
    const exponentialDelay = RETRY_DELAY_BASE_MS * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return Math.floor(exponentialDelay + jitter);
  }

  private async sendToDeadLetterQueue(
    event: FraudCheckRequestedEvent,
    error: unknown,
  ): Promise<void> {
    const deadLetterMessage = {
      originalEvent: event,
      error: error instanceof Error ? error.message : 'Unknown error',
      failedAt: new Date().toISOString(),
      retryCount: event.retryCount || 0,
    };

    try {
      const producer = this.kafka.producer();
      await producer.connect();
      await producer.send({
        topic: 'payment.fraud-check.dead-letter',
        messages: [
          {
            key: event.correlationId,
            value: JSON.stringify(deadLetterMessage),
            headers: {
              'original-topic': FRAUD_CHECK_TOPIC,
              'failure-reason': error instanceof Error ? error.message : 'Unknown error',
            },
          },
        ],
      });
      await producer.disconnect();
      this.logger.log(
        `Mensaje enviado a cola de mensajes fallidos para correlationId: ${event.correlationId}`,
      );
    } catch (dlqError) {
      this.logger.error(
        `Error al enviar mensaje a la cola de mensajes fallidos: ${dlqError}`,
      );
    }
  }

  async pauseConsumption(): Promise<void> {
    await this.consumer.pause([{ topic: FRAUD_CHECK_TOPIC }]);
    this.logger.log('Consumo de mensajes pausado');
  }

  async resumeConsumption()::
 Promise<void> {
    await this.consumer.resume([{ topic: FRAUD_CHECK_TOPIC }]);
    this.logger.log('Consumo de mensajes reanudado');
  }

  getConsumerStatus(): { connected: boolean; bufferedMessages: number } {
    return {
      connected: this.isConnected,
      bufferedMessages: this.messageBuffer.size,
    };
  }
}

// === ARCHIVO: src/risk/application/events/risk-check-requested.event.ts ===
import { DomainEvent } from '@payments/domain/events/payment-domain.event';

export interface RiskCheckRequestedEvent extends DomainEvent {
  eventType: 'RiskCheckRequested';
  paymentId: string;
  amount: number;
  currency: string;
  merchantId: string;
  customerId: string;
  customerEmail: string;
  customerIpAddress: string;
  billingCountry: string;
  cardBin: string;
  transactionType: 'card_present' | 'card_not_present' | 'recurring' | 'moto';
  riskScore: number | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | null;
  checkCompletedAt: Date | null;
  checkFailedAt: Date | null;
  failureReason: string | null;
  requestedAt: Date;
  idempotencyKey: string;
}

export interface RiskCheckResult {
  paymentId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendation: 'approve' | 'review' | 'decline';
  checkedAt: Date;
}

export interface RiskFactor {
  type: 'velocity' | 'geolocation' | 'amount' | 'history' | 'device' | 'behavioral';
  score: number;
  weight: number;
  description: string;
  triggered: boolean;
}

export function createRiskCheckRequestedEvent(
  paymentId: string,
  amount: number,
  currency: string,
  merchantId: string,
  customerId: string,
  customerEmail: string,
  customerIpAddress: string,
  billingCountry: string,
  cardBin: string,
  transactionType: 'card_present' | 'card_not_present' | 'recurring' | 'moto',
  idempotencyKey: string,
): RiskCheckRequestedEvent {
  return {
    eventType: 'RiskCheckRequested',
    eventId: `risk-${paymentId}-${Date.now()}`,
    occurredOn: new Date(),
    paymentId,
    amount,
    currency,
    merchantId,
    customerId,
    customerEmail,
    customerIpAddress,
    billingCountry,
    cardBin,
    transactionType,
    riskScore: null,
    riskLevel: null,
    checkCompletedAt: null,
    checkFailedAt: null,
    failureReason: null,
    requestedAt: new Date(),
    idempotencyKey,
  };
}

export function createRiskCheckResultEvent(
  paymentId: string,
  riskScore: number,
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  factors: RiskFactor[],
  recommendation: 'approve' | 'review' | 'decline',
): RiskCheckResult {
  return {
    paymentId,
    riskScore,
    riskLevel,
    factors,
    recommendation,
    checkedAt: new Date(),
  };
}

// === ARCHIVO: src/risk/infrastructure/messaging/kafka/kafka-risk-consumer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RiskCheckRequestedEvent } from '@risk/application/events/risk-check-requested.event';

const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
const RISK_TOPIC = process.env.KAFKA_RISK_TOPIC || 'payment.risk.check.requested';
const RISK_GROUP_ID = process.env.KAFKA_RISK_GROUP_ID || 'risk-consumer-group';

@Injectable()
export class KafkaRiskConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaRiskConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.kafka = new Kafka({
      clientId: 'risk-consumer',
      brokers: KAFKA_BROKERS,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 3000,
      authenticationTimeout: 3000,
    });
    this.consumer = this.kafka.consumer({
      groupId: RISK_GROUP_ID,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
    this.logger.log('Kafka Risk Consumer inicializado correctamente');
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log(`Conectado al broker Kafka: ${KAFKA_BROKERS.join(', ')}`);
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Desconectado del broker Kafka');
      } catch (error) {
        this.logger.error('Error al desconectar de Kafka', error);
      }
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({ topic: RISK_TOPIC, fromBeginning: false });
      this.logger.log(`Suscrito al topic: ${RISK_TOPIC}`);
    } catch (error) {
      this.logger.error(`Error al suscribirse al topic ${RISK_TOPIC}`, error);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const messageValue = message.value?.toString();
    const messageKey = message.key?.toString();

    this.logger.debug(`Mensaje recibido - Topic: ${topic}, Partition: ${partition}, Key: ${messageKey}`);

    if (!messageValue) {
      this.logger.warn('Mensaje vacío recibido, ignorando');
      return;
    }

    try {
      const event = JSON.parse(messageValue) as RiskCheckRequestedEvent;
      await this.processRiskCheckEvent(event);
      this.logger.log(`Evento de riesgo procesado exitosamente para paymentId: ${event.paymentId}`);
    } catch (error) {
      this.logger.error(`Error al procesar mensaje: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        topic,
        partition,
        offset: message.offset,
        key: messageKey,
      });
    }
  }

  private async processRiskCheckEvent(event: RiskCheckRequestedEvent): Promise<void> {
    this.logger.debug(`Procesando verificación de riesgo para paymentId: ${event.paymentId}`);
    
    if (!this.isValidRiskEvent(event)) {
      this.logger.warn(`Evento de riesgo inválido para paymentId: ${event.paymentId}`);
      return;
    }

    this.eventEmitter.emit('risk.check.requested', event);
    
    this.logger.debug(`Evento emitido: risk.check.requested para ${event.paymentId}`);
  }

  private isValidRiskEvent(event: unknown): event is RiskCheckRequestedEvent {
    if (!event || typeof event !== 'object') {
      return false;
    }
    const riskEvent = event as Partial<RiskCheckRequestedEvent>;
    return (
      typeof riskEvent.paymentId === 'string' &&
      typeof riskEvent.amount === 'number' &&
      typeof riskEvent.merchantId === 'string' &&
      typeof riskEvent.customerId === 'string' &&
      typeof riskEvent.idempotencyKey === 'string'
    );
  }

  async pauseConsumption(): Promise<void> {
    await this.consumer.pause([{ topic: RISK_TOPIC }]);
    this.logger.log(`Consumo pausado para el topic: ${RISK_TOPIC}`);
  }

  async resumeConsumption(): Promise<void> {
    await this.consumer.resume([{ topic: RISK_TOPIC }]);
    this.logger.log(`Consumo reanudado para el topic: ${RISK_TOPIC}`);
  }

  getConsumerStatus(): { connected: boolean; topic: string; groupId: string } {
    return {
      connected: this.isConnected,
      topic: RISK_TOPIC,
      groupId: RISK_GROUP_ID,
    };
  }
}

// === ARCHIVO: test/payments/payment.saga.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSaga } from '@payments/application/sagas/payment.saga';
import { PaymentInitiatedEvent } from '@payments/application/events/payment-initiated.event';
import { PaymentStatus } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';
import { IdempotencyException } from '@common/exceptions/idempotency-exception';
import { BackoffUtil } from '@common/utils/backoff-util';

describe('PaymentSaga', () => {
  let saga: PaymentSaga;
  let mockPaymentRepository: any;
  let mockOutboxRepository: any;
  let mockKafkaProducer: any;
  let mockSqsProducer: any;

  const mockPayment = {
    id: 'pay-123',
    amount: 1000,
    currency: 'USD',
    status: PaymentStatus.PENDING,
    idempotencyKey: 'idem-123',
    customerId: 'cust-456',
    merchantId: 'merch-789',
    retryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockPaymentRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      updateStatus: jest.fn(),
    };

    mockOutboxRepository = {
      save: jest.fn(),
      findPending: jest.fn(),
      markAsProcessed: jest.fn(),
    };

    mockKafkaProducer = {
      publish: jest.fn(),
    };

    mockSqsProducer = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentSaga,
        { provide: 'PaymentRepository', useValue: mockPaymentRepository },
        { provide: 'PaymentOutboxRepository', useValue: mockOutboxRepository },
        { provide: 'KafkaPaymentProducerService', useValue: mockKafkaProducer },
        { provide: 'SqsPaymentProducerService', useValue: mockSqsProducer },
      ],
    }).compile();

    saga = module.get<PaymentSaga>(PaymentSaga);
  });

  describe('handlePaymentInitiated', () => {
    it('debe iniciar el flujo de la saga correctamente', async () => {
      const event = PaymentDomainEventFactory.createPaymentInitiatedEvent(mockPayment);
      
      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-1' });
      mockKafkaProducer.publish.mockResolvedValue(undefined);

      await saga.handlePaymentInitiated(event);

      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(mockPayment.id);
      expect(mockOutboxRepository.save).toHaveBeenCalled();
      expect(mockKafkaProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'PaymentInitiated' }),
      );
    });

    it('debe lanzar IdempotencyException si la clave ya existe', async () => {
      const event = PaymentDomainEventFactory.createPaymentInitiatedEvent(mockPayment);
      
      mockPaymentRepository.findById.mockRejectedValue(
        new IdempotencyException('Duplicate idempotency key'),
      );

      await expect(saga.handlePaymentInitiated(event)).rejects.toThrow(
        IdempotencyException,
      );
    });
  });

  describe('compensatePayment', () => {
    it('debe ejecutar la compensación correctamente', async () => {
      const failedPayment = {
        ...mockPayment,
        status: PaymentStatus.FAILED,
        failureReason: 'Antifraud check failed',
      };

      mockPaymentRepository.findById.mockResolvedValue(failedPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue(failedPayment);
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-2' });

      await saga.compensatePayment(failedPayment.id, 'Antifraud check failed');

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        failedPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
      expect(mockOutboxRepository.save).toHaveBeenCalled();
    });

    it('debe revertir al estado anterior si la compensación falla', async () => {
      const originalStatus = PaymentStatus.PENDING;
      const paymentWithBackup = {
        ...mockPayment,
        previousStatus: originalStatus,
      };

      mockPaymentRepository.findById.mockResolvedValue(paymentWithBackup);
      mockPaymentRepository.updateStatus.mockRejectedValue(
        new Error('Compensation failed'),
      );

      await expect(
        saga.compensatePayment(mockPayment.id, 'Test failure'),
      ).rejects.toThrow('Compensation failed');

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
    });
  });

  describe('retryWithBackoff', () => {
    it('debe usar backoff exponencial con jitter para reintentos', async () => {
      const paymentWithRetry = {
        ...mockPayment,
        retryCount: 2,
        lastRetryAt: new Date(Date.now() - 60000),
      };

      mockPaymentRepository.findById.mockResolvedValue(paymentWithRetry);
      mockPaymentRepository.save.mockResolvedValue(paymentWithRetry);

      const delay = BackoffUtil.calculateExponentialBackoff(paymentWithRetry.retryCount);
      
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThan(31000);

      await saga.retryWithBackoff(paymentWithRetry.id);

      expect(mockPaymentRepository.save).toHaveBeenCalled();
    });

    it('debe no reintentar si se alcanza el límite máximo', async () => {
      const paymentAtLimit = {
        ...mockPayment,
        retryCount: 5,
      };

      mockPaymentRepository.findById.mockResolvedValue(paymentAtLimit);

      await expect(saga.retryWithBackoff(paymentAtLimit.id)).rejects.toThrow(
        'Maximum retry attempts reached',
      );
    });
  });

  describe('handleAntifraudResult', () => {
    it('debe continuar el flujo si antifraude aprueba', async () => {
      const approvedEvent = {
        paymentId: mockPayment.id,
        approved: true,
        riskScore: 0.2,
      };

      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.ANTIFRAUD_APPROVED,
      });
      mockKafkaProducer.publish.mockResolvedValue(undefined);

      await saga.handleAntifraudResult(approvedEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.ANTIFRAUD_APPROVED,
        expect.any(String),
      );
    });

    it('debe compensar si antifraude rechaza', async () => {
      const rejectedEvent = {
        paymentId: mockPayment.id,
        approved: false,
        reason: 'High risk transaction',
      };

      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.FAILED,
      });
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-3' });

      await saga.handleAntifraudResult(rejectedEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
      expect(mockOutboxRepository.save).toHaveBeenCalled();
    });
  });

  describe('handleRiskAssessment', () => {
    it('debe autorizar el pago si el riesgo es bajo', async () => {
      const lowRiskEvent = {
        paymentId: mockPayment.id,
        riskLevel: 'LOW',
        score: 15,
      };

      mockPaymentRepository.findById.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.ANTIFRAUD_APPROVED,
      });
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.AUTHORIZED,
      });
      mockKafkaProducer.publish.mockResolvedValue(undefined);

      await saga.handleRiskAssessment(lowRiskEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.AUTHORIZED,
        expect.any(String),
      );
    });

    it('debe rechazar el pago si el riesgo es alto', async () => {
      const highRiskEvent = {
        paymentId: mockPayment.id,
        riskLevel: 'HIGH',
        score: 85,
      };

      mockPaymentRepository.findById.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.ANTIFRAUD_APPROVED,
      });
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.FAILED,
      });
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-4' });

      await saga.handleRiskAssessment(highRiskEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.FAILED,
        expect.any(String),
      );
    });
  });

  describe('handlePaymentCompletion', () => {
    it('debe completar el pago exitosamente', async () => {
      const completedEvent = {
        paymentId: mockPayment.id,
        transactionId: 'txn-abc123',
      };

      mockPaymentRepository.findById.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.AUTHORIZED,
      });
      mockPaymentRepository.updateStatus.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.COMPLETED,
      });
      mockOutboxRepository.save.mockResolvedValue({ id: 'outbox-5' });

      await saga.handlePaymentCompletion(completedEvent);

      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.COMPLETED,
        expect.any(String),
      );
    });
  });
});

// === ARCHIVO: test/payments/payment-outbox.repository.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentOutboxRepository } from '@payments/infrastructure/persistence/dynamodb/payment-outbox.repository';
import { PaymentStatus } from '@payments/domain/entities/payment.entity';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb');

describe('PaymentOutboxRepository', () => {
  let repository: PaymentOutboxRepository;
  let mockDynamoDBClient: jest.Mocked<DynamoDBClient>;

  const mockOutboxEvent = {
    id: 'outbox-event-1',
    aggregateId: 'pay-123',
    aggregateType: 'Payment',
    eventType: 'PaymentInitiated',
    payload: JSON.stringify({
      paymentId: 'pay-123',
      amount: 1000,
      currency: 'USD',
    }),
    metadata: JSON.stringify({
      correlationId: 'corr-123',
      causationId: 'cmd-123',
    }),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    processedAt: null,
    retryCount: 0,
  };

  beforeEach(async () => {
    mockDynamoDBClient = {
      send: jest.fn(),
    } as unknown as jest.Mocked<DynamoDBClient>;

    (DynamoDBClient as jest.Mock).mockImplementation(() => mockDynamoDBClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentOutboxRepository,
        {
          provide: 'DYNAMODB_CLIENT',
          useValue: mockDynamoDBClient,
        },
      ],
    }).compile();

    repository = module.get<PaymentOutboxRepository>(PaymentOutboxRepository);
  });

  describe('save', () => {
    it('debe persistir un evento en el outbox', async () => {
      const eventToSave = {
        aggregateId: 'pay-456',
        aggregateType: 'Payment',
        eventType: 'PaymentCompleted',
        payload: { paymentId: 'pay-456', amount: 500 },
        metadata: { correlationId: 'corr-456' },
      };

      mockDynamoDBClient.send.mockResolvedValue({} as any);
      (marshall as jest.Mock).mockReturnValue(eventToSave);

      const result = await repository.save(eventToSave);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
      expect(result).toBeDefined();
    });

    it('debe lanzar error si la persistencia falla', async () => {
      const eventToSave = {
        aggregateId: 'pay-789',
        aggregateType: 'Payment',
        eventType: 'PaymentFailed',
        payload: { paymentId: 'pay-789' },
        metadata: {},
      };

      mockDynamoDBClient.send.mockRejectedValue(
        new Error('DynamoDB connection error'),
      );

      await expect(repository.save(eventToSave)).rejects.toThrow(
        'DynamoDB connection error',
      );
    });
  });

  describe('findPending', () => {
    it('debe recuperar eventos pendientes del outbox', async () => {
      const pendingEvents = [mockOutboxEvent];
      
      mockDynamoDBClient.send.mockResolvedValue({
        Items: pendingEvents.map(item => marshall(item)),
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      const result = await repository.findPending(10);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(QueryCommand),
      );
      expect(result).toHaveLength(1);
      expect(result[0].aggregateId).toBe('pay-123');
    });

    it('debe retornar array vacío si no hay eventos pendientes', async () => {
      mockDynamoDBClient.send.mockResolvedValue({
        Items: undefined,
      } as any);

      const result = await repository.findPending(10);

      expect(result).toEqual([]);
    });

    it('debe limitar la cantidad de eventos recuperados', async () => {
      mockDynamoDBClient.send.mockResolvedValue({
        Items: [marshall(mockOutboxEvent)],
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      await repository.findPending(5);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            limit: 5,
          }),
        }),
      );
    });
  });

  describe('markAsProcessed', () => {
    it('debe marcar un evento como procesado', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      await repository.markAsProcessed('outbox-event-1');

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
    });

    it('debe actualizar el campo processedAt con la fecha actual', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      const beforeTime = new Date();
      await repository.markAsProcessed('outbox-event-1');
      const afterTime = new Date();

      const updateCall = mockDynamoDBClient.send.mock.calls[0][0];
      const updateInput = updateCall.input;
      
      expect(updateInput.UpdateExpression).toContain('processedAt');
      expect(updateInput.ExpressionAttributeValues[':processedAt']).toBeDefined();
    });

    it('debe incrementar el retryCount si se procesa con delay', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      await repository.markAsProcessed('outbox-event-1', true);

      const updateCall = mockDynamoDBClient.send.mock.calls[0][0];
      const updateInput = updateCall.input;

      expect(updateInput.UpdateExpression).toContain('retryCount');
    });
  });

  describe('findByAggregateId', () => {
    it('debe recuperar eventos por ID del agregado', async () => {
      const eventsForAggregate = [
        { ...mockOutboxEvent, eventType: 'PaymentInitiated' },
        { ...mockOutboxEvent, eventType: 'PaymentCompleted', id: 'outbox-2' },
      ];

      mockDynamoDBClient.send.mockResolvedValue({
        Items: eventsForAggregate.map(item => marshall(item)),
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      const result = await repository.findByAggregateId('pay-123');

      expect(result).toHaveLength(2);
      expect(result[0].aggregateId).toBe('pay-123');
    });
  });

  describe('findByEventType', () => {
    it('debe filtrar eventos por tipo', async () => {
      mockDynamoDBClient.send.mockResolvedValue({
        Items: [marshall(mockOutboxEvent)],
      } as any);
      (unmarshall as jest.Mock).mockImplementation(item => item);

      const result = await repository.findByEventType('PaymentInitiated');

      expect(result).toHaveLength(1);
      expect(result[0].eventType).toBe('PaymentInitiated');
    });
  });

  describe('deleteOldEvents', () => {
    it('debe eliminar eventos procesados mayores a la fecha especificada', async () => {
      mockDynamoDBClient.send.mockResolvedValue({} as any);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      await repository.deleteOldEvents(cutoffDate);

      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
    });
  });
});

// === ARCHIVO: test/payments/payment.repository.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from '@payments/infrastructure/persistence/postgresql/payment.repository';
import { PaymentEntity, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PaymentRepository', () => {
  let repository: PaymentRepository;
  let mockTypeormRepository: jest.Mocked<Repository<PaymentEntity>>;

  const mockPaymentEntity = {
    id: 'pay-123',
    amount: 1000,
    currency: 'USD',
    status: PaymentStatus.PENDING,
    idempotencyKey: 'idem-123',
    customerId: 'cust-456',
    merchantId: 'merch-789',
    retryCount: 0,
    failureReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTypeormRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<PaymentEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRepository,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<PaymentRepository>(PaymentRepository);
  });

  describe('findById', () => {
    it('debe recuperar un pago por su ID', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);

      const result = await repository.findById('pay-123');

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'pay-123' },
      });
      expect(result).toBeDefined();
      expect(result?.id).toBe('pay-123');
    });

    it('debe retornar null si el pago no existe', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('debe incluir relaciones si se especifican', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);

      await repository.findById('pay-123', { relations: ['metadata'] });

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['metadata'],
        }),
      );
    });
  });

  describe('findByIdempotencyKey', () => {
    it('debe buscar por clave de idempotencia', async () => {
      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);

      const result = await repository.findByIdempotencyKey('idem-123');

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'idem-123' },
      });
      expect(result?.idempotencyKey).toBe('idem-123');
    });
  });

  describe('save', () => {
    it('debe persistir un nuevo pago', async () => {
      const newPayment = {
        amount: 500,
        currency: 'EUR',
        customerId: 'cust-new',
        merchantId: 'merch-new',
        status: PaymentStatus.PENDING,
        idempotencyKey: 'idem-new',
      };

      const createdEntity = { ...mockPaymentEntity, ...newPayment };
      
      mockTypeormRepository.create.mockReturnValue(createdEntity as PaymentEntity);
      mockTypeormRepository.save.mockResolvedValue(createdEntity as PaymentEntity);

      const result = await repository.save(newPayment);

      expect(mockTypeormRepository.create).toHaveBeenCalledWith(newPayment);
      expect(mockTypeormRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toBeDefined();
    });

    it('debe actualizar un pago existente', async () => {
      const updatedData = { status: PaymentStatus.COMPLETED };
      const updatedEntity = { ...mockPaymentEntity, ...updatedData };

      mockTypeormRepository.findOne.mockResolvedValue(mockPaymentEntity as PaymentEntity);
      mockTypeormRepository.save.mockResolvedValue(updatedEntity as PaymentEntity);

      const result = await repository.save({ id: 'pay-123', ...updatedData });

      expect(mockTypeormRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(PaymentStatus.COMPLETED);
    });
  });

  describe('updateStatus', () {
    it('debe actualizar el estado de un pago', async () => {
      mockTypeormRepository.update.mockResolvedValue({ affected: 1 } as any);

      await repository.updateStatus('pay-123', PaymentStatus.COMPLETED);

      expect(mockTypeormRepository.update).toHaveBeenCalledWith(
        'pay-123',
        expect.objectContaining({
          status: PaymentStatus.COMPLETED,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('debe incluir razón de fallo si se proporciona', async () => {
      mockTypeormRepository.update.mockResolvedValue({ affected: 1 } as any);

      await repository.updateStatus(
        'pay-123',
        PaymentStatus.FAILED,
        'Insufficient funds',
      );

      expect(mockTypeormRepository.update).toHaveBeenCalledWith(
        'pay-123',
        expect.objectContaining({
          status: PaymentStatus.FAILED,
          failureReason: 'Insufficient funds',
        }),
      );
    });

    it('debe lanzar error si no afecta ninguna fila', async () => {
      mockTypeormRepository.update.mockResolvedValue({ affected: 0 } as any);

      await expect(
        repository.updateStatus('non-existent', PaymentStatus.COMPLETED),
      ).rejects.toThrow('Payment not found');
    });
  });

  describe('findByStatus', () => {
    it('debe buscar pagos por estado', async () => {
      const pendingPayments = [
        mockPaymentEntity,
        { ...mockPaymentEntity, id: 'pay-124' },
      ];

      mockTypeormRepository.find.mockResolvedValue(pendingPayments as PaymentEntity[]);

      const result = await repository.findByStatus(PaymentStatus.PENDING);

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: { status: PaymentStatus.PENDING },
      });
      expect(result).toHaveLength(2);
    });

    it('debe aplicar filtros adicionales', async () => {
      mockTypeormRepository.find.mockResolvedValue([mockPaymentEntity] as PaymentEntity[]);

      await repository.findByStatus(PaymentStatus.PENDING, {
        createdAfter: new Date('2024-01-01'),
      });

      expect(mockTypeormRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: PaymentStatus.PENDING,
          }),
        }),
      );
    });
  });

  describe('findByCustomerId', () => {
    it('debe recuperar pagos de un cliente', async () => {
      const customerPayments = [mockPaymentEntity];

      mockTypeormRepository.find.mockResolvedValue(customerPayments as PaymentEntity[]);

      const result = await repository.findByCustomerId('cust-456');

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: { customerId: 'cust-456' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });

    it('debe permitir paginación', async () => {
      mockTypeormRepository.find.mockResolvedValue([] as PaymentEntity[]);

      await repository.findByCustomerId('cust-456', { limit: 10, offset: 0 });

      expect(mockTypeormRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0,
        }),
      );
    });
  });

  describe('delete', () => {
    it('debe eliminar un pago por su ID', async () => {
      mockTypeormRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('pay-123');

      expect(mockTypeormRepository.delete).toHaveBeenCalledWith('pay-123');
    });

    it('debe lanzar error si la eliminación falla', async () => {
      mockTypeormRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Failed to delete payment',
      );
    });
  });

  describe('transaction', () => {
    it('debe ejecutar operaciones dentro de una transacción', async () => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockResolvedValue(mockPaymentEntity),
        },
      };

      mockTypeormRepository.manager = mockQueryRunner.manager as any;

      const result = await repository.transaction(async (manager) => {
        return manager.save(mockPaymentEntity);
      });

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('debe hacer rollback si la transacción falla', async () => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn().mockRejectedValue(new Error('Transaction failed')),
        },
      };

      mockTypeormRepository.manager = mockQueryRunner.manager as any;

      await expect(
        repository.transaction(async (manager) => {
          throw new Error('Transaction failed');
        }),
      ).rejects.toThrow('Transaction failed');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });


// === ARCHIVO: test/integration/payment-flow.spec.ts ===
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
// === ARCHIVO: docs/comparacion-kafka-sqs.md ===
# Comparación de Kafka y SQS FIFO en el Sistema de Procesamiento de Pagos

## 1. Visión General de las Opciones

### 1.1 Apache Kafka

Apache Kafka es una plataforma de streaming distribuida ursprünglich desarrollada por LinkedIn y ahora mantenida por Confluent. Utiliza un modelo de **pub-sub** con logs append-only persistentes. Los mensajes se organizan en **temas (topics)** que pueden tener múltiples **particiones**. Cada partición mantiene un orden total de mensajes y permite la distribución de carga entre consumidores.

Kafka ofrece **retención configurable por tema** (desde horas hasta años), lo que permite la replay de mensajes. La arquitectura de Kafka está basada en **pull** (los consumidores solicitan mensajes), lo que optimiza el consumo y permite procesamiento por lotes (batch processing).

### 1.2 Amazon SQS FIFO

Amazon SQS FIFO (First-In-First-Out) es un tipo de cola de mensajes completamente gestionado por AWS. Las colas FIFO garantizan que los mensajes se procesen **exactamente una vez** y en el **orden exacto** en que se enviaron. Utiliza el concepto de **grupo de mensajes** para permitir múltiples flujos ordenados dentro de una misma cola.

SQS FIFO tiene un límite de **300 mensajes por segundo** (transaccional) o **3000 mensajes por segundo** (sin transacción) por cola. Ofrece entrega **at-least-once** por defecto, pero con la característica de exactly-once processing disponible para evitar duplicados.

## 2. Comparación por Fase del Proceso de Pagos

### 2.1 Fase 1: Inicio del Pago (Payment Initiation)

**Kafka - Ventajas:**
- Alta吞吐量 (throughput): Kafka puede manejar millones de mensajes por segundo con la configuración adecuada.
- Replay de mensajes: Si el consumidor falla durante el procesamiento, puede reiniciar desde el último offset confirmado.
- Particionamiento por paymentId: Garantiza que todos los eventos relacionados con un pago específico vayan a la misma partición, manteniendo el orden.
- Retención larga: Los mensajes pueden mantenerse en el topic durante días, permitiendo recuperación ante desastres.

**Kafka - Desventajas:**
- Complejidad operativa: Requiere administración de brokers, configuración de réplicas, monitoreo de lag.
- Ordenamiento solo por partición: Sin una estrategia de particionamiento adecuada, no hay garantía de orden global.
- Latencia de confirmación: Los productores deben esperar acks de los brokers, lo que añade latencia.

**SQS FIFO - Ventajas:**
- Garantía de orden exacto: Los mensajes se procesan en orden FIFO sin configuración adicional.
- Exactly-once semantics: Elimina la necesidad de implementar deduplicación manual.
- Gestionado completamente: AWS maneja la infraestructura, escalado y disponibilidad.
- Integración nativa con AWS: Facilidad de integración con otros servicios AWS (Lambda, EC2, ECS).

**SQS FIFO - Desventajas:**
- Límite de throughput: 3000 msg/s puede ser insuficiente para picos de tráfico masivo.
- Costo por mensaje: El modelo de pricing puede resultar más caro en volúmenes muy altos.
- Sin replay nativo: Una vez procesado y eliminado, el mensaje no se puede reprocesar sin mecanismo adicional.

**Veredicto para Fase 1:** Para el inicio de pagos, **Kafka** es preferible debido a su alta disponibilidad y capacidad de replay. Un pago iniciado es el evento raíz de toda la saga, y su pérdida es crítica. La capacidad de reprocesar este evento después de un fallo del sistema es esencial.

### 2.2 Fase 2: Verificación Antifraude (Antifraud Check)

**Kafka - Ventajas:**
- El evento de antifraude puede correlacionarse con el evento de inicio mediante el paymentId en la misma partición.
- Múlticrosumidores: Diferentes servicios pueden consumir el mismo evento (por ejemplo, logging + procesamiento).
- Escalabilidad horizontal: Más particiones permiten aumentar el throughput del servicio antifraude.

**SQS FIFO - Ventajas:**
- Para sistemas con volumen moderado, la garantía de orden reduce la complejidad de implementación.
- La integración con Lambda permite procesamiento serverless del servicio antifraude.
- Menor probabilidad de mensajes perdidos en comparación con configuración compleja de Kafka.

**Veredicto para Fase 2:** **SQS FIFO** es adecuado aquí si el volumen de transacciones es moderado (<1000 tps). La garantía automática de orden reduce la complejidad del código de correlación. Sin embargo, si el sistema espera picos de más de 3000 tps, **Kafka** con particionamiento por merchantId es preferible.

### 2.3 Fase 3: Evaluación de Riesgos (Risk Assessment)

**Kafka - Ventajas:**
- Los eventos de riesgo pueden procesarse de forma asíncrona sin bloquear el flujo principal.
- La retención permite análisis históricos de patrones de riesgo sin impacto en producción.
- Transformaciones de datos: Kafka Streams permite enriquecer eventos con datos adicionales en tiempo real.

**SQS FIFO - Ventajas:**
- Simplicidad de implementación para equipos menos experimentados en messaging distribuido.
- Integración directa con servicios de ML de AWS para scoring de riesgo.

**Veredicto para Fase 3:** **Kafka** es preferible para evaluación de riesgo por su capacidad de procesamiento de streams y retención. El servicio de riesgo puede beneficiarse de windowing operations (tumbling windows, sliding windows) para calcular métricas en tiempo real.

### 2.4 Fase 4: Autorización y Capture (Authorization & Capture)

**Kafka - Ventajas:**
- Necesidad de exactly-once semantics para evitar cobros duplicados.
- Integración con esquemas de транзакции distribuidas (Kafka Transactions API).
- Alta confiabilidad para operaciones financieras críticas.

**SQS FIFO - Ventajas:**
- Exactly-once disponible out-of-the-box.
- Menos probabilidad de errores de implementación que causen duplicación de cobros.

**Veredicto para Fase 4:** **SQS FIFO** es más seguro para autorización y capture. El riesgo de cobros duplicados en esta fase es inaceptable, y la característica de exactly-once de SQS FIFO reduce significativamente este riesgo. La menor throughput es aceptable porque esta fase es naturalmente secuencial.

### 2.5 Fase 5: Notificaciones y Reconciliación

**Kafka - Ventajas:**
- Múltiples consumidores pueden reaccionar a la notificación de completado (email, push, webhook).
- Retención permite reprocesar notificaciones fallidas.
- Kafka Connect facilita integración con sistemas de logging y auditoría.

**SQS FIFO - Ventajas:**
- DLQ (Dead Letter Queue) integrado para mensajes que fallan repetidamente.
- Configuración simple de retry con backoff.

**Veredicto para Fase 5:** **Kafka** es preferible para notificaciones debido a su modelo pub-sub que permite múltiples suscriptores independientes.

## 3. Análisis de Costos

### 3.1 Costos Operativos

**Kafka:**
- Infraestructura propia: Se requieren brokers dedicados o uso de Confluent Cloud.
- Expertise requerido: Equipo con experiencia en administración de Kafka.
- Monitoreo: Inversión en herramientas de observabilidad (Confluent Control Center, Prometheus, Grafana).
- Escalado: Agregar brokers requiere planificación y redistribución de particiones.

**SQS FIFO:**
- Costo por uso: Pricing basado en número de solicitudes API y datos transferidos.
- Sin servidor: AWS gestiona la infraestructura completamente.
- Escalado automático: AWS maneja el escalado transparéntemente.

### 3.2 Modelo de Precios Comparativo

Para un sistema con 1 millón de pagos diarios promedio (aproximadamente 12 tps continuo, con picos de 100 tps):

**Kafka (auto-gestionado):**
- 3 brokers m5.xlarge: ~$150/mes
- Storage (500GB): ~$50/mes
- Monitoreo: ~$50/mes
- **Total aproximado: $250-350/mes**

**Kafka (Confluent Cloud):**
- Plan estándar: ~$400/mes para el volumen descrito
- **Total aproximado: $400+/mes**

**SQS FIFO:**
- 1 millón de solicitudes API/mes: ~$0.40
- Data transfer: ~$10/mes
- **Total aproximado: $10-20/mes** (más económico para este volumen)

## 4. Consideraciones de Latencia

### 4.1 Latencia de Productor

**Kafka:**
- Latencia promedio producer → broker: 1-5ms (con acks=1)
- Latencia con acks=all y replicas=3: 10-30ms
- Configurable según trade-off entre durabilidad y latencia.

**SQS FIFO:**
- Latencia sendMessage: 10-50ms
- Latencia receiveMessage: 5-20ms
- Depende de la región y load del servicio.

### 4.2 Latencia de Consumidor

**Kafka:**
- Pull model permite batching: procesamiento de múltiples mensajes en una sola ronda.
- Latencia adicional por rebalanceo: 100ms-5s cuando se agregan consumidores.

**SQS FIFO:**
- Push model (con Lambda) o pull model (con SDK).
- Long polling: Hasta 20 segundos de espera para nuevos mensajes.
- No hay rebalanceo: Cada mensaje tiene un receipt handle único.

## 5. Tolerancia a Fallos

### 5.1 Escenarios de Fallo

**Escenario: Caída de Consumidor**

*Kafka:* El offsetCommit es automático o manual. Si el consumidor cae, al reiniciar continúa desde el último offset confirmado. Si usa exactly-once, debe guardar el offset en una transacción.

*SQS FIFO:* El mensaje vuelve a estar disponible después del visibility timeout (por defecto 30 segundos, máximo 12 horas). Si el consumidor no procesa y elimina el mensaje, vuelve a la cola.

**Escenario: Caída de Productor**

*Kafka:* Los mensajes en el buffer del producer se pierden. Para garantizar entrega, se debe configurar retries con backoff y usar un transactional producer.

*SQS FIFO:* El SDK de AWS tiene lógica de retry incorporada. Los mensajes se confirman solo después de recibir respuesta exitosa de SQS.

**Escenario: Partición de Red**

*Kafka:* Si la mayoría de réplicas no están disponibles, el topic deja de aceptar writes. Depende de la configuración de min.insync.replicas.

*SQS FIFO:* AWS garantiza disponibilidad dentro del SLA. En caso de outage regional, los mensajes pueden perderse si no hay cross-region replication configurada.

## 6. Recomendaciones de Arquitectura Híbrida

Basado en el análisis anterior, se recomienda una **arquitectura híbrida** que aproveche las fortalezas de cada tecnología:

1. **Inicio de Pago (Payment Initiation):** Kafka - Para garantizar persistencia y replay
2. **Verificación Antifraude:** SQS FIFO - Para garantía de orden y simplicidad
3. **Evaluación de Riesgo:** Kafka - Para procesamiento de streams y enrichment
4. **Autorización y Capture:** SQS FIFO - Para exactly-once y seguridad
5. **Notificaciones:** Kafka - Para modelo pub-sub con múltiples suscriptores

### 6.1 Bridging entre Sistemas

Para comunicar Kafka con SQS, se puede implementar un **Kafka Connect SQS Sink** que consuma de topics de Kafka y publique en colas SQS. Esto permite:
- Desacoplar productores de consumidores.
- Transformar mensajes entre formatos de esquema.
- Agregar lógica de enrutamiento basada en contenido del mensaje.

### 6.2 Consideraciones de Transaccionalidad

Almixclar ambos sistemas, es crítico implementar una **transacción distribuida** que garantice que los mensajes se publican en ambos sistemas o en ninguno. Esto puede lograrse mediante:
- Patrón outbox: Publicar en ambos sistemas desde una única transacción de base de datos.
- Saga orchestrator: Coordinar los pasos entre sistemas con compensaciones.
- Message tracking: Mantener un registro de mensajes publicados para auditoría y recovery.

## 7. Matriz de Decisión

| Criterio | Kafka | SQS FIFO | Recomendación |
|----------|-------|----------|---------------|
| Alto throughput (>10k tps) | ✓ | ✗ | Kafka |
| Exactly-once guarantee | △ (complejo) | ✓ | SQS FIFO |
| Orden estricto | △ (partición) | ✓ | SQS FIFO |
| Replay de mensajes | ✓ | ✗ | Kafka |
| Operaciones simples | ✗ | ✓ | SQS FIFO |
| Bajo costo | △ | ✓ | SQS FIFO |
| Múltiples suscriptores | ✓ | △ | Kafka |
| Integración AWS | ✗ | ✓ | SQS FIFO |
| Retención larga | ✓ | ✗ | Kafka |

## 8. Conclusión

La elección entre Kafka y SQS FIFO no es mutuamente excluyente. Un sistema de pagos maduro puede beneficiarse de ambos sistemas para diferentes fases del procesamiento. La recomendación final es:

- **Para el flujo principal de la saga** (inicio → antifraude → riesgo → autorización): Usar **SQS FIFO** por su simplicidad y garantías de exactamente-una-vez y orden.

- **Para auditoría, logging y notificaciones**: Usar **Kafka** por su modelo pub-sub y capacidad de retención.

- **Para procesamiento de streams en tiempo real** (detección de fraude en tiempo real, scoring de riesgo dinámico): Usar **Kafka Streams** sobre el cluster de Kafka.

Esta arquitectura híbrida maximiza las fortalezas de cada tecnología mientras minimiza sus debilidades en el contexto específico del procesamiento de pagos.


// === ARCHIVO: src/payments/domain/repositories/payment.repository.ts ===
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

// === ARCHIVO: src/payments/infrastructure/persistence/postgresql/payment.repository.ts ===
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

// === ARCHIVO: src/payments/application/sagas/payment.saga.ts ===
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PaymentInitiatedEventData } from '../events/payment-initiated.event';
import { PaymentAttributes, PaymentStatus } from '@payments/domain/entities/payment.entity';
import { PaymentDomainEventFactory } from '@payments/domain/events/payment-domain.event';
import { PaymentRepository } from '@payments/domain/repositories/payment.repository';

interface SagaState {
  sagaId: string;
  paymentId: string;
  currentStep: SagaStep;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  compensationActions: CompensationAction[];
  startedAt: Date;
  metadata: Record<string, unknown>;
}

enum SagaStep {
  INITIATED = 'INITIATED',
  ANTIFRAUD_CHECK = 'ANTIFRAUD_CHECK',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  AUTHORIZATION = 'AUTHORIZATION',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

interface CompensationAction {
  step: SagaStep;
  compensate: () => Promise<void>;
  compensating: boolean;
}

interface BackoffConfig {
  baseDelay: number;
  maxDelay: number;
  jitterFactor: number;
  maxRetries: number;
}

@Injectable()
export class PaymentSaga implements OnModuleInit {
  private readonly logger = new Logger(PaymentSaga.name);
  private readonly activeSagas: Map<string, SagaState> = new Map();
  private readonly backoffConfig: BackoffConfig = {
    baseDelay: 1000,
    maxDelay: 30000,
    jitterFactor: 0.3,
    maxRetries: 5,
  };

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  public onModuleInit(): void {
    this.logger.log('PaymentSaga initialized with exponential backoff and jitter');
  }

  @OnEvent('payment.initiated')
  public async handlePaymentInitiated(event: PaymentInitiatedEventData): Promise<void> {
    const sagaId = event.sagaId || `saga-${event.paymentId}-${Date.now()}`;
    this.logger.log(`Starting saga ${sagaId} for payment ${event.paymentId}`);

    const sagaState: SagaState = {
      sagaId,
      paymentId: event.paymentId,
      currentStep: SagaStep.INITIATED,
      retryCount: 0,
      maxRetries: this.backoffConfig.maxRetries,
      compensationActions: [],
      startedAt: new Date(),
      metadata: { correlationId: event.correlationId, ...event.metadata },
    };

    this.activeSagas.set(sagaId, sagaState);

    try {
      await this.executeAntifraudCheck(sagaState, event);
    } catch (error) {
      await this.handleSagaFailure(sagaState, error as Error);
    }
  }

  public async compensatePayment(paymentId: string, failureReason: string): Promise<void> {
    this.logger.log(`Compensating payment ${paymentId}: ${failureReason}`);
    
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.FAILED, failureReason);
    await this.paymentRepository.save(payment);

    const failedEvent = PaymentDomainEventFactory.createPaymentFailedEvent(
      payment,
      failureReason,
    );
    this.eventEmitter.emit('payment.failed', failedEvent);
  }

  public async retryWithBackoff(paymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found for retry`);
    }

    if (payment.retryCount >= this.backoffConfig.maxRetries) {
      throw new Error('Maximum retry attempts reached');
    }

    const delay = this.calculateBackoffWithJitter(payment.retryCount);
    this.logger.log(`Retrying payment ${paymentId} after ${delay}ms (attempt ${payment.retryCount + 1})`);

    payment.incrementRetry();
    await this.paymentRepository.save(payment);

    await new Promise(resolve => setTimeout(resolve, delay));

    await this.handlePaymentInitiated({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      senderAccountId: payment.senderAccountId,
      receiverAccountId: payment.receiverAccountId,
      idempotencyKey: payment.idempotencyKey,
      description: payment.description,
      metadata: payment.metadata,
      requestedBy: payment.requestedBy,
      timestamp: new Date(),
      correlationId: payment.id,
      sagaId: `saga-${payment.id}-retry`,
    });
  }

  public async handleAntifraudResult(event: { paymentId: string; approved: boolean; riskScore?: number; reason?: string }): Promise<void> {
    this.logger.log(`Handling antifraud result for payment ${event.paymentId}: approved=${event.approved}`);

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    if (event.approved) {
      payment.transitionTo(PaymentStatus.ANTIFRAUD_APPROVED, 'Antifraud check passed');
      await this.paymentRepository.save(payment);
      
      const riskEvent = PaymentDomainEventFactory.createPaymentRiskAssessedEvent(
        payment.toPlainObject(),
        'LOW',
        event.riskScore || 0.15,
      );
      this.eventEmitter.emit('payment.risk.assessed', riskEvent);
    } else {
      payment.transitionTo(PaymentStatus.FAILED, event.reason || 'Antifraud check failed');
      await this.paymentRepository.save(payment);
      
      const failedEvent = PaymentDomainEventFactory.createPaymentFailedEvent(
        payment,
        event.reason || 'Antifraud check failed',
      );
      this.eventEmitter.emit('payment.failed', failedEvent);
    }
  }

  public async handleRiskAssessment(event: { paymentId: string; riskLevel: string; score: number }): Promise<void> {
    this.logger.log(`Handling risk assessment for payment ${event.paymentId}: level=${event.riskLevel}, score=${event.score}`);

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    if (event.riskLevel === 'LOW' || event.score < 30) {
      payment.transitionTo(PaymentStatus.AUTHORIZED, 'Risk assessment passed - low risk');
      await this.paymentRepository.save(payment);
      
      const authEvent = PaymentDomainEventFactory.createPaymentAuthorizedEvent(
        payment.toPlainObject(),
        'AUTHORIZED',
        `AUTH_TOKEN_${Date.now()}`,
      );
      this.eventEmitter.emit('payment.authorized', authEvent);
    } else {
      payment.transitionTo(PaymentStatus.FAILED, `High risk: ${event.riskLevel} (score: ${event.score})`);
      await this.paymentRepository.save(payment);
      
      const failedEvent = PaymentDomainEventFactory.createPaymentFailedEvent(
        payment,
        `High risk: ${event.riskLevel}`,
      );
      this.eventEmitter.emit('payment.failed', failedEvent);
    }
  }

  public async handlePaymentCompletion(event: { paymentId: string; transactionId?: string }): Promise<void> {
    this.logger.log(`Handling payment completion for payment ${event.paymentId}`);

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.COMPLETED, 'Payment processed successfully');
    await this.paymentRepository.save(payment);
    
    const completedEvent = PaymentDomainEventFactory.createPaymentCompletedEvent(payment.toPlainObject());
    this.eventEmitter.emit('payment.completed', completedEvent);
  }

  private async executeAntifraudCheck(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing antifraud check for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.ANTIFRAUD_CHECK;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.ANTIFRAUD_CHECK,
      compensate: async () => {
        this.logger.warn(`Compensating antifraud check for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.FAILED, 'Antifraud check failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const antifraudEvent = PaymentDomainEventFactory.createPaymentAntifraudCheckedEvent(
      payment.toPlainObject(),
      true,
      'PASSED',
    );
    this.eventEmitter.emit('payment.antifraud.checked', antifraudEvent);

    await this.executeRiskAssessment(sagaState, event);
  }

  private async executeRiskAssessment(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing risk assessment for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.RISK_ASSESSMENT;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.RISK_ASSESSMENT,
      compensate: async () => {
        this.logger.warn(`Compensating risk assessment for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.FAILED, 'Risk assessment failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const riskEvent = PaymentDomainEventFactory.createPaymentRiskAssessedEvent(
      payment.toPlainObject(),
      'LOW',
      0.15,
    );
    this.eventEmitter.emit('payment.risk.assessed', riskEvent);

    await this.executeAuthorization(sagaState, event);
  }

  private async executeAuthorization(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Executing authorization for payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.AUTHORIZATION;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    sagaState.compensationActions.push({
      step: SagaStep.AUTHORIZATION,
      compensate: async () => {
        this.logger.warn(`Compensating authorization for payment ${event.paymentId}`);
        payment.transitionTo(PaymentStatus.CANCELLED, 'Authorization failed - compensation triggered');
        await this.paymentRepository.save(payment);
      },
      compensating: false,
    });

    const authEvent = PaymentDomainEventFactory.createPaymentAuthorizedEvent(
      payment.toPlainObject(),
      'AUTHORIZED',
      'AUTH_TOKEN_123',
    );
    this.eventEmitter.emit('payment.authorized', authEvent);

    await this.completePayment(sagaState, event);
  }

  private async completePayment(sagaState: SagaState, event: PaymentInitiatedEventData): Promise<void> {
    this.logger.log(`Saga ${sagaState.sagaId}: Completing payment ${event.paymentId}`);
    sagaState.currentStep = SagaStep.COMPLETED;

    const payment = await this.paymentRepository.findById(event.paymentId);
    if (!payment) {
      throw new Error(`Payment ${event.paymentId} not found`);
    }

    payment.transitionTo(PaymentStatus.COMPLETED, 'Payment processed successfully');
    await this.paymentRepository.save(payment);

    const completedEvent = PaymentDomainEventFactory.createPaymentCompletedEvent(payment.toPlainObject());
    this.eventEmitter.emit('payment.completed', completedEvent);

    this.logger.log(`Saga ${sagaState.sagaId} completed successfully for payment ${event.paymentId}`);
    this.activeSagas.delete(sagaState.sagaId);
  }

  private async handleSagaFailure(sagaState: SagaState, error: Error): Promise<void> {
    this.logger.error(`Saga ${sagaState.sagaId} failed: ${error.message}`, error.stack);
    sagaState.lastError = error.message;
    sagaState.currentStep = SagaStep.FAILED;

    if (sagaState.retryCount < sagaState.maxRetries) {
      const delay = this.calculateBackoffWithJitter(sagaState.retryCount);
      this.logger.log(`Saga ${sagaState.sagaId}: Retrying in ${delay}ms (attempt ${sagaState.retryCount + 1}/${sagaState.maxRetries})`);

      setTimeout(async () => {
        sagaState.retryCount++;
        try {
          await this.retryFromLastStep(sagaState);
        } catch (retryError) {
          await this.handleSagaFailure(sagaState, retryError as Error);
        }
      }, delay);
    } else {
      await this.executeCompensation(sagaState);
    }
  }

  private calculateBackoffWithJitter(retryCount: number): number {
    const exponentialDelay = this.backoffConfig.baseDelay * Math.pow(2, retryCount);
    const cappedDelay = Math.min(exponentialDelay, this.backoffConfig.maxDelay);
    const jitter = cappedDelay * this.backoffConfig.jitterFactor * Math.random();
    return Math.floor(cappedDelay + jitter);
  }

  private async retryFromLastStep(sagaState: SagaState): Promise<void> {
    const payment = await this.paymentRepository.findById(sagaState.paymentId);
    if (!payment) {
      throw new Error(`Payment ${sagaState.paymentId} not found for retry`);
    }

    switch (sagaState.currentStep) {
      case SagaStep.ANTIFRAUD_CHECK:
        await this.executeAntifraudCheck(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      case SagaStep.RISK_ASSESSMENT:
        await this.executeRiskAssessment(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      case SagaStep.AUTHORIZATION:
        await this.executeAuthorization(sagaState, {
          paymentId: sagaState.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          senderAccountId: payment.senderAccountId,
          receiverAccountId: payment.receiverAccountId,
          idempotencyKey: payment.idempotencyKey,
          description: payment.description,
          metadata: payment.metadata,
          requestedBy: payment.requestedBy,
          timestamp: new Date(),
          correlationId: sagaState.metadata.correlationId as string,
          sagaId: sagaState.sagaId,
        });
        break;
      default:
        throw new Error(`Cannot retry from step: ${sagaState.currentStep}`);
    }
  }

  private async executeCompensation(sagaState: SagaState): Promise<void> {
    this.logger.error(`Saga ${sagaState.sagaId}: Executing compensation for payment ${sagaState.paymentId}`);
    sagaState.currentStep = SagaStep.COMPENSATING;

    const reversedActions = [...sagaState.compensationActions].reverse();

    for (const action of reversedActions) {
      if (!action.compensating) {
        try {
          action.compensating = true;
          await action.compensate();
        } catch (compensateError) {
          this.logger.error(`Compensation failed for step ${action.step}: ${(compensateError as Error).message}`);
        }
      }
    }

    sagaState.currentStep = SagaStep.COMPENSATED;
    this.logger.warn(`Saga ${sagaState.sagaId} compensation completed for payment ${sagaState.paymentId}`);
    this.activeSagas.delete(sagaState.sagaId);
  }

  public getSagaState(sagaId: string): SagaState | undefined {
    return this.activeSagas.get(sagaId);
  }

  public getActiveSagasCount(): number {
    return this.activeSagas.size;
  }
}

```
