"""
================================================================================
M3 · PROGRAMACIÓN DE INTELIGENCIA ARTIFICIAL (RA1)
PRÁCTICA: KNN DESDE CERO - IMPLEMENTACIÓN MANUAL EN PYTHON
================================================================================

Integrantes del equipo: Práctica en parejas / Individual
Dataset: Iris (iris_extended.csv)
Características clásicas utilizadas (4 dimensiones):
    1. sepal_length (longitud del sépalo en cm)
    2. sepal_width  (anchura del sépalo en cm)
    3. petal_length (longitud del pétalo en cm)
    4. petal_width  (anchura del pétalo en cm)
Variable objetivo:
    - species (setosa, versicolor, virginica)

Restricciones académicas:
    - Sin librerías externas de machine learning o manipulación (scikit-learn, numpy, pandas).
    - Exclusivamente biblioteca estándar de Python: csv, math, random, collections, sys, pathlib, time.
================================================================================
"""

import csv
import math
import random
import sys
import time
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List, Tuple

# Asegurar compatibilidad de salida UTF-8 en consolas Windows (evita errores con cp1252)
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


# ==============================================================================
# BLOQUE 1: CARGA Y PREPROCESAMIENTO DE DATOS (FASE 1)
# ==============================================================================
def cargar_datos_iris(
    ruta_archivo: str | Path,
) -> Tuple[List[List[float]], List[str]]:
    """
    Carga el archivo CSV del dataset Iris y extrae las 4 características morfológicas
    y la clase/especie de cada flor.

    Parámetros:
        ruta_archivo: Ruta al archivo CSV con los datos.

    Retorna:
        Tuple[List[List[float]], List[str]]:
            - X: Matriz de características (lista de listas de floats de tamaño N x 4).
            - y: Vector de etiquetas reales (lista de strings de tamaño N).
    """
    ruta = Path(ruta_archivo)
    if not ruta.is_file():
        raise FileNotFoundError(f"No se ha encontrado el archivo de datos en: {ruta}")

    columnas_caracteristicas = [
        "sepal_length",
        "sepal_width",
        "petal_length",
        "petal_width",
    ]
    columna_objetivo = "species"

    X: List[List[float]] = []
    y: List[str] = []

    with open(ruta, mode="r", encoding="utf-8") as archivo:
        lector = csv.DictReader(archivo)
        for fila in lector:
            try:
                caracteristicas = [
                    float(fila[col]) for col in columnas_caracteristicas
                ]
                etiqueta = str(fila[columna_objetivo]).strip()
                X.append(caracteristicas)
                y.append(etiqueta)
            except (ValueError, KeyError):
                # Omitir filas corruptas o incompletas si existieran
                continue

    return X, y


def dividir_entrenamiento_prueba(
    X: List[List[float]],
    y: List[str],
    porcentaje_entrenamiento: float = 0.8,
    semilla: int = 42,
) -> Tuple[List[List[float]], List[List[float]], List[str], List[str]]:
    """
    Divide los datos en conjuntos de entrenamiento (80%) y prueba (20%) de forma aleatoria
    y reproducible fijando una semilla.

    Parámetros:
        X: Lista de características de todas las muestras.
        y: Lista de etiquetas de todas las muestras.
        porcentaje_entrenamiento: Proporción para entrenamiento (0.8 = 80%).
        semilla: Semilla entera para el generador pseudoaleatorio.

    Retorna:
        (X_train, X_test, y_train, y_test)
    """
    if len(X) != len(y):
        raise ValueError("X e y deben tener la misma cantidad de elementos.")

    total_muestras = len(X)
    random.seed(semilla)

    # Creamos y mezclamos los índices para no desalinear características y etiquetas
    indices = list(range(total_muestras))
    random.shuffle(indices)

    punto_corte = int(total_muestras * porcentaje_entrenamiento)
    indices_train = indices[:punto_corte]
    indices_test = indices[punto_corte:]

    X_train = [X[i] for i in indices_train]
    y_train = [y[i] for i in indices_train]
    X_test = [X[i] for i in indices_test]
    y_test = [y[i] for i in indices_test]

    return X_train, X_test, y_train, y_test


# ==============================================================================
# BLOQUE 2: ALGORITMO K-NEAREST NEIGHBORS (FASE 2)
# ==============================================================================
def distancia_euclidea(a: List[float], b: List[float]) -> float:
    """
    Calcula la distancia euclídea entre dos puntos en un espacio n-dimensional:
        d(a, b) = sqrt( sum( (a_i - b_i)^2 ) )

    Parámetros:
        a: Vector numérico de la primera muestra.
        b: Vector numérico de la segunda muestra.

    Retorna:
        float: Distancia geométrica euclídea (>= 0.0).
    """
    if len(a) != len(b):
        raise ValueError(f"Dimensión incompatible: dim(a)={len(a)}, dim(b)={len(b)}")

    suma_cuadrados = sum((val_a - val_b) ** 2 for val_a, val_b in zip(a, b))
    return math.sqrt(suma_cuadrados)


def obtener_vecinos(
    X: List[List[float]],
    muestra: List[float],
    k: int,
    y: List[str] | None = None,
) -> List[Tuple[float, str]]:
    """
    Encuentra los k vecinos más cercanos a una muestra dada calculando su
    distancia euclídea respecto a todos los puntos del conjunto X.

    Parámetros:
        X: Muestras de referencia / entrenamiento.
        muestra: Punto no visto a clasificar.
        k: Cantidad de vecinos a seleccionar.
        y: Lista de etiquetas de entrenamiento correspondientes a X (opcional).
           Si no se proporciona, se asume que cada fila de X incluye la clase al final.

    Retorna:
        List[Tuple[float, str]]: Lista de los k vecinos más cercanos ordenados de
        menor a mayor distancia con formato [(distancia, clase), ...].
    """
    if k <= 0:
        raise ValueError("El parámetro k debe ser mayor que cero.")

    distancias: List[Tuple[float, str]] = []

    if y is not None:
        for punto, etiqueta in zip(X, y):
            d = distancia_euclidea(muestra, punto)
            distancias.append((d, etiqueta))
    else:
        for fila in X:
            punto = [float(val) for val in fila[:-1]]
            etiqueta = str(fila[-1])
            d = distancia_euclidea(muestra, punto)
            distancias.append((d, etiqueta))

    # Ordenar por distancia ascendente y tomar los k primeros
    distancias.sort(key=lambda elem: elem[0])
    return distancias[:k]


def predecir_clase(vecinos: List[Any]) -> str:
    """
    Determina la clase mayoritaria entre los vecinos más cercanos mediante votación.

    Criterio de Desempate:
        En caso de que dos o más especies obtengan la misma cantidad de votos,
        se rompe el empate favoreciendo a la especie cuyo vecino esté a menor
        distancia euclídea absoluta (el vecino más próximo).

    Parámetros:
        vecinos: Lista con los vecinos (tuplas [distancia, etiqueta] o etiquetas).

    Retorna:
        str: Especie ganadora de la votación.
    """
    if not vecinos:
        raise ValueError("La lista de vecinos no puede estar vacía.")

    etiquetas: List[str] = []
    distancias: List[float] = []

    for v in vecinos:
        if isinstance(v, (tuple, list)) and len(v) >= 2:
            distancias.append(float(v[0]))
            etiquetas.append(str(v[1]))
        else:
            etiquetas.append(str(v))
            distancias.append(float("inf"))

    conteo = Counter(etiquetas)
    max_votos = max(conteo.values())
    candidatas = [clase for clase, votos in conteo.items() if votos == max_votos]

    # Si hay una ganadora clara sin empate
    if len(candidatas) == 1:
        return candidatas[0]

    # En caso de empate, gana la que tenga el vecino más cercano en distancia
    for d, c in zip(distancias, etiquetas):
        if c in candidatas:
            return c

    return candidatas[0]


def knn_predecir(
    X_train: List[List[float]],
    y_train: List[str],
    X_test: List[List[float]],
    k: int,
) -> List[str]:
    """
    Predice la especie para cada una de las muestras en X_test utilizando KNN.

    Parámetros:
        X_train: Características de entrenamiento.
        y_train: Clases de entrenamiento.
        X_test: Características de prueba.
        k: Número de vecinos.

    Retorna:
        List[str]: Lista de especies predichas para cada muestra de prueba.
    """
    predicciones: List[str] = []
    for muestra in X_test:
        vecinos = obtener_vecinos(X_train, muestra, k=k, y=y_train)
        prediccion = predecir_clase(vecinos)
        predicciones.append(prediccion)
    return predicciones


# ==============================================================================
# BLOQUE 3: MÉTRICAS Y EVALUACIÓN PROPIA (FASE 3)
# ==============================================================================
def calcular_accuracy(y_reales: List[str], y_predichas: List[str]) -> float:
    """
    Calcula la exactitud global: Total de aciertos / Total de muestras.
    """
    if len(y_reales) != len(y_predichas) or len(y_reales) == 0:
        raise ValueError("Listas inválidas o con longitudes discordantes.")
    aciertos = sum(1 for r, p in zip(y_reales, y_predichas) if r == p)
    return aciertos / len(y_reales)


def generar_matriz_confusion(
    y_reales: List[str],
    y_predichas: List[str],
    etiquetas: List[str] | None = None,
) -> Tuple[List[List[int]], List[str]]:
    """
    Genera la matriz de confusión cuadrática en código Python puro.
    Filas: Clases Reales.
    Columnas: Clases Predichas.
    """
    if etiquetas is None:
        etiquetas_ordenadas = sorted(list(set(y_reales) | set(y_predichas)))
    else:
        etiquetas_ordenadas = list(etiquetas)

    mapa_indices = {clase: i for i, clase in enumerate(etiquetas_ordenadas)}
    n = len(etiquetas_ordenadas)
    matriz = [[0 for _ in range(n)] for _ in range(n)]

    for real, pred in zip(y_reales, y_predichas):
        matriz[mapa_indices[real]][mapa_indices[pred]] += 1

    return matriz, etiquetas_ordenadas


def imprimir_matriz_confusion(
    matriz: List[List[int]],
    etiquetas: List[str],
    titulo: str = "MATRIZ DE CONFUSIÓN",
) -> None:
    """
    Visualiza la matriz de confusión con alineación tabular limpia.
    """
    ancho_nombre = max(len(c) for c in etiquetas) + 2
    ancho_celda = 12

    print("\n" + "=" * 75)
    print(f"{titulo:^75}")
    print("=" * 75)
    print("  Filas: Clase REAL  |  Columnas: Clase PREDICHA")
    print("-" * 75)

    cabecera = f"{'REAL \\ PRED':<{ancho_nombre + 2}}|"
    for clase in etiquetas:
        cabecera += f" {clase:^{ancho_celda}} |"
    cabecera += f" {'TOTAL REAL':^{ancho_celda}}"
    print(cabecera)
    print("-" * len(cabecera))

    totales_columna = [0] * len(etiquetas)
    total_general = 0

    for i, clase_real in enumerate(etiquetas):
        fila_str = f" {clase_real:<{ancho_nombre}}|"
        total_fila = sum(matriz[i])
        total_general += total_fila

        for j in range(len(etiquetas)):
            valor = matriz[i][j]
            totales_columna[j] += valor
            if i == j:
                fila_str += f" {str(valor) + ' *':^{ancho_celda}} |"
            else:
                fila_str += f" {str(valor):^{ancho_celda}} |"

        fila_str += f" {total_fila:^{ancho_celda}}"
        print(fila_str)

    print("-" * len(cabecera))

    pie_str = f" {'TOTAL PRED':<{ancho_nombre}}|"
    for tot in totales_columna:
        pie_str += f" {tot:^{ancho_celda}} |"
    pie_str += f" {total_general:^{ancho_celda}}"
    print(pie_str)
    print("=" * 75)
    print("(*) Los valores con asterisco indican la diagonal principal (Aciertos).")


# ==============================================================================
# BLOQUE 4: EXPERIMENTACIÓN CON HIPERPARÁMETRO k (FASE 4)
# ==============================================================================
def comparar_hiperparametro_k(
    X_train: List[List[float]],
    y_train: List[str],
    X_test: List[List[float]],
    y_test: List[str],
    valores_k: List[int],
) -> None:
    """
    Ejecuta el experimento comparativo para la lista de valores de k solicitados,
    imprimiendo la tabla resumen de rendimiento y las matrices individuales.
    """
    print("\n" + "=" * 80)
    print("      EXPERIMENTO: EVALUACIÓN DEL CLASIFICADOR CAMBIANDO k (1, 3, 5, 9)")
    print("=" * 80)
    print(
        f"{'k':^5} | {'Accuracy (%)':^14} | {'Aciertos':^10} | {'Fallos':^8} | "
        f"{'Tiempo (ms)':^13} | {'Errores (Set/Ver/Vir)':^21}"
    )
    print("-" * 80)

    matrices_guardadas: List[Tuple[int, float, List[List[int]], List[str]]] = []

    for k in valores_k:
        inicio = time.perf_counter()
        y_pred = knn_predecir(X_train, y_train, X_test, k=k)
        duracion_ms = (time.perf_counter() - inicio) * 1000

        acc = calcular_accuracy(y_test, y_pred)
        aciertos = sum(1 for r, p in zip(y_test, y_pred) if r == p)
        fallos = len(y_test) - aciertos

        matriz, clases = generar_matriz_confusion(y_test, y_pred)
        matrices_guardadas.append((k, acc, matriz, clases))

        errs_clase = []
        for i, c in enumerate(clases):
            total_c = sum(matriz[i])
            aciertos_c = matriz[i][i]
            errs_clase.append(total_c - aciertos_c)

        str_errs = " / ".join(str(e) for e in errs_clase)
        print(
            f"{k:^5} | {acc * 100:^14.2f} | {aciertos:^10} | {fallos:^8} | "
            f"{duracion_ms:^13.1f} | {str_errs:^21}"
        )

    print("=" * 80)

    # Imprimir matrices de cada k
    for k, acc, mat, cls_names in matrices_guardadas:
        titulo = f"MATRIZ DE CONFUSIÓN (k = {k} | Accuracy = {acc * 100:.2f}%)"
        imprimir_matriz_confusion(mat, cls_names, titulo=titulo)


# ==============================================================================
# FUNCIÓN PRINCIPAL / ENTRYPOINT DE LA PRÁCTICA
# ==============================================================================
def main() -> None:
    print("=" * 75)
    print("   PRÁCTICA: CLASIFICADOR KNN DESDE CERO (DATASET IRIS)")
    print("   Especialización en Inteligencia Artificial y Big Data")
    print("=" * 75)

    # 1. Localización del archivo CSV
    directorio_actual = Path(__file__).resolve().parent
    ruta_csv = directorio_actual / "iris_extended.csv"
    print(f"\n[1] Cargando datos desde '{ruta_csv.name}'...")
    X, y = cargar_datos_iris(ruta_csv)
    print(f"    -> Total de muestras leídas: {len(X)}")

    # 2. Partición Train / Test (80 / 20)
    print("\n[2] Preparando partición 80% Entrenamiento y 20% Prueba (seed=42)...")
    X_train, X_test, y_train, y_test = dividir_entrenamiento_prueba(
        X, y, porcentaje_entrenamiento=0.8, semilla=42
    )
    print(f"    -> Muestras de entrenamiento: {len(X_train)}")
    print(f"    -> Muestras de prueba:        {len(X_test)}")

    # 3. Ejecución obligatoria con k = 5
    K_BASE = 5
    print(f"\n[3] Ejecutando clasificador con k = {K_BASE}...")
    inicio_k5 = time.perf_counter()
    y_pred_k5 = knn_predecir(X_train, y_train, X_test, k=K_BASE)
    tiempo_k5 = (time.perf_counter() - inicio_k5) * 1000

    acc_k5 = calcular_accuracy(y_test, y_pred_k5)
    aciertos_k5 = sum(1 for r, p in zip(y_test, y_pred_k5) if r == p)
    print(f"    -> Tiempo de inferencia: {tiempo_k5:.1f} ms")
    print(f"    -> Aciertos:             {aciertos_k5} / {len(y_test)}")
    print(f"    -> Accuracy (Exactitud): {acc_k5 * 100:.2f}% ({acc_k5:.4f})")

    matriz_k5, clases_k5 = generar_matriz_confusion(y_test, y_pred_k5)
    imprimir_matriz_confusion(
        matriz_k5, clases_k5, titulo=f"MATRIZ DE CONFUSIÓN BASE (k = {K_BASE})"
    )

    # 4. Experimentación con k = 1, 3, 5, 9
    print("\n[4] Iniciando estudio experimental con diferentes valores de k...")
    comparar_hiperparametro_k(X_train, y_train, X_test, y_test, valores_k=[1, 3, 5, 9])

    print("\n" + "=" * 75)
    print("   [EJECUCIÓN COMPLETADA EXITOSAMENTE]")
    print("=" * 75)


if __name__ == "__main__":
    main()
