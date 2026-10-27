// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import ProductosInventario from '../paginas/ProductosInventario';

test('muestra una alerta si falta información al agregar un producto', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.clear();

    render(
        <MemoryRouter>
            <ProductosInventario />
        </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));

    expect(alerta).toHaveBeenCalledWith('Completa nombre, categoría, precio y stock.');
    alerta.mockRestore();
});
