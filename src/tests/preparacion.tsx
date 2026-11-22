import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
    // Una prueba nunca debe escribir por accidente en la base de datos real.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Servicio no simulado en esta prueba')));
});

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
});
