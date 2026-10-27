# =============================================================================
# PRÁCTICA 1 · RA1 · M3 PROGRAMACIÓ D'INTEL·LIGÈNCIA ARTIFICIAL
# Laboratorio Multilenguaje para IA: KNN en Iris
# Fase 3: Implementación en Julia
# =============================================================================
# Condiciones experimentales fijadas:
#  - Dataset: Iris (4 variables de entrada continuas y 1 clase)
#  - Partición: 80% entrenamiento / 20% prueba (estratificada, seed=42)
#  - Escalado: Estandarización (Standardizer / Z-score: media 0, desviación 1)
#  - Algoritmo: K-Nearest Neighbors (k=5, distancia euclídea)
#  - Métricas: Accuracy y Matriz de Confusión
#  - Registro: Tiempo de primera ejecución (JIT/TTFX) y versiones
# =============================================================================

using Dates
println("="^70)
println("PRÁCTICA 1 · RA1: CLASIFICACIÓN KNN EN JULIA")
println("="^70)

# -----------------------------------------------------------------------------
# 0. GESTIÓN DE PAQUETES Y COMPILACIÓN JIT
# -----------------------------------------------------------------------------
# En Julia, Pkg gestiona entornos reproducibles (Project.toml).
# Medimos el tiempo total incluyendo compilación (Time To First Execution - TTFX)
t_inicio_total = time()

using Pkg
# Activar el entorno local si existe Project.toml
if isfile("Project.toml")
    Pkg.activate(".")
elseif isfile("Julia/Project.toml")
    Pkg.activate("Julia")
end

using CSV
using DataFrames
using Random
using Statistics

# -----------------------------------------------------------------------------
# 1. CARGA DEL DATASET Y RECONOCIMIENTO DE LA ESTRUCTURA
# -----------------------------------------------------------------------------
posibles_rutas = ["data/iris_extended.csv", "../data/iris_extended.csv"]
ruta_datos = filter(isfile, posibles_rutas)[1]

println("\n[1] Cargando dataset desde: ", ruta_datos)
df_raw = CSV.read(ruta_datos, DataFrame)

# Selección de las 4 variables canónicas y la variable clase
features = [:sepal_length, :sepal_width, :petal_length, :petal_width]
target = :species
df = select(df_raw, [features; target])

println("Dimensiones del dataset: $(nrow(df)) filas x $(ncol(df)) columnas")
println("\nPrimeras 5 filas:")
println(first(df, 5))

println("\nTipos de datos en Julia (schema):")
for col in names(df)
    println(" - $col: $(eltype(df[!, col]))")
end

println("\nDistribución de las clases (combine/groupby):")
conteo_clases = combine(groupby(df, target), nrow => :count)
println(conteo_clases)

# -----------------------------------------------------------------------------
# 2. PARTICIÓN ESTRATIFICADA (80% TRAIN / 20% TEST, SEED=42)
# -----------------------------------------------------------------------------
println("\n[2] Realizando partición estratificada (80% Train / 20% Test, seed=42)...")
Random.seed!(42)

# Partición estratificada por cada especie
indices_train = Int[]
indices_test = Int[]

for grupo in groupby(df, target)
    n = nrow(grupo)
    n_train = round(Int, 0.80 * n)
    indices_shuffled = shuffle(1:n)
    
    # Índices globales en el DataFrame
    indices_grupo = parentindices(grupo)[1]
    
    append!(indices_train, indices_grupo[indices_shuffled[1:n_train]])
    append!(indices_test,  indices_grupo[indices_shuffled[n_train+1:end]])
end

train_df = df[indices_train, :]
test_df  = df[indices_test, :]

println(" - Conjunto de entrenamiento (Train): $(nrow(train_df)) muestras")
println(" - Conjunto de prueba (Test):         $(nrow(test_df)) muestras")

# -----------------------------------------------------------------------------
# 3. ESTANDARIZACIÓN DE VARIABLES (PREVENCIÓN DE DATA LEAKAGE)
# -----------------------------------------------------------------------------
println("\n[3] Estandarizando variables con estadísticas aprendidas en Train...")

# Extraer matrices numéricas
X_train = Matrix{Float64}(train_df[:, features])
y_train = Vector{String}(train_df[:, target])

X_test = Matrix{Float64}(test_df[:, features])
y_test = Vector{String}(test_df[:, target])

# Calcular medias y desviaciones típicas exclusivamente sobre Train
medias_train = mean(X_train, dims=1)
desv_train   = std(X_train, dims=1)

println(" - Medias aprendidas en Train:        ", round.(medias_train, digits=3))
println(" - Desviaciones aprendidas en Train:  ", round.(desv_train, digits=3))

# Estandarización: Z = (X - μ) / σ
X_train_scaled = (X_train .- medias_train) ./ desv_train
X_test_scaled  = (X_test  .- medias_train) ./ desv_train

# -----------------------------------------------------------------------------
# 4. IMPLEMENTACIÓN DE KNN CON DESPACHO MÚLTIPLE (MULTIPLE DISPATCH)
# -----------------------------------------------------------------------------
# Julia destaca por su Despacho Múltiple y funciones parametrizadas de alto rendimiento.
k_val = 5
println("\n[4] Ejecutando K-Nearest Neighbors (k=$k_val, distancia euclídea)...")

function predict_knn(X_tr::Matrix{Float64}, y_tr::Vector{String}, X_te::Matrix{Float64}, k::Int)
    n_test = size(X_te, 1)
    n_train = size(X_tr, 1)
    predicciones = Vector{String}(undef, n_test)
    
    for i in 1:n_test
        x_query = @view X_te[i, :]
        # Vector de distancias euclídeas a todas las instancias de Train
        distancias = zeros(Float64, n_train)
        for j in 1:n_train
            x_cand = @view X_tr[j, :]
            # Distancia euclídea al cuadrado (suficiente para ordenar)
            d2 = sum((x_query .- x_cand) .^ 2)
            distancias[j] = sqrt(d2)
        end
        
        # Encontrar los k vecinos más cercanos (k menores distancias)
        indices_k = partialsortperm(distancias, 1:k)
        etiquetas_vecinos = y_tr[indices_k]
        
        # Votación por mayoría (moda)
        conteo = Dict{String, Int}()
        for et in etiquetas_vecinos
            conteo[et] = get(conteo, et, 0) + 1
        end
        # Escoger la clase con más votos
        mejor_clase = argmax(conteo)
        predicciones[i] = mejor_clase
    end
    return predicciones
end

t_entreno_inicio = time()
y_pred = predict_knn(X_train_scaled, y_train, X_test_scaled, k_val)
t_entreno_fin = time()

# -----------------------------------------------------------------------------
# 5. EVALUACIÓN Y MATRIZ DE CONFUSIÓN
# -----------------------------------------------------------------------------
println("\n[5] Evaluando resultados en el conjunto de Test...")

# Accuracy
correctas = sum(y_pred .== y_test)
total_test = length(y_test)
accuracy = correctas / total_test

println("-> Accuracy obtenida: $(round(accuracy * 100, digits=2))% ($(round(accuracy, digits=4)))")

# Matriz de confusión
clases = sort(unique(y_train))
n_clases = length(clases)
cm = zeros(Int, n_clases, n_clases)

for i in 1:total_test
    idx_real = findfirst(==(y_test[i]), clases)
    idx_pred = findfirst(==(y_pred[i]), clases)
    cm[idx_real, idx_pred] += 1
end

println("\nMatriz de Confusión (Filas: Real, Columnas: Predicción):")
println("Clases: ", clases)
println(cm)

# -----------------------------------------------------------------------------
# 6. GENERACIÓN DE VISUALIZACIONES
# -----------------------------------------------------------------------------
println("\n[6] Generando gráficos con Plots.jl...")
dir_salida = isdir("Julia") ? "Julia/output" : "output"
if !isdir(dir_salida)
    mkpath(dir_salida)
end

# Intentar generar gráfico con Plots si está precompilado
try
    using Plots
    
    # Gráfico de dispersión
    p1 = scatter(
        df.petal_length, df.petal_width,
        group = df.species,
        title = "Visualización Iris en Julia: Pétalo Longitud vs Ancho",
        xlabel = "Longitud del Pétalo (cm)",
        ylabel = "Ancho del Pétalo (cm)",
        markersize = 5,
        alpha = 0.8,
        legend = :topleft
    )
    savefig(p1, joinpath(dir_salida, "dispersion_iris_julia.png"))
    println(" -> Guardada dispersión en: ", joinpath(dir_salida, "dispersion_iris_julia.png"))
catch e
    println(" -> [Nota Plots.jl] Para visualización gráfica en Julia, use Pluto.jl o ejecute `using Plots`.")
end

# -----------------------------------------------------------------------------
# 7. REGISTRO DE VERSIONES, ENTORNO Y TIEMPOS (TTFX)
# -----------------------------------------------------------------------------
t_fin_total = time()
tiempo_total = t_fin_total - t_inicio_total
tiempo_knn = t_entreno_fin - t_entreno_inicio

println("\n" * "="^70)
println("EVIDENCIAS TÉCNICAS Y REPRODUCIBILIDAD (JULIA)")
println("="^70)
println("Versión de Julia:      ", VERSION)
println("Plataforma / CPU:      ", Sys.MACHINE)
println("Hilos de ejecución:    ", Threads.nthreads())
println("Tiempo algoritmo KNN:  $(round(tiempo_knn * 1000, digits=2)) ms ($(round(tiempo_knn, digits=4)) s)")
println("Tiempo total (TTFX):   $(round(tiempo_total * 1000, digits=2)) ms ($(round(tiempo_total, digits=4)) s)")
println("="^70)
println("Ejecución completada con éxito.")
