P1 · RA2 · DE LOS DATOS A LOS KPI — POWER BI
==============================================

FUENTE
------
Brazilian E-Commerce Public Dataset by Olist
https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

Los datos originales son datos comerciales reales anonimizados.
Licencia original: CC BY-NC-SA 4.0.

VERSIÓN DOCENTE
---------------
Para esta práctica se ha preparado una versión simplificada destinada
a Business Intelligence.

Scope:
- pedidos entregados;
- compras desde 2017-01-01 hasta 2018-08-31;
- registros sin fecha real/estimada de entrega quedan fuera;
- categorías traducidas al inglés cuando existe traducción.

GRANULARIDAD
------------
FactVentas.csv:
una fila = una línea de producto de un pedido.

IMPORTANTE:
un pedido puede aparecer en más de una fila.
Para contar pedidos debe utilizarse un conteo distinto de pedido_id.

RELACIONES ESPERADAS
--------------------
DimProductos[producto_id]  1 ---> * FactVentas[producto_id]
DimClientes[cliente_id]    1 ---> * FactVentas[cliente_id]
DimCalendario[fecha]       1 ---> * FactVentas[fecha_compra]

NOTA TEMPORAL
-------------
2018 termina en agosto.
No compares 2017 completo con 2018 completo como si ambos periodos
tuvieran la misma duración.

Uso exclusivamente educativo/no comercial bajo las condiciones
de la licencia de origen.
