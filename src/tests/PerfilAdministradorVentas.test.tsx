// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import PerfilAdministrador from '../paginas/PerfilAdministrador';

test('muestra pedidos y ventas para el administrador', () => {
  render(
    <MemoryRouter>
      <PerfilAdministrador sesion={{ nombre: 'Administrador', correo: 'admin@vetsanmarcos.cl' }} />
    </MemoryRouter>,
  );

  expect(screen.getByText('Pedidos y ventas')).toBeTruthy();
});
