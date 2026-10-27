# ShopData | Material de datos | RA1 · M4

Este paquete contiene los datos necesarios para realizar la Práctica 3 del RA1.
El enunciado se publica por separado en Moodle.

## Archivos
- `warehouses.csv`: almacenes y características.
- `devices.csv`: catálogo actual de dispositivos y configuración.
- `events.csv`: flujo bruto de eventos observados, incluidos posibles reenvíos.
- `alerts.csv`: alertas registradas por la plataforma.
- `incidents.csv`: anotaciones del personal operativo e impacto empresarial.
- `DICCIONARIO_DATOS.md`: claves, columnas, relaciones y límites de interpretación.
- `MANIFEST.json`: listado y comprobación de integridad del paquete.

## Orden recomendado
1. Leer el enunciado publicado en Moodle.
2. Revisar `DICCIONARIO_DATOS.md`.
3. Abrir los cinco CSV con Pandas y comprobar claves, nulos, duplicados y cardinalidades.
4. Investigar la incidencia, la calidad de los datos y las latencias.
5. Dimensionar el escenario futuro y justificar la arquitectura propuesta.

## Alcance
Los CSV contienen una captura de dos horas del sistema actual con 500 dispositivos. No
representan directamente el escenario futuro de 30.000 dispositivos. Para dimensionarlo,
utiliza las hipótesis indicadas en el enunciado.

## Reproducibilidad
El notebook debe ejecutarse utilizando exclusivamente estos cinco CSV. No modifiques los
archivos manualmente: realiza y documenta mediante código cualquier transformación,
exclusión o deduplicación.

No se incluyen respuestas, indicadores precalculados, generadores ni soluciones docentes.
