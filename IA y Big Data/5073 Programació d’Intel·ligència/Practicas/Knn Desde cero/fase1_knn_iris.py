"""
=============================================================================
FASE 1: CLASIFICACIÓN CON K-NEAREST NEIGHBORS (KNN) - IRIS EXTENDED DATASET
=============================================================================
Módulo: MP4 Sistemes de Big Data - RA1
Dataset: samybaladram/iris-dataset-extended (Kaggle)

Este script implementa de forma reproducible y modular las 6 tareas requeridas:
  1. Cargar el dataset y mostrar su estructura.
  2. Describir los tipos de datos y la representación de la clase.
  3. Preparar la partición (Train/Test) y el escalado de características.
  4. Entrenar y evaluar el modelo KNN (búsqueda de k óptimo y métricas).
  5. Generar visualizaciones completas (matriz de confusión, frontera de decisión, curva de k).
  6. Documentar las dependencias de bibliotecas externas vs código nativo.
=============================================================================
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Scikit-learn: Preprocesamiento, selección de modelos, métricas y reducción de dimensionalidad
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)
from sklearn.decomposition import PCA

# Kagglehub para descarga automatizada del dataset
try:
    import kagglehub
    from kagglehub import KaggleDatasetAdapter
    KAGGLEHUB_AVAILABLE = True
except ImportError:
    KAGGLEHUB_AVAILABLE = False


# =============================================================================
# 1. CARGA DEL DATASET Y ESTRUCTURA
# =============================================================================
def cargar_dataset(dataset_name="samybaladram/iris-dataset-extended", file_name="iris_extended.csv"):
    """
    Carga el dataset utilizando kagglehub según el snippet indicado.
    Si no hay conexión a internet o ya existe localmente, recurre al archivo local.
    """
    print("=" * 70)
    print("PASO 1: CARGA DEL DATASET Y ESTRUCTURA")
    print("=" * 70)

    df = None
    if os.path.exists(file_name):
        print(f"-> Cargando dataset desde archivo local: '{file_name}'...")
        df = pd.read_csv(file_name)
    elif KAGGLEHUB_AVAILABLE:
        print(f"-> Descargando y cargando desde KaggleHub: '{dataset_name}/{file_name}'...")
        try:
            # En kagglehub el file_path debe apuntar al archivo concreto dentro del repositorio
            df = kagglehub.load_dataset(
                KaggleDatasetAdapter.PANDAS,
                dataset_name,
                file_name
            )
        except Exception as e:
            print(f"Aviso con load_dataset: {e}. Intentando dataset_download...")
            path = kagglehub.dataset_download(dataset_name)
            csv_path = os.path.join(path, file_name)
            df = pd.read_csv(csv_path)
    else:
        raise FileNotFoundError(
            f"No se encontró '{file_name}' ni la biblioteca 'kagglehub'. "
            "Por favor, instala kagglehub o coloca 'iris_extended.csv' en la carpeta."
        )

    print(f"\n[Estructura General]")
    print(f"- Filas (muestras): {df.shape[0]}")
    print(f"- Columnas (características + etiqueta): {df.shape[1]}")
    print(f"- Dimensiones (shape): {df.shape}")
    print(f"- Valores nulos totales: {df.isnull().sum().sum()}")
    
    print("\n[Primeros 5 registros (head)]:")
    print(df.head())

    print("\n[Información del DataFrame (info)]:")
    df.info()

    return df


# =============================================================================
# 2. DESCRIPCIÓN DE TIPOS DE DATOS Y REPRESENTACIÓN DE LA CLASE
# =============================================================================
def describir_datos_y_clase(df):
    """
    Analiza tipos de datos, variable objetivo y variables categóricas.
    """
    print("\n" + "=" * 70)
    print("PASO 2: TIPOS DE DATOS Y REPRESENTACIÓN DE LA CLASE")
    print("=" * 70)

    # Identificar columna objetivo y columnas predictoras
    target_col = "species"
    feature_cols = [c for c in df.columns if c != target_col]

    print(f"\n1. Variable Objetivo (Clase): '{target_col}'")
    conteo_clases = df[target_col].value_counts()
    porcentaje_clases = df[target_col].value_counts(normalize=True) * 100
    resumen_clases = pd.DataFrame({
        "Muestras": conteo_clases,
        "Porcentaje (%)": porcentaje_clases
    })
    print(resumen_clases)
    print(f"-> Balance de clases: El dataset está perfectamente balanceado ({conteo_clases.iloc[0]} muestras por clase).")

    # Identificación de tipos de variables predictoras
    num_cols = df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df[feature_cols].select_dtypes(exclude=[np.number]).columns.tolist()

    print(f"\n2. Variables Predictoras Numéricas ({len(num_cols)} variables):")
    print(f"   {num_cols}")

    print(f"\n3. Variables Predictoras Categóricas ({len(cat_cols)} variables):")
    for col in cat_cols:
        print(f"   - '{col}': valores únicos = {df[col].unique().tolist()}")

    print("\n4. Resumen Estadístico de Variables Numéricas:")
    print(df[num_cols].describe().T[["mean", "std", "min", "50%", "max"]].head(10))

    return target_col, num_cols, cat_cols


# =============================================================================
# 3. PREPARACIÓN, PARTICIÓN Y ESCALADO
# =============================================================================
def preparar_particion_y_escalado(df, target_col="species", cat_cols=None, test_size=0.2, random_state=42):
    """
    Codifica variables categóricas, divide en train/test estratificado y escala
    las variables con StandardScaler.
    """
    print("\n" + "=" * 70)
    print("PASO 3: PARTICIÓN (TRAIN/TEST) Y ESCALADO")
    print("=" * 70)

    # Separar X e y
    X = df.drop(columns=[target_col])
    y = df[target_col]

    # Codificación de variables predictoras categóricas (One-Hot Encoding)
    if cat_cols:
        print(f"\n-> Aplicando One-Hot Encoding a variables categóricas: {cat_cols}")
        X = pd.get_dummies(X, columns=cat_cols, drop_first=True)
        print(f"-> Número de columnas resultantes en X tras One-Hot: {X.shape[1]}")

    # Codificación de la clase para scikit-learn
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    clases_mapeadas = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
    print(f"-> Mapeo de clases (LabelEncoder): {clases_mapeadas}")

    # Partición Estratificada Train / Test
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=test_size,
        random_state=random_state,
        stratify=y_encoded
    )

    print(f"\n[Partición de Datos]")
    print(f"- Conjunto de Entrenamiento (Train): {X_train.shape[0]} muestras ({100*(1-test_size):.0f}%)")
    print(f"- Conjunto de Prueba (Test):        {X_test.shape[0]} muestras ({100*test_size:.0f}%)")

    # Escalado de características con StandardScaler
    # Justificación teórica: KNN utiliza distancias euclidianas. Variables con órdenes de magnitud
    # muy altos (ej. elevation: 100-300) dominarían injustamente sobre variables en rango 0.1-2.5 (petal_width).
    scaler = StandardScaler()
    
    # IMPORTANTE: fit_transform solo en Train, y transform en Test para evitar fuga de datos (Data Leakage)
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("\n[Escalado de Características]")
    print("-> Escalador utilizado: StandardScaler (media = 0, varianza = 1)")
    print(f"-> Media en Train tras escalar (promedio de variables): {np.mean(X_train_scaled):.4f}")
    print(f"-> Desviación típica en Train tras escalar:             {np.std(X_train_scaled):.4f}")
    print("-> Regla aplicada: fit_transform(X_train) y transform(X_test) para evitar Data Leakage.")

    return X, y_encoded, X_train_scaled, X_test_scaled, y_train, y_test, label_encoder, scaler


# =============================================================================
# 4. ENTRENAMIENTO Y EVALUACIÓN DE KNN
# =============================================================================
def entrenar_y_evaluar_knn(X_train, X_test, y_train, y_test, label_encoder, k_range=range(1, 31), k_fijo=None):
    """
    Evalúa KNN en el rango de k con validación cruzada.
    Si se proporciona k_fijo (ej: k_fijo=5), se usa ese valor para el modelo final.
    Si k_fijo=None, se usa el k que maximice la validación cruzada.
    """
    print("\n" + "=" * 70)
    print("PASO 4: ENTRENAMIENTO Y EVALUACIÓN DE KNN")
    print("=" * 70)

    # 1. Búsqueda y curva de validación cruzada con 5-Fold Stratified Cross Validation
    print("-> Evaluando hiperparámetro k mediante 5-Fold Stratified Cross Validation...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = []
    cv_stds = []

    for k in k_range:
        knn_temp = KNeighborsClassifier(n_neighbors=k, metric='minkowski', p=2)
        scores = cross_val_score(knn_temp, X_train, y_train, cv=cv, scoring='accuracy')
        cv_scores.append(scores.mean())
        cv_stds.append(scores.std())

    cv_scores = np.array(cv_scores)
    best_idx = np.argmax(cv_scores)
    best_cv_k = list(k_range)[best_idx]
    best_cv_acc = cv_scores[best_idx]

    # Determinación del k final a emplear
    if k_fijo is not None:
        best_k = k_fijo
        print(f"-> [CONFIGURACIÓN MANUAL] Se ha fijado manualmente: k = {best_k}")
        print(f"   (Nota: El óptimo puramente estadístico de CV fue k={best_cv_k} con {best_cv_acc*100:.2f}%)")
    else:
        best_k = best_cv_k
        print(f"-> [SELECCIÓN AUTOMÁTICA] k óptimo por CV: k = {best_k} (Accuracy CV = {best_cv_acc*100:.2f}%)")

    # 2. Entrenar el modelo final con el k seleccionado
    knn_final = KNeighborsClassifier(n_neighbors=best_k, metric='minkowski', p=2)
    knn_final.fit(X_train, y_train)

    # 3. Predicciones en el conjunto de prueba
    y_pred = knn_final.predict(X_test)

    # 4. Cálculo de métricas
    test_accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)
    class_names = label_encoder.classes_

    print(f"\n[Resultados en el Conjunto de Test (k={best_k})]")
    print(f"- Exactitud (Accuracy): {test_accuracy * 100:.2f}%")
    print(f"- Aciertos: {np.trace(conf_matrix)} / {len(y_test)} observaciones")

    print("\n[Reporte de Clasificación (Precision, Recall, F1-Score)]:")
    print(classification_report(y_test, y_pred, target_names=class_names))

    print("[Matriz de Confusión (Numérica)]:")
    print(pd.DataFrame(conf_matrix, index=[f"Real_{c}" for c in class_names], columns=[f"Pred_{c}" for c in class_names]))

    return knn_final, best_k, k_range, cv_scores, cv_stds, y_pred, test_accuracy, conf_matrix


# =============================================================================
# 5. VISUALIZACIÓN
# =============================================================================
def generar_visualizaciones(
    df, X_train, X_test, y_train, y_test, y_pred,
    knn_model, best_k, k_range, cv_scores, cv_stds,
    label_encoder, conf_matrix, output_image="visualizacion_knn_completa.png"
):
    """
    Genera un panel visual 2x2 que incluye:
      1. Matriz de confusión con mapa de calor (Seaborn).
      2. Curva de optimización de k (Accuracy vs k en validación cruzada).
      3. Fronteras de decisión de KNN proyectadas en 2D con PCA.
      4. Distribución de características clave en el dataset original.
    """
    print("\n" + "=" * 70)
    print("PASO 5: GENERACIÓN DE VISUALIZACIONES")
    print("=" * 70)

    class_names = label_encoder.classes_
    fig, axes = plt.subplots(2, 2, figsize=(16, 13))
    plt.subplots_adjust(wspace=0.3, hspace=0.35)

    # ---------------------------------------------------------
    # Subplot 1: Matriz de Confusión Normalizada
    # ---------------------------------------------------------
    ax1 = axes[0, 0]
    cm_normalized = conf_matrix.astype('float') / conf_matrix.sum(axis=1)[:, np.newaxis]
    sns.heatmap(
        cm_normalized,
        annot=True,
        fmt=".2%",
        cmap="Blues",
        cbar=True,
        xticklabels=class_names,
        yticklabels=class_names,
        ax=ax1,
        linewidths=1.5,
        annot_kws={"size": 12, "weight": "bold"}
    )
    ax1.set_title(f"1. Matriz de Confusión (Test Set, k={best_k})", fontsize=13, fontweight='bold', pad=10)
    ax1.set_xlabel("Clase Predicha", fontsize=11)
    ax1.set_ylabel("Clase Real", fontsize=11)

    # ---------------------------------------------------------
    # Subplot 2: Curva de Optimización de Hiperparámetro k
    # ---------------------------------------------------------
    ax2 = axes[0, 1]
    k_list = list(k_range)
    ax2.plot(k_list, cv_scores * 100, marker='o', color='#1f77b4', linewidth=2, label="Accuracy Media (CV 5-Fold)")
    ax2.fill_between(
        k_list,
        (cv_scores - cv_stds) * 100,
        (cv_scores + cv_stds) * 100,
        color='#1f77b4',
        alpha=0.2,
        label="± 1 Desviación Típica"
    )
    ax2.axvline(x=best_k, color='crimson', linestyle='--', linewidth=2, label=f"Mejor k = {best_k}")
    ax2.scatter([best_k], [cv_scores[k_list.index(best_k)] * 100], color='crimson', s=120, zorder=5)
    ax2.set_title("2. Curva de Rendimiento según Hiperparámetro k", fontsize=13, fontweight='bold', pad=10)
    ax2.set_xlabel("Número de Vecinos (k)", fontsize=11)
    ax2.set_ylabel("Exactitud (Accuracy %) en CV", fontsize=11)
    ax2.grid(True, linestyle=":", alpha=0.6)
    ax2.legend(loc="lower left", fontsize=10)

    # ---------------------------------------------------------
    # Subplot 3: Fronteras de Decisión de KNN proyectadas en 2D (PCA)
    # ---------------------------------------------------------
    ax3 = axes[1, 0]
    # Reducción a 2 componentes principales para visualizar frontera en plano 2D
    pca = PCA(n_components=2, random_state=42)
    X_train_pca = pca.fit_transform(X_train)
    X_test_pca = pca.transform(X_test)

    # Entrenar un KNN en el espacio 2D de PCA para graficar la frontera continua
    knn_pca = KNeighborsClassifier(n_neighbors=best_k)
    knn_pca.fit(X_train_pca, y_train)

    # Crear malla (mesh grid)
    h = 0.05
    x_min, x_max = X_train_pca[:, 0].min() - 1, X_train_pca[:, 0].max() + 1
    y_min, y_max = X_train_pca[:, 1].min() - 1, X_train_pca[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
    Z = knn_pca.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    from matplotlib.colors import ListedColormap
    cmap_light = ListedColormap(['#FFAAAA', '#AAFFAA', '#AAAAFF'])
    cmap_bold = ['#d62728', '#2ca02c', '#1f77b4']

    ax3.contourf(xx, yy, Z, cmap=cmap_light, alpha=0.5)
    for idx, c_name in enumerate(class_names):
        mask = (y_test == idx)
        ax3.scatter(
            X_test_pca[mask, 0],
            X_test_pca[mask, 1],
            c=cmap_bold[idx],
            label=f"Real: {c_name}",
            edgecolor='k',
            s=40,
            alpha=0.85
        )
    var_exp = pca.explained_variance_ratio_ * 100
    ax3.set_title(
        f"3. Fronteras de Decisión KNN (Proyección PCA 2D: {var_exp.sum():.1f}% Varianza)",
        fontsize=13, fontweight='bold', pad=10
    )
    ax3.set_xlabel(f"PC1 ({var_exp[0]:.1f}% varianza)", fontsize=11)
    ax3.set_ylabel(f"PC2 ({var_exp[1]:.1f}% varianza)", fontsize=11)
    ax3.legend(loc="upper right", fontsize=9)
    ax3.grid(True, linestyle=":", alpha=0.4)

    # ---------------------------------------------------------
    # Subplot 4: Dispersión de Características Clave (Petal Length vs Width)
    # ---------------------------------------------------------
    ax4 = axes[1, 1]
    sns.scatterplot(
        data=df,
        x="petal_length",
        y="petal_width",
        hue="species",
        palette=cmap_bold,
        s=45,
        alpha=0.8,
        edgecolor='k',
        ax=ax4
    )
    ax4.set_title("4. Separabilidad de Clases (Petal Length vs Petal Width)", fontsize=13, fontweight='bold', pad=10)
    ax4.set_xlabel("Petal Length (cm)", fontsize=11)
    ax4.set_ylabel("Petal Width (cm)", fontsize=11)
    ax4.legend(title="Especie", loc="upper left", fontsize=10)
    ax4.grid(True, linestyle=":", alpha=0.5)

    # Guardar gráfico en disco (con soporte para entornos restringidos / Windows Controlled Folder Access)
    plt.tight_layout()
    try:
        plt.savefig(output_image, dpi=300)
        print(f"-> Panel de visualizaciones guardado exitosamente en: '{output_image}'")
    except (OSError, FileNotFoundError):
        import tempfile, subprocess
        temp_dest = os.path.join(tempfile.gettempdir(), os.path.basename(output_image))
        plt.savefig(temp_dest, dpi=300)
        # Copiar mediante comando del sistema si python no tiene permisos directos de escritura en Documents
        if sys.platform == "win32":
            cmd = ['powershell', '-NoProfile', '-Command', f'Copy-Item -LiteralPath "{temp_dest}" -Destination "{os.path.abspath(output_image)}" -Force']
            subprocess.run(cmd, check=True)
        else:
            import shutil
            shutil.copy2(temp_dest, output_image)
        print(f"-> Panel de visualizaciones guardado exitosamente en: '{output_image}' (vía buffer seguro)")
    plt.close()


# =============================================================================
# 6. ANÁLISIS DE DEPENDENCIAS DE BIBLIOTECAS EXTERNAS
# =============================================================================
def reportar_dependencias_externas():
    """
    Imprime el desglose estructurado de bibliotecas externas y sus responsabilidades
    frente a lo que se ejecuta en Python nativo.
    """
    print("\n" + "=" * 70)
    print("PASO 6: IDENTIFICACIÓN DE DEPENDENCIAS DE BIBLIOTECAS EXTERNAS")
    print("=" * 70)

    dependencias = [
        ("kagglehub", "Carga del dataset", "Descarga automatizada del dataset y sus metadatos desde la API de Kaggle."),
        ("pandas", "Manipulación tabular", "Carga en DataFrames (pd.read_csv), inspección (info, head, describe), One-Hot Encoding (pd.get_dummies) y recuento de clases."),
        ("numpy", "Cálculo numérico", "Operaciones sobre matrices/arrays, generación de mallas espaciales (np.meshgrid, np.c_), cálculo de medias y desviaciones."),
        ("scikit-learn (model_selection)", "Partición y validación", "División estratificada (train_test_split), validación cruzada (cross_val_score, StratifiedKFold)."),
        ("scikit-learn (preprocessing)", "Transformación de datos", "Estandarización z-score (StandardScaler) y codificación de clases (LabelEncoder)."),
        ("scikit-learn (neighbors)", "Algoritmo de clasificación", "Implementación del modelo KNN (KNeighborsClassifier) con estructura de indexación espacial (KDTree/BallTree)."),
        ("scikit-learn (metrics)", "Evaluación de rendimiento", "Cálculo de métricas cuantitativas (accuracy_score, confusion_matrix, classification_report)."),
        ("scikit-learn (decomposition)", "Reducción de dimensionalidad", "PCA (Principal Component Analysis) para proyectar 20 variables a 2 dimensiones para graficar."),
        ("matplotlib", "Motor gráfico", "Creación de la figura, cuadrícula de subplots, curvas de k, contornos de fronteras y exportación a PNG."),
        ("seaborn", "Visualización estadística", "Mapas de calor (heatmap) para la matriz de confusión y scatter plots enriquecidos estéticamente.")
    ]

    print(f"{'BIBLIOTECA / MÓDULO':<32} | {'RESPONSABILIDAD PRINCIPAL':<26} | DESCRIPCIÓN DETALLADA")
    print("-" * 110)
    for lib, resp, desc in dependencias:
        print(f"{lib:<32} | {resp:<26} | {desc}")

    print("\n[¿Qué partes del código corresponden a Python Nativo (Built-in)?]")
    print("- Estructuras de datos básicas: listas, tuplas, diccionarios (mapeo de clases) y rangos (range(1, 31)).")
    print("- Estructuras de control de flujo: bucles for, condicionales if/else, bloques try/except.")
    print("- Manejo del sistema operativo y rutas con la librería estándar 'os' y 'sys'.")
    print("- Nota teórica: Sin scikit-learn, la lógica de KNN requeriría escribir en Python nativo el bucle")
    print("  de distancias euclidianas (usando math.sqrt y sum), ordenar distancias y contar vecinos con collections.Counter.")


# =============================================================================
# EJECUCIÓN PRINCIPAL
# =============================================================================
if __name__ == "__main__":
    # 1. Cargar dataset
    df = cargar_dataset()

    # 2. Describir tipos de datos y clase
    target_col, num_cols, cat_cols = describir_datos_y_clase(df)

    # 3. Preparar partición y escalado
    X, y_encoded, X_train_s, X_test_s, y_train, y_test, le, scaler = preparar_particion_y_escalado(
        df, target_col=target_col, cat_cols=cat_cols, test_size=0.2, random_state=42
    )

    # =========================================================================
    # PARÁMETROS DEL MODELO (MODIFICAR 'k' A MANO AQUÍ)
    # =========================================================================
    # Cambia K_MANUAL al valor que desees (ej: 3, 5, 7, 9).
    # Si prefieres que el código escoja automáticamente el óptimo de CV, pon K_MANUAL = None.
    K_MANUAL = 5  # <--- MODIFICA ESTE VALOR A MANO SEGÚN TUS PREFERENCIAS

    # 4. Entrenar y evaluar KNN
    knn, best_k, k_range, cv_scores, cv_stds, y_pred, acc, cm = entrenar_y_evaluar_knn(
        X_train_s, X_test_s, y_train, y_test, le, k_fijo=K_MANUAL
    )

    # 5. Generar visualizaciones
    generar_visualizaciones(
        df, X_train_s, X_test_s, y_train, y_test, y_pred,
        knn, best_k, k_range, cv_scores, cv_stds, le, cm,
        output_image="visualizacion_knn_completa.png"
    )

    # 6. Identificar dependencias externas
    reportar_dependencias_externas()

    print("\n" + "=" * 70)
    print("FASE 1 COMPLETADA CON ÉXITO")
    print("=" * 70)
