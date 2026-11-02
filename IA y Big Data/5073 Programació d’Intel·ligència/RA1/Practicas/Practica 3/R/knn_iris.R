# =============================================================================
# PRÁCTICA 1 · RA1 · M3 PROGRAMACIÓ D'INTEL·LIGÈNCIA ARTIFICIAL
# Laboratorio Multilenguaje para IA: KNN en Iris
# Fase 2: Implementación en R
# =============================================================================
# Condiciones experimentales fijadas:
#  - Dataset: Iris (4 variables de entrada continuas y 1 clase)
#  - Partición: 80% entrenamiento / 20% prueba (estratificada, seed=42)
#  - Escalado: Estandarización (media 0, desviación estándar 1)
#  - Algoritmo: K-Nearest Neighbors (k=5, distancia euclídea)
#  - Métricas: Accuracy y Matriz de Confusión
#  - Registro: Tiempo de ejecución medido y versiones de librerías
# =============================================================================

# Medición de tiempo de ejecución
tiempo_inicio <- Sys.time()

cat("======================================================================\n")
cat("PRÁCTICA 1 · RA1: CLASIFICACIÓN KNN EN R\n")
cat("======================================================================\n\n")

# -----------------------------------------------------------------------------
# 0. GESTIÓN DE DEPENDENCIAS
# -----------------------------------------------------------------------------
# En R, los paquetes se instalan desde el repositorio oficial CRAN mediante
# install.packages() y se cargan en la sesión con library().
paquetes_necesarios <- c("class", "ggplot2", "caret")
paquetes_faltantes <- paquetes_necesarios[!(paquetes_necesarios %in% installed.packages()[, "Package"])]

if (length(paquetes_faltantes) > 0) {
  cat("[0] Instalando paquetes faltantes desde CRAN:", paste(paquetes_faltantes, collapse=", "), "\n")
  install.packages(paquetes_faltantes, repos = "https://cloud.r-project.org")
}

library(class)    # Algoritmo KNN básico estándar de R
library(ggplot2)  # Visualización basada en la Gramática de Gráficos (Wilkinson)
library(caret)    # Herramientas de evaluación y partición estratificada

# -----------------------------------------------------------------------------
# 1. CARGA DEL DATASET Y RECONOCIMIENTO DE LA ESTRUCTURA
# -----------------------------------------------------------------------------
# Detección de ruta robusta (local o Posit Cloud)
posibles_rutas <- c("data/iris_extended.csv", "../data/iris_extended.csv")
ruta_datos <- posibles_rutas[file.exists(posibles_rutas)][1]

if (is.na(ruta_datos)) {
  stop("Error: No se ha encontrado el archivo iris_extended.csv en la ruta esperada.")
}

cat("[1] Cargando dataset desde:", ruta_datos, "\n")
df_raw <- read.csv(ruta_datos, stringsAsFactors = TRUE)

# Selección de las 4 variables canónicas y la variable clase
features <- c("sepal_length", "sepal_width", "petal_length", "petal_width")
target <- "species"
df <- df_raw[, c(features, target)]

cat("Dimensiones del dataset:", nrow(df), "filas x", ncol(df), "columnas\n\n")

cat("Estructura de los datos (str):\n")
str(df)

cat("\nResumen estadístico básico (summary):\n")
print(summary(df))

cat("\nDistribución de las clases (table):\n")
print(table(df$species))

# -----------------------------------------------------------------------------
# 2. PARTICIÓN ESTRATIFICADA (80% TRAIN / 20% TEST, SEED=42)
# -----------------------------------------------------------------------------
# En R se fija la semilla con set.seed().
# createDataPartition de 'caret' garantiza una división estratificada exacta.
set.seed(42)
cat("\n[2] Realizando partición estratificada (80% Train / 20% Test, seed=42)...\n")

indices_train <- createDataPartition(df$species, p = 0.80, list = FALSE)
train_set <- df[indices_train, ]
test_set  <- df[-indices_train, ]

cat(" - Conjunto de entrenamiento (Train):", nrow(train_set), "muestras\n")
cat(" - Conjunto de prueba (Test):        ", nrow(test_set), "muestras\n\n")
cat("Distribución en Test por clase:\n")
print(table(test_set$species))

# Separar predictores (X) y vector de clases (y)
X_train <- train_set[, features]
y_train <- train_set$species

X_test <- test_set[, features]
y_test <- test_set$species

# -----------------------------------------------------------------------------
# 3. ESTANDARIZACIÓN DE VARIABLES (PREVENCIÓN DE DATA LEAKAGE)
# -----------------------------------------------------------------------------
# La función scale() calcula media y desviación estándar.
# Obtenemos los parámetros de Train y los aplicamos sobre Test para no filtrar datos.
cat("\n[3] Estandarizando variables (media 0, desviación 1)...\n")

# Escalar Train y almacenar centros (medias) y escalas (desviaciones)
X_train_scaled <- scale(X_train)
train_means <- attr(X_train_scaled, "scaled:center")
train_sds   <- attr(X_train_scaled, "scaled:scale")

# Escalar Test usando las medias y desviaciones aprendidas en Train
X_test_scaled <- scale(X_test, center = train_means, scale = train_sds)

cat(" - Medias aprendidas en Train:      ", round(train_means, 3), "\n")
cat(" - Desviaciones aprendidas en Train:", round(train_sds, 3), "\n")

# -----------------------------------------------------------------------------
# 4 y 5. ENTRENAMIENTO Y EVALUACIÓN DE KNN (k=5)
# -----------------------------------------------------------------------------
# A diferencia de Python (orientado a objetos con fit/predict), el paquete 'class'
# de R es funcional: knn() recibe simultáneamente train, test y las etiquetas.
k_val <- 5
cat(paste0("\n[4 y 5] Ejecutando KNN funcional (k=", k_val, ", métrica euclídea)...\n"))

pred_knn <- knn(
  train = X_train_scaled,
  test  = X_test_scaled,
  cl    = y_train,
  k     = k_val
)

# Matriz de Confusión y Accuracy
matriz_confusion <- table(Real = y_test, Predicho = pred_knn)
accuracy <- sum(diag(matriz_confusion)) / sum(matriz_confusion)

cat("\n-> Accuracy obtenida:", sprintf("%.2f%% (%.4f)", accuracy * 100, accuracy), "\n\n")
cat("Matriz de Confusión:\n")
print(matriz_confusion)

# Evaluación con caret para obtener métricas por clase
eval_caret <- confusionMatrix(data = pred_knn, reference = y_test)
cat("\nMétricas detalladas (caret::confusionMatrix):\n")
print(eval_caret$byClass[, c("Sensitivity", "Specificity", "Pos Pred Value", "Balanced Accuracy")])

# -----------------------------------------------------------------------------
# 6. GENERACIÓN DE VISUALIZACIONES (ggplot2)
# -----------------------------------------------------------------------------
cat("\n[6] Generando gráficos con ggplot2...\n")
dir_salida <- if (dir.exists("R")) "R/output" else "output"
if (!dir.exists(dir_salida)) dir.create(dir_salida, recursive = TRUE)

# Gráfico 1: Dispersión Petal Length vs Petal Width
grafico_dispersion <- ggplot(df, aes(x = petal_length, y = petal_width, color = species)) +
  geom_point(size = 2.5, alpha = 0.8) +
  theme_minimal(base_size = 13) +
  labs(
    title = "Visualización Iris en R: Longitud vs Ancho de Pétalo",
    subtitle = "Dataset completo con tres especies de flores",
    x = "Longitud del Pétalo (cm)",
    y = "Ancho del Pétalo (cm)",
    color = "Especie"
  ) +
  scale_color_brewer(palette = "Set1")

ruta_dispersion <- file.path(dir_salida, "dispersion_iris_r.png")
ggsave(ruta_dispersion, plot = grafico_dispersion, width = 7, height = 5, dpi = 300)
cat(" -> Guardada dispersión:", ruta_dispersion, "\n")

# Gráfico 2: Matriz de Confusión como Mapa de Calor (ggplot2)
df_cm <- as.data.frame(matriz_confusion)
grafico_cm <- ggplot(df_cm, aes(x = Predicho, y = Real, fill = Freq)) +
  geom_tile(color = "white", linewidth = 1) +
  geom_text(aes(label = Freq), size = 6, fontface = "bold") +
  scale_fill_gradient(low = "#e0f3ff", high = "#08519c") +
  theme_minimal(base_size = 13) +
  labs(
    title = paste0("Matriz de Confusión - KNN (k=", k_val, ") en R"),
    subtitle = sprintf("Accuracy global: %.2f%%", accuracy * 100),
    x = "Predicción del Modelo",
    y = "Valor Real",
    fill = "Frecuencia"
  )

ruta_cm <- file.path(dir_salida, "matriz_confusion_r.png")
ggsave(ruta_cm, plot = grafico_cm, width = 6, height = 5, dpi = 300)
cat(" -> Guardada matriz de confusión:", ruta_cm, "\n")

# -----------------------------------------------------------------------------
# 7. REGISTRO DE VERSIONES, ENTORNO Y TIEMPO DE EJECUCIÓN
# -----------------------------------------------------------------------------
tiempo_fin <- Sys.time()
tiempo_total <- as.numeric(difftime(tiempo_fin, tiempo_inicio, units = "secs"))

cat("\n======================================================================\n")
cat("EVIDENCIAS TÉCNICAS Y REPRODUCIBILIDAD (R)\n")
cat("======================================================================\n")
cat("Versión de R:        ", R.version.string, "\n")
cat("Plataforma:          ", R.version$platform, "\n")
cat("Versión de class:    ", as.character(packageVersion("class")), "\n")
cat("Versión de ggplot2:  ", as.character(packageVersion("ggplot2")), "\n")
cat("Versión de caret:    ", as.character(packageVersion("caret")), "\n")
cat(sprintf("Tiempo de ejecución:  %.2f ms (%.4f segundos)\n", tiempo_total * 1000, tiempo_total))
cat("======================================================================\n")
cat("Ejecución completada con éxito.\n")
