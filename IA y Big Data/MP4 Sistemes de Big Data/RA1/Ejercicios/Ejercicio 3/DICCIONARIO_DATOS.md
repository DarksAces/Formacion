# Diccionario de datos y relaciones — ShopData

**Todas las fechas tienen formato ISO 8601 en UTC (`Z`).** Puede haber datos sin normalizar porque el objetivo es investigarlos. Los números usan punto decimal; celdas vacías son datos ausentes.

## Esquema lógico

```text
warehouses 1 ─── N devices 1 ─── N events 1 ─── N alerts
     │                        │
     └───── N incidents       └─ warehouse_id del evento: declaración de origen, contrastar
```

Las cardinalidades son **esperadas por negocio**, no garantías de integridad de los archivos brutos. Un reenvío puede repetir `event_id`; una alerta puede faltar, repetirse o no apuntar a un evento conocido. No combines `events` con `alerts` sin comprobar cardinalidades: podrías duplicar métricas. `device_id` debería identificar un dispositivo del maestro; usa `devices.warehouse_id` como asignación oficial vigente en esta captura y compara con `events.warehouse_id`. `zone_id` se almacena en `devices` y en anotaciones `incidents`.

## warehouses.csv
| Campo | Significado |
|---|---|
| warehouse_id | PK esperada del almacén, formato `WH-XX` |
| name | Nombre interno ficticio |
| region | Región operativa |
| operation | Tipo de instalación |
| max_temperature_c | Temperatura orientativa del edificio; **no** umbral de cada sensor |
| cold_chain | 1 si trabaja con cadena de frío |
| active_from | Fecha de alta |

## devices.csv
| Campo | Significado |
|---|---|
| device_id | PK del maestro |
| warehouse_id | FK esperada hacia warehouses |
| zone_id | Zona física del dispositivo |
| sensor_type | temperature, humidity, power, door o vibration |
| expected_unit | Unidad configurada esperada (`C`, `%`, `kW`, `bool`, `mm/s`) |
| valid_min / valid_max | Límites físicamente admisibles para el tipo de sensor, en expected_unit |
| alert_low / alert_high | Umbrales de alarma **por dispositivo**, en expected_unit; activar si valor < alert_low o > alert_high |
| sampling_interval_s | Cadencia configurada del sensor; la captura muestra 10 s |
| firmware_version | Versión declarada |
| installed_at | Fecha de instalación |
| criticality | Prioridad operativa orientativa |

## events.csv
| Campo | Significado |
|---|---|
| event_id | Identificador lógico, supuestamente único; comprobar reenvíos y conflictos |
| timestamp | Momento declarado de generación del evento por el dispositivo |
| received_at | Momento en que llega a la plataforma |
| device_id | FK esperada hacia devices |
| warehouse_id | Almacén declarado por el emisor, contrastar con el maestro |
| event_type | Tipo de medida; debe coincidir con sensor_type |
| value | Lectura; puede requerir transformación o ser inválida |
| unit | Unidad observada; `F` (Fahrenheit) y `W` pueden convertirse a `C` y `kW` si se justifica |
| status | Estado declarado: NORMAL, WARNING, CRITICAL; debe auditarse, no asumirse infalible |

Valores canónicos orientativos: temperatura °C, humedad %, potencia kW, puerta bool 0/1, vibración mm/s. El CSV usa el literal `C` para °C. `status=CRITICAL` es la señal reportada a partir de la cual el sistema **intenta** generar alerta. También debes evaluar si el estado concuerda con los umbrales del maestro. Para comparar lecturas y umbrales, primero normaliza las unidades válidas; una unidad desconocida debe quedar como caso no interpretable, no forzarse a cero.

## alerts.csv
| Campo | Significado |
|---|---|
| alert_id | PK declarada de registro de alerta |
| event_id | FK esperada al evento lógico que activa la alerta |
| processed_at | Momento en el que finaliza el procesamiento de alerta |
| notified_at | Momento de notificación; vacío cuando no existe confirmación de envío |
| channel | EMAIL o SMS |
| alert_status | SENT o FAILED |

Una alerta puede aparecer repetida por reintentos. No confundas **alerta ausente** con **alerta presente sin notificación**. La latencia de extremo a extremo solo se calcula si existen tiempos válidos y enlazables. Para un evento con varias alertas, documenta si seleccionas primera notificación válida y por qué.

## incidents.csv
| Campo | Significado |
|---|---|
| incident_id | PK de la anotación operativa |
| warehouse_id / zone_id | Instalación y zona según personal |
| opened_at / closed_at | Apertura y cierre administrativo de la incidencia |
| severity | Prioridad declarada por operación |
| reported_by | Equipo informante |
| description | Observación humana, no diagnóstico técnico demostrado |
| business_impact | Impacto reportado; puede incluir estimaciones |

## Pistas metodológicas, no soluciones
- Contrasta fuentes antes de concluir: una nota humana y un registro de telemetría miden aspectos distintos.
- No hagas `merge` 1:N sin comprobar si duplicará eventos.
- Cuidado con la calidad de los relojes: una latencia negativa no demuestra entrega instantánea.
- Distingue promedio, p95, p99 y proporción que cumple el requisito de 10 segundos.
- Si un dato no permite afirmar causalidad, preséntalo como asociación o hipótesis.
