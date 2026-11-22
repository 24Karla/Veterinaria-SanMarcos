import { expect, test } from 'vitest';
import { crearRutaReserva } from '../servicios/rutas';

test('lleva a la reserva con el servicio seleccionado', () => {
  expect(crearRutaReserva('Consulta general'))
    .toBe('/tienda?pagina=cita&origen=servicios&servicio=Consulta%20general');
});
