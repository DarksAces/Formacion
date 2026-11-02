# NovaByte Retail S.L. - Automatización y Control de Inventarios
**Módulo M3 · Programació d'Intel·ligència Artificial**  
**Resultado de Aprendizaje (RA1): Desarrollo de programas de inteligencia artificial**  
**Autor:** Daniel García Brun  

---

## 1. Problema Elegido
NovaByte Retail S.L. es una empresa de distribución de electrónica que opera cuatro almacenes logísticos (Barcelona, Madrid, Valencia y Sevilla). Cada semana recibe el inventario de estos centros para calcular los balances y programar las órdenes de reposición.

Hasta la fecha, la consolidación se realizaba de manera manual en hojas de cálculo, enfrentándose a graves deficiencias:
* **Heterogeneidad de formatos**: Coexistencia de archivos CSV y JSON procedentes de distintos sistemas de almacén.
* **Inconsistencias críticas de calidad de datos**: Registros incompletos, identificadores duplicados, tipos erróneos y valores numéricos negativos.
* **Valores atípicos (outliers) desorbitados**: Existencia de códigos de error con stocks de `99.999` unidades que disparaban ficticiamente la valoración del inventario de 100.000 € reales a más de 400 millones de euros, desvirtuando por completo las métricas operativas.

El objetivo del proyecto ha sido desarrollar un pipeline en Python modular, robusto y reutilizable que automatice la ingesta, validación, depuración y cálculo analítico de inventarios sin borrado ciego de información.

---

## 2. Datos Utilizados
El sistema procesa 3.000 registros repartidos en cuatro almacenes estratégicos:
* **`inventario_BCN.csv`** (750 registros): Almacén de Barcelona en formato CSV. Datos limpios con leves discrepancias de formato.
* **`inventario_MAD.csv`** (750 registros): Almacén de Madrid en formato CSV. Incluye errores de validación (precios y stocks negativos) y productos duplicados.
* **`inventario_VAL.json`** (750 registros): Almacén de Valencia en formato JSON. Estructura anidada con variaciones menores.
* **`inventario_SEV.json`** (750 registros): Almacén de Sevilla en formato JSON. Presenta campos ausentes, IDs vacíos y valores nulos.

Campos procesados por registro: `producto_id`, `nombre`, `categoria`, `proveedor`, `precio_unitario`, `stock_actual`, `stock_minimo`, `almacen`, `fecha_ultima_entrada`, `estado`.

---

## 3. Funcionamiento General del Programa
El flujo de ejecución sigue una arquitectura por capas desacoplada:

```
[Datos de entrada: CSV / JSON]
           │
           ▼
1. Ingesta y detección automática de formato (cargar_csv / cargar_json)
           │
           ▼
2. Normalización de tipos y trazabilidad (centro_origen, formato_origen)
           │
           ▼
3. Cálculo dinámico de umbrales IQR (Q1, Q3, 1.5×IQR, 3.0×IQR)
           │
           ▼
4. Validación y bifurcación de registros (validar_datos):
   ├── Dataset Procesable (operativo, limpio)
   └── Dataset de Cuarentena (anomalías + motivo_cuarentena)
           │
           ▼
5. Procesamiento analítico y reglas de negocio (procesar_datos):
   - Clasificación por estado de stock (Crítico, Reponer, Óptimo, Exceso)
   - Detección de productos bajo stock mínimo
   - Cálculo de valoración real y métricas financieras
   - Distribución por categorías y almacenes
           │
           ▼
6. Persistencia multiformato en 'resultados/' (guardar_resultados):
   - resultado.json (resumen global de KPIs)
   - inventario_procesable.csv / .json
   - inventario_cuarentena_outliers.csv / .json
```

---

## 4. Reglas de Validación
El motor de validación comprueba rigurosamente cada producto aplicando cinco filtros:
1. **Identificador del Producto (`producto_id`)**: Se comprueba que no sea nulo ni esté en blanco. Se analizan duplicados en todo el catálogo; cualquier ID repetido se marca como incidencia.
2. **Precio Unitario (`precio_unitario`)**: Conversión numérica segura. Se rechazan valores vacíos/nulos, precios negativos (`< 0 €`) y precios clasificados como outliers extremos mediante IQR.
3. **Existencias Actuales (`stock_actual`)**: Se descartan valores no numéricos, stocks negativos (`< 0 uds`) y registros con stock desorbitado que superen el umbral extremo de IQR (`> 201 uds`, como los códigos `99.999`).
4. **Stock Mínimo (`stock_minimo`)**: Verificación de coherencia (`>= 0`).
5. **Generación del Motivo de Aislamiento**: Cada registro rechazado concatena en el campo `motivo_cuarentena` todas las causas detectadas para facilitar la auditoría humana.

---

## 5. Decisiones Tomadas
* **Enfoque Estadístico IQR vs Constantes Fijas (*hardcoding*)**:  
  En lugar de programar reglas rígidas como `stock == 99999`, se utiliza el Rango Intercuartílico (`IQR = Q3 - Q1`). Esto hace que el pipeline sea **agnóstico a la empresa**: se adapta automáticamente a cualquier catálogo (tornillos con miles de unidades o maquinaria pesada con pocas unidades) sin alterar el código fuente.
* **Política de Cero Pérdida de Datos (Aislamiento en Cuarentena)**:  
  En entornos profesionales ningún dato erróneo se destruye a ciegas. Se optó por una segregación en dos datasets: el equipo de Compras opera con los datos limpios (`df_procesable`), mientras que el equipo de Control de Calidad y almacenes recibe el dataset de cuarentena (`df_cuarentena_outliers`) con su diagnóstico detallado para subsanar los errores en origen.
* **Modularidad Estricta**:  
  Toda la lógica de procesamiento reside en `funciones.py`, dejando `main.py` únicamente como orquestador del flujo y punto de entrada para el usuario.

---

## 6. Instrucciones para Ejecutar la Aplicación

### Requisitos Previos
* Python 3.10 o superior.
* Librería Pandas:
```bash
pip install pandas
```

### Opciones de Ejecución desde la Terminal

1. **Procesar todos los datasets combinados (recomendado):**
```bash
python main.py -t
```

2. **Procesar un archivo individual específico:**
```bash
python main.py -a datos/inventario_BCN.csv
# o bien:
python main.py -a datos/inventario_SEV.json
```

3. **Modo interactivo con menú por consola:**
```bash
python main.py
```

### Resultados Generados
Tras la ejecución, la carpeta `resultados/` contendrá:
* `resultado.json`: Resumen estadístico de ejecución (registros leídos, válidos, descartados, KPIs financieros y desglose de motivos).
* `inventario_procesable.csv` y `inventario_procesable.json`: Catálogo limpio para operaciones.
* `inventario_cuarentena_outliers.csv` y `inventario_cuarentena_outliers.json`: Archivo de auditoría con las incidencias documentadas.
