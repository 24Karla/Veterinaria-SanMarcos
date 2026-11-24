import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import App from '../App';

const producto = {
    codigo: 'PRODUCTO',
    nombre: 'Alimento',
    categoria: 'Alimentos',
    precio: 1000,
    stock: 5,
    cantidad: 1,
    imagen: '/img/Amoxibay.jpg',
    principioActivo: '',
    presentacion: 'Bolsa',
    especie: 'Perro',
};

const sesion = { id: 4, nombre: 'Sofía', correo: 'sofia@gmail.com', rol: 'cliente' };
const horario = {
    id: 42,
    fecha: '2030-01-15',
    hora: '10:00:00',
    veterinario: 'Fabián Gómez',
};

function abrir(ruta: string) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <App />
        </MemoryRouter>,
    );
}

test('permite confirmar un pedido como invitado', async () => {
    localStorage.setItem('carrito-veterinaria', JSON.stringify([producto]));
    const fetchSimulado = vi.fn(
        async () =>
            new Response(JSON.stringify({ id: 10, total: 1000, estado: 'CONFIRMADO' }), {
                status: 201,
            }),
    );
    vi.stubGlobal('fetch', fetchSimulado);
    abrir('/tienda?pagina=pago');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar como invitado' }));

    fireEvent.change(screen.getByLabelText('Nombre completo'), {
        target: { value: 'Invitado' },
    });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'invitado@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Dirección de despacho'), {
        target: { value: 'Dirección indicada' },
    });
    fireEvent.change(screen.getByLabelText('Medio de pago'), {
        target: { value: 'Transferencia' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(
        await screen.findByRole('heading', { name: '¡Pedido confirmado!' }),
    ).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledWith(
        expect.stringContaining('/api/pedidos'),
        expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('invitado@example.com'),
        }),
    );
    expect(localStorage.getItem('sesion-veterinaria')).toBeNull();
});

test('el ingreso opcional vuelve al pago y conserva el despacho', async () => {
    localStorage.setItem('carrito-veterinaria', JSON.stringify([producto]));
    vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response(JSON.stringify(sesion), { status: 200 })),
    );
    abrir('/tienda?pagina=pago');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar como invitado' }));

    fireEvent.change(screen.getByLabelText('Dirección de despacho'), {
        target: { value: 'Dirección conservada' },
    });
    fireEvent.change(screen.getByLabelText('Medio de pago'), {
        target: { value: 'Transferencia' },
    });
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión (opcional)' }));
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'sofia@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await screen.findByRole('heading', { name: 'Finalizar compra' });
    expect(
        (screen.getByLabelText('Dirección de despacho') as HTMLInputElement).value,
    ).toBe('Dirección conservada');
    expect((screen.getByLabelText('Medio de pago') as HTMLSelectElement).value).toBe(
        'Transferencia',
    );
    expect(screen.queryByRole('link', { name: 'Iniciar sesión (opcional)' })).toBeNull();
});

test('permite reservar como invitado sin marcar Tienda como activa', async () => {
    const fetchSimulado = vi.fn(
        async (_url: string, opciones?: RequestInit) =>
            new Response(
                JSON.stringify(
                    opciones?.method === 'POST'
                        ? { id: 50, mascota: 'Luna', ...horario }
                        : [horario],
                ),
                { status: opciones?.method === 'POST' ? 201 : 200 },
            ),
    );
    vi.stubGlobal('fetch', fetchSimulado);
    abrir('/tienda?pagina=cita&origen=navbar');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar como invitado' }));
    expect(
        screen.getByRole('link', { name: 'Tienda' }).classList.contains('active'),
    ).toBe(false);
    fireEvent.change(screen.getByLabelText('Nombre del dueño'), {
        target: { value: 'Invitado' },
    });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'invitado@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Nombre de la mascota'), {
        target: { value: 'Luna' },
    });
    fireEvent.change(screen.getByLabelText('Especie'), { target: { value: 'PERRO' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2030-01-15' } });
    await screen.findByRole('option', { name: '10:00 · Fabián Gómez' });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '42' } });
    fireEvent.change(screen.getByLabelText('Motivo de consulta'), {
        target: { value: 'Consulta general' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reservar cita' }));

    expect(await screen.findByRole('heading', { name: '¡Cita reservada!' })).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledWith(
        expect.stringContaining('/api/citas'),
        expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('invitado@example.com'),
        }),
    );
    expect(localStorage.getItem('sesion-veterinaria')).toBeNull();
});

test('el ingreso opcional vuelve a la reserva y conserva los datos de la mascota', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn(
            async (url: string) =>
                new Response(
                    JSON.stringify(url.includes('/registro/login') ? sesion : [horario]),
                    { status: 200 },
                ),
        ),
    );
    abrir('/tienda?pagina=cita&origen=servicios&servicio=Consulta%20general');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar como invitado' }));
    fireEvent.change(screen.getByLabelText('Nombre de la mascota'), {
        target: { value: 'Luna' },
    });
    fireEvent.change(screen.getByLabelText('Motivo de consulta'), {
        target: { value: 'Motivo conservado' },
    });
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar sesión (opcional)' }));
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
        target: { value: 'sofia@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Reservar cita' })).toBeTruthy(),
    );
    expect(
        (await screen.findByLabelText<HTMLInputElement>('Nombre de la mascota')).value,
    ).toBe('Luna');
    expect(
        (screen.getByLabelText('Motivo de consulta') as HTMLTextAreaElement).value,
    ).toBe('Motivo conservado');
    expect(screen.getByText('Servicio seleccionado: Consulta general')).toBeTruthy();
});

test('la cuenta cliente puede reservar para una de sus mascotas inscritas', async () => {
    localStorage.setItem('sesion-veterinaria', JSON.stringify(sesion));
    const fetchSimulado = vi.fn(async (url: string, opciones?: RequestInit) => {
        if (url.endsWith('/api/mascotas?clienteId=4')) {
            return Response.json([
                { id: 6, clienteId: 4, nombre: 'Luna', especie: 'GATO', activo: true },
                { id: 7, clienteId: 4, nombre: 'Boby', especie: 'PERRO', activo: false },
                { id: 8, clienteId: 5, nombre: 'Toby', especie: 'PERRO', activo: true },
            ]);
        }
        if (opciones?.method === 'POST') return Response.json({ id: 50, mascota: 'Luna', ...horario });
        return Response.json([horario]);
    });
    vi.stubGlobal('fetch', fetchSimulado);
    abrir('/tienda?pagina=cita');

    const desplegable = await screen.findByLabelText('Mascotas inscritas');
    expect(screen.queryByRole('option', { name: 'Boby' })).toBeNull();
    expect(screen.queryByRole('option', { name: 'Toby' })).toBeNull();
    fireEvent.change(desplegable, { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: horario.fecha } });
    await screen.findByRole('option', { name: '10:00 · Fabián Gómez' });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '42' } });
    fireEvent.change(screen.getByLabelText('Motivo de consulta'), { target: { value: 'Control' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reservar cita' }));

    expect(await screen.findByRole('heading', { name: '¡Cita reservada!' })).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledWith(
        expect.stringContaining('/api/citas'),
        expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"mascota":"Luna","especie":"GATO"'),
        }),
    );
});

test('crear cuenta desde la reserva abre directamente el formulario de registro', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response('[]', { status: 200 })),
    );
    abrir('/tienda?pagina=cita&origen=navbar');
    fireEvent.click(screen.getByRole('link', { name: 'Crear cuenta' }));
    expect(await screen.findByRole('heading', { name: 'Crear cuenta' })).toBeTruthy();
    expect(screen.getByLabelText('Nombre')).toBeTruthy();
});
