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