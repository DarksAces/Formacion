"""
================================================================================
PRÁCTICA: KNN DESDE CERO - PROGRAMACIÓN DE IA (RA1)
FASE 2: Construcción del Algoritmo KNN Paso a Paso
================================================================================

Objetivo:
    Implementar las 4 funciones centrales del algoritmo K-Nearest Neighbors:
    1. distancia_euclidea(a, b): Cálculo geométrico de distancia entre dos vectores.
    2. obtener_vecinos(X, muestra, k, y): Búsqueda y ordenación de los k puntos más cercanos.
    3. predecir_clase(vecinos): Votación mayoritaria con desempate inteligente.
    4. knn_predecir(X_train, y_train, X_test, k): Clasificación completa de un conjunto test.

Restricciones:
    - NO se permite el uso de scikit-learn, pandas ni numpy.
    - Se utilizan únicamente módulos estándar de Python: math, collections, typing.
"""

import math
import sys
from collections import Counter
from pathlib import Path
from typing import Any, List, Tuple, Union

# Reutilizamos las funciones de carga y partición de la Fase 1
from parte1 import cargar_datos_iris, dividir_entrenamiento_prueba

# Asegurar compatibilidad UTF-8 en consolas Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


# ==============================================================================
# FUNCIÓN 1: DISTANCIA EUCLÍDEA
# ==============================================================================
def distancia_euclidea(a: List[float], b: List[float]) -> float:
    """
    Calcula la distancia euclídea (en línea recta) entre dos puntos en n dimensiones.

    Fórmula matemática:
        d(a, b) = sqrt( sum( (a_i - b_i)^2 ) )

    Intuición:
        Es la generalización del Teorema de Pitágoras a 4 dimensiones (longitud y
        anchura de sépalos y pétalos). Cuanto menor sea la distancia, más se
        parecen físicamente las dos flores.

    Parámetros:
        a: Lista de números float con las características del primer punto.
        b: Lista de números float con las características del segundo punto.

    Retorna:
        float: Distancia euclídea (siempre >= 0.0).

    Ejemplo:
        distancia_euclidea([0, 0], [3, 4]) -> sqrt(3^2 + 4^2) = 5.0
    """
    if len(a) != len(b):
        raise ValueError(
            f"Los vectores deben tener la misma dimensión. Se recibió dim(a)={len(a)} y dim(b)={len(b)}"
        )

    # Sumamos el cuadrado de la diferencia dimensión por dimensión
    suma_cuadrados = 0.0
    for i in range(len(a)):
        diferencia = a[i] - b[i]
        suma_cuadrados += diferencia * diferencia  # Más rápido que diferencia ** 2

    # Raíz cuadrada del total
    return math.sqrt(suma_cuadrados)


# ==============================================================================
# FUNCIÓN 2: OBTENER VECINOS MÁS CERCANOS
# ==============================================================================
def obtener_vecinos(
    X: List[List[float]],
    muestra: List[float],
    k: int,
    y: List[str] | None = None,
) -> List[Tuple[float, str]]:
    """
    Localiza los 'k' vecinos de entrenamiento más próximos a una muestra dada.

    ¿Cómo funciona?
    1. Recorre cada muestra del conjunto de entrenamiento X.
    2. Calcula la distancia euclídea entre la muestra a clasificar y cada punto de entrenamiento.
    3. Asocia a cada distancia su etiqueta de clase correspondiente.
    4. Ordena todas las distancias de menor a mayor.
    5. Devuelve únicamente los primeros 'k' elementos (los más cercanos).

    Parámetros:
        X: Muestras de entrenamiento (lista de listas de floats).
        muestra: Vector de características de la flor que queremos predecir.
        k: Número de vecinos a considerar (ej: 1, 3, 5, 9).
        y: Lista de etiquetas de entrenamiento correspondientes a cada fila de X.
           (Si no se pasa, asume que la última columna de cada fila en X es la etiqueta).

    Retorna:
        Lista de tuplas de tamaño k: [(distancia_1, clase_1), (distancia_2, clase_2), ...]
        ordenada de menor a mayor distancia.
    """
    if k <= 0:
        raise ValueError("El valor de k debe ser un entero positivo mayor que cero.")
    if k > len(X):
        raise ValueError(
            f"El valor de k ({k}) no puede ser mayor que el total de muestras ({len(X)})."
        )

    distancias_con_clase: List[Tuple[float, str]] = []

    # Caso estándar: se proporcionan X e y por separado
    if y is not None:
        if len(X) != len(y):
            raise ValueError("X e y deben tener la misma longitud.")
        for punto_entrenamiento, etiqueta in zip(X, y):
            distancia = distancia_euclidea(muestra, punto_entrenamiento)
            distancias_con_clase.append((distancia, etiqueta))
    else:
        # Caso alternativo: cada fila de X contiene las características y al final la clase
        for fila in X:
            punto_entrenamiento = [float(v) for v in fila[:-1]]
            etiqueta = str(fila[-1])
            distancia = distancia_euclidea(muestra, punto_entrenamiento)
            distancias_con_clase.append((distancia, etiqueta))

    # Ordenamos de menor a mayor distancia
    # La clave de ordenación es el primer elemento de la tupla: distancia
    distancias_con_clase.sort(key=lambda elemento: elemento[0])

    # Devolvemos los k primeros
    return distancias_con_clase[:k]


# ==============================================================================
# FUNCIÓN 3: PREDECIR CLASE (VOTACIÓN POR MAYORÍA)
# ==============================================================================
def predecir_clase(vecinos: List[Any]) -> str:
    """
    Determina la clase ganadora entre los 'k' vecinos más cercanos mediante voto mayoritario.

    Criterio de Desempate:
        Si dos o más clases empatan en número de votos (por ejemplo, 1 voto setosa y 1 voto versicolor),
        gana la clase cuyo vecino esté a menor distancia euclídea (el vecino más próximo).

    Parámetros:
        vecinos: Lista con los k vecinos. Puede ser:
                 - Lista de tuplas: [(distancia, clase), ...]
                 - Lista de etiquetas: ['setosa', 'setosa', 'versicolor']

    Retorna:
        str: Nombre de la especie ganadora.
    """
    if not vecinos:
        raise ValueError("La lista de vecinos no puede estar vacía.")

    # Normalizamos la entrada a dos listas paralelas: etiquetas y distancias
    etiquetas: List[str] = []
    distancias: List[float] = []

    for elemento in vecinos:
        if isinstance(elemento, (tuple, list)) and len(elemento) >= 2:
            distancias.append(float(elemento[0]))
            etiquetas.append(str(elemento[1]))
        else:
            # Si solo se pasaron las clases como strings
            etiquetas.append(str(elemento))
            distancias.append(float("inf"))

    # Contamos la frecuencia de cada especie
    conteo_votos = Counter(etiquetas)

    # Obtenemos el número máximo de votos obtenido por alguna clase
    max_votos = max(conteo_votos.values())

    # Identificamos todas las clases que hayan obtenido ese número máximo de votos
    candidatas = [clase for clase, votos in conteo_votos.items() if votos == max_votos]

    # Si solo hay una candidata, es la ganadora indiscutible
    if len(candidatas) == 1:
        return candidatas[0]

    # Si hay empate entre varias clases:
    # Desempatamos eligiendo la clase que aparece primero en la lista de vecinos
    # (que ya viene ordenada de menor a mayor distancia).
    for dist, clase in zip(distancias, etiquetas):
        if clase in candidatas:
            return clase

    # En caso de no tener distancias, devolvemos la primera candidata
    return candidatas[0]


# ==============================================================================
# FUNCIÓN 4: KNN PREDECIR (ORQUESTADOR SOBRE X_TEST)
# ==============================================================================
def knn_predecir(
    X_train: List[List[float]],
    y_train: List[str],
    X_test: List[List[float]],
    k: int,
) -> List[str]:
    """
    Clasifica cada una de las muestras del conjunto de prueba X_test utilizando KNN.

    Algoritmo:
        Para cada muestra en X_test:
            1. Encontrar los k vecinos más cercanos en X_train usando 'obtener_vecinos'.
            2. Votar la clase mayoritaria usando 'predecir_clase'.
            3. Guardar la predicción.

    Parámetros:
        X_train: Características de entrenamiento.
        y_train: Etiquetas de entrenamiento.
        X_test: Características de prueba a clasificar.
        k: Número de vecinos a consultar.

    Retorna:
        List[str]: Lista con las especies predichas para cada muestra de X_test.
    """
    predicciones: List[str] = []

    for muestra in X_test:
        vecinos = obtener_vecinos(X_train, muestra, k=k, y=y_train)
        clase_predicha = predecir_clase(vecinos)
        predicciones.append(clase_predicha)

    return predicciones


# ==============================================================================
# DEMOSTRACIÓN DIDÁCTICA Y PRUEBAS UNITARIAS
# ==============================================================================
if __name__ == "__main__":
    print("=" * 70)
    print("PRUEBAS DE LA FASE 2: ALGORITMO KNN PASO A PASO")
    print("=" * 70)

    # --------------------------------------------------------------------------
    # Prueba 1: Distancia Euclídea
    # --------------------------------------------------------------------------
    print("\n[Prueba 1] Verificación de 'distancia_euclidea':")
    p1 = [0.0, 0.0]
    p2 = [3.0, 4.0]
    dist_p1_p2 = distancia_euclidea(p1, p2)
    print(f"  Distancia entre {p1} y {p2} = {dist_p1_p2} (Esperado: 5.0)")
    assert math.isclose(dist_p1_p2, 5.0), "Error en el cálculo de distancia euclídea 2D."

    flor_a = [5.1, 3.5, 1.4, 0.2]
    flor_b = [4.9, 3.0, 1.4, 0.2]
    dist_iris = distancia_euclidea(flor_a, flor_b)
    print(f"  Distancia 4D entre dos flores Iris = {dist_iris:.4f} cm")
    print("  -> OK: distancia_euclidea funciona correctamente.")

    # --------------------------------------------------------------------------
    # Prueba 2: Votación y Desempate
    # --------------------------------------------------------------------------
    print("\n[Prueba 2] Verificación de 'predecir_clase' con mayoría y desempate:")
    # Caso claro: 2 setosa vs 1 versicolor
    vecinos_claros = [(0.15, "setosa"), (0.25, "setosa"), (0.40, "versicolor")]
    pred_clara = predecir_clase(vecinos_claros)
    print(f"  Vecinos: {vecinos_claros} -> Predicción: '{pred_clara}'")
    assert pred_clara == "setosa", "Error en votación mayoritaria simple."

    # Caso de empate: 1 setosa (a dist 0.10) vs 1 versicolor (a dist 0.30)
    vecinos_empate = [(0.10, "setosa"), (0.30, "versicolor")]
    pred_empate = predecir_clase(vecinos_empate)
    print(f"  Empate: {vecinos_empate} -> Predicción por proximidad: '{pred_empate}'")
    assert pred_empate == "setosa", "Error en el criterio de desempate por distancia."
    print("  -> OK: predecir_clase gestiona mayorías y empates adecuadamente.")

    # --------------------------------------------------------------------------
    # Prueba 3: Integración completa con el Dataset Iris (k = 5)
    # --------------------------------------------------------------------------
    print("\n[Prueba 3] Integrando con datos reales de Iris (iris_extended.csv)...")
    directorio_actual = Path(__file__).resolve().parent
    ruta_csv = directorio_actual / "iris_extended.csv"

    X, y = cargar_datos_iris(ruta_csv)
    X_train, X_test, y_train, y_test = dividir_entrenamiento_prueba(
        X, y, porcentaje_entrenamiento=0.8, semilla=42
    )

    k_prueba = 5
    print(f"  Ejecutando knn_predecir sobre {len(X_test)} muestras de test con k = {k_prueba}...")
    y_pred = knn_predecir(X_train, y_train, X_test, k=k_prueba)

    # Calculamos aciertos
    aciertos = sum(1 for real, pred in zip(y_test, y_pred) if real == pred)
    exactitud = aciertos / len(y_test)

    print("\n" + "=" * 70)
    print("RESULTADO PRELIMINAR DE EVALUACIÓN (k = 5)")
    print("=" * 70)
    print(f"  Total de flores evaluadas en Test: {len(y_test)}")
    print(f"  Aciertos del clasificador:         {aciertos}")
    print(f"  Errores:                           {len(y_test) - aciertos}")
    print(f"  Exactitud (Accuracy):              {exactitud * 100:.2f}%")
    print("=" * 70)

    # Mostramos las primeras 5 predicciones detalladas
    print("\nDetalle de las 5 primeras predicciones de prueba:")
    for i in range(5):
        estado = "CORRECTO" if y_test[i] == y_pred[i] else "ERROR"
        print(
            f"  Flor {i + 1}: Real='{y_test[i]:<10}' | Predicho='{y_pred[i]:<10}' -> [{estado}]"
        )

    print("\n[OK] Fase 2 completada con éxito.")
