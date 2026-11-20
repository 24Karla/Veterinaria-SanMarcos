import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import Contacto from '../paginas/Contacto';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function rellenarContacto() {
  render(<Contacto />);
  fireEvent.change(screen.getByPlaceholderText('Ej: María González'), {
    target: { value: 'María González' },
  });
  fireEvent.change(screen.getByPlaceholderText('ejemplo@correo.com'), {
    target: { value: 'maria@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Escribe tu consulta aquí...'), {
    target: { value: 'Consulta de prueba' },
  });
}

test('envía el contacto y espera al servidor antes de confirmar', async () => {
  let confirmar!: (respuesta: Response) => void;
  const peticion = new Promise<Response>((resolve) => {
    confirmar = resolve;
  });
  const fetchSimulado = vi.fn().mockReturnValue(peticion);
  vi.stubGlobal('fetch', fetchSimulado);
  rellenarContacto();

  fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensaje' }));

  expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith(
    expect.stringContaining('/api/contactos'),
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreCompleto: 'María González',
        correo: 'maria@example.com',
        telefono: '',
        asunto: 'Consulta General',
        mensaje: 'Consulta de prueba',
      }),
    }),
  );
  expect(screen.queryByText('¡Mensaje enviado con éxito!')).toBeNull();
  expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Enviando…' }).disabled).toBe(true);

  confirmar(new Response(null, { status: 201 }));
  expect(await screen.findByText('¡Mensaje enviado con éxito!')).toBeTruthy();
});

test('conserva el mensaje si el servidor rechaza el envío', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 400 })));
  rellenarContacto();

  fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensaje' }));

  expect((await screen.findByRole('alert')).textContent).toContain('Revisa el formato');
  expect(screen.queryByText('¡Mensaje enviado con éxito!')).toBeNull();
  expect(screen.getByDisplayValue('Consulta de prueba')).toBeTruthy();
  expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Enviar Mensaje' }).disabled).toBe(false);
});
