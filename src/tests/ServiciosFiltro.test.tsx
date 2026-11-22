import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import ListaServicios from '../componentes/organismos/ListaServicios';

test('filtra los servicios recibidos del servidor por categoría', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
            new Response(
                JSON.stringify([
                    {
                        codigo: 'SV001',
                        nombre: 'Consulta general',
                        categoria: 'Consultas',
                        precioClp: 15000,
                    },
                    {
                        codigo: 'SV002',
                        nombre: 'Cirugía menor',
                        categoria: 'Cirugía',
                        precioClp: 35000,
                    },
                ]),
                { status: 200 },
            ),
        ),
    );
    render(
        <MemoryRouter>
            <ListaServicios />
        </MemoryRouter>,
    );
    await screen.findByText('Cirugía menor');
    expect(
        screen.getByRole('img', { name: 'Consulta general' }).getAttribute('src'),
    ).toBe('/img/consulta-general.jpg');
    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), {
        target: { value: 'Cirugía' },
    });
    expect(screen.getByText('Cirugía menor')).toBeTruthy();
    expect(screen.queryByText('Consulta general')).toBeNull();
});
