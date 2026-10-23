// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CardTienda from '../componentes/organismos/CardTienda';

test('muestra el stock disponible', () => {
  render(
    <CardTienda
      producto={{
        codigo: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg',
        principioActivo: 'Amoxicilina', presentacion: 'Blíster 10 comp.',
        especie: 'Perro / Gato', stock: 45, precio: 4200, imagen: '/img/Amoxibay.jpg',
      }}
      cantidad={0}
      onAgregar={vi.fn()}
      onCambiarCantidad={vi.fn()}
      onVerDetalle={vi.fn()}
    />,
  );

  expect(screen.getByText('Stock: 45')).toBeTruthy();
});
