
 // @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioSesion from '../componentes/organismos/FormularioSesion';

test('inicia sesión como cliente', () => {
    const iniciarSesion = vi.fn();

    render(
        <FormularioSesion onLogin={iniciarSesion} />
    );

    const correo = document.querySelector<HTMLInputElement>(
        'input[name="correo"]'
    )!;

    const clave = document.querySelector<HTMLInputElement>(
        'input[name="contraseña"]'
    )!;

    fireEvent.change(correo, {
        target: {
            value: 'sofia@gmail.com',
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

    expect(iniciarSesion).toHaveBeenCalledWith({
        nombre: 'Sofía',
        correo: 'sofia@gmail.com',
        rol: 'cliente',
    });
});
