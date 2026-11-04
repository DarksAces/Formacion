# STAGEOPS · Solicitud de investigación independiente
## Expediente SO-2026-041 · Destinatario: equipo consultor

StageOps coordina operaciones de conciertos para distintas promotoras. La venta de localidades se presta mediante compañías externas de ticketing; los pagos se procesan en una pasarela independiente. Nuestro equipo recibe exportaciones para supervisar el servicio.

Durante la revisión de las próximas actuaciones hemos recibido reclamaciones sobre asignación de localidades y confirmación de compras. Antes de abrir nuevas ventas necesitamos un diagnóstico independiente. No damos por hecho que todas las reclamaciones tengan el mismo origen ni que una repetición en los registros sea una operación incorrecta.

Disponéis de exportaciones de seis conciertos, clientes, reservas, movimientos de pago, entradas e historial de cambios. Determinad qué funciona correctamente y dónde existen incidencias, su alcance y las medidas prioritarias.

## Preguntas que necesita resolver dirección
1. ¿Qué conciertos, periodos y compañías presentan incidencias demostrables?
2. ¿Qué operaciones parecen repetidas pero son legítimas? ¿Cuáles generan un conflicto real?
3. ¿Qué secuencia explica los casos afectados? Aportad ejemplos rastreables por identificador.
4. ¿Cuántas butacas, reservas, compradores e importes están afectados? Definid cada indicador para no duplicar personas ni dinero.
5. ¿Qué corregiríais antes de la siguiente apertura de ventas y cómo comprobaríais la corrección?

## Reglas del servicio
- Todas las localidades son numeradas. Una butaca se identifica por concert_id + seat_id. El mismo seat_id en conciertos distintos no representa un conflicto.
- Una reserva bloquea UNA butaca durante diez minutos: intervalo [created_at, expires_at). Un pedido puede contener varias reservas y varios pagos unitarios, con un solo comprador.
- Si al terminar el plazo no hay confirmación aceptada, la butaca queda libre. No se prorroga la reserva por iniciar un pago.
- Una confirmación de pago solo permite emitir si la reserva sigue vigente y conserva la butaca. La captura bancaria y la llegada de su confirmación son momentos distintos.
- Si la confirmación llega con la reserva caducada, debe devolverse el importe sin emitir entrada. El protocolo permite esa devolución aunque la butaca aún no se haya vendido de nuevo.
- Una entrada deja de ser válida en voided_at. Tras la anulación se puede vender la localidad a otra persona. Dos entradas sucesivas pueden ser legítimas; dos simultáneamente vigentes para la misma localidad no lo son.
- Un pago unitario CAPTURED es dinero cobrado. REFUNDED es dinero devuelto. Los importes son positivos; el signo contable lo determina event_type. Los reenvíos de una misma notificación no son nuevos cobros.
- Cada reserva tiene, en este alcance, como máximo una captura bancaria y una devolución. No hay pagos parciales, cambios de asiento ni transferencias. Los precios son finales, en EUR, sin comisiones separadas.
- La compra no identifica a todos los asistentes: customer_id identifica al comprador, que puede comprar varias entradas.

## Entrega del equipo consultor
Un PDF de una o dos páginas: diagnóstico ejecutivo, evidencias y cronología, cuantificación con denominadores explícitos, límites de las conclusiones y tres medidas priorizadas. Máximo dos gráficos. Mantened vuestro notebook ejecutable disponible para revisión durante la sesión.

## Condiciones de la sesión
De 15:30 a 19:30, sin pausa programada, en equipos de cuatro o cinco. Utilizad Python y Pandas; no hace falta desplegar servicios. Los seis CSV deben conservarse intactos y toda transformación debe realizarse mediante código. El profesor realizará rondas de seguimiento.

## Alcance y confidencialidad de la simulación
Las exportaciones contienen todos los movimientos incluidos en el periodo de venta hasta snapshot_at. Los conciertos aún no se han celebrado: no hay escaneos ni evidencia de acceso al recinto. No se proporciona un inventario completo de butacas: saleable_capacity es el aforo comercial y reservations contiene las localidades solicitadas. Este paquete no permite auditar butacas nunca solicitadas.

Todos los artistas, recintos, compañías, personas y operaciones son ficticios. Cualquier coincidencia de nombre es casual. Son datos sintéticos de formación, no eventos anunciados ni datos reales de clientes. Los correos utilizan example.com.
