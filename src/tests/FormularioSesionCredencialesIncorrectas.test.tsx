
// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioSesion from '../componentes/organismos/FormularioSesion';

test('muestra error con credenciales incorrectas', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
        <FormularioSesion onLogin={vi.fn()} />
    );

    const correo = document.querySelector<HTMLInputElement>(
        'input[name="correo"]'
    )!;

    const clave = document.querySelector<HTMLInputElement>(
        'input[name="contraseña"]'
    )!;

    fireEvent.change(correo, {
        target: {
            value: 'persona@gmail.com',
        },
    });

    fireEvent.change(clave, {
        target: {
            value: '1234',
        },
    });

    fireEvent.click(
        screen.getByRole('button', { name: 'Ingresar' })
    );

    expect(alerta).toHaveBeenCalledWith(
        'El correo o la contraseña no corresponden a una cuenta de prueba.'
    );

    alerta.mockRestore();
});
