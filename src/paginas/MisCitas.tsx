import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type CitaApi,
    type HorarioApi,
} from '../servicios/api';

export default function MisCitas() {
    const correo = obtenerSesion()?.correo;
    const [citas, setCitas] = useState<CitaApi[]>([]);
    const [horarios, setHorarios] = useState<HorarioApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [editando, setEditando] = useState<number | null>(null);
    const [horarioId, setHorarioId] = useState('');

    useEffect(() => {
        if (!correo) return;
        pedirDatos<CitaApi[]>(
            `${api.agenda}/api/citas?correo=${encodeURIComponent(correo)}`,
        )
            .then(setCitas)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [correo]);

    async function cancelar(cita: CitaApi) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.agenda}/api/citas/${cita.id}`, { method: 'DELETE' });
            setCitas((actuales) =>
                actuales.map((actual) =>
                    actual.id === cita.id ? { ...actual, estado: 'CANCELADA' } : actual,
                ),
            );
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function abrirReprogramacion(id: number) {
        setError('');
        try {
            setHorarios(await pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`));
            setEditando(id);
            setHorarioId('');
        } catch (error) {
            setError(mensajeError(error));
        }
    }

    async function reprogramar(cita: CitaApi) {
        if (!horarioId || ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const actualizada = await pedirDatos<CitaApi>(
                `${api.agenda}/api/citas/${cita.id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        horarioId: Number(horarioId),
                        dueno: cita.dueno,
                        correo: cita.correo,
                        mascota: cita.mascota,
                        especie: cita.especie,
                        servicio: cita.servicio,
                        motivo: cita.motivo,
                    }),
                },
            );
            setCitas((actuales) =>
                actuales.map((actual) => (actual.id === cita.id ? actualizada : actual)),
            );
            setEditando(null);
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <h1>Mis citas</h1>
            <EstadoApi cargando={cargando} error={error} />
            <Link to="/tienda?pagina=cita&origen=perfil" className="btn btn-tienda mb-3">
                Reservar cita
            </Link>
            {!cargando && !error && citas.length === 0 && (
                <p>No tienes citas registradas.</p>
            )}
            <section className="lista-registros">
                {citas.map((cita) => (
                    <article className="perfil-tarjeta" key={cita.id}>
                        <h2>
                            {cita.servicio} · {cita.mascota}
                        </h2>
                        <p>
                            {cita.fecha} · {cita.hora.slice(0, 5)} · {cita.veterinario}
                        </p>
                        <p>
                            {cita.motivo} · {cita.estado}
                        </p>
                        {cita.estado === 'RESERVADA' && (
                            <div>
                                <button
                                    className="btn btn-volver-tienda me-2"
                                    disabled={ocupado}
                                    onClick={() => abrirReprogramacion(cita.id)}
                                >
                                    Reprogramar
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    disabled={ocupado}
                                    onClick={() => cancelar(cita)}
                                >
                                    Cancelar cita
                                </button>
                            </div>
                        )}
                        {editando === cita.id && (
                            <div className="mt-3">
                                <label htmlFor={`horario-${cita.id}`}>
                                    Nuevo horario
                                </label>
                                <select
                                    id={`horario-${cita.id}`}
                                    className="form-select"
                                    value={horarioId}
                                    onChange={(event) => setHorarioId(event.target.value)}
                                >
                                    <option value="">Selecciona</option>
                                    {horarios.map((horario) => (
                                        <option key={horario.id} value={horario.id}>
                                            {horario.fecha} · {horario.hora.slice(0, 5)} ·{' '}
                                            {horario.veterinario}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-tienda mt-2"
                                    disabled={ocupado || !horarioId}
                                    onClick={() => reprogramar(cita)}
                                >
                                    Guardar nuevo horario
                                </button>
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}
