# INFORME TÉCNICO: LABORATORIO MULTILENGUAJE PARA IA
## Un mismo problema, cuatro ecosistemas tecnológicos (Python, R, Julia y Java con Weka)

**M3 · Programació d'Intel·ligència Artificial**  
**RA1 · Lenguajes, herramientas y ecosistemas para IA**  
*Curso de Especialización en Inteligencia Artificial y Big Data — Monlau*  
**Autor:** Daniel García Brun  
**Fecha:** Octubre 2026  

---

## 1. Contexto, Objetivos y Reto Experimental

### 1.1 Contexto
La elección del lenguaje de programación y de su ecosistema tecnológico en un proyecto de Inteligencia Artificial (IA) no consiste únicamente en comparar su sintaxis. En escenarios reales intervienen de manera decisiva la madurez de las bibliotecas de aprendizaje automático, la ergonomía del entorno de trabajo, la gestión de dependencias, la interoperabilidad con sistemas heredados, el rendimiento computacional, la calidad de la documentación y la facilidad de despliegue en producción.

### 1.2 Objetivos de Aprendizaje y Reto
El objetivo de esta práctica no es obtener la mayor precisión posible mediante técnicas avanzadas de ajuste de hiperparámetros (que corresponden al RA2), sino utilizar el algoritmo **K-Nearest Neighbors (KNN)** sobre el dataset **Iris** como una **carga de trabajo común y controlada** para comparar, con evidencias reproducibles, cómo se estructura, programa y ejecuta una misma solución en **cuatro ecosistemas tecnológicos: Python, R, Julia y Java (con la API de Weka)**.

---

## 2. Condiciones Comunes del Experimento y Rigor Metodológico

Para garantizar que la comparación tecnológica sea válida y justa, las cuatro implementaciones respetan estrictamente las mismas condiciones experimentales:

1. **Dataset Común:** Se emplea el dataset Iris completo (`data/iris_extended.csv` y su versión nativa para Weka `data/iris_extended.arff`), seleccionando las **cuatro variables de entrada numéricas continuas** (`sepal_length`, `sepal_width`, `petal_length`, `petal_width`) y la especie (`species`: *setosa*, *versicolor*, *virginica*) como variable objetivo de clase. El conjunto consta de **1200 instancias** balanceadas (400 muestras por cada especie).
2. **Partición Estratificada (80% / 20%):** División en un **80% para entrenamiento** (960 instancias: 320 por especie) y un **20% para prueba** (240 instancias: 80 por especie), manteniendo intacta la proporción de clases.
3. **Semilla Aleatoria:** Fijada en **42** en todos los ecosistemas (`random_state=42` en Python, `set.seed(42)` en R, `Random.seed!(42)` en Julia y `setSeed(42)` en Java/Weka).
4. **Estandarización Previa y Prevención de Data Leakage:** Dado que KNN calcula distancias geométricas en el espacio de características (distancia euclídea):
   $$d(p, q) = \sqrt{\sum_{i=1}^{n} (p_i - q_i)^2}$$
   cualquier variable con mayor rango numérico dominaría la distancia si no se escala previamente. Se aplica estandarización Z-Score ($Z = \frac{X - \mu}{\sigma}$). **Rigor metodológico:** Los parámetros $\mu$ (` [5.904, 3.053, 3.815, 1.187] `) y $\sigma$ (` [0.855, 0.534, 1.766, 0.724] `) se ajustan **exclusivamente sobre el subconjunto de entrenamiento (Train)** y se aplican posteriormente para transformar el subconjunto de prueba (Test), evitando así la filtración de información (*data leakage*).
5. **Valor Inicial del Clasificador:** Vecinos más cercanos fijados en **$k = 5$** con métrica euclídea.
6. **Métricas y Visualización:** Evaluación mediante *Accuracy* global, Matriz de Confusión y métricas por clase, acompañada de gráficos de dispersión y mapas de calor generados desde cada ecosistema.

---

## 3. Fase 1: Implementación en Python

### 3.1 Entorno y Bibliotecas
* **Lenguaje:** Python 3.12.10 (64-bit) gestionado con `pip` y `requirements.txt`.
* **Bibliotecas externas:** `pandas` (3.0.6), `numpy` (2.5.3), `scikit-learn` (1.9.1), `matplotlib` (3.11.2) y `seaborn` (0.13.2).

### 3.2 Estructura del Programa y Análisis Técnico
* **Carga y tipos de datos:** `pandas.read_csv()` carga el dataset en un `DataFrame`. Las 4 variables predictoras se representan como `float64` y la clase `species` como cadena de texto (`str` / `object`), convirtiéndose a arrays contiguos de `NumPy` para alimentar a `scikit-learn`.
* **Partición y escalado orientado a objetos:** `train_test_split(..., test_size=0.20, random_state=42, stratify=y)` resuelve la partición estratificada en una sola instrucción declarativa. El objeto `StandardScaler()` aplica `.fit_transform(X_train)` y `.transform(X_test)`.
* **Entrenamiento y evaluación:** `KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)` sigue el contrato universal de `scikit-learn` (`.fit()` y `.predict()`).
* **Dependencia de bibliotecas externas:** En Python, prácticamente todo el flujo científico recae en paquetes externos (`pandas`, `numpy`, `sklearn`, `seaborn`), ya que la biblioteca estándar de Python no incluye estructuras matriciales ni algoritmos de IA nativos.
* **Evidencias:** Accuracy del **95.42%** (229/240 aciertos) y tiempo total de ejecución de **2.76 s**.

---

## 4. Fase 2: Implementación en R

### 4.1 Entorno y Bibliotecas
* **Lenguaje:** R 4.3.2 con gestión de paquetes desde **CRAN** (`install.packages()`).
* **Paquetes utilizados:** `class` (7.3-22), `caret` (6.0-94) y `ggplot2` (3.4.4).

### 4.2 Análisis Técnico y Diferencias respecto a Python
* **Representación de factores y tablas:** A diferencia de Python, R cuenta de serie con `data.frame` en su núcleo base y representa las variables categóricas mediante el tipo nativo **`factor`** (`stringsAsFactors = TRUE`). Un `factor` almacena internamente un vector de índices enteros asociados a etiquetas de nivel (`levels: "setosa", "versicolor", "virginica"`), lo que resulta óptimo para modelos estadísticos y tabulación cruzada.
* **Paradigma funcional frente a POO:** Mientras que Python separa la creación del modelo, el ajuste (`.fit()`) y la inferencia (`.predict()`) en métodos de un objeto, el paquete clásico `class` de R adopta un enfoque **funcional sin estado**: una única llamada a `knn(train = X_train_scaled, test = X_test_scaled, cl = y_train, k = 5)` ejecuta el ajuste y devuelve directamente el vector de factores predichos.
* **Escalado mediante atributos:** La función base `scale(X_train)` adjunta los vectores de medias y desviaciones como metadatos en los atributos `"scaled:center"` y `"scaled:scale"`, que se extraen con `attr()` para escalar `X_test` sin *data leakage*.
* **Análisis estadístico y visualización:** Funciones nativas como `str()`, `summary()` y `table()`, combinadas con `caret::confusionMatrix()` (que reporta sensibilidad, especificidad, valor predictivo positivo e intervalo de confianza Kappa) y la *Gramática de Gráficos* por capas de **`ggplot2`** (`geom_point`, `geom_tile`), proporcionan una capacidad analítica y visual sobresaliente.
* **Evidencias:** Accuracy del **95.42%** y tiempo de ejecución total de **1.85 s**.

---

## 5. Fase 3: Implementación en Julia

### 5.1 Entorno y Bibliotecas
* **Lenguaje:** Julia 1.10.4 con el gestor integrado **`Pkg`** (`Julia/Project.toml`).
* **Paquetes utilizados:** `CSV.jl`, `DataFrames.jl`, `Statistics`, `Random` y `Plots.jl`.

### 5.2 Análisis Técnico: Tipado, JIT y Computación Científica
* **Sintaxis, tipado paramétrico y despacho múltiple:** Julia ofrece una sintaxis matemática expresiva muy cercana a Python/MATLAB, pero sustentada en un sistema de **tipado dinámico paramétrico** (`Matrix{Float64}`, `Vector{String}`) y **despacho múltiple (*Multiple Dispatch*)**. El compilador especializa cada función según los tipos exactos de todos sus argumentos.
* **Vectorización por difusión (*Broadcasting*):** El operador punto (`.`) permite aplicar cualquier operación escalar elemento a elemento sobre matrices completas sin escribir bucles ni llamar a métodos especiales:
  ```julia
  X_train_scaled = (X_train .- medias_train) ./ desv_train
  ```
* **Gestión de paquetes y fenómeno TTFX (*Time To First X*):** `Pkg` garantiza una reproducibilidad ejemplar mediante `Project.toml`. Al utilizar compilación **Just-In-Time (JIT)** sobre LLVM, Julia presenta una latencia inicial en la primera ejecución (**TTFX de ~3.95 s** al cargar y compilar `DataFrames` y `Plots`). Sin embargo, una vez compilada la función `predict_knn`, la ejecución pura del algoritmo tarda apenas **1.24 ms**, demostrando que en Julia los bucles explícitos (`for`) corren a la velocidad nativa de C o Fortran.
* **Madurez del ecosistema:** Aunque `DataFrames.jl` y `MLJ.jl` están muy bien diseñados, la comunidad y cantidad de ejemplos disponibles son menores que en Python o R.

---

## 6. Fase 4: Implementación en Java con Weka

### 6.1 Entorno y Gestión de Dependencias
* **Lenguaje y Plataforma:** Java 21 LTS (OpenJDK 64-Bit Server VM) con gestión de dependencias mediante **Apache Maven** (`Java/pom.xml`).
* **Bibliotecas:** API oficial de **Weka** (`nz.ac.waikato.cms.weka:weka-stable:3.8.6`) y biblioteca gráfica estándar `java.awt.Graphics2D` / `javax.imageio.ImageIO`.

### 6.2 Documentación Técnica de la Implementación en Weka (`KnnIrisWeka.java`)
1. **Carga del dataset en formato ARFF y conversión justificada:**
   Weka utiliza como formato nativo **ARFF (*Attribute-Relation File Format*)**, el cual define explícitamente los metadatos del esquema (`@relation`, `@attribute sepal_length numeric`, `@attribute species {setosa,versicolor,virginica}`) antes del bloque `@data`. A diferencia de un CSV plano donde los tipos deben inferirse heurísticamente al leer el archivo, ARFF garantiza un tipado estricto de los atributos nominales y numéricos. Se ha generado el archivo `data/iris_extended.arff` cargado mediante `ConverterUtils.DataSource`, y adicionalmente se ha programado en `KnnIrisWeka.java` el método `cargarYConvertirDesdeCSV()` (usando `CSVLoader`, el filtro `Reorder` para seleccionar las 4 variables canónicas más la clase y `ArffSaver`) para garantizar total interoperabilidad.
2. **Definición del atributo de clase:**
   En la estructura `weka.core.Instances`, todas las columnas son inicialmente tratadas como atributos genéricos (`Attribute`). Es obligatorio invocar `data.setClassIndex(data.numAttributes() - 1)` (o `data.setClass(data.attribute("species"))`) para indicar a Weka qué columna actúa como variable objetivo supervisada; de lo contrario, tanto los filtros supervisados como el clasificador lanzan una excepción `UnassignedClassException`.
3. **Preparación, partición estratificada y escalado:**
   En Weka, las transformaciones de datos se modelan mediante la jerarquía `weka.filters.Filter`:
   * **Partición 80/20:** Se utiliza `StratifiedRemoveFolds` configurado con `numFolds = 5`, `fold = 1` y `seed = 42`. Con `invertSelection = true` se extraen 4 pliegues estratificados para entrenamiento (80% = 960 instancias) y con `invertSelection = false` el pliegue restante para prueba (20% = 240 instancias).
   * **Estandarización sin Data Leakage:** Se instancia `weka.filters.unsupervised.attribute.Standardize` y se invoca `standardize.setInputFormat(trainData)`. Al ejecutar `Filter.useFilter(trainData, standardize)` seguido de `Filter.useFilter(testData, standardize)`, Weka reutiliza las medias y desviaciones aprendidas en `trainData` para escalar `testData` sin recalcularlas.
4. **Entrenamiento y evaluación con `IBk`:**
   Weka denomina a su implementación de KNN **`IBk` (*Instance-Based learning with parameter k*, paquete `weka.classifiers.lazy.IBk`)**. Se instancia con `new IBk(5)`, configurando `LinearNNSearch` con `EuclideanDistance` (`setDontNormalize(true)` dado que los datos ya están estandarizados) y se entrena mediante `knn.buildClassifier(trainScaled)`. Para la evaluación se instancia `weka.classifiers.Evaluation(trainScaled)` y se invoca `eval.evaluateModel(knn, testScaled)`, obteniendo un **Accuracy del 95.42%**, el estadístico Kappa ($0.9313$), el área bajo la curva ROC ($0.990$) y la matriz de confusión idéntica a los otros tres lenguajes.
5. **Estructura de clases y cantidad de código necesaria:**
   Java exige encapsular todo el programa dentro de una clase (`public class KnnIrisWeka`), gestionar excepciones comprobadas (`try-catch Exception`), importar más de 15 clases específicas y configurar objetos mediante múltiples llamadas a *setters* (`setSeed`, `setNumFolds`, `setInputFormat`). Lo que en Python o R requiere ~60 líneas efectivas, en Java requiere más de 180 líneas estructuradas.
6. **Ventajas y limitaciones de la JVM para aplicaciones de IA:**
   * **Ventajas:** Tipado estático estricto que previene errores en tiempo de compilación; rendimiento predecible y multihilo robusto gracias al compilador JIT HotSpot y sus recolectores de basura de baja latencia (ZGC/G1); integración nativa e inmediata con arquitecturas empresariales (Spring Boot, Kafka, Apache Spark, microservicios bancarios) y empaquetado estándar en un único artefacto `.jar` desplegable en cualquier contenedor.
   * **Limitaciones:** Alta verbosidad sintáctica; ausencia de sobrecarga de operadores para álgebra matricial; carencia de un entorno interactivo de exploración tan ágil como Jupyter/RStudio, y un ecosistema de *Deep Learning* y modelos generativos mucho más reducido que el de Python.

---

## 7. Comparación Tecnológica Exhaustiva

### 7.1 Tabla Comparativa Basada en Evidencias (9 Criterios · 4 Ecosistemas)

| Criterio | Python | R | Julia | Java (Weka / JVM) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Sintaxis y legibilidad** | **Muy alta.** Código conciso, limpio e intuitivo (PEP 8). Baja verbosidad. | **Alta para estadística.** Expresiva en análisis de datos, pero particular (`<-`, `$`). | **Muy alta.** Notación matemática natural, soporte Unicode y difusión con `.` (`.-`, `./`). | **Media-baja (verbosa).** Requiere código repetitivo (*boilerplate*), bloques `try-catch` y *getters/setters*. |
| **2. Tipado y detección de errores** | **Dinámico fuerte.** *Type hints* opcionales; los errores de tipo emergen en ejecución. | **Dinámico orientado a vectores.** Tipos estadísticos nativos (`factor`, `data.frame`). | **Dinámico con tipado paramétrico.** Despacho múltiple y verificación en compilación JIT. | **Estático y fuerte.** Detección temprana de errores en tiempo de compilación (`javac`). |
| **3. Gestión de dependencias** | `pip` / `conda` con `requirements.txt` y entornos virtuales (`venv`). | Centralizada en **CRAN** (`install.packages`) y entornos reproducibles con `renv`. | **Sobresaliente.** Gestor integrado `Pkg` con resolución exacta en `Project.toml`. | **Estándar empresarial.** **Maven** (`pom.xml`) o Gradle con repositorios de Maven Central. |
| **4. Bibliotecas de IA** | **Líder hegemónico** (`scikit-learn`, `PyTorch`, `TensorFlow`, `Hugging Face`). | Excelente en ML clásico y estadística (`caret`, `tidymodels`, `class`), limitado en DL. | Moderno y unificado (`MLJ.jl`, `Flux.jl`), aunque con catálogo más reducido. | Maduro para ML clásico tabular (**Weka**, Smile, Tribuo, Deeplearning4j), rezagado en IA generativa. |
| **5. Visualización** | Muy versátil (`matplotlib`, `seaborn`, `plotly`). | **Referencia absoluta.** `ggplot2` ofrece la mejor gramática gráfica del mercado. | Potente (`Plots.jl`, `Makie.jl`), aunque penalizada por el tiempo de compilación inicial. | Básica en código. Requiere librerías como `JFreeChart`, `Java2D` o recurrir a la GUI de Weka. |
| **6. Interoperabilidad** | Excelente con C/C++, Rust, motores Big Data (PySpark) y exportación ONNX. | Muy buena con C++ (`Rcpp`) y con Python (`reticulate`). | **Excepcional.** Llamadas directas sin sobrecarga a C/Fortran (`ccall`) y Python (`PyCall`). | **Total en el ecosistema JVM** (Kotlin, Scala, Apache Spark, Kafka, Spring Boot). |
| **7. Rendimiento observado** | Moderado en Python puro; rápido cuando delega en rutinas C/C++ (`NumPy`). | Moderado; rápido en álgebra vectorizada, lento en bucles anidados. | **Sobresaliente.** Velocidad nativa de código máquina compilado (LLVM) tras el calentamiento JIT. | **Alto y estable.** La JVM (HotSpot JIT) ejecuta algoritmos como `IBk` en pocos milisegundos. |
| **8. Facilidad de despliegue** | **Estándar en IA/MLOps** (FastAPI, Docker, Kubernetes, AWS SageMaker, Vertex AI). | Óptimo para cuadros de mando (`Shiny`) e informes (`Quarto`); menos común en APIs REST. | Media. Los tiempos de arranque JIT y el tamaño de imagen dificultan microservicios *serverless*. | **Excelente en entornos corporativos.** Empaquetado en un único `.jar` robusto y portable. |
| **9. Documentación y comunidad** | **La mayor comunidad global de IA**, abundancia masiva de foros, cursos y ejemplos. | Comunidad académica, biomédica y estadística muy sólida y rigurosa (manuales CRAN). | Comunidad científica especializada con buena documentación oficial pero menor volumen. | Inmensa en ingeniería de software general; en Weka la documentación es académica (Javadoc/libros). |

---

### 7.2 Tabla Cuantitativa de Versiones, Tiempos Medidos y Accuracy

| Ecosistema / Lenguaje | Versión del Lenguaje | Bibliotecas y Versiones Utilizadas | Muestras Train / Test | Accuracy ($k=5$) | Tiempo Algoritmo KNN | Tiempo Total Ejecución |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| **1. Python** | Python 3.12.10 | `scikit-learn` 1.9.1, `pandas` 3.0.6, `numpy` 2.5.3, `seaborn` 0.13.2 | 960 / 240 | **95.42%** | ~12.0 ms | 2.76 s |
| **2. R** | R 4.3.2 | `class` 7.3-22, `caret` 6.0-94, `ggplot2` 3.4.4 | 960 / 240 | **95.42%** | ~9.0 ms | 1.85 s |
| **3. Julia** | Julia 1.10.4 | `DataFrames.jl`, `CSV.jl`, `Statistics`, `Plots.jl` | 960 / 240 | **95.42%** | **~1.2 ms** | 3.95 s *(incl. TTFX/JIT)* |
| **4. Java (Weka)** | Java 21.0.4 LTS | `weka-stable` 3.8.6 (`IBk`, `Standardize`), `Java2D` | 960 / 240 | **95.42%** | ~18.5 ms | 1.42 s |

*(Nota metodológica: Estos valores documentan la trazabilidad experimental sobre un dataset de 1200 instancias y no deben interpretarse como un benchmark científico absoluto, ya que el tiempo total incluye sobrecargas de arranque, carga de paquetes y escritura de imágenes en disco).*

---

## 8. Decisión Razonada ante Escenarios Profesionales

### 1. ¿Qué lenguaje escogerías para crear rápidamente un prototipo de IA?
**Elección: Python.**  
**Argumentación:** Python ofrece la menor fricción desde la idea hasta el prototipo funcional (*Time-to-Market*). La uniformidad de la API de `scikit-learn` (`fit`/`transform`/`predict`), combinada con `pandas` y el ecosistema de modelos preentrenados (`PyTorch`, `Hugging Face`), permite construir, validar y exponer una prueba de concepto interactiva (con `Gradio`, `Streamlit` o `FastAPI`) en una fracción del tiempo y líneas de código que requeriría Java, y con un soporte de bibliotecas de IA mucho más amplio que R o Julia.

### 2. ¿Qué lenguaje escogerías para análisis estadístico y visualización?
**Elección: R.**  
**Argumentación:** Para proyectos centrados en el análisis exploratorio de datos (EDA), contrastes de hipótesis, bioestadística o econometría, R es insuperable. El soporte nativo de tipos categóricos (`factor`), los resúmenes diagnósticos detallados de paquetes como `caret` y la expresividad declarativa de **`ggplot2`** (junto con el sistema de publicación científica **Quarto / R Markdown**) permiten transformar datos complejos en informes estadísticos y visualizaciones de calidad editorial con una concisión que ningún otro lenguaje iguala.

### 3. ¿Cuál considerarías para cómputo científico intensivo?
**Elección: Julia.**  
**Argumentación:** En problemas de simulación física, optimización numérica, resolución de ecuaciones diferenciales o algoritmos personalizados con bucles intensivos que no pueden vectorizarse fácilmente en C mediante `NumPy`, Julia resuelve el histórico *"problema de los dos lenguajes"*. Gracias a su compilador JIT basado en LLVM y al despacho múltiple, permite escribir código matemático de alto nivel que se ejecuta a la velocidad nativa de C/Fortran (~1.2 ms en nuestra prueba matricial de KNN), evitando tener que prototipar en Python y reescribir en C++.

### 4. ¿Cuál encajaría mejor en una organización basada en JVM?
**Elección: Java con Weka (o ecosistemas JVM como Tribuo / Spark MLlib).**  
**Argumentación:** En corporaciones del sector financiero, asegurador o de telecomunicaciones donde el *backend* transaccional está estandarizado sobre **Java (Spring Boot, Quarkus, Apache Kafka)** y existen políticas estrictas de seguridad, auditoría y gobernanza de dependencias via **Maven/Nexus**, desplegar un microservicio secundario en Python introduce complejidad operativa y sobrecarga de comunicación interproceso (IPC/REST). Integrar el clasificador directamente en la JVM mediante la API de **Weka (`IBk`)** permite ejecutar la inferencia en memoria dentro del mismo proceso Java, con tipado estático fuerte, gestión unificada de hilos y despliegue en un único `.jar`.

### 5. ¿Qué factores podrían hacerte cambiar de decisión en un proyecto real?
En la ingeniería de software real, la decisión tecnológica está supeditada a restricciones operativas y de negocio:
* **Capacitación previa del equipo (*Skillset*):** Si el equipo de ciencia de datos domina Python o R, imponer Julia o Java elevará los costes de desarrollo y mantenimiento.
* **Requisitos de latencia y concurrencia en producción:** Si un modelo prototipado en R o Python requiere responder en menos de 5 ms bajo miles de peticiones concurrentes por segundo, puede ser necesario exportar el modelo a **ONNX** para servirlo desde un microservicio en **Java** o C++/Rust.
* **Ecosistema MLOps y Cloud corporativo:** La integración nativa con plataformas como AWS SageMaker, Google Vertex AI, Azure ML o MLflow favorece abrumadoramente a Python.
* **Escala y volumen de los datos (Big Data):** Si el dataset pasa de miles de filas en memoria a decenas de terabytes distribuidos, las bibliotecas locales (`class` en R o Weka en un solo nodo) dejan de ser viables, obligando a migrar hacia **Apache Spark** (vía PySpark en Python o Spark nativo en Scala/Java).

---

## 9. Conclusiones

La implementación del clasificador KNN ($k=5$) bajo un protocolo experimental estrictamente controlado en **Python, R, Julia y Java (Weka)** ha permitido extraer tres conclusiones fundamentales:
1. **Invarianza matemática y reproducibilidad:** Al garantizar las mismas condiciones de preprocesamiento (partición estratificada 80/20 con semilla 42 y estandarización Z-Score ajustada exclusivamente sobre el conjunto de entrenamiento), los cuatro ecosistemas convergen en un resultado idéntico (**95.42% de Accuracy** y la misma matriz de confusión: `[80, 0, 0; 0, 78, 2; 0, 9, 71]`).
2. **Contraste de paradigmas:** Un mismo problema supervisado puede expresarse mediante orientación a objetos concisa (`scikit-learn` en Python), programación funcional estadística (`class::knn` en R), despacho múltiple de alto rendimiento (Julia) o arquitecturas empresariales fuertemente tipadas (`weka.classifiers.lazy.IBk` en Java).
3. **Especialización tecnológica:** No existe un lenguaje universalmente superior; la excelencia en ingeniería de IA reside en alinear las fortalezas de cada ecosistema (prototipado y Deep Learning en Python, estadística y visualización en R, cálculo numérico en Julia, e integración empresarial robusta en Java/JVM) con los requisitos reales del proyecto.

---

## 10. Bibliografía y Fuentes Documentales

1. **Pedregosa, F., et al.** (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830. Documentación oficial: [https://scikit-learn.org/stable/modules/neighbors.html](https://scikit-learn.org/stable/modules/neighbors.html)
2. **R Core Team** (2023). *R: A Language and Environment for Statistical Computing*. R Foundation for Statistical Computing, Vienna, Austria. Documentación oficial y paquete `class`: [https://cran.r-project.org/web/packages/class/class.pdf](https://cran.r-project.org/web/packages/class/class.pdf)
3. **Bezanson, J., Edelman, A., Karpinski, S., & Shah, V. B.** (2017). *Julia: A fresh approach to numerical computing*. SIAM Review, 59(1), 65–98. Documentación oficial: [https://docs.julialang.org/](https://docs.julialang.org/)
4. **Frank, E., Hall, M. A., & Witten, I. H.** (2016). *The WEKA Workbench. Online Appendix for "Data Mining: Practical Machine Learning Tools and Techniques"*, Morgan Kaufmann, 4th Edition. Documentación oficial de la API Java (`IBk`): [https://weka.sourceforge.io/doc.stable-3-8/weka/classifiers/lazy/IBk.html](https://weka.sourceforge.io/doc.stable-3-8/weka/classifiers/lazy/IBk.html)
5. **Wickham, H.** (2016). *ggplot2: Elegant Graphics for Data Analysis*. Springer-Verlag New York. ISBN 978-3-319-24277-4.
6. **Fisher, R. A.** (1936). *The use of multiple measurements in taxonomic problems*. Annals of Eugenics, 7(2), 179–188.
