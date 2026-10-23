// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CardTienda from '../componentes/organismos/CardTienda';

test('desactiva agregar al carrito cuando no hay stock', () => {
  render(
    <CardTienda
      producto={{
        codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg',
        principioActivo: 'Amoxicilina', presentacion: 'Blíster 10 comp.',
        especie: 'Perro / Gato', stock: 0, precio: 4200, imagen: '/img/Amoxibay.jpg',
      }}
      cantidad={0}
      onAgregar={vi.fn()}
      onCambiarCantidad={vi.fn()}
      onVerDetalle={vi.fn()}
    />,
  );

  const boton = screen.getByRole('button', {
    name: 'Agregar al carrito',
  }) as HTMLButtonElement;

  expect(boton.disabled).toBe(true);
});
