// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Pago from '../paginas/Pago';

test('muestra un mensaje si no hay productos para pagar', () => {
  render(
    <Pago carrito={[]} onVolver={vi.fn()} onIrProductos={vi.fn()}
      onFinalizar={vi.fn()} />,
  );

  expect(screen.getByText('No hay productos para pagar')).toBeTruthy();
});
