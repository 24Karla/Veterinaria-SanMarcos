import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import ListaEquipo from '../componentes/organismos/ListaEquipo';

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

test('muestra el equipo recibido del backend', async () => {
    vi.stubGlobal(
        'fetch',
        vi
            .fn()
            .mockResolvedValue(
                new Response(
                    JSON.stringify([
                        {
                            id: 2,
                            nombre: 'Dr. Fabián',
                            rol: 'VETERINARIO',
                            especialidad: 'Medicina general',
                        },
                    ]),
                    { status: 200 },
                ),
            ),
    );
    render(<ListaEquipo />);
    expect(await screen.findByText('Dr. Fabián Gómez')).toBeTruthy();
});
