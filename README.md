# Implementación de arquitectura event-driven con outbox pattern y saga distribuida

En el contexto de una plataforma de procesamiento de pagos en una entidad financiera, se requiere implementar una arquitectura event-driven utilizando el outbox pattern y una saga distribuida para garantizar la consistencia eventual en un sistema distribuido. El sistema debe manejar flujos de eventos desde el originador de pagos, el motor antifraude y el buró de riesgos, asegurando la idempotencia de las solicitudes y manejando adecuadamente la backpressure. Se deben comparar las ventajas y desventajas de Kafka y SQS FIFO en diferentes fases del proceso. Además, se debe implementar un mecanismo de compensaciones en la saga para manejar errores y reintentos con backoff exponencial y jitter, evitando el thundering herd.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | arquitectura event-driven con outbox pattern y saga distribuida |
| **Nivel** | senior-l3 |
| **Tipo** | practical |
| **Tiempo estimado** | 4 semanas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y generará un ZIP listo para usar.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y generará un archivo ZIP descargable. Descárgalo y extráelo en la carpeta donde quieras trabajar.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no genera el ZIP automáticamente al terminar el análisis, escríbele: "genera el ZIP ahora".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Exploración del sistema y definición de restricciones

**Objetivo:** Identificar y documentar las restricciones y ambigüedades del sistema existente.

**Tiempo estimado:** 1 semana

**Instrucciones:**

- Analiza el sistema de procesamiento de pagos y enumera las restricciones operativas y de consistencia.
- Identifica ambigüedades en las reglas de negocio y propone aclaraciones necesarias.

**Entregable:** Documento que describe las restricciones y ambigüedades identificadas.

<details>
<summary>Pistas de conocimiento</summary>

- Considera los flujos de eventos desde el originador de pagos, el motor antifraude y el buró de riesgos.
- Evalúa la necesidad de idempotencia en las solicitudes de pago.

</details>

### Fase 2: Comparación de Kafka y SQS FIFO

**Objetivo:** Comparar las ventajas y desventajas de Kafka y SQS FIFO en el contexto del sistema de procesamiento de pagos.

**Tiempo estimado:** 1 semana

**Instrucciones:**

- Realiza una comparación detallada de Kafka y SQS FIFO en al menos 4 fases del proceso de pagos.
- Documenta las pros y contras de cada opción en términos de consistencia, latencia, escalabilidad y costo.

**Entregable:** Documento que compara Kafka y SQS FIFO en diferentes fases del proceso de pagos.

<details>
<summary>Pistas de conocimiento</summary>

- Considera la consistencia eventual, la backpressure y la idempotencia en tu comparación.
- Evalúa el impacto de cada opción en la arquitectura del sistema.

</details>

### Fase 3: Implementación del outbox pattern

**Objetivo:** Implementar el outbox pattern para garantizar la consistencia eventual en el sistema de procesamiento de pagos.

**Tiempo estimado:** 1 semana

**Instrucciones:**

- Diseña e implementa el outbox pattern en el sistema de procesamiento de pagos.
- Asegura que el pattern maneje adecuadamente la idempotencia y la backpressure.

**Entregable:** Implementación del outbox pattern en el sistema de procesamiento de pagos.

<details>
<summary>Pistas de conocimiento</summary>

- Considera el uso de una tabla en DynamoDB para almacenar los eventos del outbox.
- Evalúa diferentes estrategias para manejar la backpressure y la idempotencia.

</details>

### Fase 4: Implementación de la saga distribuida

**Objetivo:** Implementar una saga distribuida para manejar compensaciones y reintentos en el sistema de procesamiento de pagos.

**Tiempo estimado:** 1 semana

**Instrucciones:**

- Diseña e implementa una saga distribuida que maneje compensaciones y reintentos con backoff exponencial y jitter.
- Asegura que la saga evite el thundering herd y maneje adecuadamente los errores.

**Entregable:** Implementación de la saga distribuida en el sistema de procesamiento de pagos.

<details>
<summary>Pistas de conocimiento</summary>

- Considera el uso de un servicio de orquestación para coordinar la saga.
- Evalúa diferentes estrategias para manejar los reintentos y las compensaciones.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es el outbox pattern y cómo se aplica en el sistema de procesamiento de pagos?
- **paraQueSirve**: ¿Para qué sirve la saga distribuida en el contexto del sistema de procesamiento de pagos?
- **comoSeUsa**: ¿Cómo se usa el outbox pattern para garantizar la consistencia eventual en el sistema?
- **erroresComunes**: ¿Cuáles son los errores comunes al implementar el outbox pattern y la saga distribuida?
- **queDecisionesImplica**: ¿Qué decisiones arquitectónicas implica la elección entre Kafka y SQS FIFO en el sistema de procesamiento de pagos?

## Criterios de Evaluacion

- Identificación y documentación de restricciones y ambigüedades del sistema.
- Comparación detallada de Kafka y SQS FIFO en diferentes fases del proceso de pagos.
- Implementación del outbox pattern que garantice la consistencia eventual y maneje adecuadamente la idempotencia y la backpressure.
- Implementación de la saga distribuida que maneje compensaciones y reintentos con backoff exponencial y jitter, evitando el thundering herd.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT). Devuelve un ZIP con el proyecto. Sirve si no tenes un agente en el IDE.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
el comando de build o arranque canonico del stack elegido
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
