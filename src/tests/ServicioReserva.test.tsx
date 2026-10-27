import { expect, test } from 'vitest';
import { crearRutaReserva } from '../componentes/organismos/CardServicio';

test('lleva a la reserva con el servicio seleccionado', () => {
  expect(crearRutaReserva('Consulta general'))
    .toBe('/tienda?pagina=cita&servicio=Consulta%20general');
});
