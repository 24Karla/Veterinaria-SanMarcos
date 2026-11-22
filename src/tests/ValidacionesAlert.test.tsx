import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import App from '../App';

test('la reserva vacía muestra una alerta con los campos faltantes y no envía datos', async () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fetchSimulado = vi.fn(async () => new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetchSimulado);
    render(
        <MemoryRouter initialEntries={['/tienda?pagina=cita']}>
            <App />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continuar como invitado' }));
    await screen.findByText('No hay horarios disponibles para reservar.');
    fireEvent.click(screen.getByRole('button', { name: 'Reservar cita' }));

    expect(alerta).toHaveBeenCalledTimes(1);
    const mensaje = alerta.mock.calls[0][0];
    expect(mensaje).toContain('Nombre del dueño');
    expect(mensaje).toContain('Correo electrónico');
    expect(mensaje).toContain('Nombre de la mascota');
    expect(mensaje).toContain('Especie');
    expect(mensaje).toContain('Fecha');
    expect(mensaje).toContain('Hora');
    expect(mensaje).toContain('Motivo de consulta');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
});

test('los campos obligatorios de mascotas generan una sola alerta', async () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const sesion = { id: 4, nombre: 'Sofía', correo: 'sofia@gmail.com', rol: 'cliente' };
    localStorage.setItem('sesion-veterinaria', JSON.stringify(sesion));
    const fetchSimulado = vi.fn(
        async (url: string, _opciones?: RequestInit) =>
            new Response(
                JSON.stringify(
                    url.includes('/registro/usuario/') ? { nombre: sesion.nombre } : [],
                ),
                { status: 200 },
            ),
    );
    vi.stubGlobal('fetch', fetchSimulado);
    render(
        <MemoryRouter initialEntries={['/perfil/cliente']}>
            <App />
        </MemoryRouter>,
    );
    await screen.findByText('No tienes mascotas registradas.');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar mascota' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar mascota' }));

    expect(alerta).toHaveBeenCalledTimes(1);
    expect(alerta.mock.calls[0][0]).toContain('Nombre de la mascota');
    expect(alerta.mock.calls[0][0]).toContain('Edad en años');
    expect(
        fetchSimulado.mock.calls.every(
            ([, opciones]) => !opciones?.method || opciones.method === 'GET',
        ),
    ).toBe(true);
});
