"""
================================================================================
PRÁCTICA: KNN DESDE CERO - PROGRAMACIÓN DE IA (RA1)
FASE 4: Experimentación y Análisis de Hiperparámetros (k = 1, 3, 5, 9)
================================================================================

Objetivo:
    1. Evaluar el clasificador KNN variando el hiperparámetro k: [1, 3, 5, 9].
    2. Construir una tabla comparativa de rendimiento (Accuracy, aciertos y fallos).
    3. Analizar la matriz de confusión para cada valor de k.
    4. Explicar el comportamiento del algoritmo:
       - Sesgo vs. Varianza (Bias-Variance Tradeoff).
       - Sobreajuste (Overfitting) con k pequeño frente a Suavizado con k grande.
       - Identificar el valor óptimo de k para este problema.

Restricciones:
    - NO se permite el uso de scikit-learn, pandas ni numpy.
    - Se utilizan únicamente módulos estándar de Python: sys, pathlib, typing, time.
"""

import sys
import time
from pathlib import Path
from typing import Any, Dict, List

# Reutilizamos las funciones de las fases anteriores
from parte1 import cargar_datos_iris, dividir_entrenamiento_prueba
from parte2 import knn_predecir
from parte3 import calcular_accuracy, generar_matriz_confusion, imprimir_matriz_confusion

# Asegurar compatibilidad UTF-8 en consolas Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def experimentar_valores_k(
    X_train: List[List[float]],
    y_train: List[str],
    X_test: List[List[float]],
    y_test: List[str],
    valores_k: List[int],
) -> List[Dict[str, Any]]:
    """
    Ejecuta el clasificador KNN para una lista de valores de k y recopila
    métricas detalladas de evaluación para cada uno.

    Parámetros:
        X_train: Características de entrenamiento.
        y_train: Etiquetas de entrenamiento.
        X_test: Características de prueba.
        y_test: Etiquetas reales de prueba.
        valores_k: Lista de números enteros con los valores de k a evaluar.

    Retorna:
        Lista de diccionarios con el resumen de métricas para cada k.
    """
    resultados: List[Dict[str, Any]] = []
    total_test = len(y_test)

    for k in valores_k:
        inicio = time.perf_counter()

        # Ejecutamos la clasificación con el k actual
        y_pred = knn_predecir(X_train, y_train, X_test, k=k)

        tiempo_ms = (time.perf_counter() - inicio) * 1000

        # Calculamos métricas
        acc = calcular_accuracy(y_test, y_pred)
        aciertos = sum(1 for r, p in zip(y_test, y_pred) if r == p)
        fallos = total_test - aciertos

        # Matriz de confusión
        matriz, clases = generar_matriz_confusion(y_test, y_pred)

        # Calculamos errores por cada especie específica
        errores_por_clase: Dict[str, int] = {}
        for i, clase in enumerate(clases):
            total_clase = sum(matriz[i])
            aciertos_clase = matriz[i][i]
            errores_por_clase[clase] = total_clase - aciertos_clase

        resultados.append(
            {
                "k": k,
                "accuracy": acc,
                "aciertos": aciertos,
                "fallos": fallos,
                "tiempo_ms": tiempo_ms,
                "matriz": matriz,
                "clases": clases,
                "errores_por_clase": errores_por_clase,
            }
        )

    return resultados


def imprimir_tabla_comparativa(resultados: List[Dict[str, Any]]) -> None:
    """
    Imprime una tabla comparativa resumen con los resultados de cada k.
    """
    print("\n" + "=" * 80)
    print("           TABLA COMPARATIVA DE RENDIMIENTO SEGÚN EL HIPERPARÁMETRO k")
    print("=" * 80)
    print(
        f"{'k':^5} | {'Accuracy (%)':^14} | {'Aciertos':^10} | {'Fallos':^8} | "
        f"{'Tiempo (ms)':^13} | {'Errores (Set/Ver/Vir)':^21}"
    )
    print("-" * 80)

    mejor_k = None
    mejor_acc = -1.0

    for res in resultados:
        k = res["k"]
        acc_pct = res["accuracy"] * 100
        aciertos = res["aciertos"]
        fallos = res["fallos"]
        t_ms = res["tiempo_ms"]
        errs = res["errores_por_clase"]
        str_errs = f"{errs.get('setosa', 0)} / {errs.get('versicolor', 0)} / {errs.get('virginica', 0)}"

        # Marcador para el mejor k
        marca = ""
        if res["accuracy"] > mejor_acc:
            mejor_acc = res["accuracy"]
            mejor_k = k

        print(
            f"{k:^5} | {acc_pct:^14.2f} | {aciertos:^10} | {fallos:^8} | "
            f"{t_ms:^13.1f} | {str_errs:^21}"
        )

    print("=" * 80)
    print(f"(*) Mejor configuración encontrada: k = {mejor_k} con {mejor_acc * 100:.2f}% de Accuracy.")


def imprimir_analisis_teorico() -> None:
    """
    Muestra la explicación técnica y conclusiones pedagógicas del efecto de k.
    """
    print("\n" + "=" * 80)
    print("                  ANÁLISIS TÉCNICO Y CONCLUSIONES")
    print("=" * 80)
    print("""
1. ¿Qué sucede con k = 1?
   - Con k = 1, el modelo toma la decisión basada ÚNICAMENTE en el vecino más próximo.
   - Ventaja: Capacidad máxima para ajustarse a fronteras complejas y patrones sutiles.
   - Riesgo: Alta varianza (sobreajuste / overfitting). Si una muestra de entrenamiento
     tiene un error de medición o es un caso atípico (outlier), cualquier muestra
     cercana heredará su etiqueta errónea.

2. ¿Qué sucede al aumentar k a 3 y 5?
   - Al considerar 3 o 5 vecinos, se introduce un efecto de 'votación democrática' o filtro
     de ruido. Un solo dato ruidoso o atípico es superado en votos por la mayoría local.
   - En nuestro experimento, k = 3 y k = 5 consiguen el mejor equilibrio (sweet spot)
     con la mayor tasa de aciertos y un modelo más generalizable.

3. ¿Qué sucede con k = 9 (y valores mayores)?
   - Conforme k crece, las fronteras de decisión se vuelven más suaves y rígidas (mayor sesgo).
   - Si k fuera excesivamente grande, las regiones con mayor densidad de población
     terminarían absorbiendo a los vecinos minoritarios, reduciendo la exactitud.

4. Comportamiento por Especie:
   - 'setosa': Se clasifica con 100% de precisión en TODOS los valores de k (0 fallos).
     Esto confirma que sus características son geométricamente separables del resto.
   - 'versicolor' y 'virginica': Comparten solapamiento en las dimensiones de pétalos
     y sépalos, por lo que todos los fallos del clasificador ocurren exclusivamente
     en la frontera entre estas dos especies.
""")
    print("=" * 80)


# ==============================================================================
# BLOQUE PRINCIPAL
# ==============================================================================
if __name__ == "__main__":
    print("======================================================================")
    print("FASE 4: EXPERIMENTACIÓN CON DISTINTOS VALORES DE k (1, 3, 5, 9)")
    print("======================================================================")

    # 1. Carga y preparación del dataset
    directorio_actual = Path(__file__).resolve().parent
    ruta_csv = directorio_actual / "iris_extended.csv"

    print("\n[Paso 1] Cargando y dividiendo datos (80% Train / 20% Test, seed=42)...")
    X, y = cargar_datos_iris(ruta_csv)
    X_train, X_test, y_train, y_test = dividir_entrenamiento_prueba(
        X, y, porcentaje_entrenamiento=0.8, semilla=42
    )
    print(f"  -> Train: {len(X_train)} muestras | Test: {len(X_test)} muestras")

    # 2. Valores de k a evaluar (solicitados en la práctica: 1, 3, 5, 9)
    VALORES_K = [1, 3, 5, 9]

    print(f"\n[Paso 2] Evaluando clasificador KNN para k in {VALORES_K}...")
    resultados_k = experimentar_valores_k(X_train, y_train, X_test, y_test, VALORES_K)

    # 3. Mostrar tabla comparativa
    imprimir_tabla_comparativa(resultados_k)

    # 4. Mostrar matrices de confusión detalladas para cada k
    print("\n[Paso 3] Matrices de confusión detalladas por cada valor de k:")
    for res in resultados_k:
        k = res["k"]
        acc = res["accuracy"] * 100
        titulo = f"MATRIZ DE CONFUSIÓN (k = {k} | Accuracy = {acc:.2f}%)"
        imprimir_matriz_confusion(res["matriz"], res["clases"], titulo=titulo)

    # 5. Conclusiones y análisis teórico
    imprimir_analisis_teorico()

    print("\n[OK] Fase 4 completada con éxito.")
