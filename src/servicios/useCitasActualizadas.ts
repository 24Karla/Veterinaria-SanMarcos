import { useEffect, useState } from 'react';
import { api, mensajeError, pedirDatos, type CitaApi } from './api';

export function useCitasActualizadas(pausado: boolean) {
    const [citas, setCitas] = useState<CitaApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [errorAgenda, setErrorAgenda] = useState('');

    useEffect(() => {
        if (pausado) return;
        const control = new AbortController();
        let temporizador: number;

        async function cargar() {
            try {
                const resultado = await pedirDatos<CitaApi[]>(`${api.agenda}/api/citas`, {
                    signal: control.signal,
                });
                if (control.signal.aborted) return;
                setCitas(resultado);
                setErrorAgenda('');
            } catch (error) {
                if (!control.signal.aborted) setErrorAgenda(mensajeError(error));
            } finally {
                if (!control.signal.aborted) {
                    setCargando(false);
                    temporizador = window.setTimeout(cargar, 5000);
                }
            }
        }

        void cargar();
        return () => {
            control.abort();
            window.clearTimeout(temporizador);
        };
    }, [pausado]);

    function actualizarCita(cita: CitaApi) {
        setCitas((actuales) => actuales.map((actual) => actual.id === cita.id ? cita : actual));
    }

    return { citas, cargando, errorAgenda, actualizarCita };
}
