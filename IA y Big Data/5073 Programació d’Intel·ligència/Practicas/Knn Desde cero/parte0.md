# 📖 Fase 0: Fundamentos y Conceptos Clave de KNN

Bienvenido a la **Fase 0**. Antes de programar una sola línea de código, es fundamental comprender qué hace este algoritmo a nivel intuitivo y matemático. Cuando entiendes la teoría, programar el algoritmo se convierte en una simple traducción de ideas a código Python.

---

## 1. ¿Qué es el Aprendizaje Perezoso (*Lazy Learning*)?

En el aprendizaje automático (*Machine Learning*) supervisado, la mayoría de algoritmos pertenecen a una de estas dos familias:

```
                      Modelos de Clasificación
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
  Eager Learning                                  Lazy Learning
(Árboles, Redes Neuronales, SVM)             (K-Nearest Neighbors - KNN)
  * Fase de entrenamiento costosa                * Sin fase de entrenamiento real
  * Aprende una función matemática f(x)          * Memoriza todas las muestras
  * Inferencia rápida                            * Inferencia costosa (calcula distancias)
```

* **Modelos impacientes (*Eager Learners*)**: Durante el entrenamiento ajustan parámetros (pesos, ramas, coeficientes) y luego pueden "olvidar" los datos originales.
* **Modelos perezosos (*Lazy Learners / Basados en Instancias*)**: 
  * En la fase de entrenamiento **no aprenden ninguna fórmula** ni extraen coeficientes. Lo único que hacen es **guardar en memoria** los datos de entrenamiento con sus etiquetas correspondientes.
  * Todo el trabajo computacional se retrasa hasta el momento de hacer una **predicción**. Cuando llega un nuevo dato, el algoritmo busca entre todos los datos memorizados cuáles se le parecen más.

> 💡 **Analogía**:  
> Imagina a un estudiante antes de un examen:
> * *Eager learner*: Estudia con antelación, sintetiza las leyes y va al examen con las fórmulas aprendidas en la cabeza.
> * *Lazy learner*: No estudia nada antes; va al examen con el libro abierto y, para cada pregunta, busca en el libro el ejemplo más parecido.

---

## 2. La Distancia Euclídea en $n$ Dimensiones

Para decidir qué datos son "vecinos", necesitamos una regla para medir distancias numéricas. La más natural y geométrica es la **Distancia Euclídea** (la distancia en línea recta, basada en el Teorema de Pitágoras).

### En 2 Dimensiones (Plano Cartesiano)
Si tenemos dos puntos $A = (x_1, y_1)$ y $B = (x_2, y_2)$:
$$d(A, B) = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$

### Generalización a $n$ Dimensiones
En nuestro problema de las flores Iris, cada flor está descrita por **4 características numéricas**:
1. Longitud del sépalo ($x_1$)
2. Anchura del sépalo ($x_2$)
3. Longitud del pétalo ($x_3$)
4. Anchura del pétalo ($x_4$)

Para dos flores $A = (a_1, a_2, a_3, a_4)$ y $B = (b_1, b_2, b_3, b_4)$, la fórmula general es:

$$d(A, B) = \sqrt{\sum_{i=1}^{n} (a_i - b_i)^2} = \sqrt{(a_1 - b_1)^2 + (a_2 - b_2)^2 + (a_3 - b_3)^2 + (a_4 - b_4)^2}$$

### ¿Por qué elevamos al cuadrado y luego hacemos la raíz cuadrada?
1. **Diferencias positivas**: $(a_i - b_i)^2$ asegura que distancias negativas no se anulen con positivas.
2. **Penalización**: Las diferencias grandes reciben una penalización proporcionalmente mayor.
3. **Escala**: La raíz cuadrada devuelve la magnitud a las unidades originales de medida (centímetros).

---

## 3. El Hiperparámetro $k$ y el Criterio de Votación Mayoritaria

Una vez calculadas las distancias entre la flor desconocida y **todas** las flores de entrenamiento:
1. Las ordenamos de menor a mayor distancia.
2. Escogemos las primeras **$k$** flores (sus vecinos más cercanos).
3. **Votación por Mayoría**: La especie que más se repita entre esos $k$ vecinos será la predicción final.

```
Muestra nueva (?)
       │
       ├─ Distancia a Flor 12 (setosa):     0.21 cm  <-- Vecino 1
       ├─ Distancia a Flor 45 (setosa):     0.34 cm  <-- Vecino 2
       ├─ Distancia a Flor 88 (versicolor): 0.39 cm  <-- Vecino 3
       │
Votación con k = 3:
  * setosa: 2 votos
  * versicolor: 1 voto
  --> PREDICCIÓN: setosa
```

### ¿Cómo influye el valor de $k$?

| Valor de $k$ | Comportamiento | Ventajas | Inconvenientes |
| :--- | :--- | :--- | :--- |
| **Muy pequeño ($k = 1$)** | Frontera muy irregular y ajustada al detalle. | Captura patrones locales finos. | **Sobreajuste (*Overfitting*)**: Muy sensible a ruido, errores de medición o flores atípicas (*outliers*). |
| **Intermedio ($k = 3, 5$)** | Buen equilibrio entre sesgo y varianza. | Robusto frente a ruido individual. | Estándar en la mayoría de problemas pequeños. |
| **Muy grande ($k \gg 10$)** | Frontera muy suave y global. | Muy resistente al ruido. | **Infraajuste (*Underfitting*)**: La clase mayoritaria en los datos puede terminar ganando todas las votaciones, ignorando las peculiaridades locales. |

> ⚠️ **Consejo de diseño**:  
> Con 2 clases se suelen elegir números impares ($k=1, 3, 5\dots$) para evitar empates ($2$ contra $2$).  
> Con 3 clases (como en Iris: *setosa, versicolor, virginica*), los empates son posibles (ej. $1-1-1$ con $k=3$); por ello, nuestro algoritmo debe definir una política de desempate (por ejemplo, el vecino más cercano en distancia desempata).

---

## 4. Métricas de Evaluación: Accuracy y Matriz de Confusión

Para saber si nuestro clasificador funciona bien, no podemos evaluarlo con las mismas flores que memorizó; debemos probarlo con un **conjunto de prueba (*test set*)** independiente (el 20% reservado).

### A) Exactitud (*Accuracy*)
Es el porcentaje de predicciones correctas sobre el total de casos evaluados:

$$\text{Accuracy} = \frac{\text{Número de Aciertos}}{\text{Total de Muestras Evaluadas}} = \frac{\sum_{i=1}^{N} \mathbb{I}(y_{\text{real}, i} == y_{\text{pred}, i})}{N}$$

* Si de 240 flores de test acertamos 228:
  $$\text{Accuracy} = \frac{228}{240} = 0.95 \quad (95\%)$$

---

### B) Matriz de Confusión
El *Accuracy* es un solo número que resume todo, pero **no nos dice en qué se equivoca el modelo**.  
La **Matriz de Confusión** es una tabla de doble entrada que compara la **clase real** contra la **clase predicha**:

```
                       PREDICCIONES DEL MODELO
                  setosa     versicolor    virginica
               ┌───────────┬────────────┬───────────┐
    setosa     │    80     │     0      │     0     │  <-- 80 reales: 80 acertadas
REAL           ├───────────┼────────────┼───────────┤
    versicolor │     0     │     74     │     6     │  <-- 80 reales: 74 bien, 6 confundidas con virginica
               ├───────────┼────────────┼───────────┤
    virginica  │     0     │     4      │     76    │  <-- 80 reales: 76 bien, 4 confundidas con versicolor
               └───────────┴────────────┴───────────┘
```

* **Diagonal principal** (de arriba-izq a abajo-der): Son los **aciertos**.
* **Fuera de la diagonal**: Son las **confusiones / errores** del modelo.  
  * Nos permite ver de un vistazo si dos especies (por ejemplo *versicolor* y *virginica*) tienen características físicas tan similares que el modelo tiende a confundirlas.

---

## ✅ Resumen de la Fase 0
Ahora que conocemos:
1. Qué es el aprendizaje perezoso (almacenar en memoria y buscar en inferencia).
2. La fórmula de la distancia euclídea de 4 dimensiones.
3. El papel de $k$ y la votación mayoritaria.
4. Cómo evaluar con Accuracy y Matriz de Confusión.

¡Estamos listos para implementar la **Fase 1** en código Python limpio y comentado!
