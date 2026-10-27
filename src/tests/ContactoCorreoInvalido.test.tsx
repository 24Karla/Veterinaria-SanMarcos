import { expect, test } from 'vitest';
import { esCorreoValido } from '../componentes/moleculas/validacionesContacto';

test('rechaza un correo sin formato válido', () => {
  expect(esCorreoValido('sofia')).toBe(false);
});
