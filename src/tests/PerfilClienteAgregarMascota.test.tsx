import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import PerfilCliente from '../paginas/PerfilCliente';

test('muestra los campos para agregar una mascota', () => {
    render(<MemoryRouter><PerfilCliente sesion={{ nombre: 'Sofía', correo: 'sofia@example.com' }} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar mascota' }));
    expect(screen.getByLabelText('Nombre de la mascota')).toBeTruthy();
    expect(screen.getByLabelText('Edad en años')).toBeTruthy();
});
