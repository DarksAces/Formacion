"""
MÓDULO DE FUNCIONES REUTILIZABLES - CONTROL Y AUDITORÍA DE INVENTARIOS
Módulo M3 · Programació d'Intel·ligència Artificial (RA1)
Caso: NovaByte Retail S.L.

Este archivo contiene la lógica modular para la ingesta de archivos CSV y JSON,
validación de integridad, cálculo dinámico de outliers por IQR, procesamiento
de métricas operativas y persistencia de resultados.
"""

import os
import json
from typing import Dict, Any, Tuple, List
import pandas as pd
import numpy as np


# =============================================================================
# 1. LECTURA Y DETECCIÓN DE FORMATOS
# =============================================================================

def cargar_csv(ruta: str) -> pd.DataFrame:
    """
    Carga un archivo en formato CSV garantizando codificación UTF-8.
    
    Args:
        ruta: Ruta al archivo CSV.
        
    Returns:
        pd.DataFrame con los datos leídos.
    """
    if not os.path.exists(ruta):
        raise FileNotFoundError(f"No se encontró el archivo CSV en la ruta: {ruta}")
    df = pd.read_csv(ruta, encoding="utf-8")
    df["formato_origen"] = "CSV"
    df["archivo_origen"] = os.path.basename(ruta)
    return df


def cargar_json(ruta: str) -> pd.DataFrame:
    """
    Carga un archivo en formato JSON y lo convierte a DataFrame tabular.
    
    Args:
        ruta: Ruta al archivo JSON.
        
    Returns:
        pd.DataFrame con los datos leídos.
    """
    if not os.path.exists(ruta):
        raise FileNotFoundError(f"No se encontró el archivo JSON en la ruta: {ruta}")
    with open(ruta, "r", encoding="utf-8") as f:
        datos = json.load(f)
    df = pd.DataFrame(datos)
    df["formato_origen"] = "JSON"
    df["archivo_origen"] = os.path.basename(ruta)
    return df


def cargar_datos(ruta: str) -> pd.DataFrame:
    """
    Detecta automáticamente el formato del archivo por su extensión
    y lo carga con la función especializada correspondiente.
    
    Args:
        ruta: Ruta al archivo (.csv o .json).
        
    Returns:
        pd.DataFrame unificado.
    """
    extension = os.path.splitext(ruta)[1].lower()
    if extension == ".csv":
        return cargar_csv(ruta)
    elif extension == ".json":
        return cargar_json(ruta)
    else:
        raise ValueError(f"Formato no soportado: '{extension}'. Se requiere CSV o JSON.")


# =============================================================================
# 2. DETECCIÓN DINÁMICA DE OUTLIERS POR IQR
# =============================================================================

def calcular_umbrales_iqr(serie: pd.Series, factor_moderado: float = 1.5, factor_extremo: float = 3.0) -> Dict[str, float]:
    """
    Calcula de forma dinámica los límites del Rango Intercuartílico (IQR).
    Agnóstico al negocio: no presupone constantes fijas.
    
    Args:
        serie: Serie numérica sobre la que calcular los cuartiles.
        factor_moderado: Multiplicador para límites moderados (típico 1.5).
        factor_extremo: Multiplicador para límites extremos (típico 3.0).
        
    Returns:
        Diccionario con Q1, Q3, IQR y límites superior e inferior.
    """
    s_val = serie[(serie.notna()) & (serie >= 0)]
    if len(s_val) == 0:
        return {}
    
    q1 = float(s_val.quantile(0.25))
    q3 = float(s_val.quantile(0.75))
    iqr = q3 - q1
    
    return {
        "q1": round(q1, 2),
        "q3": round(q3, 2),
        "iqr": round(iqr, 2),
        "limite_inf": round(max(0.0, q1 - factor_moderado * iqr), 2),
        "limite_sup_moderado": round(q3 + factor_moderado * iqr, 2),
        "limite_sup_extremo": round(q3 + factor_extremo * iqr, 2)
    }


# =============================================================================
# 3. VALIDACIÓN, LIMPIEZA Y SEGREGACIÓN DE DATOS
# =============================================================================

def validar_datos(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, Dict[str, Any]]:
    """
    Aplica las reglas de negocio e integridad a cada registro sin descartar datos.
    Divide el dataset en dos conjuntos: procesable (operativo) y cuarentena (auditoría).
    
    Reglas evaluadas:
    1. Existencia y formato del ID (no nulo, no vacío).
    2. Detección de identificadores duplicados.
    3. Conversión y validación de precios (no nulos, >= 0, no outliers IQR extremos).
    4. Conversión y validación de stock actual (no nulos, >= 0, no outliers IQR extremos).
    5. Validación de stock mínimo (no nulo, >= 0).
    
    Args:
        df: DataFrame original con datos en bruto.
        
    Returns:
        Tupla (df_procesable, df_cuarentena, metricas_iqr).
    """
    df_copia = df.copy()
    
    # Conversión numérica segura
    df_copia["precio_num"] = pd.to_numeric(df_copia.get("precio_unitario"), errors="coerce")
    df_copia["stock_num"] = pd.to_numeric(df_copia.get("stock_actual"), errors="coerce")
    df_copia["stock_min_num"] = pd.to_numeric(df_copia.get("stock_minimo"), errors="coerce")
    
    # Cálculo dinámico de umbrales
    stats_stock = calcular_umbrales_iqr(df_copia["stock_num"])
    stats_precio = calcular_umbrales_iqr(df_copia["precio_num"])
    
    # Detección de duplicados
    ids_col = df_copia.get("producto_id")
    if ids_col is not None:
        ids_validos = ids_col.dropna().astype(str).str.strip()
        ids_duplicados = set(ids_validos[ids_validos.duplicated()].unique())
    else:
        ids_duplicados = set()
        
    registros_limpios = []
    registros_cuarentena = []
    
    limite_sup_stock = stats_stock.get("limite_sup_extremo", float("inf"))
    limite_sup_precio = stats_precio.get("limite_sup_extremo", float("inf"))
    
    for _, row in df_copia.iterrows():
        motivos = []
        pid = str(row.get("producto_id", "")).strip() if pd.notna(row.get("producto_id")) else ""
        precio = row["precio_num"]
        stock = row["stock_num"]
        stock_min = row["stock_min_num"]
        
        # Validación de ID
        if not pid or pid == "nan":
            motivos.append("ID ausente o vacío")
        elif pid in ids_duplicados:
            motivos.append(f"ID duplicado en catálogo ({pid})")
            
        # Validación de Precio
        if pd.isna(precio):
            motivos.append("Precio nulo o no numérico")
        elif precio < 0:
            motivos.append(f"Precio negativo imposible ({precio} €)")
        elif precio > limite_sup_precio:
            motivos.append(f"Precio outlier extremo IQR (> {limite_sup_precio} €)")
            
        # Validación de Stock
        if pd.isna(stock):
            motivos.append("Stock actual nulo o no numérico")
        elif stock < 0:
            motivos.append(f"Stock negativo imposible ({stock} uds)")
        elif stock > limite_sup_stock:
            motivos.append(f"Stock outlier sospechoso IQR (> {limite_sup_stock} uds, valor={stock})")
            
        # Validación de Stock Mínimo
        if pd.isna(stock_min) or stock_min < 0:
            motivos.append(f"Stock mínimo inválido ({stock_min})")
            
        row_dict = row.to_dict()
        if motivos:
            row_dict["motivo_cuarentena"] = " | ".join(motivos)
            registros_cuarentena.append(row_dict)
        else:
            # Normalizar tipos definitivos en dataset limpio
            row_dict["precio_unitario"] = float(precio)
            row_dict["stock_actual"] = int(stock)
            row_dict["stock_minimo"] = int(stock_min)
            registros_limpios.append(row_dict)
            
    df_procesable = pd.DataFrame(registros_limpios)
    df_cuarentena = pd.DataFrame(registros_cuarentena)
    
    # Limpieza de columnas auxiliares temporales
    for df_sub in [df_procesable, df_cuarentena]:
        for col in ["precio_num", "stock_num", "stock_min_num"]:
            if col in df_sub.columns:
                df_sub.drop(columns=[col], inplace=True)
                
    metricas_iqr = {
        "umbrales_stock": stats_stock,
        "umbrales_precio": stats_precio
    }
    
    return df_procesable, df_cuarentena, metricas_iqr


# =============================================================================
# 4. PROCESAMIENTO ANALÍTICO (OPERACIONES EXIGIDAS)
# =============================================================================

def procesar_datos(df_procesable: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Ejecuta las operaciones de procesamiento analítico sobre los registros operativos:
    1. Operación 1: Clasificación de productos según estado de stock (Crítico, Reposición, Óptimo, Exceso).
    2. Operación 2: Filtrado y detección de productos con stock bajo (stock_actual <= stock_minimo).
    3. Operación 3: Cálculo de estadísticas e indicadores financieros (valor total, precios medios, etc.).
    4. Operación 4: Agrupación y conteo de productos por categoría y por almacén.
    
    Args:
        df_procesable: DataFrame limpio validado.
        
    Returns:
        Tupla (df_con_indicadores, metricas_calculadas).
    """
    df = df_procesable.copy()
    
    if len(df) == 0:
        return df, {}
    
    # Operación 1: Clasificación por reglas de negocio
    def clasificar_estado(row):
        stock = row["stock_actual"]
        s_min = row["stock_minimo"]
        if stock == 0:
            return "Agotado"
        elif stock <= s_min * 0.5:
            return "Crítico"
        elif stock <= s_min:
            return "Bajo (Reponer)"
        elif stock > s_min * 3:
            return "Exceso"
        else:
            return "Óptimo"
            
    df["estado_stock"] = df.apply(clasificar_estado, axis=1)
    df["valor_total_producto"] = round(df["precio_unitario"] * df["stock_actual"], 2)
    
    # Operación 2: Filtrado de necesidades de reposición
    necesitan_reposicion = df[df["stock_actual"] <= df["stock_minimo"]]
    
    # Operación 3: Estadísticas globales
    valor_total_inventario = round(float(df["valor_total_producto"].sum()), 2)
    precio_medio = round(float(df["precio_unitario"].mean()), 2)
    stock_medio = round(float(df["stock_actual"].mean()), 2)
    
    # Operación 4: Agrupaciones y conteos
    desglose_categorias = df["categoria"].value_counts().to_dict()
    almacenes = df.get("almacen")
    desglose_almacenes = almacenes.value_counts().to_dict() if almacenes is not None else {}
    
    metricas = {
        "valor_total_inventario": valor_total_inventario,
        "precio_medio": precio_medio,
        "stock_medio": stock_medio,
        "total_productos_stock_bajo": len(necesitan_reposicion),
        "desglose_categorias": desglose_categorias,
        "desglose_almacenes": desglose_almacenes
    }
    
    return df, metricas


# =============================================================================
# 5. GENERACIÓN DEL RESUMEN Y PERSISTENCIA DE RESULTADOS
# =============================================================================

def generar_resumen(
    df_procesable: pd.DataFrame, 
    df_cuarentena: pd.DataFrame, 
    metricas: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Construye el resumen global de ejecución en el formato especificado
    por la rúbrica de la práctica.
    
    Args:
        df_procesable: Datos válidos.
        df_cuarentena: Datos aislados con incidencias.
        metricas: Indicadores analíticos generados.
        
    Returns:
        Diccionario listo para serializar a JSON.
    """
    total_leidos = len(df_procesable) + len(df_cuarentena)
    motivos_cuar = {}
    if len(df_cuarentena) > 0 and "motivo_cuarentena" in df_cuarentena.columns:
        motivos_cuar = df_cuarentena["motivo_cuarentena"].value_counts().to_dict()
        
    resumen = {
        "total_registros_ingestados": total_leidos,
        "registros_procesados": len(df_procesable),
        "registros_invalidos": len(df_cuarentena),
        "porcentaje_calidad_datos": round((len(df_procesable) / total_leidos * 100), 2) if total_leidos > 0 else 0.0,
        "productos_stock_bajo": metricas.get("total_productos_stock_bajo", 0),
        "valor_total_inventario": metricas.get("valor_total_inventario", 0.0),
        "precio_medio": metricas.get("precio_medio", 0.0),
        "stock_medio": metricas.get("stock_medio", 0.0),
        "desglose_categorias": metricas.get("desglose_categorias", {}),
        "desglose_motivos_cuarentena": motivos_cuar
    }
    return resumen


def guardar_resultados(
    df_procesable: pd.DataFrame,
    df_cuarentena: pd.DataFrame,
    resumen: Dict[str, Any],
    carpeta_salida: str = "resultados"
) -> List[str]:
    """
    Guarda los datasets resultantes y el resumen estadístico en disco
    tanto en formato JSON como en CSV.
    
    Args:
        df_procesable: Dataset operativo limpio.
        df_cuarentena: Dataset de auditoría.
        resumen: Resumen de indicadores.
        carpeta_salida: Directorio destino.
        
    Returns:
        Lista con las rutas de los archivos generados.
    """
    try:
        os.makedirs(carpeta_salida, exist_ok=True)
    except Exception:
        pass
    archivos_generados = []
    
    # 1. Guardar resumen general en JSON (exigido por la rúbrica)
    ruta_resumen = os.path.join(carpeta_salida, "resultado.json")
    with open(ruta_resumen, "w", encoding="utf-8") as f:
        json.dump(resumen, f, indent=2, ensure_ascii=False)
    archivos_generados.append(ruta_resumen)
    
    # 2. Guardar dataset procesable (CSV y JSON)
    ruta_proc_csv = os.path.join(carpeta_salida, "inventario_procesable.csv")
    ruta_proc_json = os.path.join(carpeta_salida, "inventario_procesable.json")
    df_procesable.to_csv(ruta_proc_csv, index=False, encoding="utf-8")
    df_procesable.to_json(ruta_proc_json, orient="records", indent=2, force_ascii=False)
    archivos_generados.extend([ruta_proc_csv, ruta_proc_json])
    
    # 3. Guardar dataset de cuarentena (CSV y JSON)
    ruta_cuar_csv = os.path.join(carpeta_salida, "inventario_cuarentena_outliers.csv")
    ruta_cuar_json = os.path.join(carpeta_salida, "inventario_cuarentena_outliers.json")
    df_cuarentena.to_csv(ruta_cuar_csv, index=False, encoding="utf-8")
    df_cuarentena.to_json(ruta_cuar_json, orient="records", indent=2, force_ascii=False)
    archivos_generados.extend([ruta_cuar_csv, ruta_cuar_json])
    
    return archivos_generados
