# 🧠 Plan de Aprendizaje: KNN (K-Nearest Neighbors) Desde Cero
**Práctica · Programación de Inteligencia Artificial (RA1)**  
*Especialización en IA y Big Data*

---

## 🎯 Objetivo General
Implementar el algoritmo de clasificación **K-Nearest Neighbors (KNN)** desde cero utilizando exclusivamente la **biblioteca estándar de Python** (`csv`, `math`, `random`, `collections`), sin librerías externas de Machine Learning o manipulación de datos (`scikit-learn`, `numpy`, `pandas`).

El propósito es comprender a fondo los fundamentos matemáticos, la lógica interna de clasificación y la evaluación de modelos supervisados antes de recurrir a abstracciones de alto nivel.

---

## 📋 Checklist General de Fases y Tareas

- [x] **Fase 0: Fundamentos y Conceptos Clave**
  - [x] Comprender qué es el aprendizaje perezoso (*lazy learning* / basado en instancias).
  - [x] Entender la fórmula de la Distancia Euclídea en $n$ dimensiones.
  - [x] Entender el rol del hiperparámetro $k$ y el criterio de voto mayoritario.
  - [x] Comprender qué es una Matriz de Confusión y cómo se calcula el *Accuracy*.

- [x] **Fase 1: Ingesta y Preparación del Dataset (80/20)**
  - [x] Explorar el archivo [iris_extended.csv](file:///C:/Proyectos/bigdata-ai-m3/src/ra1/p3/ejercicio/iris_extended.csv) e identificar las columnas necesarias (`sepal_length`, `sepal_width`, `petal_length`, `petal_width` y `species`).
  - [x] Cargar los datos con el módulo estándar `csv`.
  - [x] Limpiar y convertir características a `float` y etiquetas a `str`.
  - [x] Barajar los datos con `random.shuffle` (usando una semilla para reproducibilidad).
  - [x] Dividir los datos en conjunto de entrenamiento ($80\%$) y conjunto de prueba ($20\%$).

- [x] **Fase 2: Construcción del Algoritmo KNN**
  - [x] Implementar `distancia_euclidea(a, b)` usando `math.sqrt`.
  - [x] Implementar `obtener_vecinos(X_train, y_train, muestra, k)` calculando distancias y seleccionando los $k$ más cercanos.
  - [x] Implementar `predecir_clase(vecinos)` resolviendo la moda con `collections.Counter` y gestionando empates.
  - [x] Implementar `knn_predecir(X_train, y_train, X_test, k)` para clasificar todo el conjunto de test.

- [x] **Fase 3: Métricas de Evaluación Propias**
  - [x] Implementar la función de cálculo de `accuracy(y_reales, y_predichas)`.
  - [x] Diseñar y calcular la **Matriz de Confusión** en Python puro (filas = reales, columnas = predichas).
  - [x] Visualizar la matriz en consola con un formato limpio y tabular.
  - [x] Evaluar el modelo base con $k = 5$.

- [x] **Fase 4: Experimentación y Análisis de $k$**
  - [x] Probar el clasificador para $k \in \{1, 3, 5, 9\}$.
  - [x] Comparar las métricas obtenidas para cada $k$.
  - [x] Interpretar el efecto de $k$: riesgo de sobreajuste (*overfitting*) con $k$ bajo vs. pérdida de resolución local con $k$ alto.

- [x] **Fase 5: Código Limpio y Memoria/Informe de Entrega**
  - [x] Refactorizar [main.py](file:///C:/Proyectos/bigdata-ai-m3/src/ra1/p3/ejercicio/main.py) con código auto-explicativo, docstrings y tipado.
  - [x] Redactar el informe de resultados (máximo 2 páginas) con explicación de funciones y análisis de dificultades.

---

## 🗺️ Desglose Detallado por Fases

### 🔹 Fase 0: Fundamentos y Conceptos
* **Intuición**: KNN es un algoritmo no paramétrico y supervisado. No genera un modelo explícito durante el entrenamiento; simplemente almacena los datos y calcula distancias cuando llega una muestra nueva.
* **Métrica de Distancia**: Para dos puntos $A = (a_1, \dots, a_n)$ y $B = (b_1, \dots, b_n)$:
  $$d(A, B) = \sqrt{\sum_{i=1}^n (a_i - b_i)^2}$$
* **Elección de $k$**: Determina cuántos vecinos cercanos votan la clase final. Un $k$ impar previene empates directos entre 2 clases.

---

### 🔹 Fase 1: Carga y Preparación de Datos (Train/Test Split)
* **Objetivo**: Extraer sólo las 4 características morfológicas principales:
  1. `sepal_length`
  2. `sepal_width`
  3. `petal_length`
  4. `petal_width`
  Junto con la variable objetivo `species`.
* **Proceso**:
  1. Lectura segura mediante `csv.DictReader` o `csv.reader`.
  2. Conversión de tipos de datos.
  3. Barajado aleatorio controlado (`random.seed(42)`).
  4. Partición $80/20$ manual preservando o verificando la distribución de clases.

---

### 🔹 Fase 2: Implementación de las Funciones Requeridas
* `distancia_euclidea(a, b)`:
  - Recibe dos listas o tuplas de números.
  - Devuelve la distancia escalar euclídea.
* `obtener_vecinos(X_train, y_train, muestra, k)`:
  - Para una muestra no vista, calcula la distancia con cada punto de `X_train`.
  - Ordena de menor a mayor distancia.
  - Retorna las etiquetas (o tuplas distancia-etiqueta) de los $k$ elementos más próximos.
* `predecir_clase(vecinos)`:
  - Cuenta la frecuencia de cada especie entre los $k$ vecinos.
  - Selecciona la clase más común.
* `knn_predecir(X_train, y_train, X_test, k)`:
  - Itera sobre cada muestra de `X_test` y genera la lista de predicciones.

---

### 🔹 Fase 3: Evaluación y Matriz de Confusión
* **Accuracy**:
  $$\text{Accuracy} = \frac{\text{Número de Aciertos}}{\text{Total de Muestras}}$$
* **Matriz de Confusión**:
  - Matriz de tamaño $C \times C$ (donde $C$ es el número de especies: setosa, versicolor, virginica).
  - Cada celda $[i][j]$ representa cuántas flores de la especie real $i$ fueron clasificadas como especie $j$.

---

### 🔹 Fase 4: Experimentación con $k$
* Comparar $k=1, 3, 5, 9$.
* Documentar:
  - ¿Qué ocurre en las fronteras de decisión con $k=1$?
  - ¿Qué ocurre cuando $k$ aumenta?
  - ¿Cómo afecta la presencia de ruido o muestras atípicas?

---

### 🔹 Fase 5: Memoria Técnica (Informe)
* Estructura del informe (máximo 2 páginas):
  1. Introducción y descripción del algoritmo.
  2. Explicación técnica de las funciones implementadas.
  3. Tabla comparativa de resultados con diferentes valores de $k$ y matriz de confusión para $k=5$.
  4. Dificultades encontradas (ej. gestión de empates, escalado de variables, coste computacional $O(N)$).
