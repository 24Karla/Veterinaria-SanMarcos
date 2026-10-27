// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import PerfilCliente from '../paginas/PerfilCliente';

test('muestra el formulario al agregar una mascota', () => {
  localStorage.clear();

  render(
    <MemoryRouter>
      <PerfilCliente sesion={{ nombre: 'Sofía', correo: 'sofia@gmail.com' }} />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Agregar mascota' }));

  expect(screen.getByPlaceholderText('Nombre de la mascota')).toBeTruthy();
});
