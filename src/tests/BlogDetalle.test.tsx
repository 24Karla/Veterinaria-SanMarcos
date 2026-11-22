import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import ListaBlog from '../componentes/organismos/ListaBlog';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test('carga las publicaciones guardadas en el backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([
        { id: 1, titulo: 'Cuidados de verano', resumen: 'Agua fresca', autor: 'Veterinaria', fecha: '2030-01-15', categoria: 'Cuidados', imagen: '/img/perro.jpg', contenido: 'Agua fresca disponible' },
    ]), { status: 200 })));
    render(<ListaBlog />);
    expect(await screen.findByText('Cuidados de verano')).toBeTruthy();
});
