"""
================================================================================
PRÁCTICA: KNN DESDE CERO - PROGRAMACIÓN DE IA (RA1)
FASE 3: Métricas de Evaluación Propias (Accuracy y Matriz de Confusión)
================================================================================

Objetivo:
    1. Implementar la función de cálculo de exactitud: calcular_accuracy(y_reales, y_predichas).
    2. Construir la Matriz de Confusión en código Python puro sin librerías externas:
       - Filas representan las clases REALES.
       - Columnas representan las clases PREDICHAS por el modelo.
       - La diagonal principal contiene los aciertos (True Positives de cada clase).
       - Fuera de la diagonal se sitúan los errores y confusiones.
    3. Formatear y mostrar la matriz en consola con un diseño tabular claro y profesional.
    4. Ejecutar el clasificador base con k = 5 sobre el conjunto de prueba (80/20)
       y analizar detalladamente los resultados obtenidos.

Restricciones:
    - NO se permite el uso de scikit-learn, pandas ni numpy.
    - Se utilizan únicamente módulos estándar de Python: sys, pathlib, typing.
"""

import sys
from pathlib import Path
from typing import Dict, List, Tuple

# Importamos las fases anteriores
from parte1 import cargar_datos_iris, dividir_entrenamiento_prueba
from parte2 import knn_predecir

# Asegurar compatibilidad UTF-8 en consolas Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


# ==============================================================================
# FUNCIÓN 1: CÁLCULO DE ACCURACY (EXACTITUD)
# ==============================================================================
def calcular_accuracy(y_reales: List[str], y_predichas: List[str]) -> float:
    """
    Calcula la tasa de exactitud (Accuracy) de las predicciones.

    Fórmula matemática:
        Accuracy = Total de aciertos / Total de muestras evaluadas

    Parámetros:
        y_reales: Lista con las etiquetas reales de las flores de prueba.
        y_predichas: Lista con las etiquetas predichas por el algoritmo KNN.

    Retorna:
        float: Valor entre 0.0 (0% de aciertos) y 1.0 (100% de aciertos).
    """
    if len(y_reales) != len(y_predichas):
        raise ValueError(
            f"Las listas deben tener la misma longitud: reales={len(y_reales)}, predichas={len(y_predichas)}"
        )

    if len(y_reales) == 0:
        raise ValueError("Las listas de etiquetas no pueden estar vacías.")

    # Contamos cuántas veces coinciden exactamente la etiqueta real y la predicha
    aciertos = sum(1 for real, pred in zip(y_reales, y_predichas) if real == pred)

    return aciertos / len(y_reales)


# ==============================================================================
# FUNCIÓN 2: CONSTRUCCIÓN DE LA MATRIZ DE CONFUSIÓN
# ==============================================================================
def generar_matriz_confusion(
    y_reales: List[str],
    y_predichas: List[str],
    etiquetas: List[str] | None = None,
) -> Tuple[List[List[int]], List[str]]:
    """
    Construye la matriz de confusión cuadrática (N x N) en Python puro.

    Estructura de la matriz:
        - Filas: Representan la CLASE REAL.
        - Columnas: Representan la CLASE PREDICHA por el clasificador.
        - Celda [i][j]: Muestra cuántas instancias de la clase i fueron
          clasificadas como clase j.

    Parámetros:
        y_reales: Lista de etiquetas verdaderas.
        y_predichas: Lista de etiquetas emitidas por el modelo.
        etiquetas: Lista opcional con el orden deseado de las clases.
                   Si es None, se obtienen y ordenan alfabéticamente.

    Retorna:
        Una tupla (matriz, etiquetas_ordenadas):
        - matriz: Lista de listas de enteros de dimensiones (len(etiquetas) x len(etiquetas)).
        - etiquetas_ordenadas: Lista con los nombres de las clases en el orden de las filas/columnas.
    """
    if len(y_reales) != len(y_predichas):
        raise ValueError("y_reales e y_predichas deben tener la misma longitud.")

    # Si no se especifican las etiquetas, extraemos todas las clases únicas presentes
    if etiquetas is None:
        etiquetas_ordenadas = sorted(list(set(y_reales) | set(y_predichas)))
    else:
        etiquetas_ordenadas = list(etiquetas)

    n_clases = len(etiquetas_ordenadas)

    # Creamos un mapa de etiqueta -> índice para acceso rápido O(1)
    # Ejemplo: {'setosa': 0, 'versicolor': 1, 'virginica': 2}
    indice_clase: Dict[str, int] = {
        clase: i for i, clase in enumerate(etiquetas_ordenadas)
    }

    # Inicializamos una matriz de ceros de tamaño n_clases x n_clases
    matriz: List[List[int]] = [[0 for _ in range(n_clases)] for _ in range(n_clases)]

    # Rellenamos la matriz recorriendo los pares (real, predicho)
    for real, pred in zip(y_reales, y_predichas):
        idx_fila = indice_clase[real]
        idx_columna = indice_clase[pred]
        matriz[idx_fila][idx_columna] += 1

    return matriz, etiquetas_ordenadas


# ==============================================================================
# FUNCIÓN 3: VISUALIZACIÓN FORMATEADA DE LA MATRIZ DE CONFUSIÓN
# ==============================================================================
def imprimir_matriz_confusion(
    matriz: List[List[int]],
    etiquetas: List[str],
    titulo: str = "MATRIZ DE CONFUSIÓN"
) -> None:
    """
    Muestra la matriz de confusión en la consola con un formato tabular
    elegante, limpio y totalmente compatible con caracteres ASCII.

    Incluye además:
        - Totales reales por fila.
        - Totales predichos por columna.
        - Desglose de aciertos por clase (diagonal principal).
    """
    ancho_nombre = max(len(c) for c in etiquetas) + 2
    ancho_celda = 12

    print("\n" + "=" * 75)
    print(f"{titulo:^75}")
    print("=" * 75)
    print("  Filas: Clase REAL  |  Columnas: Clase PREDICHA")
    print("-" * 75)

    # Cabecera de columnas
    cabecera = f"{'REAL \\ PRED':<{ancho_nombre + 2}}|"
    for clase in etiquetas:
        cabecera += f" {clase:^{ancho_celda}} |"
    cabecera += f" {'TOTAL REAL':^{ancho_celda}}"
    print(cabecera)
    print("-" * len(cabecera))

    # Filas con los datos
    totales_columna = [0] * len(etiquetas)
    total_general = 0
    total_aciertos = 0

    for i, clase_real in enumerate(etiquetas):
        fila_str = f" {clase_real:<{ancho_nombre}}|"
        total_fila = sum(matriz[i])
        total_general += total_fila

        for j in range(len(etiquetas)):
            valor = matriz[i][j]
            totales_columna[j] += valor
            if i == j:
                total_aciertos += valor
                # Marcamos visualmente los aciertos con un asterisco
                fila_str += f" {str(valor) + ' *':^{ancho_celda}} |"
            else:
                fila_str += f" {str(valor):^{ancho_celda}} |"

        fila_str += f" {total_fila:^{ancho_celda}}"
        print(fila_str)

    print("-" * len(cabecera))

    # Fila de totales predichos
    pie_str = f" {'TOTAL PRED':<{ancho_nombre}}|"
    for tot in totales_columna:
        pie_str += f" {tot:^{ancho_celda}} |"
    pie_str += f" {total_general:^{ancho_celda}}"
    print(pie_str)
    print("=" * 75)
    print("(*) Los valores con asterisco corresponden a la DIAGONAL PRINCIPAL (Aciertos).")

    # Resumen cuantitativo por clase
    print("\n[Desglose de Aciertos por Especie]:")
    for i, clase in enumerate(etiquetas):
        aciertos_clase = matriz[i][i]
        total_clase = sum(matriz[i])
        porcentaje = (aciertos_clase / total_clase) * 100 if total_clase > 0 else 0.0
        print(
            f"  * {clase:<12}: {aciertos_clase}/{total_clase} acertadas ({porcentaje:.2f}%)"
        )


# ==============================================================================
# BLOQUE PRINCIPAL: EVALUACIÓN DEL CLASIFICADOR CON k = 5
# ==============================================================================
if __name__ == "__main__":
    print("======================================================================")
    print("FASE 3: EVALUACIÓN DEL CLASIFICADOR KNN (k = 5) Y MATRIZ DE CONFUSIÓN")
    print("======================================================================")

    # 1. Carga de datos
    directorio_actual = Path(__file__).resolve().parent
    ruta_csv = directorio_actual / "iris_extended.csv"

    print("\n[Paso 1] Cargando dataset Iris...")
    X, y = cargar_datos_iris(ruta_csv)

    # 2. Partición 80/20
    print("[Paso 2] Dividiendo en 80% Entrenamiento y 20% Prueba (semilla=42)...")
    X_train, X_test, y_train, y_test = dividir_entrenamiento_prueba(
        X, y, porcentaje_entrenamiento=0.8, semilla=42
    )
    print(f"  -> Muestras de entrenamiento: {len(X_train)}")
    print(f"  -> Muestras de prueba:        {len(X_test)}")

    # 3. Predicción con k = 5
    K_EVALUAR = 5
    print(f"\n[Paso 3] Ejecutando clasificación KNN con k = {K_EVALUAR}...")
    y_predichas = knn_predecir(X_train, y_train, X_test, k=K_EVALUAR)

    # 4. Cálculo de Accuracy
    accuracy = calcular_accuracy(y_test, y_predichas)
    aciertos = sum(1 for r, p in zip(y_test, y_predichas) if r == p)
    total = len(y_test)

    print("\n[Paso 4] Resultados globales:")
    print(f"  * Aciertos:  {aciertos} de {total}")
    print(f"  * Fallos:    {total - aciertos}")
    print(f"  * Accuracy:  {accuracy * 100:.2f}%  ({accuracy:.4f})")

    # 5. Generación e impresión de la Matriz de Confusión
    matriz_conf, clases = generar_matriz_confusion(y_test, y_predichas)
    imprimir_matriz_confusion(matriz_conf, clases)

    print("\n[OK] Fase 3 completada con éxito.")
