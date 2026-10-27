// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Carrito from '../paginas/Carrito';

test('muestra el mensaje cuando el carrito está vacío', () => {
  render(
    <Carrito carrito={[]} onCambiarCantidad={vi.fn()} onEliminar={vi.fn()}
      onVolver={vi.fn()} onPagar={vi.fn()} />,
  );

  expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
});
