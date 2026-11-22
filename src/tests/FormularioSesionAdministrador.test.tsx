import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioSesion from '../componentes/organismos/FormularioSesion';

test('inicia sesión como administrador con la respuesta del servidor', async () => {
    const sesion = { id: 1, nombre: 'Administración', correo: 'admin@example.com', rol: 'administrador' };
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(JSON.stringify(sesion), { status: 200 }));
    vi.stubGlobal('fetch', fetchSimulado);
    const iniciarSesion = vi.fn();
    render(<FormularioSesion onLogin={iniciarSesion} />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'ClaveDePrueba' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await waitFor(() => expect(iniciarSesion).toHaveBeenCalledWith(sesion));
    expect(fetchSimulado).toHaveBeenCalledWith(expect.stringContaining('/registro/login'), expect.objectContaining({ method: 'POST' }));
});
