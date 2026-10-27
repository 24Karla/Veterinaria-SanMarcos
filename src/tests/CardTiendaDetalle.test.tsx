// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CardTienda from '../componentes/organismos/CardTienda';

test('abre el detalle del producto', () => {
  const verDetalle = vi.fn();
  const producto = {
    codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg',
    principioActivo: 'Amoxicilina', presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato', stock: 45, precio: 4200, imagen: '/img/Amoxibay.jpg',
  };

  render(
    <CardTienda producto={producto} cantidad={0} onAgregar={vi.fn()}
      onCambiarCantidad={vi.fn()} onVerDetalle={verDetalle} />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Ver producto' }));

  expect(verDetalle).toHaveBeenCalledWith(producto);
});
