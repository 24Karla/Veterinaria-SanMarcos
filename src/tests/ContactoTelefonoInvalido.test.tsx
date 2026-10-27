import { expect, test } from 'vitest';
import { esTelefonoValido } from '../componentes/moleculas/validacionesContacto';

test('rechaza un teléfono que contiene letras', () => {
  expect(esTelefonoValido('+569ABC123')).toBe(false);
});
