import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioSesion from '../componentes/organismos/FormularioSesion';

test('no inicia sesión cuando el servidor rechaza las credenciales', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: 'Correo o contraseña incorrectos' }), { status: 401 })));
    const iniciarSesion = vi.fn();
    render(<FormularioSesion onLogin={iniciarSesion} />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'persona@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Correo o contraseña incorrectos');
    expect(iniciarSesion).not.toHaveBeenCalled();
});
