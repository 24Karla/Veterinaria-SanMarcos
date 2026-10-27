import { expect, test } from 'vitest';
import { filtrarServicios } from '../componentes/organismos/ListaServicios';

test('filtra los servicios por categoría', () => {
  expect(filtrarServicios('Cirugía')[0].categoria).toBe('Cirugía');
});
