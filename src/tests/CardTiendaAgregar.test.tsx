// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CardTienda from '../componentes/organismos/CardTienda';

test('agrega un producto al carrito', () => {
  const agregarCarrito = vi.fn();
  const producto = {
    codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg',
    principioActivo: 'Amoxicilina', presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato', stock: 45, precio: 4200, imagen: '/img/Amoxibay.jpg',
  };

  render(
    <CardTienda producto={producto} cantidad={0} onAgregar={agregarCarrito}
      onCambiarCantidad={vi.fn()} onVerDetalle={vi.fn()} />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

  expect(agregarCarrito).toHaveBeenCalledWith(producto);
});
