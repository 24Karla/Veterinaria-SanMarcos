import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import Navbar from '../componentes/organismos/Navbar';
import Tienda from '../paginas/Tienda';

test('actualiza la cantidad del navbar al agregar y quitar unidades', async () => {
    const producto = {
        codigo: 'PRODUCTO',
        nombre: 'Alimento',
        categoria: 'Alimentos',
        precio: 1000,
        stock: 5,
        imagen: '/img/Amoxibay.jpg',
        principioActivo: '',
        presentacion: 'Bolsa',
        especie: 'Perro',
    };
    vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response(JSON.stringify([producto]), { status: 200 })),
    );
    render(
        <MemoryRouter initialEntries={['/tienda']}>
            <Navbar sesion={null} onCerrarSesion={() => {}} />
            <Tienda />
        </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }));
    expect(screen.getByRole('link', { name: 'Ir al carrito, 1 producto' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByRole('link', { name: 'Ir al carrito, 2 productos' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    expect(screen.getByRole('link', { name: 'Ir al carrito' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Ir al carrito, / })).toBeNull();
});
