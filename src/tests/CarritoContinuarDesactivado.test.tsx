// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Carrito from '../paginas/Carrito';

test('desactiva continuar compra con el carrito vacío', () => {
  render(
    <Carrito carrito={[]} onCambiarCantidad={vi.fn()} onEliminar={vi.fn()}
      onVolver={vi.fn()} onPagar={vi.fn()} />,
  );

  const boton = screen.getByRole('button', {
    name: 'Continuar compra',
  }) as HTMLButtonElement;

  expect(boton.disabled).toBe(true);
});
