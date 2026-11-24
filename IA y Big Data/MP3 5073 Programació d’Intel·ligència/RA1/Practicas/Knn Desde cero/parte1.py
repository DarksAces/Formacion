"""
================================================================================
PRÁCTICA: KNN DESDE CERO - PROGRAMACIÓN DE IA (RA1)
FASE 1: Carga y Preparación de Datos (Train/Test Split 80/20)
================================================================================

Objetivo:
    1. Leer el archivo CSV con la biblioteca estándar `csv`.
    2. Extraer ÚNICAMENTE las 4 características morfológicas clásicas del Iris:
       - sepal_length (longitud del sépalo)
       - sepal_width  (anchura del sépalo)
       - petal_length (longitud del pétalo)
       - petal_width  (anchura del pétalo)
       y la variable objetivo (especie): `species`.
    3. Convertir las características numéricas a tipo `float`.
    4. Mezclar aleatoriamente las muestras de forma reproducible con `random.seed(42)`.
    5. Dividir manualmente los datos en:
       - 80% Conjunto de Entrenamiento (Train): el clasificador "memorizará" estos datos.
       - 20% Conjunto de Prueba (Test): datos no vistos para evaluar el clasificador.
    6. Verificar la distribución de clases para asegurar un reparto equilibrado.

Restricciones:
    - NO se permite el uso de scikit-learn, pandas ni numpy.
    - Se utilizan únicamente módulos estándar de Python: csv, random, collections, pathlib.
"""

import csv
import random
import sys
from collections import Counter
from pathlib import Path
from typing import List, Tuple

# Asegurar compatibilidad UTF-8 en consolas Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def cargar_datos_iris(
    ruta_archivo: str | Path
) -> Tuple[List[List[float]], List[str]]:
    """
    Lee el archivo CSV de Iris y extrae las 4 características numéricas y la etiqueta.

    Parámetros:
        ruta_archivo: Ruta al archivo CSV con los datos de Iris.

    Retorna:
        Una tupla (X, y):
        - X: Lista de listas con las 4 características en formato float.
             Ejemplo: [[5.1, 3.5, 1.4, 0.2], [4.9, 3.0, 1.4, 0.2], ...]
        - y: Lista de strings con la etiqueta/especie correspondiente.
             Ejemplo: ['setosa', 'setosa', 'versicolor', ...]
    """
    ruta = Path(ruta_archivo)
    if not ruta.is_file():
        raise FileNotFoundError(f"No se ha encontrado el archivo de datos en: {ruta}")

    # Lista de las 4 características clásicas que solicita la práctica
    columnas_caracteristicas = [
        "sepal_length",
        "sepal_width",
        "petal_length",
        "petal_width",
    ]
    columna_objetivo = "species"

    X: List[List[float]] = []
    y: List[str] = []

    # Abrimos el CSV con codificación utf-8 de forma segura
    with open(ruta, mode="r", encoding="utf-8") as archivo:
        # csv.DictReader nos permite acceder a los campos por su nombre de columna,
        # independientemente del orden o de si el CSV tiene 5 o 20 columnas.
        lector = csv.DictReader(archivo)

        # Verificamos que las columnas necesarias existan en el CSV
        nombres_columnas = lector.fieldnames or []
        for col in columnas_caracteristicas + [columna_objetivo]:
            if col not in nombres_columnas:
                raise KeyError(f"La columna obligatoria '{col}' no existe en el archivo CSV.")

        # Recorremos fila por fila
        for numero_fila, fila in enumerate(lector, start=2):
            try:
                # Convertimos cada una de las 4 características de texto (str) a decimal (float)
                caracteristicas_muestra = [
                    float(fila[col]) for col in columnas_caracteristicas
                ]
                etiqueta_muestra = str(fila[columna_objetivo]).strip()

                X.append(caracteristicas_muestra)
                y.append(etiqueta_muestra)

            except ValueError as error:
                # Si una fila tuviera datos corruptos o vacíos, notificamos la línea
                print(f"[Aviso] Fila {numero_fila} omitida por valor no numérico: {error}")

    return X, y


def dividir_entrenamiento_prueba(
    X: List[List[float]],
    y: List[str],
    porcentaje_entrenamiento: float = 0.8,
    semilla: int = 42,
) -> Tuple[List[List[float]], List[List[float]], List[str], List[str]]:
    """
    Divide los datos en conjuntos de entrenamiento y prueba (80/20 por defecto).

    ¿Por qué barajamos antes de dividir?
    En los datasets, las muestras suelen venir ordenadas por clase (todas las setosas,
    luego todas las versicolor, etc.). Si no barajáramos, el conjunto de entrenamiento
    solo tendría setosas y versicolors, y el de test solo virginicas.

    ¿Por qué usamos una semilla (random.seed)?
    La reproducibilidad es fundamental en ciencia de datos. Usando la misma semilla,
    obtendremos exactamente la misma partición en cada ejecución.

    Parámetros:
        X: Lista de características de todas las muestras.
        y: Lista de etiquetas de todas las muestras.
        porcentaje_entrenamiento: Proporción destinada a entrenamiento (0.8 = 80%).
        semilla: Número entero para fijar el generador de números aleatorios.

    Retorna:
        (X_train, X_test, y_train, y_test)
    """
    if len(X) != len(y):
        raise ValueError("X e y deben tener exactamente la misma cantidad de elementos.")

    total_muestras = len(X)
    if total_muestras == 0:
        raise ValueError("El conjunto de datos está vacío.")

    # Fijamos la semilla para que los resultados sean siempre reproducibles
    random.seed(semilla)

    # Creamos una lista de índices [0, 1, 2, ..., total_muestras - 1]
    # y la mezclamos aleatoriamente. De esta forma mantenemos sincronizados X e y.
    indices = list(range(total_muestras))
    random.shuffle(indices)

    # Calculamos el punto de corte para el 80%
    # Ejemplo: si total_muestras = 1200, punto_corte = 1200 * 0.8 = 960 muestras
    punto_corte = int(total_muestras * porcentaje_entrenamiento)

    indices_train = indices[:punto_corte]
    indices_test = indices[punto_corte:]

    # Extraemos las muestras según los índices asignados
    X_train = [X[i] for i in indices_train]
    y_train = [y[i] for i in indices_train]

    X_test = [X[i] for i in indices_test]
    y_test = [y[i] for i in indices_test]

    return X_train, X_test, y_train, y_test


def imprimir_resumen_particion(
    y_train: List[str],
    y_test: List[str]
) -> None:
    """
    Muestra en consola estadísticas de la partición para verificar que las clases
    estén adecuadamente representadas tanto en entrenamiento como en prueba.
    """
    conteo_train = Counter(y_train)
    conteo_test = Counter(y_test)
    total_train = len(y_train)
    total_test = len(y_test)
    total_general = total_train + total_test

    todas_las_clases = sorted(list(set(y_train) | set(y_test)))

    print("=" * 70)
    print("[RESUMEN] PREPARACIÓN DE DATOS (TRAIN / TEST SPLIT)")
    print("=" * 70)
    print(f"Total de muestras leídas:        {total_general}")
    print(f"Muestras de Entrenamiento (80%): {total_train}")
    print(f"Muestras de Prueba (20%):        {total_test}")
    print("-" * 70)
    print(f"{'Especie':<15} | {'Train (conteo / %)':<25} | {'Test (conteo / %)':<25}")
    print("-" * 70)

    for clase in todas_las_clases:
        n_train = conteo_train.get(clase, 0)
        pct_train = (n_train / total_train) * 100 if total_train > 0 else 0
        n_test = conteo_test.get(clase, 0)
        pct_test = (n_test / total_test) * 100 if total_test > 0 else 0

        info_train = f"{n_train} ({pct_train:.1f}%)"
        info_test = f"{n_test} ({pct_test:.1f}%)"
        print(f"{clase:<15} | {info_train:<25} | {info_test:<25}")

    print("=" * 70)


# ==============================================================================
# BLOQUE DE EJECUCIÓN PRINCIPAL (Para pruebas directas de la Fase 1)
# ==============================================================================
if __name__ == "__main__":
    # Determinamos la ruta del CSV relativo a este archivo
    directorio_actual = Path(__file__).resolve().parent
    ruta_csv = directorio_actual / "iris_extended.csv"

    print("\n[Paso 1] Cargando datos desde:", ruta_csv.name)
    X, y = cargar_datos_iris(ruta_csv)
    print(f"-> Se han cargado {len(X)} muestras con sus 4 características clásicas.")

    print("\n[Paso 2] Dividiendo en 80% Train y 20% Test (semilla=42)...")
    X_train, X_test, y_train, y_test = dividir_entrenamiento_prueba(
        X, y, porcentaje_entrenamiento=0.8, semilla=42
    )

    # Verificamos la distribución de las clases
    imprimir_resumen_particion(y_train, y_test)

    # Mostramos unas pocas muestras como ejemplo pedagógico
    print("\n[Ejemplo] 3 primeras muestras de ENTRENAMIENTO:")
    print("Formato: [sepal_length, sepal_width, petal_length, petal_width] -> especie")
    for i in range(min(3, len(X_train))):
        print(f"  Muestra {i + 1}: {X_train[i]} -> '{y_train[i]}'")

    print("\n[Ejemplo] 3 primeras muestras de PRUEBA (TEST):")
    for i in range(min(3, len(X_test))):
        print(f"  Muestra {i + 1}: {X_test[i]} -> '{y_test[i]}'")

    print("\n[OK] Fase 1 completada con éxito. Los datos están listos para la Fase 2 (KNN).")
