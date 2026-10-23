// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import PerfilVeterinario from '../paginas/PerfilVeterinario';

test('muestra las recetas emitidas del veterinario', () => {
  render(
    <MemoryRouter>
      <PerfilVeterinario sesion={{ nombre: 'Fabián', correo: 'fabian@vetsanmarcos.cl' }} />
    </MemoryRouter>,
  );

  expect(screen.getByText('Recetas emitidas')).toBeTruthy();
});
