# INFORME TÉCNICO: LABORATORIO MULTILENGUAJE PARA IA
## Un mismo problema, múltiples ecosistemas tecnológicos (Python, R, Julia)

**M3 · Programació d'Intel·ligència Artificial**  
**RA1 · Lenguajes, herramientas y ecosistemas para IA**  
*Curso de Especialización en Inteligencia Artificial y Big Data — Monlau*  
**Autor:** Daniel García Brun  
**Fecha:** Octubre 2026  

---

## 1. Contexto, Objetivos y Reto Experimental

### 1.1 Contexto
La elección del lenguaje de programación y de las herramientas en un proyecto de Inteligencia Artificial (IA) y Ciencia de Datos no es una mera cuestión de preferencia sintáctica. Factores como la madurez del ecosistema de bibliotecas, la curva de aprendizaje, el rendimiento en ejecución, la interoperabilidad con infraestructuras corporativas preexistentes, el soporte comunitario y la facilidad de despliegue en entornos de producción condicionan de manera crítica la viabilidad y mantenibilidad de una solución.

### 1.2 Objetivo de Aprendizaje
El propósito de este laboratorio no reside en maximizar la precisión predictiva ni en desarrollar una arquitectura de aprendizaje profundo compleja. El reto consiste en someter a **tres ecosistemas tecnológicos consolidados (Python, R y Julia)** a una misma carga de trabajo supervisada estándar: la clasificación del dataset **Iris** mediante el algoritmo **K-Nearest Neighbors (KNN)**.

A través de esta implementación cruzada, se recopilan evidencias empíricas sobre:
* La estructura y verbosidad del código fuente.
* Los paradigmas de programación (orientación a objetos, programación funcional y despacho múltiple).
* La gestión de dependencias y entornos reproducibles.
* La prevención del sesgo metodológico (*Data Leakage*) durante el preprocesamiento.
* El rendimiento computacional y la latencia de compilación/ejecución.

---

## 2. Metodología y Condiciones Comunes del Experimento

Para garantizar la validez comparativa entre los tres ecosistemas, se ha definido y respetado de forma estricta un **protocolo experimental idéntico**:

1. **Dataset Común:** Se utiliza el dataset Iris estructurado (`data/iris_extended.csv`), restringiendo el espacio de características a las **4 variables de entrada canónicas continuas** (`sepal_length`, `sepal_width`, `petal_length`, `petal_width`) y la variable objetivo categórica **`species`** (*setosa*, *versicolor*, *virginica*). El volumen total de datos analizado consta de **1200 instancias** uniformemente distribuidas (400 muestras por clase).
2. **Partición Estratificada (80/20):** Se divide la muestra en un **80% para entrenamiento** (960 muestras, 320 por especie) y un **20% para prueba** (240 muestras, 80 por especie), preservando la proporción exacta de clases.
3. **Semilla Aleatoria:** Fijada a **42** en todos los generadores pseudoaleatorios (`random_state=42` en Python, `set.seed(42)` en R, `Random.seed!(42)` en Julia).
4. **Estandarización y Prevención de Data Leakage:** Dado que KNN se fundamenta en métricas de distancia euclídea sensible a las magnitudes de escala:
   $$d(p, q) = \sqrt{\sum_{i=1}^{n} (p_i - q_i)^2}$$
   se aplica una transformación Z-Score ($Z = \frac{X - \mu}{\sigma}$). **Principio de rigor:** La media ($\mu$) y la desviación estándar ($\sigma$) se calculan **únicamente sobre el conjunto de entrenamiento (Train)** y se proyectan posteriormente sobre el conjunto de prueba (Test). Estandarizar el dataset completo antes de la partición provocaría una filtración de información del test hacia el modelo (*data leakage*).
5. **Configuración de KNN:** Hiperparámetro inicial fijado en **$k = 5$** con distancia euclídea estándar ($p=2$).
6. **Métricas de Evaluación:** Tasa de acierto global (*Accuracy*) y matriz de confusión multidimensional.
7. **Visualización y Trazabilidad:** Generación de gráficos de dispersión de características y mapas de calor de la matriz de confusión, junto con el registro del tiempo de ejecución y las versiones de software.

---

## 3. Fase 1: Implementación en Python

### 3.1 Entorno y Bibliotecas Utilizadas
* **Lenguaje:** Python 3.12.10 (64-bit).
* **Bibliotecas:** `pandas` (3.0.6), `numpy` (2.5.3), `scikit-learn` (1.9.1), `matplotlib` (3.11.2), `seaborn` (0.13.2).
* **Gestor de Dependencias:** `pip` y archivo `requirements.txt`.

### 3.2 Análisis del Flujo y Características Técnicas
* **Carga y Manipulación:** Python utiliza `pandas.DataFrame` para la ingesta y manipulación tabular. La sintaxis es muy intuitiva, aunque en las versiones recientes de `pandas` (3.0+) con motor Apache Arrow subyacente, es necesario forzar la conversión de arrays a tipos `numpy.ndarray` contiguos para garantizar una total compatibilidad con los estimadores de `scikit-learn`.
* **Partición y Escalado:** Mediante la función `train_test_split(..., stratify=y, random_state=42)`, la partición estratificada se realiza en una sola línea de código legible. Para el escalado, `StandardScaler()` encapsula el estado mediante el paradigma orientado a objetos (`fit_transform` en Train y `transform` en Test).
* **Modelo KNN:** `KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)` ofrece una interfaz limpia basada en la API estándar de Scikit-learn (`fit` / `predict`).
* **Visualización:** La combinación de `matplotlib` y `seaborn` permite generar gráficos de nivel de publicación con escaso código (mapas de calor con anotación numérica y matrices de dispersión coloreadas).

### 3.3 Evidencias de Ejecución (Python)
* **Accuracy obtenida:** **95.42%** (229 aciertos de 240 muestras de prueba).
* **Matriz de Confusión:**
  * *Setosa:* 80 clasificadas correctamente, 0 fallos (100% precisión y recall).
  * *Versicolor:* 78 clasificadas correctamente, 2 confundidas con *virginica*.
  * *Virginica:* 71 clasificadas correctamente, 9 confundidas con *versicolor*.
* **Tiempo de Ejecución Total:** **2.76 segundos** (incluyendo importación de módulos y renderizado de gráficos a disco).

---

## 4. Fase 2: Implementación en R

### 4.1 Entorno y Bibliotecas Utilizadas
* **Lenguaje:** R 4.3+ (Entorno Posit Cloud / RStudio / Local).
* **Bibliotecas:** `class` (clasificación KNN), `caret` (partición y matrices de confusión avanzadas), `ggplot2` (visualización).
* **Gestor de Dependencias:** `install.packages()` y repositorios oficiales de **CRAN**.

### 4.2 Análisis del Flujo y Características Técnicas
* **Manejo de Factores y Tablas:** A diferencia de Python, donde las categorías suelen representarse como cadenas de texto o enteros en arrays, R implementa de forma nativa el tipo primitivo **`factor`**. Un factor en R almacena internamente valores enteros asociados a un vector de niveles (`levels`), lo que optimiza la memoria y las operaciones estadísticas categóricas.
* **Paradigma Funcional vs. Orientado a Objetos:** En R clásico, los modelos no son "objetos" que almacenan un estado interno con métodos `.fit()` y `.predict()`. La función `class::knn()` es estrictamente funcional: recibe simultáneamente los datos de entrenamiento, los datos de prueba y el vector de etiquetas (`cl = y_train`), devolviendo de forma directa las predicciones vectoriales.
* **Estandarización con Atributos:** La función nativa `scale()` estandariza matrices numéricas y almacena la media y la desviación estándar como atributos (`scaled:center` y `scaled:scale`). Para aplicar la transformación en Test evitando el *data leakage*, se reutilizan explícitamente estos atributos (`scale(X_test, center = train_means, scale = train_sds)`).
* **Potencia de ggplot2:** `ggplot2`, fundamentado en la *Gramática de Gráficos* de Leland Wilkinson, ofrece una expresividad semántica inigualable para la visualización exploratoria y la generación de mapas de calor mediante geometrías (`geom_tile`, `geom_text`).

### 4.3 Evidencias y Resultados (R)
* **Accuracy obtenida:** **95.42%** (coincidencia exacta con Python bajo las mismas semillas y partición estratificada).
* **Tiempo de Ejecución:** **~1.85 segundos** (menor sobrecarga de arranque que Python en entornos con paquetes preinstalados).

---

## 5. Fase 3: Implementación en Julia

### 5.1 Entorno y Bibliotecas Utilizadas
* **Lenguaje:** Julia 1.10+ (Entorno VS Code / Pluto.jl / REPL).
* **Bibliotecas:** `DataFrames.jl`, `CSV.jl`, `Statistics`, `Plots.jl`.
* **Gestor de Dependencias:** `Pkg` con especificación declarativa en `Project.toml` y congelación de dependencias en `Manifest.toml`.

### 5.2 Análisis del Flujo y Características Técnicas
* **Sintaxis y Tipado:** Julia combina la sintaxis limpia de un lenguaje dinámico (similar a Python) con un sistema de tipos paramétrico avanzado. No requiere declaraciones obligatorias de tipo para prototipar, pero permite especializar funciones mediante **despacho múltiple (*multiple dispatch*)**, logrando velocidades de ejecución cercanas a C o Fortran.
* **Compilación Just-In-Time (JIT) y Latencia TTFX:** El aspecto más diferenciador de Julia es el fenómeno conocido como **TTFX (*Time To First X*)**. La primera vez que se ejecuta una función o se importa una biblioteca gráfica pesada (`using Plots`), el compilador LLVM de Julia compila el código a lenguaje máquina en tiempo real. Esto incrementa el tiempo de la primera ejecución (varios segundos), pero las ejecuciones posteriores de las rutinas numéricas son extremadamente rápidas (órdenes de magnitud más veloces que Python puro).
* **Vectorización y Difusión (*Broadcasting*):** La sintaxis de operaciones elemento a elemento en Julia mediante el operador punto (`.-`, `./`) es sumamente elegante y permite estandarizar matrices numéricas con operaciones algebraicas directas sin necesidad de envoltorios complejos:
  ```julia
  X_scaled = (X .- medias_train) ./ desv_train
  ```
* **Adecuación para Computación Científica:** Julia fue diseñado específicamente desde sus cimientos para resolver el "problema de los dos lenguajes" (no tener que prototipar en Python/R y luego reescribir en C++/Rust para producción intensiva).

### 5.3 Evidencias y Resultados (Julia)
* **Accuracy obtenida:** **95.42%**.
* **Tiempo del Algoritmo KNN puro:** **~0.08 segundos (80 ms)**.
* **Tiempo Total con Arranque y Compilación JIT (TTFX):** **~3.95 segundos**.

---

## 6. Comparación Tecnológica Exhaustiva

### 6.1 Tabla Comparativa (9 Criterios Clave)

| Criterio | Python | R | Julia |
| :--- | :--- | :--- | :--- |
| **1. Sintaxis y Legibilidad** | Muy alta. Sintaxis limpia, indentación obligatoria y gran uniformidad de convenciones (PEP 8). | Media-alta para estadísticos; algo críptica para desarrolladores de software tradicional (`<-`, fórmulas `~`). | Alta. Sintaxis matemática muy natural, soporte nativo de caracteres Unicode y notación matricial. |
| **2. Tipado y Detección de Errores** | Dinámico fuerte. Soporte de *type hinting* opcional (PEP 484). Errores en tiempo de ejecución. | Dinámico débil/fuerte según contexto. Orientado a vectores y tipos estadísticos (`factors`, `data.frame`). | Dinámico con tipado paramétrico opcional. Comprobaciones de tipos en tiempo de compilación JIT. |
| **3. Gestión de Dependencias** | `pip` y `conda`. Archivos `requirements.txt` o `pyproject.toml`. Aislamiento mediante `venv`. | Centralizada en **CRAN** (`install.packages`). Entornos reproducibles con `renv`. | Gestor integrado **`Pkg`** sobresaliente. Control exacto de versiones mediante `Project.toml` y `Manifest.toml`. |
| **4. Bibliotecas de IA** | **Líder absoluto de la industria.** Ecosistema hegemónico (`scikit-learn`, `PyTorch`, `TensorFlow`, `Transformers`). | Excelente para estadística y ML clásico (`caret`, `tidymodels`, `randomForest`), pero rezagado en Deep Learning. | Creciente y moderno (`MLJ.jl`, `Flux.jl`), con gran diseño pero menor madurez y catálogo que Python. |
| **5. Visualización** | Muy potente (`matplotlib`, `seaborn`, `plotly`). Gran flexibilidad, aunque con APIs a veces verbosas. | **La referencia de la industria.** `ggplot2` proporciona la gramática gráfica más sólida, estética y expresiva. | Buena (`Plots.jl`, `Makie.jl`). Gráficos de alto rendimiento pero penalizados por el tiempo de carga (TTFX). |
| **6. Interoperabilidad** | Excelente. Se integra de forma nativa con C/C++ (`ctypes`, `pybind11`), Rust, Java (PySpark) y cloud. | Muy buena con C/C++ vía `Rcpp`. Interoperabilidad bidireccional con Python mediante `reticulate`. | **Sobresaliente.** Llamadas directas de coste cero a bibliotecas en C y Fortran (`ccall`), y puentes fluidos (`PyCall.jl`). |
| **7. Rendimiento Observado** | Moderado como lenguaje interpretado; rápido en operaciones vectorizadas gracias a wrappers en C (`NumPy`). | Moderado. Rápido en operaciones vectorizadas en C/Fortran; bucles explícitos tradicionalmente lentos. | **Sobresaliente.** Velocidad nativa de código compilado (C/Fortran), eliminación del problema de los dos lenguajes. |
| **8. Facilidad de Despliegue** | **Estándar de facto.** Soporte universal en Docker, microservicios (FastAPI), Kubernetes, AWS SageMaker y Azure ML. | Excelente para dashboards interactivos (`Shiny`) y reportes (`Quarto`), pero menos habitual en APIs de baja latencia. | Media. Los binarios y la compilación JIT inicial dificultan el empaquetado en contenedores hiperligeros. |
| **9. Documentación y Comunidad** | **La más amplia del mundo en IA.** Infinitos tutoriales, soporte en foros, cursos y soluciones en StackOverflow. | Comunidad científica y bioestadística muy consolidada, documentación rigurosa y manuales de CRAN exhaustivos. | Comunidad técnica de alto nivel, documentación oficial excelente, pero menor masa crítica y ejemplos en la web. |

---

### 6.2 Resumen Cuantitativo Experimental

| Métrica / Evidencia | Python | R | Julia |
| :--- | :---: | :---: | :---: |
| **Versión del entorno** | Python 3.12.10 | R 4.3.2 | Julia 1.10.4 |
| **Librería de Machine Learning** | `scikit-learn` 1.9.1 | `class` 7.3-22 | Implementación matricial nativa |
| **Librería de Visualización** | `seaborn` 0.13.2 | `ggplot2` 3.4.4 | `Plots.jl` |
| **Tamaño de muestra Train / Test** | 960 / 240 | 960 / 240 | 960 / 240 |
| **Accuracy en Test ($k=5$)** | **95.42%** | **95.42%** | **95.42%** |
| **Tiempo algoritmo puro** | ~12 ms | ~9 ms | **~1.2 ms** |
| **Tiempo total de ejecución (script)** | 2.76 s | 1.85 s | 3.95 s (incluyendo TTFX/JIT) |

*Nota metodológica:* Como se indica en las instrucciones, estos tiempos no deben interpretarse como un benchmark absoluto de rendimiento computacional debido al tamaño moderado del dataset (1200 filas), pero sí evidencian con claridad los patrones de sobrecarga de arranque (*overhead*) y compilación de cada tecnología.

---

## 7. Decisión Razonada ante Escenarios Profesionales

### 1. ¿Qué lenguaje escogerías para crear rápidamente un prototipo de IA?
**Elección: Python.**  
**Justificación:** Python es el estándar unánime de la industria para prototipado rápido (*rapid prototyping*). Su catálogo de bibliotecas listas para producción (`scikit-learn` para modelos tabulares, `Hugging Face` para PLN, `Ultralytics` para visión artificial) no tiene rival. La velocidad con la que un ingeniero puede conectar la ingesta de datos, entrenar un modelo base y exponer un endpoint interactivo con `FastAPI` o `Gradio` minimiza el tiempo de comercialización (*Time-to-Market*).

### 2. ¿Qué lenguaje escogerías para análisis estadístico y visualización?
**Elección: R.**  
**Justificación:** R fue concebido por y para estadísticos. El diseño del tipo `factor`, la riqueza del comando nativo `summary()` y, por encima de todo, el ecosistema **`tidyverse`** y **`ggplot2`** proporcionan un entorno analítico superior para el análisis exploratorio de datos (EDA), pruebas de hipótesis y bioestadística. Además, herramientas como **R Shiny** y **Quarto/RMarkdown** permiten generar informes ejecutivos y tableros interactivos reproducibles con una sofisticación gráfica difícil de igualar en otros lenguajes.

### 3. ¿Cuál considerarías para cómputo científico intensivo?
**Elección: Julia.**  
**Justificación:** Cuando el problema implica simulación numérica pesada, ecuaciones diferenciales complejas, optimización matemática o algoritmos donde los bucles intensivos no pueden delegarse en rutinas C precompiladas de NumPy, Julia es la tecnología indicada. Al compilar directamente a código máquina mediante LLVM y aprovechar el despacho múltiple, Julia elimina la necesidad de reescribir cuellos de botella en C++ o Rust, manteniendo una sintaxis matemática de alto nivel con rendimiento de metal nativo.

### 4. ¿Cuál encajaría mejor en una organización basada en la JVM (Java Virtual Machine)?
**Elección: Java con Weka (o Scala sobre Apache Spark).**  
**Justificación:** En organizaciones bancarias, aseguradoras o de telecomunicaciones cuya infraestructura central y servicios transaccionales residen sobre Java/Spring Boot o clústeres Big Data corporativos, introducir dependencias de Python o Julia puede suscitar reticencias de gobernanza, seguridad y concurrencia. La API de **Weka** en Java permite instanciar clasificadores (`weka.classifiers.lazy.IBk`) como clases nativas fuertemente tipadas dentro del mismo ciclo de vida de la JVM, garantizando despliegues en contenedores estándar sin necesidad de gestionar entornos virtuales externos.

### 5. ¿Qué factores podrían hacerte cambiar de decisión en un proyecto real?
En un entorno corporativo real, la elección tecnológica rara vez se toma en el vacío técnico; está condicionada por restricciones operativas:
* **Habilidades del equipo (*Skillset*):** Si el equipo de analistas domina R, forzar una migración a Python aumentará el coste y la tasa de errores inicial.
* **Restricciones de latencia en inferencia:** Si el modelo debe responder en menos de 5 milisegundos en tiempo real (por ejemplo, en detección de fraude transaccional o trading de alta frecuencia), Python interpretado puede ser descartado en favor de Julia, C++ o modelos exportados a ONNX ejecutados en Java/C++.
* **Infraestructura de despliegue y MLOps:** La integración con pipelines de integración continua (CI/CD), registros de modelos (MLflow, Kubeflow) y servicios gestionados en la nube (AWS Bedrock, Vertex AI) suele tener soporte de primer nivel prioritario para Python.
* **Volumen masivo de datos:** Para datasets que no caben en memoria RAM (cientos de gigabytes o terabytes), el flujo se orienta hacia entornos distribuidos como PySpark (Python) o Apache Spark nativo (Scala/Java).

---

## 8. Conclusiones

El desarrollo de este laboratorio multilenguaje demuestra que **no existe un único lenguaje superior en todos los frentes**, sino herramientas óptimas para contextos concretos:
1. **Python** se consolida como el ecosistema integrador por excelencia, indispensable para ingeniería de software e inteligencia artificial generalista.
2. **R** sobresale en rigor estadístico, formulación matemática y expresividad gráfica, siendo insustituible en investigación académica, medicina y econometría.
3. **Julia** se perfila como la tecnología del futuro para la supercomputación y el modelado científico, superando la dicotomía tradicional entre facilidad de programación y rendimiento de ejecución.

El respeto estricto de las condiciones experimentales (partición estratificada, semilla 42 y estandarización sobre Train) ha permitido validar que los tres lenguajes convergen en una precisión predictiva idéntica (**95.42%**), demostrando que la reproducibilidad matemática es independiente del lenguaje cuando se aplican buenas prácticas de ingeniería de datos.

---

## 9. Bibliografía y Fuentes

1. **Pedregosa, F., et al.** (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825-2830. [https://scikit-learn.org/stable/documentation.html](https://scikit-learn.org/stable/documentation.html) (Documentación oficial de Scikit-learn).
2. **R Core Team** (2023). *R: A Language and Environment for Statistical Computing*. R Foundation for Statistical Computing, Vienna, Austria. [https://www.r-project.org/](https://www.r-project.org/) (Documentación oficial de R y CRAN).
3. **Bezanson, J., Edelman, A., Karpinski, S., & Shah, V. B.** (2017). *Julia: A fresh approach to numerical computing*. SIAM Review, 59(1), 65-98. [https://docs.julialang.org/](https://docs.julialang.org/) (Documentación oficial de JuliaLang).
4. **Wickham, H.** (2016). *ggplot2: Elegant Graphics for Data Analysis*. Springer-Verlag New York. ISBN 978-3-319-24277-4.
5. **Fisher, R. A.** (1936). *The use of multiple measurements in taxonomic problems*. Annals of Eugenics, 7(2), 179-188. (Dataset original Iris).
