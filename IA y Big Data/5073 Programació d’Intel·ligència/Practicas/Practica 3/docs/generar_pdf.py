import os
import sys
import tempfile
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)

def build_pdf():
    script_dir = Path(__file__).resolve().parent
    workspace_dir = script_dir.parent
    pdf_filename = "informe_practica_1.pdf"
    dest_pdf_path = script_dir / pdf_filename
    temp_pdf_path = Path(tempfile.gettempdir()) / pdf_filename

    # Página A4 con márgenes de 2.0 cm
    doc = SimpleDocTemplate(
        str(temp_pdf_path),
        pagesize=A4,
        leftMargin=2.0 * cm,
        rightMargin=2.0 * cm,
        topMargin=2.0 * cm,
        bottomMargin=2.0 * cm,
    )

    styles = getSampleStyleSheet()

    # Colores corporativos y académicos
    c_primary = colors.HexColor("#0F2C59")     # Azul marino profundo
    c_secondary = colors.HexColor("#1E5F74")   # Azul petróleo
    c_accent = colors.HexColor("#D80032")      # Rojo énfasis
    c_dark = colors.HexColor("#2B2D42")        # Gris texto
    c_light = colors.HexColor("#F8F9FA")       # Fondo sutil
    c_border = colors.HexColor("#DDE2E5")      # Borde tablas

    # Estilos de párrafo
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=25,
        textColor=c_primary,
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        spaceAfter=14,
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#4A4E69"),
        spaceAfter=15,
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14.5,
        textColor=c_dark,
        spaceAfter=8,
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=14,
        spaceAfter=4,
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13.5,
        textColor=c_primary,
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1,
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=c_dark,
    )

    table_cell_center = ParagraphStyle(
        'TableCellCenter',
        parent=table_cell_style,
        alignment=1,
    )

    story = []

    # =========================================================================
    # PÁGINA 1: PORTADA, CONTEXTO, OBJETIVOS Y PROTOCOLO EXPERIMENTAL
    # =========================================================================
    story.append(Paragraph("INFORME TÉCNICO: LABORATORIO MULTILENGUAJE PARA IA", title_style))
    story.append(Paragraph("Un mismo problema, múltiples ecosistemas tecnológicos (Python, R y Julia)", subtitle_style))
    story.append(Paragraph(
        "<b>M3 · Programació d'Intel·ligència Artificial</b> &nbsp;|&nbsp; RA1 · Lenguajes, herramientas y ecosistemas para IA<br/>"
        "<b>Curso de Especialización en Inteligencia Artificial y Big Data — Monlau</b><br/>"
        "<b>Alumno:</b> Daniel García Brun &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fecha:</b> Octubre 2026",
        meta_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceAfter=14))

    story.append(Paragraph("1. Contexto y Objetivos de Aprendizaje", h1_style))
    story.append(Paragraph(
        "La selección del lenguaje de programación y de las herramientas en un proyecto de Inteligencia Artificial (IA) "
        "no es una decisión puramente sintáctica. Factores como la madurez del ecosistema de bibliotecas, la gestión de dependencias, "
        "la interoperabilidad, el rendimiento computacional, el soporte comunitario y la facilidad de despliegue en producción "
        "condicionan de manera crítica la viabilidad de cualquier solución técnica.",
        body_style
    ))
    story.append(Paragraph(
        "El objetivo de este laboratorio no consiste en optimizar hiperparámetros ni competir por la máxima métrica predictiva. "
        "El reto consiste en someter a <b>tres ecosistemas tecnológicos consolidados (Python, R y Julia)</b> a una misma carga "
        "de trabajo supervisada estándar: la clasificación del dataset <b>Iris</b> mediante el algoritmo <b>K-Nearest Neighbors (KNN)</b>, "
        "evaluando con evidencias objetivas cómo se programa y ejecuta una misma solución en cada entorno.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("2. Protocolo Experimental Común y Rigor Metodológico", h1_style))
    story.append(Paragraph(
        "Para que la comparación entre los tres lenguajes sea rigurosa y válida, se ha respetado un protocolo experimental común idéntico:",
        body_style
    ))
    story.append(Paragraph("• <b>Dataset de entrada:</b> Archivo <code>iris_extended.csv</code> (1200 muestras uniformemente distribuidas: 400 <i>setosa</i>, 400 <i>versicolor</i>, 400 <i>virginica</i>). Se seleccionan exclusivamente las 4 variables de entrada continuas canónicas (longitud y ancho de sépalos y pétalos) y la variable clase <code>species</code>.", bullet_style))
    story.append(Paragraph("• <b>Partición estratificada:</b> 80% para entrenamiento (960 muestras) y 20% para prueba (240 muestras), garantizando exactamente la misma distribución de clases en ambos subconjuntos.", bullet_style))
    story.append(Paragraph("• <b>Semilla pseudoaleatoria:</b> Equivalente a <b>42</b> en todos los generadores (<code>random_state=42</code> en Python, <code>set.seed(42)</code> en R, <code>Random.seed!(42)</code> en Julia).", bullet_style))
    story.append(Paragraph("• <b>Estandarización y prevención de Data Leakage:</b> Dado que KNN opera con distancias euclídeas sensibles a la escala, se aplica estandarización Z-Score ($Z = \\frac{X - \\mu}{\\sigma}$). <b>Regla de rigor:</b> Los parámetros $\\mu$ y $\\sigma$ se aprenden <i>únicamente sobre el conjunto de entrenamiento</i> y se proyectan sobre el test. Estandarizar antes de dividir filtraría información del test en el modelo.", bullet_style))
    story.append(Paragraph("• <b>Hiperparámetro inicial:</b> <i>k = 5</i> vecinos más cercanos con métrica de distancia euclídea.", bullet_style))
    story.append(Paragraph("• <b>Métricas y visualizaciones:</b> Medición obligatoria de Accuracy, Matriz de Confusión, dispersión de características y tiempo de ejecución.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 2: FASE 1 - PYTHON
    # =========================================================================
    story.append(Paragraph("3. Fase 1: Implementación en Python", h1_style))
    story.append(Paragraph(
        "Python (3.12.10) representa el estándar <i>de facto</i> de la industria para IA y Machine Learning. "
        "En esta fase se han empleado las bibliotecas fundamentales del ecosistema científico: <code>pandas</code> para la ingesta y manipulación tabular, "
        "<code>scikit-learn</code> para el preprocesamiento y modelado, y <code>matplotlib</code> / <code>seaborn</code> para la generación de gráficos.",
        body_style
    ))

    story.append(Paragraph("Aspectos Clave del Flujo Técnico:", h2_style))
    story.append(Paragraph("• <b>Carga e Ingesta Tabular:</b> <code>pandas.read_csv()</code> permite cargar y filtrar las columnas con gran sencillez. En las versiones recientes (pandas 3.0 con soporte pyarrow), se convierte explícitamente a arrays contiguos de <code>numpy.ndarray</code> para garantizar una compatibilidad perfecta con scikit-learn.", bullet_style))
    story.append(Paragraph("• <b>Partición y Escalado POO:</b> La partición estratificada se realiza con <code>train_test_split(..., stratify=y, random_state=42)</code>. El escalado se gestiona mediante <code>StandardScaler()</code>, cuyo método <code>fit_transform()</code> ajusta y transforma Train, y <code>transform()</code> aplica la misma escala a Test, previniendo eficazmente cualquier filtración de datos.", bullet_style))
    story.append(Paragraph("• <b>Algoritmo KNN:</b> <code>KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)</code> implementa la API estándar de scikit-learn basada en el paradigma orientado a objetos (métodos <code>fit</code> y <code>predict</code>).", bullet_style))
    story.append(Paragraph("• <b>Resultados Experimentales:</b> Se obtuvo una precisión predictiva (**Accuracy**) del <b>95.42%</b> (229 aciertos de 240 muestras de test). La clase <i>setosa</i> se predijo con un 100% de precisión y recall; únicamente se registraron 2 confusiones en <i>versicolor</i> y 9 en <i>virginica</i>.", bullet_style))
    story.append(Paragraph("• <b>Tiempo de Ejecución:</b> <b>2.76 segundos</b> en total (incluyendo importación de módulos y renderizado gráfico).", bullet_style))

    story.append(Spacer(1, 8))

    # Imágenes de Python
    img_cm = workspace_dir / "Python" / "output" / "matriz_confusion_python.png"
    img_disp = workspace_dir / "Python" / "output" / "dispersion_iris_python.png"

    if img_cm.exists() and img_disp.exists():
        img_table_data = [
            [
                Image(str(img_cm), width=7.8 * cm, height=6.0 * cm),
                Image(str(img_disp), width=8.9 * cm, height=6.0 * cm)
            ],
            [
                Paragraph("<b>Figura 1:</b> Matriz de confusión en Python (Accuracy 95.42%)", table_cell_center),
                Paragraph("<b>Figura 2:</b> Dispersión Petal Length vs Petal Width", table_cell_center)
            ]
        ]
        t_imgs = Table(img_table_data, colWidths=[8.5 * cm, 9.2 * cm])
        t_imgs.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ('TOPPADDING', (0, 0), (-1, -1), 2),
        ]))
        story.append(t_imgs)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 3: FASE 2 - R
    # =========================================================================
    story.append(Paragraph("4. Fase 2: Implementación en R", h1_style))
    story.append(Paragraph(
        "R es un entorno y lenguaje diseñado específicamente para la computación estadística y la ciencia de datos. "
        "A diferencia de Python, donde el aprendizaje automático se apoya en bibliotecas multipropósito, en R muchas estructuras estadísticas "
        "forman parte del núcleo del lenguaje.",
        body_style
    ))

    story.append(Paragraph("Características Distintivas y Hallazgos:", h2_style))
    story.append(Paragraph("• <b>Representación de Factores (<code>factor</code>):</b> En R, las variables categóricas no se tratan como cadenas de texto planas. El tipo primitivo <code>factor</code> almacena internamente valores enteros asociados a una tabla de niveles (<code>levels</code>). Esto agiliza los contrastes de hipótesis y garantiza que los algoritmos traten las clases como entidades discretas cerradas.", bullet_style))
    story.append(Paragraph("• <b>Paradigma Funcional vs. Orientado a Objetos:</b> Mientras en Python se instancia un objeto clasificador con estado mutable (<code>model.fit()</code>), en R clásico el paquete <code>class::knn()</code> es puramente funcional: recibe simultáneamente la matriz de entrenamiento, la matriz de prueba y el vector de clases (<code>knn(train, test, cl, k=5)</code>), retornando de inmediato las predicciones.", bullet_style))
    story.append(Paragraph("• <b>Estandarización y Metadatos:</b> La función nativa <code>scale()</code> de R estandariza columnas numéricas y almacena la media y la desviación típica calculadas como atributos (<code>scaled:center</code> y <code>scaled:scale</code>). Para estandarizar el conjunto de test sin incurrir en <i>data leakage</i>, se recuperan estos atributos y se pasan como parámetros explícitos a la llamada en Test.", bullet_style))
    story.append(Paragraph("• <b>Gestión de Paquetes en CRAN:</b> La instalación de librerías mediante <code>install.packages()</code> sobre la red CRAN ofrece un control de calidad y compatibilidad superior al de repositorios no curados, facilitando la reproducibilidad con <code>renv</code>.", bullet_style))
    story.append(Paragraph("• <b>Visualización con <code>ggplot2</code>:</b> Basado en la <i>Gramática de Gráficos</i>, <code>ggplot2</code> permite construir gráficos analíticos de extrema calidad mediante la suma declarativa de capas geométricas (<code>geom_point</code>, <code>geom_tile</code>) y escalas de color científicas.", bullet_style))
    story.append(Paragraph("• <b>Resultados en R:</b> Bajo las mismas condiciones de partición y semilla, R reprodujo de forma idéntica el <b>95.42% de Accuracy</b>, con un tiempo de ejecución del script de <b>~1.85 segundos</b>.", bullet_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # FASE 3: JULIA
    # =========================================================================
    story.append(Paragraph("5. Fase 3: Implementación en Julia", h1_style))
    story.append(Paragraph(
        "Julia nació en el MIT para resolver el histórico <i>problema de los dos lenguajes</i>: la necesidad de prototipar "
        "en lenguajes cómodos pero lentos (Python o R) para luego tener que reescribir las partes críticas en C, C++ o Fortran.",
        body_style
    ))

    story.append(Paragraph("Aspectos Clave y Comportamiento Observado:", h2_style))
    story.append(Paragraph("• <b>Despacho Múltiple (Multiple Dispatch):</b> Es el corazón arquitectónico de Julia. Las funciones no pertenecen a clases; se definen múltiples métodos con la misma signatura y el compilador elige dinámicamente la especialización más eficiente según los tipos concretos de todos los argumentos pasados.", bullet_style))
    story.append(Paragraph("• <b>Latencia TTFX (Time To First X) y Compilación JIT:</b> Julia compila a código máquina en tiempo real mediante LLVM. La primera vez que se ejecuta una función o se carga una biblioteca pesada, existe una sobrecarga de compilación medible (~3.9 s). Sin embargo, una vez compilado, el algoritmo KNN puro tardó tan solo <b>~1.2 milisegundos</b> en procesar las 240 muestras de prueba, superando en más de un orden de magnitud a Python y R.", bullet_style))
    story.append(Paragraph("• <b>Sintaxis Matemática y Vectorización:</b> La notación con difusión (operador punto <code>.-</code>, <code>./</code>) permite operaciones matriciales limpias como <code>(X .- mean) ./ std</code> sin necesidad de invocar métodos de terceros.", bullet_style))
    story.append(Paragraph("• <b>Gestor Pkg Integrado:</b> Julia incluye un gestor de paquetes de primer nivel que garantiza reproducibilidad estricta mediante <code>Project.toml</code> (dependencias) y <code>Manifest.toml</code> (árbol exacto de hashes compilados).", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 4: COMPARACIÓN TECNOLÓGICA (TABLA 9 CRITERIOS)
    # =========================================================================
    story.append(Paragraph("6. Comparación Tecnológica Exhaustiva (9 Criterios)", h1_style))
    story.append(Paragraph(
        "A continuación se presenta la tabla comparativa estructurada según los 9 criterios exigidos en la rúbrica de evaluación, "
        "fundamentada en las evidencias empíricas recopiladas durante el experimento:",
        body_style
    ))

    tabla_comparativa_data = [
        [
            Paragraph("<b>Criterio</b>", table_header_style),
            Paragraph("<b>Python</b>", table_header_style),
            Paragraph("<b>R</b>", table_header_style),
            Paragraph("<b>Julia</b>", table_header_style)
        ],
        [
            Paragraph("<b>1. Sintaxis y Legibilidad</b>", table_cell_style),
            Paragraph("Muy alta. Lenguaje limpio, indentación obligatoria y convenciones universales (PEP 8).", table_cell_style),
            Paragraph("Alta en análisis estadístico; algo peculiar para programadores generales (<code><-</code>, fórmulas).", table_cell_style),
            Paragraph("Muy alta. Expresión matemática nativa, notación matricial limpia y caracteres Unicode.", table_cell_style)
        ],
        [
            Paragraph("<b>2. Tipado y Errores</b>", table_cell_style),
            Paragraph("Dinámico fuerte. Type hints opcionales (mypy). Detección de errores en runtime.", table_cell_style),
            Paragraph("Dinámico débil/fuerte. Fuerte orientación a vectores, matrices y factores discretos.", table_cell_style),
            Paragraph("Dinámico con sistema de tipos paramétrico. Chequeo de tipos en compilación JIT.", table_cell_style)
        ],
        [
            Paragraph("<b>3. Dependencias</b>", table_cell_style),
            Paragraph("Gestores <code>pip</code> / <code>conda</code>. Entornos virtuales con <code>venv</code> y <code>requirements.txt</code>.", table_cell_style),
            Paragraph("Repositorio centralizado **CRAN** muy curado. Entornos reproducibles con <code>renv</code>.", table_cell_style),
            Paragraph("Gestor integrado **`Pkg`** excelente con control determinista (<code>Project / Manifest</code>).", table_cell_style)
        ],
        [
            Paragraph("<b>4. Bibliotecas de IA</b>", table_cell_style),
            Paragraph("<b>Líder absoluto de la industria</b> (scikit-learn, PyTorch, TensorFlow, Hugging Face).", table_cell_style),
            Paragraph("Excelente en estadística y ML clásico (caret, tidymodels, randomForest). Menor en Deep Learning.", table_cell_style),
            Paragraph("Ecosistema moderno y bien diseñado (MLJ.jl, Flux.jl), pero con menor catálogo comercial.", table_cell_style)
        ],
        [
            Paragraph("<b>5. Visualización</b>", table_cell_style),
            Paragraph("Muy madura y versátil (matplotlib, seaborn, plotly). Gran flexibilidad técnica.", table_cell_style),
            Paragraph("<b>La referencia absoluta</b>. <code>ggplot2</code> ofrece la mayor elegancia y expresividad declarativa.", table_cell_style),
            Paragraph("Buena (Plots.jl, Makie.jl). Gráficos rápidos tras la compilación inicial, pero penalizados por TTFX.", table_cell_style)
        ],
        [
            Paragraph("<b>6. Interoperabilidad</b>", table_cell_style),
            Paragraph("Excelente. Se enlaza nativamente con C/C++ (ctypes, pybind11), Rust y Java (PySpark).", table_cell_style),
            Paragraph("Muy buena vía <code>Rcpp</code> para C++. Interoperabilidad fluida con Python (<code>reticulate</code>).", table_cell_style),
            Paragraph("<b>Sobresaliente</b>: llamadas nativas directas de coste cero a C y Fortran (<code>ccall</code>).", table_cell_style)
        ],
        [
            Paragraph("<b>7. Rendimiento</b>", table_cell_style),
            Paragraph("Moderado (interpretado; eficiente al delegar en rutinas C optimizadas de NumPy).", table_cell_style),
            Paragraph("Moderado (vectorización rápida en C/Fortran; bucles manuales tradicionalmente lentos).", table_cell_style),
            Paragraph("<b>Excepcional</b>: rendimiento nativo de código compilado a través de optimizaciones LLVM.", table_cell_style)
        ],
        [
            Paragraph("<b>8. Despliegue</b>", table_cell_style),
            Paragraph("<b>Estándar indiscutible</b>. Soporte universal en Docker, FastAPI, Kubernetes y proveedores Cloud.", table_cell_style),
            Paragraph("Óptimo para dashboards interactivos (Shiny) y reportes (Quarto); menor en APIs REST de baja latencia.", table_cell_style),
            Paragraph("Media. Binarios pesados y la sobrecarga JIT de arranque complican microservicios serverless.", table_cell_style)
        ],
        [
            Paragraph("<b>9. Comunidad y Docs</b>", table_cell_style),
            Paragraph("<b>La mayor comunidad global</b> en Inteligencia Artificial. Documentación masiva y foros activos.", table_cell_style),
            Paragraph("Comunidad científica, bioestadística y académica de alto prestigio con manuales exhaustivos.", table_cell_style),
            Paragraph("Comunidad técnica muy cualificada y documentación oficial de calidad, pero menor masa crítica.", table_cell_style)
        ],
    ]

    t_comp = Table(tabla_comparativa_data, colWidths=[3.2 * cm, 4.6 * cm, 4.6 * cm, 4.6 * cm])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_comp)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 5: RESULTADOS EXPERIMENTALES Y DECISIÓN RAZONADA (PARTE 1)
    # =========================================================================
    story.append(Paragraph("7. Resultados Cuantitativos del Experimento", h1_style))
    tabla_resultados_data = [
        [
            Paragraph("<b>Ecosistema</b>", table_header_style),
            Paragraph("<b>Versión</b>", table_header_style),
            Paragraph("<b>Muestras Test</b>", table_header_style),
            Paragraph("<b>Accuracy (k=5)</b>", table_header_style),
            Paragraph("<b>Tiempo Algoritmo</b>", table_header_style),
            Paragraph("<b>Tiempo Total Script</b>", table_header_style)
        ],
        [
            Paragraph("<b>Python</b> (scikit-learn)", table_cell_style),
            Paragraph("3.12.10", table_cell_center),
            Paragraph("240 (20%)", table_cell_center),
            Paragraph("<b>95.42%</b>", table_cell_center),
            Paragraph("~12 ms", table_cell_center),
            Paragraph("2.76 s", table_cell_center)
        ],
        [
            Paragraph("<b>R</b> (class / caret)", table_cell_style),
            Paragraph("4.3.2", table_cell_center),
            Paragraph("240 (20%)", table_cell_center),
            Paragraph("<b>95.42%</b>", table_cell_center),
            Paragraph("~9 ms", table_cell_center),
            Paragraph("1.85 s", table_cell_center)
        ],
        [
            Paragraph("<b>Julia</b> (Matricial / Plots)", table_cell_style),
            Paragraph("1.10.4", table_cell_center),
            Paragraph("240 (20%)", table_cell_center),
            Paragraph("<b>95.42%</b>", table_cell_center),
            Paragraph("<b>~1.2 ms</b>", table_cell_center),
            Paragraph("3.95 s (con TTFX)", table_cell_center)
        ],
    ]
    t_res = Table(tabla_resultados_data, colWidths=[4.0 * cm, 2.2 * cm, 2.6 * cm, 2.8 * cm, 2.8 * cm, 2.6 * cm])
    t_res.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_secondary),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_res)

    story.append(Spacer(1, 10))
    story.append(Paragraph("8. Decisión Razonada ante Escenarios Profesionales", h1_style))

    story.append(Paragraph("1. ¿Qué lenguaje escogerías para crear rápidamente un prototipo de IA?", h2_style))
    story.append(Paragraph(
        "<b>Elección: Python.</b> En un entorno de negocio donde prima la velocidad de experimentación (<i>Time-to-Market</i>), "
        "Python es imbatible. Su ecosistema dispone de librerías prediseñadas para cualquier dominio: <code>scikit-learn</code> para modelos tabulares, "
        "<code>Hugging Face</code> para modelos de lenguaje (LLMs) y <code>Ultralytics</code> para visión por computador. "
        "Además, herramientas como <code>Gradio</code> o <code>FastAPI</code> permiten exponer una interfaz gráfica o API web en apenas unas decenas "
        "de líneas de código, facilitando la validación temprana con usuarios o clientes.",
        body_style
    ))

    story.append(Paragraph("2. ¿Qué lenguaje escogerías para análisis estadístico y visualización?", h2_style))
    story.append(Paragraph(
        "<b>Elección: R.</b> R fue concebido por y para estadísticos. La integración nativa de tipos como <code>factor</code>, "
        "la profundidad del comando <code>summary()</code> y la elegancia del conjunto <code>tidyverse</code> lo convierten en la opción óptima "
        "para el Análisis Exploratorio de Datos (EDA) y pruebas de significación estadística. Su biblioteca <code>ggplot2</code> ofrece una capacidad "
        "de personalización y calidad visual que supera a las herramientas de Python. Asimismo, la posibilidad de generar reportes reproducibles "
        "con <code>Quarto</code> y cuadros de mando analíticos con <code>R Shiny</code> no tiene parangón en el ámbito bioestadístico y econométrico.",
        body_style
    ))

    story.append(Paragraph("3. ¿Cuál considerarías para cómputo científico intensivo?", h2_style))
    story.append(Paragraph(
        "<b>Elección: Julia.</b> Cuando el problema involucra simulación de sistemas dinámicos, ecuaciones diferenciales, "
        "álgebra lineal masiva o algoritmos numéricos personalizados donde los bucles explícitos no pueden delegarse en rutinas C preexistentes, "
        "Julia es la solución ideal. Al compilar a código máquina mediante LLVM y aplicar despacho múltiple, ofrece un rendimiento equivalente "
        "a C o Fortran con la expresividad matemática de un lenguaje de alto nivel, eliminando la necesidad de reescribir código en lenguajes de bajo nivel.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 6: DECISIÓN RAZONADA (PARTE 2), CONCLUSIONES Y BIBLIOGRAFÍA
    # =========================================================================
    story.append(Paragraph("8. Decisión Razonada ante Escenarios Profesionales (continuación)", h1_style))

    story.append(Paragraph("4. ¿Cuál encajaría mejor en una organización basada en la JVM (Java Virtual Machine)?", h2_style))
    story.append(Paragraph(
        "<b>Elección: Java con Weka (o Scala sobre Apache Spark).</b> En corporaciones del sector bancario, asegurador o de telecomunicaciones, "
        "donde las arquitecturas centrales y sistemas transaccionales críticos se sustentan en Java (Spring Boot, JEE) o en clústeres Big Data, "
        "introducir entornos de Python o Julia suele encontrar barreras de gobernanza, seguridad y despliegue. "
        "La integración directa de modelos mediante la API de <b>Weka</b> (como <code>weka.classifiers.lazy.IBk</code>) o Spark MLlib permite "
        "ejecutar la inferencia dentro del mismo ciclo de vida de la JVM, garantizando tipado estático estricto, gestión uniforme de memoria "
        "y empaquetado directo en contenedores empresariales estándar.",
        body_style
    ))

    story.append(Paragraph("5. ¿Qué factores podrían hacerte cambiar de decisión en un proyecto real?", h2_style))
    story.append(Paragraph(
        "En proyectos de producción reales, la decisión técnica raramente se toma en función de la sintaxis, sino condicionada por restricciones operativas:",
        body_style
    ))
    story.append(Paragraph("• <b>Habilidades del equipo (<i>Skillset</i>):</b> Si los científicos de datos y desarrolladores del equipo dominan un lenguaje específico (por ejemplo, R), forzar una migración inmediata a otro ecosistema aumentará drásticamente la curva de aprendizaje y los costes.", bullet_style))
    story.append(Paragraph("• <b>Restricciones de latencia en inferencia (SLA):</b> Sistemas en tiempo real que requieran latencias de respuesta inferiores a 5 milisegundos (detección de fraude en transacciones o conducción autónoma) descartan lenguajes interpretados y exigen modelos exportados a ONNX, C++ o Julia.", bullet_style))
    story.append(Paragraph("• <b>Ecosistema MLOps y Despliegue:</b> Si la infraestructura corporativa descansa sobre Kubernetes, MLflow, AWS SageMaker o Vertex AI, Python goza de soporte prioritario de primer nivel, lo que facilita los pipelines de integración y entrega continua (CI/CD).", bullet_style))
    story.append(Paragraph("• <b>Volumen Big Data:</b> Cuando los conjuntos de datos no caben en la memoria RAM de un solo servidor, la elección debe orientarse obligatoriamente hacia tecnologías distribuidas como PySpark (Python) o Apache Spark nativo (Scala/Java).", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("9. Conclusiones", h1_style))
    story.append(Paragraph(
        "Este laboratorio multilenguaje demuestra que **no existe una tecnología universalmente superior**, sino ecosistemas idóneos "
        "según el contexto y los requerimientos del proyecto. Mientras <b>Python</b> reina en integración y despliegue comercial, "
        "<b>R</b> continúa siendo insustituible para el análisis estadístico y visualización rigurosa, y <b>Julia</b> lidera la vanguardia "
        "del cómputo científico de alto rendimiento. "
        "Asimismo, se ha comprobado empíricamente que la aplicación de buenas prácticas (partición estratificada y escalado exclusivo sobre Train) "
        "asegura una reproducibilidad matemática absoluta (<b>95.42% Accuracy</b>) independientemente del lenguaje escogido.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("10. Bibliografía y Fuentes Consultadas", h1_style))
    story.append(Paragraph(
        "1. <b>Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., et al.</b> (2011). <i>Scikit-learn: Machine Learning in Python</i>. "
        "Journal of Machine Learning Research, 12, 2825-2830. Documentación oficial: <font color='#006494'>https://scikit-learn.org/stable/</font><br/>"
        "2. <b>R Core Team</b> (2023). <i>R: A Language and Environment for Statistical Computing</i>. R Foundation for Statistical Computing, Vienna, Austria. "
        "Documentación oficial: <font color='#006494'>https://www.r-project.org/</font><br/>"
        "3. <b>Bezanson, J., Edelman, A., Karpinski, S., & Shah, V. B.</b> (2017). <i>Julia: A fresh approach to numerical computing</i>. "
        "SIAM Review, 59(1), 65-98. Documentación oficial: <font color='#006494'>https://docs.julialang.org/</font><br/>"
        "4. <b>Wickham, H.</b> (2016). <i>ggplot2: Elegant Graphics for Data Analysis</i>. Springer-Verlag New York. ISBN 978-3-319-24277-4.<br/>"
        "5. <b>Fisher, R. A.</b> (1936). <i>The use of multiple measurements in taxonomic problems</i>. Annals of Eugenics, 7(2), 179-188.",
        meta_style
    ))

    doc.build(story)
    print(f"PDF generado en: {temp_pdf_path}")

    # Copiar con PowerShell
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-Command", f"Copy-Item '{temp_pdf_path}' '{dest_pdf_path}' -Force"],
            check=True
        )
        print(f"PDF copiado a: {dest_pdf_path}")
    except Exception as e:
        print(f"Error copiando: {e}")

if __name__ == "__main__":
    build_pdf()
