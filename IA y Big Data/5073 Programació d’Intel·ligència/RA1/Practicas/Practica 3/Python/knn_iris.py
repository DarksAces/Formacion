"""
=============================================================================
PRÁCTICA 1 · RA1 · M3 PROGRAMACIÓ D'INTEL·LIGÈNCIA ARTIFICIAL
Laboratorio Multilenguaje para IA: KNN en Iris
Fase 1: Implementación en Python
=============================================================================
Condiciones experimentales fijadas:
 - Dataset: Iris (4 variables de entrada continuas y 1 clase)
 - Partición: 80% entrenamiento / 20% prueba (estratificada, seed=42)
 - Escalado: Estandarización (StandardScaler: media 0, varianza 1)
 - Algoritmo: K-Nearest Neighbors (k=5, distancia euclídea)
 - Métricas: Accuracy y Matriz de Confusión
 - Registro: Tiempo de ejecución medido y versiones de librerías
=============================================================================
"""

import sys
import os
import platform
import time
from pathlib import Path

# Iniciar cronómetro de tiempo de ejecución total
start_time = time.perf_counter()

# Importación de bibliotecas científicas
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

print("=" * 70)
print("PRÁCTICA 1 · RA1: CLASIFICACIÓN KNN EN PYTHON")
print("=" * 70)

# ---------------------------------------------------------------------------
# 1. CARGA DEL DATASET Y RECONOCIMIENTO DE LA ESTRUCTURA
# ---------------------------------------------------------------------------
# Localizar la ruta del archivo de forma robusta
base_dir = Path(__file__).resolve().parent
project_root = base_dir.parent
data_path = project_root / "data" / "iris_extended.csv"

if not data_path.exists():
    # Alternativa si se ejecuta directamente desde la raíz
    data_path = Path("data/iris_extended.csv")

print(f"\n[1] Cargando dataset desde: {data_path.name}")
df_raw = pd.read_csv(data_path)

# Variables canónicas del problema Iris
features = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
target = "species"

# Filtrar a las 4 variables de entrada + clase solicitadas en el enunciado
df = df_raw[features + [target]].copy()

print(f"Dimensiones del dataset cargado: {df.shape[0]} filas x {df.shape[1]} columnas")
print("\nPrimeras 5 filas:")
print(df.head())

print("\nTipos de datos detectados:")
print(df.dtypes)

print("\nDistribución de las clases (especies):")
print(df[target].value_counts())

# Separar variables independientes (X) y variable objetivo (y)
# Convertir a arrays de NumPy puros para máxima compatibilidad con scikit-learn
X = np.ascontiguousarray(df[features].to_numpy(dtype=np.float64))
y = np.array(df[target].to_numpy(dtype=str))

# ---------------------------------------------------------------------------
# 2. PARTICIÓN ESTRATIFICADA (80% TRAIN / 20% TEST, SEED=42)
# ---------------------------------------------------------------------------
print("\n[2] Realizando partición estratificada (80% Train / 20% Test, seed=42)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f" - Conjunto de entrenamiento (Train): {X_train.shape[0]} muestras")
print(f" - Conjunto de prueba (Test):         {X_test.shape[0]} muestras")

# ---------------------------------------------------------------------------
# 3. ESTANDARIZACIÓN DE VARIABLES (PREVENCIÓN DE DATA LEAKAGE)
# ---------------------------------------------------------------------------
# Ajustar media y desviación SOLO con el conjunto de entrenamiento (fit)
# y transformar train y test con esa misma escala (transform).
print("\n[3] Estandarizando variables con StandardScaler...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f" - Medias aprendidas en Train:        {scaler.mean_.round(3)}")
print(f" - Desviaciones aprendidas en Train:  {scaler.scale_.round(3)}")

# ---------------------------------------------------------------------------
# 4. ENTRENAMIENTO DEL MODELO KNN (k=5)
# ---------------------------------------------------------------------------
k_value = 5
print(f"\n[4] Entrenando K-Nearest Neighbors (k={k_value}, métrica euclídea)...")
knn = KNeighborsClassifier(n_neighbors=k_value, metric='minkowski', p=2)
knn.fit(X_train_scaled, y_train)
print("Modelo entrenado correctamente.")

# ---------------------------------------------------------------------------
# 5. EVALUACIÓN Y PREDICCIÓN EN TEST
# ---------------------------------------------------------------------------
print("\n[5] Evaluando sobre el conjunto de test...")
y_pred = knn.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
labels = sorted(list(np.unique(y)))
cm = confusion_matrix(y_test, y_pred, labels=labels)

print(f"\n-> Accuracy obtenida: {accuracy * 100:.2f}% ({accuracy:.4f})")
print("\nMatriz de Confusión:")
print(f"Etiquetas: {labels}")
print(cm)

print("\nInforme de Clasificación detallado:")
print(classification_report(y_test, y_pred, target_names=labels))

# ---------------------------------------------------------------------------
# 6. GENERACIÓN DE VISUALIZACIONES
# ---------------------------------------------------------------------------
print("\n[6] Generando gráficos de resultados...")
import tempfile
import subprocess

output_dir = Path("Python") / "output"
cm_plot_name = "matriz_confusion_python.png"
scatter_plot_name = "dispersion_iris_python.png"

# Función auxiliar para guardar figuras compatible con protecciones de Windows
def save_figure_safe(fig, filename):
    dest_path = output_dir / filename
    temp_path = Path(tempfile.gettempdir()) / filename
    try:
        fig.savefig(dest_path, dpi=300)
        print(f" -> Guardado directamente en: {dest_path}")
    except (PermissionError, FileNotFoundError, OSError):
        # Fallback si Windows Controlled Folder Access restringe escrituras directas en Documents
        fig.savefig(temp_path, dpi=300)
        try:
            subprocess.run(
                ["powershell", "-NoProfile", "-Command", f"Copy-Item '{temp_path}' '{dest_path}' -Force"],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            print(f" -> Guardado con éxito en: {dest_path}")
        except Exception:
            print(f" -> Guardado en directorio temporal: {temp_path}")

# Gráfico 1: Matriz de confusión con mapa de calor
fig1, ax1 = plt.subplots(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=labels, yticklabels=labels, ax=ax1)
ax1.set_title(f"Matriz de Confusión - KNN (k={k_value}) en Python\nAccuracy: {accuracy*100:.2f}%")
ax1.set_xlabel("Predicción del Modelo")
ax1.set_ylabel("Valor Real")
plt.tight_layout()
save_figure_safe(fig1, cm_plot_name)
plt.close(fig1)

# Gráfico 2: Dispersión de Petal Length vs Petal Width
fig2, ax2 = plt.subplots(figsize=(7, 5))
sns.scatterplot(
    data=df,
    x="petal_length",
    y="petal_width",
    hue="species",
    palette="deep",
    s=60,
    ax=ax2
)
ax2.set_title("Visualización de Datos Iris: Longitud vs Ancho de Pétalo")
ax2.set_xlabel("Longitud del Pétalo (cm)")
ax2.set_ylabel("Ancho del Pétalo (cm)")
ax2.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
save_figure_safe(fig2, scatter_plot_name)
plt.close(fig2)

# ---------------------------------------------------------------------------
# 7. REGISTRO DE VERSIONES, ENTORNO Y TIEMPO DE EJECUCIÓN
# ---------------------------------------------------------------------------
end_time = time.perf_counter()
execution_time_ms = (end_time - start_time) * 1000

print("\n" + "=" * 70)
print("EVIDENCIAS TÉCNICAS Y REPRODUCIBILIDAD")
print("=" * 70)
print(f"Sistema Operativo:    {platform.system()} {platform.release()} ({platform.machine()})")
print(f"Versión de Python:    {platform.python_version()}")
print(f"Versión de pandas:    {pd.__version__}")
print(f"Versión de numpy:     {np.__version__}")
print(f"Versión de sklearn:   {sys.modules['sklearn'].__version__}")
print(f"Versión de matplotlib:{sys.modules['matplotlib'].__version__}")
print(f"Versión de seaborn:   {sns.__version__}")
print(f"Tiempo de ejecución:  {execution_time_ms:.2f} ms ({execution_time_ms/1000:.4f} s)")
print("=" * 70)
print("Ejecución completada con éxito.")
