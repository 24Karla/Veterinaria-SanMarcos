import { expect, test } from 'vitest';
import { EQUIPO_MOCK } from '../componentes/organismos/ListaEquipo';

test('el equipo incluye al veterinario Fabián', () => {
  expect(EQUIPO_MOCK.some((miembro) => miembro.nombre === 'Dr. Fabián')).toBe(true);
});
