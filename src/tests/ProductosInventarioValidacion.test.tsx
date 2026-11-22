import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import ProductosInventario from '../paginas/ProductosInventario';

test('muestra el error y no guarda un producto sin datos', async () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fetchSimulado = vi.fn().mockResolvedValue(new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetchSimulado);
    render(
        <MemoryRouter>
            <ProductosInventario />
        </MemoryRouter>,
    );
    await screen.findByText('No hay productos registrados.');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(alerta).toHaveBeenCalledWith(expect.stringContaining('Completa código'));
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
});
