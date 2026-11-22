import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioSesion from '../componentes/organismos/FormularioSesion';

test('inicia sesión como cliente con la respuesta del servidor', async () => {
    const sesion = { id: 1, nombre: 'Sofía', correo: 'sofia@example.com', rol: 'cliente' };
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(JSON.stringify(sesion), { status: 200 }));
    vi.stubGlobal('fetch', fetchSimulado);
    const iniciarSesion = vi.fn();
    render(<FormularioSesion onLogin={iniciarSesion} />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'sofia@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'ClaveDePrueba' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await waitFor(() => expect(iniciarSesion).toHaveBeenCalledWith(sesion));
    expect(fetchSimulado).toHaveBeenCalledWith(expect.stringContaining('/registro/login'), expect.objectContaining({ method: 'POST' }));
});

test('confirma la creación de la cuenta antes de abrir el perfil', async () => {
    const sesion = { id: 2, nombre: 'Cliente de prueba', correo: 'cliente@example.com', rol: 'cliente' };
    const fetchSimulado = vi.fn()
        .mockResolvedValueOnce(new Response('{}', { status: 201 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(sesion), { status: 200 }));
    vi.stubGlobal('fetch', fetchSimulado);
    const iniciarSesion = vi.fn();

    render(<FormularioSesion crearCuenta onLogin={iniciarSesion} />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: sesion.nombre } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: sesion.correo } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'ClaveDePrueba' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    const abrirPerfil = await screen.findByRole('button', { name: 'Abriendo tu perfil…' });
    expect(screen.getByRole('status').textContent).toContain('Cuenta creada con éxito');
    expect(abrirPerfil).toHaveProperty('disabled', true);
    expect(iniciarSesion).not.toHaveBeenCalled();
    await waitFor(() => expect(iniciarSesion).toHaveBeenCalledOnce(), { timeout: 3500 });
    expect(iniciarSesion).toHaveBeenCalledWith(sesion);
});
