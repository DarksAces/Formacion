"""
FLUJO PRINCIPAL DE EJECUCIÓN - PIPELINE DE AUDITORÍA Y CONTROL DE INVENTARIOS
Módulo M3 · Programació d'Intel·ligència Artificial (RA1)
Caso: NovaByte Retail S.L.

Flujo de trabajo implementado:
Seleccionar archivo -> Detectar formato -> Cargar datos -> Validar -> Procesar -> Mostrar resultados -> Guardar resultado
"""

import sys
import os
import argparse
import glob
import pandas as pd

# Asegurar codificación UTF-8 en consola de Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Importación de las funciones modulares
from funciones import (
    cargar_datos,
    validar_datos,
    procesar_datos,
    generar_resumen,
    guardar_resultados
)


def ejecutar_pipeline(rutas_archivos: list, carpeta_salida: str = "resultados") -> dict:
    """
    Ejecuta el pipeline completo sobre uno o varios archivos:
    1. Carga agnóstica multiformato
    2. Validación e identificación de anomalías / outliers
    3. Procesamiento y cálculo de métricas
    4. Muestra de resultados en consola
    5. Persistencia en disco
    """
    print("\n" + "=" * 75)
    print("🚀 INICIANDO PIPELINE DE AUTOMATIZACIÓN DE INVENTARIOS - NOVABYTE RETAIL")
    print("=" * 75)
    
    # 1. Carga de datos
    dfs = []
    print("\n[1/5] 📥 Ingesta y detección de formatos...")
    for ruta in rutas_archivos:
        if not os.path.exists(ruta):
            print(f"  ❌ Archivo no encontrado: {ruta}")
            continue
        try:
            df_temp = cargar_datos(ruta)
            # Deducir centro si no viene explícito
            if "almacen" not in df_temp.columns and "centro_origen" not in df_temp.columns:
                nombre_base = os.path.basename(ruta).upper()
                centro = "Desconocido"
                for c in ["BCN", "MAD", "VAL", "SEV"]:
                    if c in nombre_base:
                        centro = {"BCN": "Barcelona", "MAD": "Madrid", "VAL": "Valencia", "SEV": "Sevilla"}[c]
                        break
                df_temp["centro_origen"] = centro
            print(f"  ✅ Cargado: {os.path.basename(ruta)} ({len(df_temp)} registros | Formato: {df_temp['formato_origen'].iloc[0]})")
            dfs.append(df_temp)
        except Exception as e:
            print(f"  ❌ Error al cargar {ruta}: {e}")
            
    if not dfs:
        print("\n❌ No se pudo cargar ningún dataset válido. Abortando ejecución.")
        return {}
        
    df_raw = pd.concat(dfs, ignore_index=True)
    print(f"\n📦 Total registros brutos ingresados: {len(df_raw)}")
    
    # 2. Validación y detección de anomalías con IQR
    print("\n[2/5] 🛡️ Validación de integridad y aislamiento de anomalías por IQR...")
    df_procesable, df_cuarentena, stats_iqr = validar_datos(df_raw)
    
    limite_stock = stats_iqr.get("umbrales_stock", {}).get("limite_sup_extremo", "N/A")
    limite_precio = stats_iqr.get("umbrales_precio", {}).get("limite_sup_extremo", "N/A")
    print(f"  📊 Umbral IQR dinámico de stock extremo:  > {limite_stock} unidades")
    print(f"  📊 Umbral IQR dinámico de precio extremo: > {limite_precio} €")
    print(f"  🔹 Registros procesables (operativos):      {len(df_procesable)} ({len(df_procesable)/len(df_raw)*100:.1f}%)")
    print(f"  🔸 Registros en cuarentena (anomalías/outliers): {len(df_cuarentena)} ({len(df_cuarentena)/len(df_raw)*100:.1f}%)")
    
    # 3. Procesamiento y cálculo de métricas
    print("\n[3/5] ⚙️ Procesamiento analítico y reglas de negocio...")
    df_procesado, metricas = procesar_datos(df_procesable)
    
    # 4. Mostrar resultados en consola
    print("\n[4/5] 📋 RESUMEN DE INDICADORES CLAVE (KPIs):")
    print("-" * 55)
    print(f"  💰 Valoración real del inventario:  {metricas.get('valor_total_inventario', 0):,.2f} €")
    print(f"  💶 Precio unitario medio:           {metricas.get('precio_medio', 0):,.2f} €")
    print(f"  📦 Stock físico medio por producto: {metricas.get('stock_medio', 0):,.2f} uds")
    print(f"  ⚠️ Productos con necesidad de reposición: {metricas.get('total_productos_stock_bajo', 0)} items")
    
    print("\n  Categorías representadas:")
    for cat, cantidad in metricas.get("desglose_categorias", {}).items():
        print(f"    - {cat}: {cantidad} productos")
        
    if len(df_cuarentena) > 0 and "motivo_cuarentena" in df_cuarentena.columns:
        print("\n  Desglose de motivos de envío a cuarentena (principales causas):")
        resumen_motivos = {
            "ID duplicado en catálogo": df_cuarentena["motivo_cuarentena"].str.contains("ID duplicado").sum(),
            "Outlier sospechoso IQR (stock 99.999 / desorbitado)": df_cuarentena["motivo_cuarentena"].str.contains("Outlier IQR|sospechoso").sum(),
            "Precio nulo o no numérico": df_cuarentena["motivo_cuarentena"].str.contains("Precio nulo").sum(),
            "Precio negativo imposible": df_cuarentena["motivo_cuarentena"].str.contains("Precio negativo").sum(),
            "Stock negativo imposible": df_cuarentena["motivo_cuarentena"].str.contains("Stock negativo").sum(),
            "Stock mínimo inválido": df_cuarentena["motivo_cuarentena"].str.contains("Stock mínimo").sum(),
            "ID ausente o vacío": df_cuarentena["motivo_cuarentena"].str.contains("ID ausente").sum(),
        }
        for causa, total in resumen_motivos.items():
            if total > 0:
                print(f"    - {causa}: {total} incidencias detectadas")
    print("-" * 55)
    
    # 5. Generar resumen y guardar resultados
    print(f"\n[5/5] 💾 Persistiendo datasets procesados y métricas en '{carpeta_salida}/'...")
    resumen = generar_resumen(df_procesado, df_cuarentena, metricas)
    archivos = guardar_resultados(df_procesado, df_cuarentena, resumen, carpeta_salida)
    
    for f in archivos:
        print(f"  📁 Generado: {f}")
        
    print("\n✅ PIPELINE COMPLETADO SATISFACTORIAMENTE.\n")
    return resumen


def listar_archivos_datos(directorio_datos: str = "datos") -> list:
    """Busca archivos CSV y JSON disponibles en la carpeta de datos o en la raíz."""
    archivos = []
    if os.path.exists(directorio_datos):
        archivos.extend(glob.glob(os.path.join(directorio_datos, "*.csv")))
        archivos.extend(glob.glob(os.path.join(directorio_datos, "*.json")))
    if not archivos:
        archivos.extend(glob.glob("*.csv"))
        archivos.extend(glob.glob("*.json"))
    
    # Filtrar archivos generados de resultados para no reprocesarlos
    archivos = [f for f in sorted(list(set(archivos))) if "inventario_procesable" not in f and "inventario_cuarentena" not in f and "resultado" not in f]
    return archivos


def modo_interactivo():
    """Menú por consola para seleccionar qué dataset ejecutar."""
    archivos = listar_archivos_datos()
    if not archivos:
        print("❌ No se encontraron datasets en 'datos/' ni en el directorio actual.")
        sys.exit(1)
        
    print("\n" + "=" * 60)
    print("📦 SELECCIÓN DE DATASET - AUTOMATIZACIÓN NOVABYTE")
    print("=" * 60)
    print("Elige una opción:")
    print("  [0] PROCESAR TODOS LOS ARCHIVOS COMBINADOS (Consolidación Global)")
    for idx, f in enumerate(archivos, start=1):
        print(f"  [{idx}] {f}")
    print("  [Q] Salir")
    
    opcion = input("\nIntroduce tu selección: ").strip().upper()
    if opcion == "Q":
        print("Operación cancelada.")
        sys.exit(0)
    elif opcion == "0":
        ejecutar_pipeline(archivos)
    else:
        try:
            indice = int(opcion) - 1
            if 0 <= indice < len(archivos):
                ejecutar_pipeline([archivos[indice]])
            else:
                print("Opción fuera de rango.")
        except ValueError:
            print("Entrada inválida.")


def main():
    parser = argparse.ArgumentParser(description="Pipeline de Automatización de Inventarios (NovaByte Retail S.L.)")
    parser.add_argument("-a", "--archivo", type=str, help="Ruta a un archivo CSV o JSON específico para procesar.")
    parser.add_argument("-t", "--todos", action="store_true", help="Procesa automáticamente todos los datasets de la carpeta datos/")
    parser.add_argument("-o", "--salida", type=str, default="resultados", help="Carpeta destino de los resultados (por defecto: resultados/)")
    
    args = parser.parse_args()
    
    if args.archivo:
        ejecutar_pipeline([args.archivo], args.salida)
    elif args.todos:
        archivos = listar_archivos_datos()
        ejecutar_pipeline(archivos, args.salida)
    else:
        # Si no se pasan argumentos, procesar todos por defecto o entrar en modo interactivo si hay terminal interactiva
        if sys.stdin.isatty():
            modo_interactivo()
        else:
            archivos = listar_archivos_datos()
            ejecutar_pipeline(archivos, args.salida)


if __name__ == "__main__":
    main()
