import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FormularioContacto from '../componentes/organismos/FormularioContacto';

test('rechaza un correo sin formato válido', () => {
  const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});

  try {
    render(<FormularioContacto />);
    fireEvent.change(screen.getByPlaceholderText('Ej: María González'), {
      target: { value: 'Sofía' },
    });
    fireEvent.change(screen.getByPlaceholderText('ejemplo@correo.com'), {
      target: { value: 'sofia' },
    });
    fireEvent.change(screen.getByPlaceholderText('Escribe tu consulta aquí...'), {
      target: { value: 'Quiero reservar una consulta.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensaje' }));

    expect(alerta).toHaveBeenCalledWith('Por favor ingresa un correo electrónico válido');
    expect(screen.queryByText('¡Mensaje enviado con éxito!')).toBeNull();
  } finally {
    alerta.mockRestore();
  }
});
