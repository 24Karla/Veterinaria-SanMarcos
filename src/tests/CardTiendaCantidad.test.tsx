// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CardTienda from '../componentes/organismos/CardTienda';

test('aumenta la cantidad de un producto', () => {
  const cambiarCantidad = vi.fn();

  render(
    <CardTienda
      producto={{
        codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg',
        principioActivo: 'Amoxicilina', presentacion: 'Blíster 10 comp.',
        especie: 'Perro / Gato', stock: 45, precio: 4200, imagen: '/img/Amoxibay.jpg',
      }}
      cantidad={1}
      onAgregar={vi.fn()}
      onCambiarCantidad={cambiarCantidad}
      onVerDetalle={vi.fn()}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '+' }));

  expect(cambiarCantidad).toHaveBeenCalledWith('ME001', 2);
});
