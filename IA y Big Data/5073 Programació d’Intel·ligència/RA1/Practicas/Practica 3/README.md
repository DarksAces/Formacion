# Práctica 1 · RA1: Laboratorio Multilenguaje para IA
**M3 · Programació d'Intel·ligència Artificial**  
*Curso de Especialización en Inteligencia Artificial y Big Data — Monlau*  
**Autor:** Daniel García Brun  

---

## 📌 1. Descripción del Proyecto

Esta práctica consiste en un estudio experimental y comparativo de **cuatro ecosistemas tecnológicos** para Inteligencia Artificial. Se resuelve un problema común de clasificación supervisada utilizando el algoritmo **K-Nearest Neighbors (KNN)** bajo las mismas condiciones exactas en:

1. **Python:** `pandas`, `scikit-learn`, `matplotlib`, `seaborn`.
2. **R:** `tidyverse`, `class`, `ggplot2`, `caret`.
3. **Julia:** `DataFrames.jl`, `CSV.jl`, `Statistics`, `Plots.jl`.
4. **Java (JVM):** API oficial de **Weka** (`weka-stable` 3.8.6, clasificador `weka.classifiers.lazy.IBk`) gestionado mediante **Maven** (`pom.xml`) y visualización nativa con `Java2D`.

### Protocolo Experimental Común:
* **Dataset:** Iris completo (`data/iris_extended.csv` y `data/iris_extended.arff`), seleccionando las 4 variables numéricas canónicas (`sepal_length`, `sepal_width`, `petal_length`, `petal_width`) y la especie (`species`) como atributo de clase (1200 instancias: 400 por especie).
* **Partición de datos:** 80% Entrenamiento (*Train*, 960 muestras) y 20% Prueba (*Test*, 240 muestras) de forma **estratificada**.
* **Semilla aleatoria:** Equivalente a `42` en los cuatro entornos.
* **Escalado previo:** Estandarización Z-Score ($Z = \frac{X - \mu}{\sigma}$), ajustando la media y desviación estándar **exclusivamente con los datos de entrenamiento** para evitar la filtración de datos (*data leakage*).
* **Parámetro KNN:** $k = 5$ con métrica de distancia euclídea.
* **Métricas evaluadas:** *Accuracy*, Matriz de Confusión y métricas detalladas por clase (*Precision*, *Recall*, *F1-Score*).
* **Visualizaciones:** Gráficos de dispersión de características y mapas de calor de la matriz de confusión en cada lenguaje.

---

## 📂 2. Estructura del Repositorio

```text
├── data/
│   ├── iris_extended.csv            # Dataset original en formato CSV
│   └── iris_extended.arff           # Dataset en formato nativo ARFF para Weka (Java)
├── Python/
│   ├── knn_iris.py                  # Script principal ejecutable en Python
│   ├── requirements.txt             # Dependencias del entorno Python
│   └── output/
│       ├── matriz_confusion_python.png
│       ├── dispersion_iris_python.png
│       └── ejecucion_python.txt     # Log con evidencias y tiempos medidos
├── R/
│   ├── knn_iris.R                   # Script principal en R
│   └── output/
│       ├── matriz_confusion_r.png
│       ├── dispersion_iris_r.png
│       └── ejecucion_r.txt          # Evidencia de salida en R
├── Julia/
│   ├── knn_iris.jl                  # Script principal en Julia
│   ├── Project.toml                 # Archivo declarativo de dependencias en Julia
│   └── output/
│       ├── matriz_confusion_julia.png
│       ├── dispersion_iris_julia.png
│       └── ejecucion_julia.txt      # Evidencia de salida y tiempos TTFX en Julia
├── Java/
│   ├── pom.xml                      # Gestión de dependencias Maven (weka-stable 3.8.6)
│   ├── KnnIrisWeka.java             # Copia directa del código fuente Java
│   ├── src/main/java/com/monlau/ia/
│   │   └── KnnIrisWeka.java         # Clase principal del proyecto Maven con API Weka (IBk)
│   └── output/
│       ├── matriz_confusion_java.png
│       ├── dispersion_iris_java.png
│       └── ejecucion_java.txt       # Evidencia de evaluación con Weka en la JVM
├── docs/
│   ├── informe_practica_1.md        # Informe técnico completo de la práctica
│   └── informe_practica_1.pdf       # Informe en formato PDF (5-7 páginas) para entrega
└── README.md                        # Instrucciones y guía de reproducción
```

---

## 🚀 3. Instrucciones de Reproducción y Ejecución

### Fase 1: Python
1. Instalar dependencias necesarias:
   ```bash
   pip install -r Python/requirements.txt
   ```
2. Ejecutar el script:
   ```bash
   python Python/knn_iris.py
   ```
3. Los resultados se mostrarán por consola y los gráficos se guardarán en `Python/output/`.

---

### Fase 2: R
* **Opción A (Local con R / RStudio):**
  ```R
  source("R/knn_iris.R")
  ```
* **Opción B (Posit Cloud):**
  Subir la carpeta `R/` y `data/iris_extended.csv` a un proyecto en [Posit Cloud](https://posit.cloud/), abrir `knn_iris.R` y pulsar **Source**. El script instala automáticamente `class`, `ggplot2` y `caret` si faltan.

---

### Fase 3: Julia
* **Opción A (Julia CLI):**
  ```bash
  julia Julia/knn_iris.jl
  ```
* **Opción B (Julia REPL / VS Code / Pluto):**
  ```julia
  using Pkg
  Pkg.activate("Julia")
  Pkg.instantiate()
  include("Julia/knn_iris.jl")
  ```

---

### Fase 4: Java con Weka (Maven)
* **Opción A (Ejecución mediante Maven CLI):**
  ```bash
  cd Java
  mvn clean compile exec:java
  ```
* **Opción B (Desde IDE: IntelliJ IDEA / Eclipse / VS Code):**
  1. Importar la carpeta `Java/` como proyecto **Maven** existente (`pom.xml`).
  2. Maven descargará automáticamente `nz.ac.waikato.cms.weka:weka-stable:3.8.6`.
  3. Ejecutar el método `main` de la clase `com.monlau.ia.KnnIrisWeka`.
  4. El programa cargará `data/iris_extended.arff` (o convertirá automáticamente `data/iris_extended.csv` a ARFF si es necesario), entrenará el modelo `IBk(5)` y generará los gráficos en `Java/output/`.

---

## 📊 4. Resumen de Resultados Experimentales

| Métrica / Parámetro | Python | R | Julia | Java (Weka) |
| :--- | :---: | :---: | :---: | :---: |
| **Versión del lenguaje** | Python 3.12.10 | R 4.3.2 | Julia 1.10.4 | Java 21 LTS (OpenJDK) |
| **Bibliotecas principales** | `scikit-learn` 1.9.1, `pandas` 3.0.6 | `class` 7.3-22, `caret` 6.0-94, `ggplot2` | `DataFrames.jl`, `Statistics`, `Plots.jl` | `weka-stable` 3.8.6 (`IBk`), `Java2D` |
| **Formato de entrada** | CSV (`DataFrame`) | CSV (`data.frame` + `factor`) | CSV (`DataFrame`) | ARFF nativo (`Instances`) / CSV |
| **Muestras Train / Test** | 960 / 240 | 960 / 240 | 960 / 240 | 960 / 240 |
| **Accuracy en Test ($k=5$)** | **95.42%** | **95.42%** | **95.42%** | **95.42%** |
| **Tiempo algoritmo KNN** | ~12.0 ms | ~9.0 ms | **~1.2 ms** | ~18.5 ms |
| **Tiempo total script** | 2.76 s | 1.85 s | 3.95 s (con TTFX/JIT) | 1.42 s |
