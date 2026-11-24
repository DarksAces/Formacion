package com.monlau.ia;

import weka.classifiers.Evaluation;
import weka.classifiers.lazy.IBk;
import weka.core.Attribute;
import weka.core.EuclideanDistance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.Version;
import weka.core.converters.ArffSaver;
import weka.core.converters.CSVLoader;
import weka.core.converters.ConverterUtils.DataSource;
import weka.core.neighboursearch.LinearNNSearch;
import weka.filters.Filter;
import weka.filters.supervised.instance.StratifiedRemoveFolds;
import weka.filters.unsupervised.attribute.Reorder;
import weka.filters.unsupervised.attribute.Standardize;

import javax.imageio.ImageIO;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Locale;
import java.util.Random;

/**
 * =============================================================================
 * PRÁCTICA 1 · RA1 · M3 PROGRAMACIÓ D'INTEL·LIGÈNCIA ARTIFICIAL
 * Laboratorio Multilenguaje para IA: KNN en Iris
 * Fase 4: Implementación en Java con la API de Weka (IBk)
 * =============================================================================
 * Condiciones experimentales fijadas:
 *  - Dataset: Iris (4 variables de entrada continuas y 1 clase nominal)
 *  - Formato: ARFF nativo de Weka (con conversión automática desde CSV si procede)
 *  - Partición: 80% entrenamiento / 20% prueba (estratificada, seed=42)
 *  - Escalado: Estandarización Z-Score (weka.filters.unsupervised.attribute.Standardize)
 *  - Algoritmo: K-Nearest Neighbors -> weka.classifiers.lazy.IBk (k=5, distancia euclídea)
 *  - Métricas: Accuracy, Matriz de Confusión y métricas detalladas por clase
 *  - Visualización: Gráficos PNG renderizados nativamente con Java2D
 * =============================================================================
 */
public class KnnIrisWeka {

    public static void main(String[] args) {
        Locale.setDefault(Locale.US);
        long startTimeTotal = System.nanoTime();

        System.out.println("======================================================================");
        System.out.println("PRÁCTICA 1 · RA1: CLASIFICACIÓN KNN EN JAVA CON WEKA (IBk)");
        System.out.println("======================================================================");

        try {
            // -----------------------------------------------------------------
            // 1. CARGA DEL DATASET (FORMATO ARFF O CONVERSIÓN JUSTIFICADA)
            // -----------------------------------------------------------------
            File arffFile = localizarArchivo("data/iris_extended.arff", "../data/iris_extended.arff");
            File csvFile  = localizarArchivo("data/iris_extended.csv", "../data/iris_extended.csv");

            Instances data;
            if (arffFile != null && arffFile.exists()) {
                System.out.println("\n[1] Cargando dataset en formato nativo ARFF desde: " + arffFile.getPath());
                DataSource source = new DataSource(arffFile.getAbsolutePath());
                data = source.getDataSet();
            } else if (csvFile != null && csvFile.exists()) {
                System.out.println("\n[1] Archivo ARFF no encontrado. Convirtiendo CSV a estructura ARFF desde: " + csvFile.getPath());
                data = cargarYConvertirDesdeCSV(csvFile);
            } else {
                throw new IllegalStateException("No se encontró iris_extended.arff ni iris_extended.csv en data/");
            }

            // -----------------------------------------------------------------
            // 2. DEFINICIÓN DEL ATRIBUTO DE CLASE Y ESTRUCTURA DE DATOS
            // -----------------------------------------------------------------
            // En Weka es obligatorio indicar explícitamente qué columna actúa como variable objetivo (clase)
            Attribute attrSpecies = data.attribute("species");
            if (attrSpecies != null) {
                data.setClass(attrSpecies);
            } else {
                data.setClassIndex(data.numAttributes() - 1);
            }

            System.out.println("Relación ARFF cargada: @" + data.relationName());
            System.out.println("Dimensiones del dataset: " + data.numInstances() + " instancias x " + data.numAttributes() + " atributos");

            System.out.println("\nEsquema de atributos detectados en Weka (Instances):");
            for (int i = 0; i < data.numAttributes(); i++) {
                Attribute attr = data.attribute(i);
                String rol = (i == data.classIndex()) ? " [ATRIBUTO DE CLASE]" : " [PREDICTOR]";
                System.out.printf(" - Atributo [%d] %-14s : Tipo %-8s%s%n",
                        i, attr.name(), Attribute.typeToString(attr), rol);
            }

            System.out.println("\nDistribución de la clase nominal '" + data.classAttribute().name() + "':");
            int[] classCounts = data.attributeStats(data.classIndex()).nominalCounts;
            for (int i = 0; i < classCounts.length; i++) {
                System.out.printf(" - %-12s : %d muestras%n", data.classAttribute().value(i), classCounts[i]);
            }

            // -----------------------------------------------------------------
            // 3. PARTICIÓN ESTRATIFICADA (80% TRAIN / 20% TEST, SEED=42)
            // -----------------------------------------------------------------
            System.out.println("\n[2] Realizando partición estratificada (80% Train / 20% Test, seed=42)...");
            // StratifiedRemoveFolds divide el dataset en 5 pliegues estratificados exactos:
            //  - 4 pliegues (invertSelection = true)  -> 80% Entrenamiento (960 muestras)
            //  - 1 pliegue  (invertSelection = false) -> 20% Prueba        (240 muestras)
            StratifiedRemoveFolds foldTrain = new StratifiedRemoveFolds();
            foldTrain.setSeed(42);
            foldTrain.setNumFolds(5);
            foldTrain.setFold(1);
            foldTrain.setInvertSelection(true);
            foldTrain.setInputFormat(data);
            Instances trainData = Filter.useFilter(data, foldTrain);

            StratifiedRemoveFolds foldTest = new StratifiedRemoveFolds();
            foldTest.setSeed(42);
            foldTest.setNumFolds(5);
            foldTest.setFold(1);
            foldTest.setInvertSelection(false);
            foldTest.setInputFormat(data);
            Instances testData = Filter.useFilter(data, foldTest);

            System.out.println(" - Conjunto de entrenamiento (Train): " + trainData.numInstances() + " muestras");
            System.out.println(" - Conjunto de prueba (Test):         " + testData.numInstances() + " muestras");

            // -----------------------------------------------------------------
            // 4. ESTANDARIZACIÓN DE VARIABLES (PREVENCIÓN DE DATA LEAKAGE)
            // -----------------------------------------------------------------
            System.out.println("\n[3] Estandarizando variables con weka.filters.unsupervised.attribute.Standardize...");
            // Calcular medias y desviaciones antes de estandarizar para trazabilidad
            System.out.printf(" - Medias aprendidas en Train:        [%.3f, %.3f, %.3f, %.3f]%n",
                    trainData.meanOrMode(0), trainData.meanOrMode(1),
                    trainData.meanOrMode(2), trainData.meanOrMode(3));
            System.out.printf(" - Desviaciones aprendidas en Train:  [%.3f, %.3f, %.3f, %.3f]%n",
                    Math.sqrt(trainData.variance(0)), Math.sqrt(trainData.variance(1)),
                    Math.sqrt(trainData.variance(2)), Math.sqrt(trainData.variance(3)));

            // IMPORTANTE: setInputFormat(trainData) ajusta el filtro SOLO con Train.
            // Al invocar Filter.useFilter(testData, standardize), se proyecta la escala de Train sobre Test.
            Standardize standardize = new Standardize();
            standardize.setInputFormat(trainData);
            Instances trainScaled = Filter.useFilter(trainData, standardize);
            Instances testScaled  = Filter.useFilter(testData, standardize);

            // -----------------------------------------------------------------
            // 5. ENTRENAMIENTO DEL CLASIFICADOR KNN (IBk, k=5, EUCLÍDEA)
            // -----------------------------------------------------------------
            int kValue = 5;
            System.out.println("\n[4] Configurando y entrenando clasificador weka.classifiers.lazy.IBk (k=" + kValue + ")...");

            long startTimeAlgo = System.nanoTime();

            IBk knn = new IBk(kValue);
            // Configurar búsqueda lineal con distancia euclídea sin re-normalizar internamente
            EuclideanDistance euclidean = new EuclideanDistance();
            euclidean.setDontNormalize(true);
            LinearNNSearch nnSearch = new LinearNNSearch();
            nnSearch.setDistanceFunction(euclidean);
            knn.setNearestNeighbourSearchAlgorithm(nnSearch);

            // Entrenar clasificador perezoso (almacena las referencias normalizadas de Train)
            knn.buildClassifier(trainScaled);
            System.out.println("Clasificador IBk construido correctamente.");

            // -----------------------------------------------------------------
            // 6. EVALUACIÓN DEL MODELO SOBRE TEST
            // -----------------------------------------------------------------
            System.out.println("\n[5] Evaluando modelo sobre el conjunto de prueba (Test)...");
            Evaluation eval = new Evaluation(trainScaled);
            eval.evaluateModel(knn, testScaled);

            long endTimeAlgo = System.nanoTime();
            double timeAlgoMs = (endTimeAlgo - startTimeAlgo) / 1_000_000.0;

            double accuracy = eval.pctCorrect();
            System.out.printf("%n-> Accuracy obtenida: %.2f%% (%.4f)%n", accuracy, accuracy / 100.0);

            System.out.println("\nResumen global de evaluación (Weka Evaluation):");
            System.out.println(eval.toSummaryString());

            System.out.println(eval.toMatrixString("=== Matriz de Confusión ==="));
            System.out.println(eval.toClassDetailsString("=== Métricas Detalladas por Especie ==="));

            // -----------------------------------------------------------------
            // 7. GENERACIÓN DE VISUALIZACIONES NATIVAS EN JAVA2D
            // -----------------------------------------------------------------
            System.out.println("[6] Generando visualizaciones gráficas con Java2D...");
            File outDir = new File("Java/output").exists() ? new File("Java/output")
                        : (new File("Java").exists() ? new File("Java/output") : new File("output"));
            if (!outDir.exists()) {
                outDir.mkdirs();
            }

            File cmFile = new File(outDir, "matriz_confusion_java.png");
            File scatterFile = new File(outDir, "dispersion_iris_java.png");

            generarGraficoMatrizConfusion(eval.confusionMatrix(),
                    new String[]{"setosa", "versicolor", "virginica"},
                    kValue, accuracy, cmFile);
            generarGraficoDispersion(data, scatterFile);

            System.out.println(" -> Guardada matriz de confusión: " + cmFile.getPath());
            System.out.println(" -> Guardada dispersión:          " + scatterFile.getPath());

            // -----------------------------------------------------------------
            // 8. REGISTRO DE VERSIONES, ENTORNO JVM Y TIEMPOS DE EJECUCIÓN
            // -----------------------------------------------------------------
            long endTimeTotal = System.nanoTime();
            double totalTimeMs = (endTimeTotal - startTimeTotal) / 1_000_000.0;

            System.out.println("\n======================================================================");
            System.out.println("EVIDENCIAS TÉCNICAS Y REPRODUCIBILIDAD (JAVA / JVM)");
            System.out.println("======================================================================");
            System.out.println("Sistema Operativo:    " + System.getProperty("os.name") + " " + System.getProperty("os.version") + " (" + System.getProperty("os.arch") + ")");
            System.out.println("Versión de Java:      " + System.getProperty("java.version") + " (" + System.getProperty("java.vendor") + ")");
            System.out.println("Máquina Virtual (JVM):" + System.getProperty("java.vm.name") + " " + System.getProperty("java.vm.version"));
            System.out.println("Versión de Weka API:  " + Version.VERSION);
            System.out.printf("Tiempo algoritmo IBk: %.2f ms (%.4f s)%n", timeAlgoMs, timeAlgoMs / 1000.0);
            System.out.printf("Tiempo total script:  %.2f ms (%.4f s)%n", totalTimeMs, totalTimeMs / 1000.0);
            System.out.println("======================================================================");
            System.out.println("Ejecución completada con éxito.");

        } catch (Exception e) {
            System.err.println("Error durante la ejecución en Weka: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Localiza un archivo probando rutas relativas desde la raíz del repositorio o desde la carpeta Java/.
     */
    private static File localizarArchivo(String... rutas) {
        for (String r : rutas) {
            File f = new File(r);
            if (f.exists()) {
                return f;
            }
        }
        return null;
    }

    /**
     * Carga el archivo CSV original, filtra las 4 variables canónicas + species,
     * reordena la clase al final y guarda una copia en formato nativo ARFF.
     */
    private static Instances cargarYConvertirDesdeCSV(File csvFile) throws Exception {
        CSVLoader loader = new CSVLoader();
        loader.setSource(csvFile);
        Instances raw = loader.getDataSet();

        // Índices en iris_extended.csv (1-based para el filtro Reorder):
        // 1: species, 4: sepal_length, 5: sepal_width, 6: petal_length, 7: petal_width
        Reorder reorder = new Reorder();
        reorder.setAttributeIndices("4,5,6,7,1");
        reorder.setInputFormat(raw);
        Instances filtered = Filter.useFilter(raw, reorder);
        filtered.setRelationName("iris_extended");
        filtered.setClassIndex(filtered.numAttributes() - 1);

        // Guardar copia en ARFF para futuras ejecuciones directas
        File destArff = new File(csvFile.getParentFile(), "iris_extended.arff");
        try {
            ArffSaver saver = new ArffSaver();
            saver.setInstances(filtered);
            saver.setFile(destArff);
            saver.writeBatch();
        } catch (Exception ignored) {
            // Si el directorio está protegido contra escritura, continuar en memoria
        }
        return filtered;
    }

    /**
     * Renderiza la Matriz de Confusión como mapa de calor PNG empleando Java2D (Graphics2D).
     */
    private static void generarGraficoMatrizConfusion(double[][] cm, String[] labels,
                                                      int k, double accuracy, File outFile) throws Exception {
        int width = 800, height = 680;
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);

        g.setColor(new Color(30, 41, 59));
        g.setFont(new Font("SansSerif", Font.BOLD, 22));
        centrarTexto(g, String.format("Matriz de Confusión - KNN (IBk, k=%d) en Java (Weka)", k), width / 2, 48);
        g.setFont(new Font("SansSerif", Font.PLAIN, 17));
        centrarTexto(g, String.format("Accuracy en Test: %.2f%%", accuracy), width / 2, 78);

        int gridX = 180, gridY = 110, cellSize = 150;
        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                int val = (int) Math.round(cm[r][c]);
                float ratio = Math.min(1.0f, val / 80.0f);
                int red   = (int) (240 - ratio * 232);
                int green = (int) (247 - ratio * 199);
                int blue  = (int) (255 - ratio * 147);

                g.setColor(new Color(red, green, blue));
                g.fillRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);

                g.setColor(Color.WHITE);
                g.setStroke(new BasicStroke(2f));
                g.drawRect(gridX + c * cellSize, gridY + r * cellSize, cellSize, cellSize);

                g.setColor(ratio > 0.5f ? Color.WHITE : new Color(15, 23, 42));
                g.setFont(new Font("SansSerif", Font.BOLD, 24));
                centrarTexto(g, String.valueOf(val),
                        gridX + c * cellSize + cellSize / 2,
                        gridY + r * cellSize + cellSize / 2 + 8);
            }
        }

        g.setColor(new Color(30, 41, 59));
        g.setFont(new Font("SansSerif", Font.PLAIN, 16));
        for (int i = 0; i < 3; i++) {
            centrarTexto(g, labels[i], gridX + i * cellSize + cellSize / 2, gridY + 3 * cellSize + 30);
            centrarTexto(g, labels[i], gridX - 60, gridY + i * cellSize + cellSize / 2 + 6);
        }

        g.setFont(new Font("SansSerif", Font.BOLD, 17));
        centrarTexto(g, "Predicción del Modelo (IBk)", gridX + (3 * cellSize) / 2, gridY + 3 * cellSize + 68);
        g.dispose();
        ImageIO.write(img, "png", outFile);
    }

    /**
     * Renderiza el gráfico de dispersión Petal Length vs Petal Width con Java2D.
     */
    private static void generarGraficoDispersion(Instances data, File outFile) throws Exception {
        int width = 860, height = 620;
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);

        g.setColor(new Color(30, 41, 59));
        g.setFont(new Font("SansSerif", Font.BOLD, 21));
        centrarTexto(g, "Visualización Iris en Java (Weka): Longitud vs Ancho de Pétalo", width / 2, 45);

        int plotX = 100, plotY = 80, plotW = 700, plotH = 450;
        g.setColor(new Color(226, 232, 240));
        for (int i = 0; i <= 7; i++) {
            int x = plotX + i * (plotW / 7);
            g.drawLine(x, plotY, x, plotY + plotH);
        }
        for (int i = 0; i <= 6; i++) {
            int y = plotY + i * (plotH / 6);
            g.drawLine(plotX, y, plotX + plotW, y);
        }

        g.setColor(new Color(71, 85, 105));
        g.drawRect(plotX, plotY, plotW, plotH);

        Color[] palette = {
            new Color(59, 130, 246, 190),
            new Color(234, 88, 12, 190),
            new Color(22, 163, 74, 190)
        };

        for (int i = 0; i < data.numInstances(); i++) {
            Instance inst = data.instance(i);
            double pl = inst.value(2);
            double pw = inst.value(3);
            int cls = (int) inst.classValue();

            int px = plotX + (int) (((pl - 0.8) / 7.2) * plotW);
            int py = plotY + plotH - (int) ((pw / 3.2) * plotH);
            g.setColor(palette[cls % 3]);
            g.fillOval(px - 4, py - 4, 9, 9);
        }

        g.setColor(new Color(30, 41, 59));
        g.setFont(new Font("SansSerif", Font.BOLD, 16));
        centrarTexto(g, "Longitud del Pétalo (cm)", plotX + plotW / 2, plotY + plotH + 45);
        g.dispose();
        ImageIO.write(img, "png", outFile);
    }

    private static void centrarTexto(Graphics2D g, String text, int x, int y) {
        FontMetrics fm = g.getFontMetrics();
        g.drawString(text, x - fm.stringWidth(text) / 2, y);
    }
}
