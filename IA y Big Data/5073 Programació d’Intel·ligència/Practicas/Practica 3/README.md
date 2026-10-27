# Práctica 1 · RA1: Laboratorio Multilenguaje para IA
**M3 · Programació d'Intel·ligència Artificial**  
*Curso de Especialización en Inteligencia Artificial y Big Data — Monlau*  
**Autor:** Daniel García Brun  

---

## 📌 1. Descripción del Proyecto

Esta práctica consiste en un estudio experimental y comparativo de diferentes ecosistemas tecnológicos para Inteligencia Artificial. Se resuelve un problema común de clasificación supervisada utilizando el algoritmo **K-Nearest Neighbors (KNN)** con las mismas condiciones exactas en tres ecosistemas:

1. **Python:** `pandas`, `scikit-learn`, `matplotlib`, `seaborn`.
2. **R:** `tidyverse`, `class`, `ggplot2`, `caret`.
3. **Julia:** `DataFrames.jl`, `Statistics`, `Plots.jl`.

### Protocolo Experimental Común:
* **Dataset:** Iris (`data/iris_extended.csv`), seleccionando las 4 variables numéricas canónicas (`sepal_length`, `sepal_width`, `petal_length`, `petal_width`) y la especie (`species`).
* **Partición de datos:** 80% Entrenamiento (*Train*) y 20% Prueba (*Test*) de forma **estratificada**.
* **Semilla aleatoria:** Equivalente a `42`.
* **Escalado previo:** Estandarización ($Z = \frac{X - \mu}{\sigma}$), ajustando la media y desviación **exclusivamente con los datos de entrenamiento** para evitar la filtración de datos (*data leakage*).
* **Parámetro KNN:** $k = 5$ con métrica euclídea.
* **Métricas evaluadas:** *Accuracy* y Matriz de Confusión.
* **Visualizaciones:** Gráficos de dispersión y mapas de calor de la matriz de confusión.

---

## 📂 2. Estructura del Repositorio

```text
├── data/
│   └── iris_extended.csv            # Dataset de entrada
├── Python/
│   ├── knn_iris.py                  # Script principal ejecutable en Python
│   ├── requirements.txt             # Dependencias del entorno Python
│   └── output/
│       ├── matriz_confusion_python.png
│       ├── dispersion_iris_python.png
│       └── ejecucion_python.txt     # Log con evidencias y tiempos reales
├── R/
│   ├── knn_iris.R                   # Script principal en R
│   └── output/                      # Gráficos generados en R
├── Julia/
│   ├── knn_iris.jl                  # Script principal en Julia
│   ├── Project.toml                 # Archivo de dependencias del entorno Julia
│   └── output/                      # Gráficos y salidas generadas en Julia
├── docs/
│   ├── informe_practica_1.md        # Informe técnico completo de la práctica
│   └── informe_practica_1.pdf       # Informe en formato PDF para entrega
└── README.md                        # Instrucciones y guía de ejecución
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
3. Los resultados impresos se mostrarán en la terminal y las figuras se generarán automáticamente en `Python/output/`.

---

### Fase 2: R
* **Opción A (Local con R o RStudio):**
  Abrir R o RStudio en el directorio raíz o en `R/` y ejecutar:
  ```R
  source("R/knn_iris.R")
  ```
* **Opción B (Posit Cloud / RStudio Cloud):**
  1. Subir la carpeta `R/` y el archivo `data/iris_extended.csv` a un proyecto en [Posit Cloud](https://posit.cloud/).
  2. Abrir `knn_iris.R` y presionar el botón **Source**.
  3. El script instalará automáticamente `ggplot2`, `caret` y `class` si no están presentes y generará los gráficos.

---

### Fase 3: Julia
* **Opción A (Local con Julia CLI):**
  ```bash
  julia Julia/knn_iris.jl
  ```
* **Opción B (Pluto Notebook / Julia REPL):**
  1. Iniciar Julia y activar el entorno:
     ```julia
     using Pkg
     Pkg.activate("Julia")
     Pkg.instantiate()
     include("Julia/knn_iris.jl")
     ```

---

## 📊 4. Resumen de Resultados Experimentales

| Métrica / Parámetro | Python | R | Julia |
| :--- | :---: | :---: | :---: |
| **Versión del lenguaje** | Python 3.12.10 | R 4.3+ | Julia 1.10+ |
| **Bibliotecas principales** | `scikit-learn` 1.9.1, `pandas` 3.0.6 | `class`, `ggplot2`, `caret` | `DataFrames`, `Statistics` |
| **Accuracy en Test (20%)** | **95.42%** | **95.42%** | **95.42%** |
| **Muestras Train / Test** | 960 / 240 | 960 / 240 | 960 / 240 |
| **Tiempo de ejecución medido** | ~2.76 s | ~1.85 s | ~0.08 s (algoritmo puro) / ~4 s (TTFX) |
