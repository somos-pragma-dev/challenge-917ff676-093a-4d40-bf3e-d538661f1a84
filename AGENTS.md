# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Implementación de arquitectura event-driven con outbox pattern y saga distribuida**.

| | |
|---|---|
| Tema | arquitectura event-driven con outbox pattern y saga distribuida |
| Nivel | senior-l3 |
| Chapter | Generico |
| Especialidad | Inferido del contexto |
| Stack | TypeScript 5.5 / NestJS 10.4 |
| Patron arquitectonico | event-driven con microservicios reactivos, outbox pattern y saga orquestada (CQRS + Event Sourcing parcial) |
| Tiempo estimado | 4 semanas |

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Corre `el comando de build o arranque canonico del stack elegido` y mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `el comando de build o arranque canonico del stack elegido` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Exploración del sistema y definición de restricciones**: Documento que describe las restricciones y ambigüedades identificadas.
- **Fase 2 — Comparación de Kafka y SQS FIFO**: Documento que compara Kafka y SQS FIFO en diferentes fases del proceso de pagos.
- **Fase 3 — Implementación del outbox pattern**: Implementación del outbox pattern en el sistema de procesamiento de pagos.
- **Fase 4 — Implementación de la saga distribuida**: Implementación de la saga distribuida en el sistema de procesamiento de pagos.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Lo que falta y tenes que completar

### 1. Archivos que la arquitectura declara (1 de 32)

La propuesta arquitectonica del reto los lista y no llegaron al repo. Crealos con implementacion real, respetando la capa en la que viven:

- [ ] `docs/restricciones-sistema.md`

### 2. Referencias colgando (7)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `src/payments/application/sagas/payment.saga.ts` — `CompensationAction.push`
      Se invoca `push` sobre `CompensationAction`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `test/payments/payment-outbox.repository.spec.ts` — `PaymentOutboxRepository.findByEventType`
      Se invoca `findByEventType` sobre `PaymentOutboxRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `test/payments/payment-outbox.repository.spec.ts` — `PaymentOutboxRepository.deleteOldEvents`
      Se invoca `deleteOldEvents` sobre `PaymentOutboxRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `test/payments/payment.repository.spec.ts` — `PaymentRepository.updateStatus`
      Se invoca `updateStatus` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `test/payments/payment.repository.spec.ts` — `PaymentRepository.findByStatus`
      Se invoca `findByStatus` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `test/payments/payment.repository.spec.ts` — `PaymentRepository.findByCustomerId`
      Se invoca `findByCustomerId` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `test/payments/payment.repository.spec.ts` — `PaymentRepository.transaction`
      Se invoca `transaction` sobre `PaymentRepository`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

### Presentes (31)

- `tsconfig.json`
- `src/main.ts`
- `package.json`
- `src/common/dto/payment-request.dto.ts`
- `src/payments/domain/entities/payment.entity.ts`
- `src/payments/domain/events/payment-domain.event.ts`
- `src/payments/domain/repositories/payment.repository.ts`
- `src/payments/infrastructure/persistence/dynamodb/payment-outbox.repository.ts`
- `src/payments/infrastructure/persistence/postgresql/payment.repository.ts`
- `src/payments/application/commands/initiate-payment.command.ts`
- `src/payments/application/events/payment-initiated.event.ts`
- `src/payments/application/sagas/payment.saga.ts`
- `src/payments/infrastructure/controllers/payments.controller.ts`
- `src/payments/infrastructure/messaging/kafka/kafka-payment-producer.service.ts`
- `src/payments/infrastructure/messaging/kafka/kafka-payment-consumer.service.ts`
- `src/payments/infrastructure/messaging/sqs/sqs-payment-producer.service.ts`
- `src/payments/infrastructure/messaging/sqs/sqs-payment-consumer.service.ts`
- `src/app.module.ts`
- `src/common/exceptions/idempotency-exception.ts`
- `src/common/utils/backoff-util.ts`
- `src/common/aws-config.ts`
- `src/common/aws-iam-policy.json`
- `src/antifraud/application/events/fraud-check-requested.event.ts`
- `src/antifraud/infrastructure/messaging/kafka/kafka-fraud-consumer.service.ts`
- `src/risk/application/events/risk-check-requested.event.ts`
- `src/risk/infrastructure/messaging/kafka/kafka-risk-consumer.service.ts`
- `test/payments/payment.saga.spec.ts`
- `test/payments/payment-outbox.repository.spec.ts`
- `test/payments/payment.repository.spec.ts`
- `test/integration/payment-flow.spec.ts`
- `docs/comparacion-kafka-sqs.md`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `src/`
- `src/common/`
- `src/common/dto/`
- `src/common/exceptions/`
- `src/common/interfaces/`
- `src/common/utils/`
- `src/payments/`
- `src/payments/application/`
- `src/payments/application/commands/`
- `src/payments/application/events/`
- `src/payments/application/queries/`
- `src/payments/application/sagas/`
- `src/payments/domain/`
- `src/payments/domain/entities/`
- `src/payments/domain/events/`
- `src/payments/domain/repositories/`
- `src/payments/domain/services/`
- `src/payments/infrastructure/`
- `src/payments/infrastructure/controllers/`
- `src/payments/infrastructure/messaging/`
- `src/payments/infrastructure/messaging/kafka/`
- `src/payments/infrastructure/messaging/sqs/`
- `src/payments/infrastructure/persistence/`
- `src/payments/infrastructure/persistence/dynamodb/`
- `src/payments/infrastructure/persistence/postgresql/`
- `src/antifraud/`
- `src/antifraud/application/`
- `src/antifraud/application/events/`
- `src/antifraud/domain/`
- `src/antifraud/domain/entities/`
- `src/antifraud/domain/services/`
- `src/antifraud/infrastructure/`
- `src/antifraud/infrastructure/messaging/`
- `src/antifraud/infrastructure/persistence/`
- `src/risk/`
- `src/risk/application/`
- `src/risk/application/events/`
- `src/risk/domain/`
- `src/risk/domain/entities/`
- `src/risk/domain/services/`
- `src/risk/infrastructure/`
- `src/risk/infrastructure/messaging/`
- `src/risk/infrastructure/persistence/`
- `test/`
- `test/payments/`
- `test/antifraud/`
- `test/risk/`
- `test/integration/`
- `docs/`

## Verificacion

```bash
el comando de build o arranque canonico del stack elegido
```

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- El patron es **event-driven con microservicios reactivos, outbox pattern y saga orquestada (CQRS + Event Sourcing parcial)**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Brecha que el reto ataca: Ingeniero SeniorL3 con 8+ años en backend distribuido. Stack: TypeScript, Node.js 22, Kafka, SQS FIFO, DynamoDB, PostgreSQL. Debe justificar consistencia eventual, backpressure, idempotencia, exactly-once vs at-least-once. Comparar Kafka vs SQS FIFO en al menos 4 fases del reto. Incluir manejo de compensaciones en la saga, retries con backoff exponencial + jitter, y cómo evitar thundering herd. El reto debe forzar decisiones no triviales.

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*
