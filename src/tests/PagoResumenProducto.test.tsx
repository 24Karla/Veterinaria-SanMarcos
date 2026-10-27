// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Pago from '../paginas/Pago';

test('muestra el producto en el resumen de pago', () => {
  render(
    <Pago
      carrito={[{
        codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg',
        principioActivo: 'Amoxicilina', presentacion: 'Blíster 10 comp.',
        especie: 'Perro / Gato', stock: 45, precio: 4200,
        imagen: '/img/Amoxibay.jpg', cantidad: 1,
      }]}
      onVolver={vi.fn()}
      onIrProductos={vi.fn()}
      onFinalizar={vi.fn()}
    />,
  );

  expect(screen.getByText('Amoxibay 250mg × 1')).toBeTruthy();
});
