GAMEPULSE STUDIOS — DATASET BI
================================

GamePulse es una empresa ficticia de videojuegos online tipo live-service.

El dataset ha sido diseñado específicamente para un proyecto de Business
Intelligence. Los registros son sintéticos, pero reproducen patrones realistas
de actividad, monetización, rendimiento técnico, soporte y operaciones.

PERIODO
-------
2025-09-01 a 2026-06-30

VOLUMEN
-------
- 55.000 jugadores
- 290.000 sesiones
- 52.000 compras
- 22.000 tickets de soporte

TABLAS DE HECHOS
----------------
FactSesiones.csv
  Una fila = una sesión de juego.

FactCompras.csv
  Una fila = una transacción.

FactSoporte.csv
  Una fila = un ticket de soporte.

DIMENSIONES
-----------
DimJugadores.csv
DimPlataformas.csv
DimRegiones.csv
DimModos.csv
DimTemporadas.csv
DimVersiones.csv
DimContenido.csv
DimCalendario.csv

OTRAS TABLAS
------------
Objetivos.csv
EventosJuego.csv

MONEDA
------
Todos los importes monetarios están normalizados a EUR.

IMPORTANTE
----------
No hay datos personales reales.
Los identificadores de jugadores, sesiones, compras y tickets son ficticios.

El dataset contiene cambios temporales, diferencias entre plataformas,
regiones y productos, además de eventos de negocio y tecnología. No todos
los cambios observados implican causalidad.

La finalidad es que el equipo BI decida qué analizar, qué medir y cómo
comunicarlo.
