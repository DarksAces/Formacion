# Diccionario de datos · StageOps

Fechas ISO 8601 en UTC (Z). Campos vacíos = ausencia de valor. Separador coma; decimal punto; codificación UTF-8 con BOM para facilitar Excel. No deducir el orden temporal de la posición de las filas ni de los identificadores. Intervalos de vigencia semiabiertos: inicio incluido, final excluido. La exportación no contiene etiquetas de anomalía.

## concerts.csv · una fila por concierto
concert_id: clave; artist: artista/banda; tour_name: gira; venue: recinto; city: ciudad; ticketing_company_id y ticketing_company_name: proveedor; saleable_capacity: localidades habilitadas para este montaje, no aforo máximo del edificio; sales_open_at: apertura; doors_open_at y concert_start_at: horarios; timezone: zona local para presentación; snapshot_at: cierre común de la exportación.

## customers.csv · una fila por comprador
customer_id: clave; first_name: nombre; last_name: apellidos; email: contacto ficticio. Puede haber homónimos. La identidad se resuelve por customer_id, no por nombre. No identifica a cada acompañante.

## reservations.csv · una fila por reserva unitaria
reservation_id: clave; order_id: agrupa una o varias localidades de una compra; customer_id: comprador; concert_id: concierto; seat_id: localidad (sector S, fila R, butaca B); created_at: inicio del bloqueo; expires_at: fin del plazo; unit_price_eur: precio unitario.
Una misma localidad puede tener varias reservas en momentos distintos. No hay columna de estado final: se reconstruye con tiempo, pago y emisión.

## payment_events.csv · una fila por entrega de una notificación financiera
payment_event_id: clave de la entrega; provider_event_id: identidad del evento financiero en la pasarela, estable en los reenvíos; payment_id: operación bancaria, común a su captura y eventual devolución; reservation_id: reserva unitaria; event_type: CAPTURED o REFUNDED; amount_eur: importe positivo; occurred_at: instante de la operación bancaria; received_at: recepción en ticketing; delivery_attempt: intento de entrega.
No hay una fila por pedido ni una fila única por cobro. Para contabilidad, una notificación financiera se cuenta una vez. Una captura y su devolución tienen provider_event_id distintos.

## tickets.csv · una fila por entrada emitida
 ticket_id: clave; reservation_id: reserva; payment_id: captura que la respalda; concert_id y seat_id: asignación; issued_at: emisión; voided_at: anulación (vacío si sigue vigente al cierre); issuer_version: versión del componente emisor.
La vigencia es [issued_at, voided_at), o hasta el cierre si no hay anulación. El archivo conserva entradas anuladas, no solo las vigentes. No hay reemisiones ni transferencias en este alcance.

## system_changes.csv · una fila por cambio de configuración
change_id: clave; ticketing_company_id: compañía; effective_at: entrada en vigor; component: componente; version: versión de ese componente, no versión global de todos los sistemas; setting_name: parámetro; old_value y new_value: valores anterior y nuevo; description: descripción operativa.
Los cambios se aplican a todos los conciertos de la compañía. Una configuración continúa hasta un cambio posterior del mismo parámetro/componente. CURRENT_OWNER_AND_NOT_EXPIRED exige vigencia y propiedad actual de la localidad; PAYMENT_REFERENCE_EXISTS comprueba la existencia de la referencia de pago. Un cambio temporalmente próximo no demuestra por sí mismo la causa de una incidencia.

## Relaciones
concerts 1:N reservations; customers 1:N reservations; order_id agrupa reservas; reservations 1:N payment_events; reservations 1:0..1 tickets en este paquete; payment_id relaciona tickets y movimientos financieros. concerts 1:N tickets. system_changes se contrasta por compañía, componente y tiempo. Verificar cardinalidades antes de combinar pagos con entradas: los reenvíos y devoluciones pueden multiplicar filas.
