// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import PerfilCliente from '../paginas/PerfilCliente';

test('muestra las mascotas iniciales del cliente', () => {
  localStorage.clear();

  render(
    <MemoryRouter>
      <PerfilCliente sesion={{ nombre: 'Sofía', correo: 'sofia@gmail.com' }} />
    </MemoryRouter>,
  );

  expect(screen.getByText('Luna')).toBeTruthy();
  expect(screen.getByText('Milo')).toBeTruthy();
});
