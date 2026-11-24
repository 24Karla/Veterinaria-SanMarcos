import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import App from '../App';
import { fechaClinica } from '../servicios/api';

afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
    vi.unstubAllGlobals();
});

function cargarRecepcion(ruta = '/perfil/recepcionista') {
    localStorage.setItem('sesion-veterinaria', JSON.stringify({
        id: 12, nombre: 'Paula Recepción', correo: 'recepcion@example.com', rol: 'recepcionista',
    }));
    render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>);
}

test('busca un cliente y muestra únicamente su historial de citas y compras', async () => {
    const fetchSimulado = vi.fn(async (url: string) => {
        if (url.endsWith('/registro/listar-dto')) {
            return Response.json([
                { id: 24, nombre: 'Ana Muñoz', email: 'ana@example.com', rol: 'CLIENTE' },
                { id: 25, nombre: 'Ana Soto', email: 'vete@example.com', rol: 'VETERINARIO' },
                { id: 26, nombre: 'Luis', email: 'luis@example.com', rol: 'CLIENTE' },
            ]);
        }
        if (url.endsWith('/api/citas')) {
            return Response.json([
                { id: 10, mascota: 'Luna', correo: 'ANA@EXAMPLE.COM', fecha: '2030-04-01',
                    hora: '10:00', veterinario: 'Fabián', estado: 'RESERVADA', servicio: 'Control' },
                { id: 11, mascota: 'Toby', correo: 'luis@example.com', fecha: '2030-04-02',
                    hora: '11:00', veterinario: 'Fabián', estado: 'RESERVADA', servicio: 'Vacuna' },
                { id: 12, dueno: 'María Invitada', mascota: 'Milo', correo: 'invitada@example.com',
                    fecha: '2030-04-03', hora: '12:00', veterinario: 'Fabián', estado: 'RESERVADA', servicio: 'Control' },
            ]);
        }
        if (url.endsWith('/api/compras/dueno/24')) {
            return Response.json([{ id: 3, fechaCompra: '2030-03-01', totalClp: 4500,
                estado: 'PAGADA', detalles: [{ id: 8, nombreComercial: 'Vacuna', cantidad: 1 }] }]);
        }
        if (url.endsWith('/api/pedidos')) {
            return Response.json([
                { id: 4, correo: 'ana@example.com', fecha: '2030-03-01', total: 3500,
                    estado: 'CONFIRMADO', productos: [{ nombre: 'Alimento', cantidad: 2 }] },
                { id: 5, correo: 'luis@example.com', productos: [{ nombre: 'Juguete', cantidad: 1 }] },
                { id: 6, nombreCompleto: 'María', correo: 'INVITADA@EXAMPLE.COM', fecha: '2030-03-11', total: 7200,
                    estado: 'CONFIRMADO', productos: [{ nombre: 'Correa', cantidad: 1 }] },
            ]);
        }
        return Response.json([]);
    });
    vi.stubGlobal('fetch', fetchSimulado);
    cargarRecepcion();
    fireEvent.click(screen.getByRole('link', { name: 'Buscar clientes' }));
    expect(screen.queryByRole('searchbox')).toBeNull();
    const inscritos = screen.getByLabelText('Clientes inscritos');
    await screen.findByRole('option', { name: /Luis/ });
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
    expect(screen.queryByRole('option', { name: /María Invitada|Ana Soto/ })).toBeNull();
    fireEvent.change(inscritos, { target: { value: '24' } });
    expect(await screen.findByText('Luna · Control')).toBeTruthy();
    expect(await screen.findByText('Vacuna × 1')).toBeTruthy();
    expect(await screen.findByText('Alimento × 2')).toBeTruthy();
    expect(screen.queryByText(/Toby|Juguete/)).toBeNull();
    expect(fetchSimulado).toHaveBeenCalledWith(expect.stringContaining('/api/compras/dueno/24'), expect.anything());
    expect(screen.queryByText(/Milo|Correa/)).toBeNull();
    fireEvent.change(inscritos, { target: { value: '' } });
    expect(screen.queryByText('Vacuna × 1')).toBeNull();
});

test('muestra en el perfil las compras de mostrador y enlaza al historial', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => Response.json(
        url.endsWith('/api/compras') ? [{
            id: 9, nombreDueno: 'Ana', fechaCompra: '2030-03-01', totalClp: 4500, estado: 'PAGADA',
            detalles: [{ id: 8, nombreComercial: 'Vacuna', cantidad: 1 }],
        }] : [],
    )));
    cargarRecepcion();
    expect(await screen.findByRole('heading', { name: 'Compra #9 · Ana' })).toBeTruthy();
    expect(screen.getByText('Vacuna × 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Ver historial de compras' }));
    expect(await screen.findByRole('heading', { name: 'Compras clínicas registradas' })).toBeTruthy();
});

test('confirma la llegada y el veterinario puede llamar al paciente', async () => {
    let estado = 'RESERVADA';
    const cita = {
        id: 4, fecha: fechaClinica(), hora: '10:00', mascota: 'Luna', dueno: 'Ana',
        servicio: 'Consulta general', motivo: 'Control', veterinario: 'Fabián',
    };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        if (url.endsWith('/4/llegada')) {
            estado = 'EN_ESPERA';
            return Response.json({ ...cita, estado });
        }
        if (url.endsWith('/4/llamar')) {
            estado = 'EN_ATENCION';
            return Response.json({ ...cita, estado });
        }
        if (url.endsWith('/api/citas')) return Response.json([{ ...cita, estado }]);
        return Response.json([]);
    }));
    cargarRecepcion();
    expect(screen.getByText('recepcion@example.com')).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: 'Ver detalle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar llegada' }));
    expect(await screen.findByText(/Llegada de Luna confirmada/)).toBeTruthy();

    cleanup();
    localStorage.setItem('sesion-veterinaria', JSON.stringify({
        id: 3, nombre: 'Fabián', correo: 'vet@example.com', rol: 'veterinario',
    }));
    render(<MemoryRouter initialEntries={['/perfil/veterinario/agenda']}><App /></MemoryRouter>);
    await screen.findByRole('button', { name: 'Llamar paciente' });
    const buscador = screen.getByRole('searchbox', { name: 'Buscar en mis citas' });
    fireEvent.change(buscador, { target: { value: 'Toby' } });
    expect(screen.queryByRole('button', { name: 'Llamar paciente' })).toBeNull();
    fireEvent.change(buscador, { target: { value: 'Luna' } });
    fireEvent.click(screen.getByRole('button', { name: 'Llamar paciente' }));
    expect(await screen.findByText('En atención')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Marcar atendida' })).toBeTruthy();
});

test('reserva con los datos del cliente sin usar la cuenta ni el borrador de recepción', async () => {
    sessionStorage.setItem('reserva-veterinaria', JSON.stringify({
        dueno: 'Borrador previo', correo: 'otro@example.com',
    }));
    const fecha = '2030-05-06';
    const fetchSimulado = vi.fn(async (url: string, opciones?: RequestInit) => {
        if (url.endsWith('/api/citas') && opciones?.method === 'POST') {
            return Response.json({ id: 12, fecha, hora: '10:00', mascota: 'Luna', veterinario: 'Fabián' });
        }
        if (url.endsWith('/api/horarios')) {
            return Response.json([{ id: 5, fecha, hora: '10:00', veterinario: 'Fabián' }]);
        }
        if (url.endsWith('/registro/listar-dto')) {
            return Response.json([{ id: 24, nombre: 'Ana', email: 'ana@example.com', rol: 'CLIENTE' }]);
        }
        if (url.endsWith('/api/mascotas?clienteId=24')) {
            return Response.json([{ id: 9, clienteId: 24, nombre: 'Luna', especie: 'GATO', activo: true }]);
        }
        return Response.json([]);
    });
    vi.stubGlobal('fetch', fetchSimulado);
    cargarRecepcion();
    fireEvent.click(screen.getByRole('link', { name: 'Reservar para un cliente' }));
    await screen.findByRole('option', { name: 'Ana · ana@example.com' });
    fireEvent.change(screen.getByLabelText('Clientes inscritos'), { target: { value: '24' } });
    const nombre = screen.getByLabelText<HTMLInputElement>('Nombre del dueño');
    const correo = screen.getByLabelText<HTMLInputElement>('Correo electrónico');
    expect(nombre.value).toBe('Ana');
    expect(correo.value).toBe('ana@example.com');
    await screen.findByRole('option', { name: 'Luna' });
    fireEvent.change(screen.getByLabelText('Mascotas inscritas'), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: fecha } });
    await screen.findByRole('option', { name: '10:00 · Fabián' });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Motivo de consulta'), { target: { value: 'Control' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reservar cita' }));
    expect(await screen.findByRole('heading', { name: '¡Cita reservada!' })).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledWith(expect.stringContaining('/api/citas'), expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"correo":"ana@example.com","mascota":"Luna","especie":"GATO"'),
    }));
});

test('registra varios productos comprados por el cliente sin mostrar el editor de catálogo', async () => {
    const productos = [
        { codigo: 'M1', nombreComercial: 'Antiparasitario', stockActual: 5, activo: true },
        { codigo: 'M2', nombreComercial: 'Suplemento', stockActual: 8, activo: true },
    ];
    const fetchSimulado = vi.fn(async (url: string, opciones?: RequestInit) => {
        if (url.endsWith('/api/compras') && opciones?.method === 'POST') {
            return Response.json({ id: 9, nombreDueno: 'Ana', totalClp: 18000, estado: 'PENDIENTE', detalles: [] });
        }
        if (url.endsWith('/api/productos')) return Response.json(productos);
        if (url.endsWith('/registro')) {
            return Response.json([{ id: 24, nombre: 'Ana', email: 'ana@example.com', rol: 'CLIENTE' }]);
        }
        return Response.json([]);
    });
    vi.stubGlobal('fetch', fetchSimulado);
    cargarRecepcion();
    fireEvent.click(screen.getByRole('link', { name: 'Registrar compra' }));
    expect(screen.queryByRole('button', { name: 'Agregar producto clínico' })).toBeNull();
    await screen.findByRole('option', { name: 'Ana · ana@example.com' });
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: '24' } });
    fireEvent.change(screen.getByLabelText('Suministro'), { target: { value: 'M1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));
    fireEvent.change(screen.getByLabelText('Suministro'), { target: { value: 'M2' } });
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar compra clínica' }));
    expect(await screen.findByText('Compra #9 registrada.')).toBeTruthy();
    expect(fetchSimulado).toHaveBeenCalledWith(expect.stringContaining('/api/compras'), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
            duenoId: 24,
            nombreDueno: 'Ana',
            items: [{ codigoProducto: 'M1', cantidad: 1 }, { codigoProducto: 'M2', cantidad: 2 }],
        }),
    }));
});

test('recepción abre el detalle de una cita, cambia su horario y puede cancelarla', async () => {
    let cita = {
        id: 7, horarioId: 1, fecha: '2030-03-04', hora: '10:00', veterinario: 'Fabián',
        mascota: 'Luna', dueno: 'Ana', correo: 'ana@example.com', especie: 'GATO',
        servicio: 'Control', motivo: 'Seguimiento', estado: 'RESERVADA',
    };
    const horario = { id: 8, fecha: '2030-03-05', hora: '09:00', veterinario: 'Sofía' };
    const fetchSimulado = vi.fn(async (url: string, opciones?: RequestInit) => {
        if (url.endsWith('/api/citas/7') && opciones?.method === 'PUT') {
            cita = { ...cita, horarioId: horario.id, fecha: horario.fecha, hora: horario.hora, veterinario: horario.veterinario };
            return Response.json(cita);
        }
        if (url.endsWith('/api/citas/7') && opciones?.method === 'DELETE') {
            cita = { ...cita, estado: 'CANCELADA' };
            return new Response(null, { status: 204 });
        }
        if (url.endsWith('/api/citas')) return Response.json([cita]);
        if (url.endsWith('/api/horarios')) return Response.json([horario]);
        return Response.json([]);
    });
    vi.stubGlobal('fetch', fetchSimulado);
    cargarRecepcion('/perfil/administrador/usuarios');

    expect(await screen.findByRole('heading', { name: 'Recepción', level: 1 })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Agregar usuario' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Solicitudes de servicios' })).toBeNull();
    fireEvent.click(await screen.findByRole('button', { name: 'Ver detalle' }));
    expect(screen.getByText(/ana@example.com/)).toBeTruthy();
    expect(screen.getByText(/Seguimiento/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Reprogramar' }));
    await screen.findByRole('option', { name: '2030-03-05 · 09:00 hrs · Sofía' });
    fireEvent.change(screen.getByLabelText('Nuevo horario'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar nuevo horario' }));

    await waitFor(() => expect(fetchSimulado).toHaveBeenCalledWith(
        expect.stringContaining('/api/citas/7'),
        expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({
                horarioId: 8, dueno: 'Ana', correo: 'ana@example.com', mascota: 'Luna',
                especie: 'GATO', servicio: 'Control', motivo: 'Seguimiento',
            }),
        }),
    ));
    expect(await screen.findByText('09:00 hrs · Sofía')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar cita' }));
    expect(await screen.findByText('Cancelada', { exact: true })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Reprogramar' })).toBeNull();
});
