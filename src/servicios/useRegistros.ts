import { useEffect, useState } from 'react';
import { api, mensajeError, pedirDatos, type UsuarioApi } from './api';

export function useRegistros<T>(url: string | null) {
    const [resultado, setResultado] = useState<{ url: string; registros: T[]; error: string }>();

    useEffect(() => {
        if (!url) return;
        const control = new AbortController();
        pedirDatos<T[]>(url, { signal: control.signal })
            .then((registros) => {
                if (!control.signal.aborted) setResultado({ url, registros, error: '' });
            })
            .catch((error) => {
                if (!control.signal.aborted) setResultado({ url, registros: [], error: mensajeError(error) });
            });
        return () => control.abort();
    }, [url]);

    const actual = resultado?.url === url ? resultado : undefined;
    return { registros: actual?.registros ?? [], error: actual?.error ?? '', cargando: Boolean(url && !actual) };
}

export function useClientesInscritos(habilitado = true) {
    const usuarios = useRegistros<UsuarioApi>(habilitado ? `${api.usuarios}/registro/listar-dto` : null);
    const clientes = usuarios.registros.filter((usuario) => usuario.rol === 'CLIENTE').sort(
        (a, b) => a.nombre.localeCompare(b.nombre, 'es-CL') || a.email.localeCompare(b.email),
    );
    return { clientes, cargando: usuarios.cargando, error: usuarios.error };
}
