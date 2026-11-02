"""
ALGORITMO K-MEANS A MANO (DESDE CERO EN UN SOLO ARCHIVO)
========================================================
El objetivo de K-Means es agrupar un conjunto de puntos sin etiquetar en 'K'
grupos (clusters) minimizando la distancia de cada punto al centro de su grupo
(llamado CENTROIDE).

El algoritmo funciona en 5 pasos muy simples:
  - PASO 1: Generar los datos y elegir 'K' puntos al azar como centroides iniciales.
  - PASO 2: Calcular la distancia Euclídea entre puntos y centroides.
  - PASO 3: Asignar cada punto al centroide que tenga más cerca (formar clusters).
  - PASO 4: Mover cada centroide al centro de gravedad (media) de los puntos de su cluster.
            Repetir los pasos 3 y 4 hasta que los centroides ya no se muevan (convergencia).
  - PASO 5: Evaluar la calidad del agrupamiento calculando la Inercia (WCSS) y el Método del Codo.
"""

import math
import random


# =====================================================================
# PASO 1: GENERACIÓN DE DATOS E INICIALIZACIÓN DE CENTROIDES
# =====================================================================
def generar_datos_sinteticos(puntos_por_grupo=30, semilla=42):
    """
    Genera datos 2D (x, y) agrupados de forma natural en 3 zonas distintas
    para poder probar nuestro K-Means a mano.
    """
    random.seed(semilla)
    puntos = []

    # Definimos 3 centros ocultos para generar nubes de puntos alrededor
    centros_reales = [
        (2.0, 2.0),   # Nube 1 (abajo a la izquierda)
        (8.0, 3.0),   # Nube 2 (abajo a la derecha)
        (5.0, 8.5),   # Nube 3 (arriba al centro)
    ]

    for cx, cy in centros_reales:
        for _ in range(puntos_por_grupo):
            x = round(random.gauss(cx, 0.8), 2)
            y = round(random.gauss(cy, 0.8), 2)
            puntos.append((x, y))

    random.shuffle(puntos)
    return puntos


def inicializar_centroides(puntos, k, semilla=42):
    """
    Elige 'K' puntos reales del dataset al azar para usarlos como
    centroides iniciales (Método de Forgy).
    """
    if k <= 0 or k > len(puntos):
        raise ValueError(f"K debe estar entre 1 y {len(puntos)}")

    random.seed(semilla)
    return random.sample(puntos, k)


# =====================================================================
# PASO 2: CÁLCULO DE LA DISTANCIA EUCLÍDEA
# =====================================================================
def distancia_euclidea(punto1, punto2):
    """
    Calcula la distancia en línea recta entre dos puntos (Teorema de Pitágoras):
        d(P, Q) = sqrt( (x2 - x1)^2 + (y2 - y1)^2 )
    """
    suma_cuadrados = 0.0
    for coord1, coord2 in zip(punto1, punto2):
        suma_cuadrados += (coord1 - coord2) ** 2

    return math.sqrt(suma_cuadrados)


def centroide_mas_cercano(punto, centroides):
    """
    Mide la distancia desde 'punto' hasta todos los centroides y devuelve
    el índice del centroide más cercano y su distancia.
    """
    indice_ganador = 0
    distancia_minima = float("inf")

    for i, centroide in enumerate(centroides):
        dist = distancia_euclidea(punto, centroide)
        if dist < distancia_minima:
            distancia_minima = dist
            indice_ganador = i

    return indice_ganador, distancia_minima


# =====================================================================
# PASO 3: ASIGNACIÓN DE PUNTOS A CLUSTERS (PASO 'E' - EXPECTATION)
# =====================================================================
def asignar_clusters(puntos, centroides):
    """
    Recorre todos los puntos y mete cada uno en el grupo (cluster) de su
    centroide más cercano.
    """
    k = len(centroides)
    clusters = [[] for _ in range(k)]
    etiquetas = []

    for punto in puntos:
        indice_cluster, _ = centroide_mas_cercano(punto, centroides)
        clusters[indice_cluster].append(punto)
        etiquetas.append(indice_cluster)

    return clusters, etiquetas


# =====================================================================
# PASO 4: ACTUALIZACIÓN DE CENTROIDES (PASO 'M' - MAXIMIZATION)
# =====================================================================
def calcular_media_puntos(grupo_puntos):
    """
    Calcula el centro de gravedad (la media aritmética de las coordenadas X e Y)
    de todos los puntos de un cluster.
    """
    n_puntos = len(grupo_puntos)
    dimensiones = len(grupo_puntos[0])

    suma_coordenadas = [0.0] * dimensiones
    for punto in grupo_puntos:
        for d in range(dimensiones):
            suma_coordenadas[d] += punto[d]

    return tuple(round(suma / n_puntos, 4) for suma in suma_coordenadas)


def actualizar_centroides(clusters, centroides_antiguos):
    """
    Recalcula la posición de los K centroides moviéndolos a la media de sus puntos.
    """
    nuevos_centroides = []
    for i, grupo in enumerate(clusters):
        if len(grupo) > 0:
            nuevos_centroides.append(calcular_media_puntos(grupo))
        else:
            # Si un cluster quedara vacío, mantiene su posición anterior
            nuevos_centroides.append(centroides_antiguos[i])

    return nuevos_centroides


def han_convergido(centroides_antiguos, centroides_nuevos, tolerancia=1e-4):
    """
    Comprueba si los centroides ya han dejado de moverse entre una iteración y otra.
    """
    desplazamiento_total = 0.0
    for c_ant, c_nuevo in zip(centroides_antiguos, centroides_nuevos):
        desplazamiento_total += distancia_euclidea(c_ant, c_nuevo)

    return desplazamiento_total <= tolerancia, desplazamiento_total


# =====================================================================
# PASO 5: EVALUACIÓN DEL MODELO - INERCIA (WCSS)
# =====================================================================
def calcular_inercia(clusters, centroides):
    """
    Calcula la Inercia (Within-Cluster Sum of Squares): la suma de las
    distancias al cuadrado de cada punto a su centroide.
    Cuanto menor sea la inercia, más compactos son los clusters.
    """
    inercia_total = 0.0
    for grupo, centroide in zip(clusters, centroides):
        for punto in grupo:
            inercia_total += distancia_euclidea(punto, centroide) ** 2

    return round(inercia_total, 4)


# =====================================================================
# BUCLE PRINCIPAL DE K-MEANS Y VISUALIZACIÓN
# =====================================================================
def ejecutar_kmeans(puntos, k, max_iteraciones=100, tolerancia=1e-4, semilla=42, mostrar_pasos=True):
    """
    Une todos los pasos anteriores en el bucle iterativo de K-Means.
    """
    centroides = inicializar_centroides(puntos, k=k, semilla=semilla)
    centroides_iniciales = list(centroides)
    historial_inercia = []

    if mostrar_pasos:
        print(f"\n[Inicio] Centroides iniciales (K={k}): {centroides}")
        print("-" * 70)

    for iteracion in range(1, max_iteraciones + 1):
        # 1. Asignar cada punto a su centroide más cercano
        clusters, etiquetas = asignar_clusters(puntos, centroides)

        # 2. Medir la inercia actual
        inercia = calcular_inercia(clusters, centroides)
        historial_inercia.append(inercia)

        # 3. Mover los centroides a la media de cada grupo
        nuevos_centroides = actualizar_centroides(clusters, centroides)

        # 4. Comprobar convergencia
        convergio, desplazamiento = han_convergido(centroides, nuevos_centroides, tolerancia)

        if mostrar_pasos:
            tamanos = [len(c) for c in clusters]
            print(
                f"Iteración {iteracion:02d} | Inercia: {inercia:8.2f} | "
                f"Desplazamiento centroides: {desplazamiento:.4f} | "
                f"Puntos por cluster: {tamanos}"
            )

        centroides = nuevos_centroides

        if convergio:
            if mostrar_pasos:
                print("-" * 70)
                print(f"¡Convergencia alcanzada en la iteración {iteracion}! (Los centroides ya no se mueven)")
            break

    return {
        "centroides_iniciales": centroides_iniciales,
        "centroides_finales": centroides,
        "clusters": clusters,
        "etiquetas": etiquetas,
        "inercia_final": historial_inercia[-1],
        "historial_inercia": historial_inercia,
        "iteraciones": iteracion,
    }


def graficar_resultados(puntos, resultado, inercias_por_k, archivo_salida="kmeans_resultado.png"):
    """
    Genera una imagen con 3 gráficos:
      1. Estado inicial (datos + centroides iniciales al azar)
      2. Resultado final (clusters coloreados + centroides finales)
      3. Método del Codo (Inercia vs K)
    """
    try:
        import matplotlib.pyplot as plt
    except ImportError:
        print("\n(Nota: Instala 'matplotlib' si deseas generar el gráfico visual).")
        return

    fig, axes = plt.subplots(1, 3, figsize=(16, 5))
    colores = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]

    # --- Gráfico 1: Estado Inicial ---
    xs = [p[0] for p in puntos]
    ys = [p[1] for p in puntos]
    axes[0].scatter(xs, ys, c="lightgray", edgecolors="gray", s=50, label="Datos sin etiquetar")
    c_ini = resultado["centroides_iniciales"]
    axes[0].scatter(
        [c[0] for c in c_ini], [c[1] for c in c_ini],
        c="red", marker="X", s=200, edgecolors="black", label="Centroides iniciales"
    )
    axes[0].set_title("1. Inicio: Datos y Centroides al Azar")
    axes[0].set_xlabel("X")
    axes[0].set_ylabel("Y")
    axes[0].legend()
    axes[0].grid(True, linestyle="--", alpha=0.4)

    # --- Gráfico 2: Resultado Final ---
    for i, grupo in enumerate(resultado["clusters"]):
        if grupo:
            gx = [p[0] for p in grupo]
            gy = [p[1] for p in grupo]
            axes[1].scatter(gx, gy, c=colores[i % len(colores)], s=50, alpha=0.8, label=f"Cluster {i}")

    c_fin = resultado["centroides_finales"]
    axes[1].scatter(
        [c[0] for c in c_fin], [c[1] for c in c_fin],
        c="gold", marker="*", s=300, edgecolors="black", linewidths=1.5, label="Centroides finales"
    )
    axes[1].set_title(f"2. Final ({resultado['iteraciones']} iteraciones, Inercia={resultado['inercia_final']:.1f})")
    axes[1].set_xlabel("X")
    axes[1].set_ylabel("Y")
    axes[1].legend()
    axes[1].grid(True, linestyle="--", alpha=0.4)

    # --- Gráfico 3: Método del Codo (Elbow Method) ---
    ks = list(inercias_por_k.keys())
    vals = list(inercias_por_k.values())
    axes[2].plot(ks, vals, marker="o", linewidth=2, color="#2b5c8f")
    if 3 in inercias_por_k:
        axes[2].scatter([3], [inercias_por_k[3]], color="red", s=120, zorder=5, label="Codo óptimo (K=3)")
    axes[2].set_title("3. Método del Codo (Elección de K)")
    axes[2].set_xlabel("Número de Clusters (K)")
    axes[2].set_ylabel("Inercia (WCSS)")
    axes[2].set_xticks(ks)
    axes[2].legend()
    axes[2].grid(True, linestyle="--", alpha=0.4)

    plt.tight_layout()
    plt.savefig(archivo_salida, dpi=150)
    plt.close()
    print(f"\n[Gráfico guardado] Se ha generado la visualización en: '{archivo_salida}'")


if __name__ == "__main__":
    print("=" * 70)
    print("         ALGORITMO K-MEANS A MANO - EJECUCIÓN COMPLETA")
    print("=" * 70)

    # 1. Generamos 90 puntos (3 grupos naturales de 30 puntos cada uno)
    puntos = generar_datos_sinteticos(puntos_por_grupo=30, semilla=42)
    print(f"Dataset cargado: {len(puntos)} puntos en 2 dimensiones (X, Y).")

    # 2. Ejecutamos K-Means con K = 3 mostrando cada iteración
    K_ELEGIDO = 3
    resultado = ejecutar_kmeans(puntos, k=K_ELEGIDO, semilla=7, mostrar_pasos=True)

    print("\nRESUMEN DE CENTROIDES FINALES:")
    for i, c in enumerate(resultado["centroides_finales"]):
        print(f"  * Cluster {i}: Centroide en {c} con {len(resultado['clusters'][i])} puntos asignados")

    # 3. Probamos varios valores de K (de 1 a 6) para demostrar el Método del Codo
    print("\n" + "=" * 70)
    print("COMPARATIVA DE K (MÉTODO DEL CODO / ELBOW METHOD)")
    print("=" * 70)
    inercias_por_k = {}
    for k_prueba in range(1, 7):
        res_k = ejecutar_kmeans(puntos, k=k_prueba, semilla=7, mostrar_pasos=False)
        inercias_por_k[k_prueba] = res_k["inercia_final"]
        nota = " <-- ¡CODO ÓPTIMO!" if k_prueba == 3 else ""
        print(f"  K = {k_prueba}  -->  Inercia (WCSS) = {res_k['inercia_final']:8.2f}{nota}")

    # 4. Guardamos el gráfico comparativo
    graficar_resultados(puntos, resultado, inercias_por_k)
