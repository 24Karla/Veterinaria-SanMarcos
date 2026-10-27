
// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioSesion from '../componentes/organismos/FormularioSesion';

test('inicia sesión como administrador', () => {
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
            value: 'admin@vetsanmarcos.cl',
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
        nombre: 'Administrador',
        correo: 'admin@vetsanmarcos.cl',
        rol: 'administrador',
    });
});
