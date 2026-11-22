import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import PerfilCliente from '../paginas/PerfilCliente';

test('muestra las mascotas del cliente recibidas de la API', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify(
        url.includes('/api/mascotas') ? [{ id: 1, nombre: 'Luna', especie: 'PERRO', edad: 4, clienteId: 1, activo: true }]
                : url.includes('/registro/usuario/') ? { nombre: 'Sofía', email: 'sofia@example.com' } : []
    ), { status: 200 })));
    render(<MemoryRouter><PerfilCliente sesion={{ id: 1, nombre: 'Sofía', correo: 'sofia@example.com' }} /></MemoryRouter>);
    expect(await screen.findByText('Luna')).toBeTruthy();
    expect(screen.queryByText('Milo')).toBeNull();
});
