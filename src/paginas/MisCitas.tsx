import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    estadosCita,
    mostrarErrorFormulario,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    reprogramarCita,
    type CitaApi,
    type HorarioApi,
} from '../servicios/api';

export default function MisCitas() {
    const correo = obtenerSesion()?.correo;
    const [citaAbierta, setCitaAbierta] = useState<number | null>(null);
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
            mostrarErrorFormulario(error, setError);
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
            mostrarErrorFormulario(error, setError);
        }
    }

    async function reprogramar(cita: CitaApi) {
        if (!horarioId || ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const actualizada = await reprogramarCita(cita, Number(horarioId));
            setCitas((actuales) =>
                actuales.map((actual) => (actual.id === cita.id ? actualizada : actual)),
            );
            setEditando(null);
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PORTAL CLIENTE</span>

                <h1>Mis citas veterinarias</h1>

                <p>Revisa tus próximas atenciones y las citas realizadas.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            <Link to="/tienda?pagina=cita&origen=perfil" className="btn btn-tienda mb-3">
                Reservar cita
            </Link>
            {!cargando && !error && citas.length === 0 && (
                <p>No tienes citas registradas.</p>
            )}
            <section className="lista-registros">
                {citas.map((cita) => (
                    <article
                        className={`registro-cita ${cita.estado === 'RESERVADA' ? 'registro-cita-proxima' : ''}`}
                        key={cita.id}
                    >
                        <div className="registro-fecha">
                            <strong>{cita.fecha.slice(8, 10)}</strong>
                            <span>
                                {
                                    [
                                        'ENE',
                                        'FEB',
                                        'MAR',
                                        'ABR',
                                        'MAY',
                                        'JUN',
                                        'JUL',
                                        'AGO',
                                        'SEP',
                                        'OCT',
                                        'NOV',
                                        'DIC',
                                    ][Number(cita.fecha.slice(5, 7)) - 1]
                                }
                            </span>
                        </div>
                        <div>
                            <span
                                className={`registro-estado ${cita.estado === 'ATENDIDA' ? 'registro-realizada' : ''}`}
                            >
                                {cita.estado === 'RESERVADA'
                                    ? 'Próxima cita'
                                    : cita.estado === 'ATENDIDA'
                                      ? 'Realizada'
                                      : estadosCita[cita.estado] ?? cita.estado}
                            </span>
                            <h2>
                                {cita.motivo} · {cita.mascota}
                            </h2>
                            <p>
                                {cita.hora.slice(0, 5)} hrs · {cita.veterinario}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={
                                cita.estado === 'RESERVADA'
                                    ? 'btn btn-tienda'
                                    : 'btn btn-volver-tienda'
                            }
                            onClick={() =>
                                setCitaAbierta(citaAbierta === cita.id ? null : cita.id)
                            }
                        >
                            {citaAbierta === cita.id ? 'Ocultar detalle' : 'Ver detalle'}
                        </button>
                        {citaAbierta === cita.id && (
                            <div className="registro-detalle">
                                <strong>
                                    {cita.servicio} de {cita.mascota}
                                </strong>
                                <span>
                                    {cita.fecha} · {cita.hora.slice(0, 5)} ·{' '}
                                    {cita.veterinario}
                                </span>
                                {cita.estado === 'RESERVADA' && (
                                    <div className="acciones-cita">
                                        <button
                                            className="btn btn-volver-tienda"
                                            disabled={ocupado}
                                            onClick={() => abrirReprogramacion(cita.id)}
                                        >
                                            Reprogramar
                                        </button>
                                        <button
                                            className="btn btn-eliminar"
                                            disabled={ocupado}
                                            onClick={() => cancelar(cita)}
                                        >
                                            Cancelar cita
                                        </button>
                                    </div>
                                )}
                                {editando === cita.id && (
                                    <div className="formulario-mascota">
                                        <label htmlFor={`horario-${cita.id}`}>
                                            Nuevo horario
                                        </label>
                                        <select
                                            id={`horario-${cita.id}`}
                                            className="form-select"
                                            value={horarioId}
                                            onChange={(event) =>
                                                setHorarioId(event.target.value)
                                            }
                                        >
                                            <option value="">Selecciona</option>
                                            {horarios.map((horario) => (
                                                <option
                                                    key={horario.id}
                                                    value={horario.id}
                                                >
                                                    {horario.fecha} ·{' '}
                                                    {horario.hora.slice(0, 5)} ·{' '}
                                                    {horario.veterinario}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-tienda"
                                            disabled={ocupado || !horarioId}
                                            onClick={() => reprogramar(cita)}
                                        >
                                            Guardar nuevo horario
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}
