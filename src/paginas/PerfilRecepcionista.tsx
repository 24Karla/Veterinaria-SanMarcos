import { useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import type { SesionUsuario } from '../componentes/organismos/PerfilProtegido';
import {
    api, estadosCita, fechaClinica, mensajeError, pedirDatos, reprogramarCita,
    type CitaApi, type CompraClinicaApi, type HorarioApi,
} from '../servicios/api';
import { rutasPerfil } from '../servicios/rutas';
import { useCitasActualizadas } from '../servicios/useCitasActualizadas';
import { useRegistros } from '../servicios/useRegistros';

const mesCita = new Intl.DateTimeFormat('es-CL', { month: 'short', timeZone: 'UTC' });
const moneda = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

function FormularioReprogramacion({ citaId, ocupado, onGuardar, onCerrar }: {
    citaId: number;
    ocupado: boolean;
    onGuardar: (horarioId: number) => void;
    onCerrar: () => void;
}) {
    const disponibles = useRegistros<HorarioApi>(`${api.agenda}/api/horarios`);
    const [horarioId, setHorarioId] = useState('');
    const campo = `nuevo-horario-cita-${citaId}`;

    return (
        <form className="mt-3" onSubmit={(event) => {
            event.preventDefault();
            if (!ocupado && horarioId) onGuardar(Number(horarioId));
        }}>
            <label className="form-label" htmlFor={campo}>Nuevo horario</label>
            <select
                id={campo}
                className="form-select"
                value={horarioId}
                disabled={ocupado || disponibles.registros.length === 0}
                onChange={(event) => setHorarioId(event.target.value)}
                required
            >
                <option value="">Selecciona un horario disponible</option>
                {disponibles.registros.map((horario) => (
                    <option key={horario.id} value={horario.id}>
                        {horario.fecha} · {horario.hora.slice(0, 5)} hrs · {horario.veterinario}
                    </option>
                ))}
            </select>
            <EstadoApi cargando={disponibles.cargando} error={disponibles.error} />
            {!disponibles.cargando && !disponibles.error && disponibles.registros.length === 0 && (
                <p className="mt-2">No hay horarios disponibles para reprogramar.</p>
            )}
            <div className="acciones-cita mt-2">
                <button type="submit" className="btn btn-tienda" disabled={ocupado || !horarioId}>
                    Guardar nuevo horario
                </button>
                <button type="button" className="btn btn-volver-tienda" disabled={ocupado} onClick={onCerrar}>
                    Cerrar reprogramación
                </button>
            </div>
        </form>
    );
}

export default function PerfilRecepcionista({ sesion }: { sesion: SesionUsuario }) {
    const [citaAbierta, setCitaAbierta] = useState<number | null>(null);
    const [reprogramando, setReprogramando] = useState(false);
    const [errorCitas, setErrorCitas] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [avisoCitas, setAvisoCitas] = useState('');
    const agenda = useCitasActualizadas(ocupado);
    const compras = useRegistros<CompraClinicaApi>(`${api.compras}/api/compras`);
    const comprasRecientes = [...compras.registros].sort((a, b) => b.id - a.id).slice(0, 5);
    const hoy = fechaClinica();

    function abrirDetalle(id: number) {
        setCitaAbierta(citaAbierta === id ? null : id);
        setReprogramando(false);
        setErrorCitas('');
    }

    async function gestionarCita(operacion: () => Promise<CitaApi>, aviso: string) {
        if (ocupado) return;
        setOcupado(true);
        setErrorCitas('');
        setAvisoCitas('');
        try {
            agenda.actualizarCita(await operacion());
            setReprogramando(false);
            setAvisoCitas(aviso);
        } catch (error) {
            setErrorCitas(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    function confirmarLlegada(cita: CitaApi) {
        void gestionarCita(
            () => pedirDatos<CitaApi>(`${api.agenda}/api/citas/${cita.id}/llegada`, { method: 'PUT' }),
            `Llegada de ${cita.mascota} confirmada. El veterinario ya puede llamar al paciente desde su agenda.`,
        );
    }

    function cancelarCita(cita: CitaApi) {
        void gestionarCita(async () => {
            await pedirDatos(`${api.agenda}/api/citas/${cita.id}`, { method: 'DELETE' });
            return { ...cita, estado: 'CANCELADA' };
        }, `La cita de ${cita.mascota} fue cancelada.`);
    }

    return (
        <main className="container panel-perfil">
            <header className="perfil-encabezado">
                <h1>Recepción</h1>
            </header>
            <section className="perfil-grid mb-5" aria-labelledby="mi-perfil-recepcion">
                <article className="perfil-tarjeta perfil-tarjeta-destacada">
                    <div className="text-break">
                        <h2 id="mi-perfil-recepcion">Mi perfil</h2>
                        <p><strong>{sesion.nombre}</strong> · Recepcionista</p>
                        <p>{sesion.correo}</p>
                    </div>
                    <div className="d-flex flex-column flex-sm-row flex-wrap gap-2">
                        <Link className="btn btn-tienda" to={`${rutasPerfil.recepcionista}/reservar`}>
                            Reservar para un cliente
                        </Link>
                        <Link className="btn btn-volver-tienda" to={`${rutasPerfil.recepcionista}/compras`}>
                            Registrar compra
                        </Link>
                        <Link className="btn btn-volver-tienda" to={`${rutasPerfil.recepcionista}/clientes`}>
                            Buscar clientes
                        </Link>
                    </div>
                </article>
            </section>
            <section className="mb-5" aria-labelledby="citas-recepcion">
                <h2 id="citas-recepcion" className="h4 fw-bold mb-3">Citas de la agenda</h2>
                <EstadoApi cargando={agenda.cargando} error={agenda.errorAgenda} />
                {avisoCitas && <p className="alert alert-success" role="status">{avisoCitas}</p>}
                {!agenda.cargando && !agenda.errorAgenda && agenda.citas.length === 0 && (
                    <div className="perfil-tarjeta agenda-formulario"><p>No hay citas registradas.</p></div>
                )}
                {agenda.citas.length > 0 && (
                    <ul className="lista-registros list-unstyled">
                        {agenda.citas.map((cita) => (
                            <li className="registro-cita" key={cita.id}>
                                <time className="registro-fecha" dateTime={cita.fecha} aria-label={cita.fecha}>
                                    <strong>{cita.fecha.slice(8, 10)}</strong>
                                    <span>{mesCita.format(new Date(cita.fecha))} {cita.fecha.slice(0, 4)}</span>
                                </time>
                                <div className="text-break">
                                    <span className={`registro-estado ${cita.estado === 'ATENDIDA' ? 'registro-realizada' : ''}`}>
                                        {estadosCita[cita.estado] ?? cita.estado}
                                    </span>
                                    <h3 className="h5 fw-bold my-1">{cita.mascota} · {cita.servicio}</h3>
                                    <p>{cita.hora.slice(0, 5)} hrs · {cita.veterinario}</p>
                                    <p>{cita.dueno}</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-volver-tienda"
                                    aria-expanded={citaAbierta === cita.id}
                                    aria-controls={citaAbierta === cita.id ? `detalle-cita-${cita.id}` : undefined}
                                    disabled={ocupado}
                                    onClick={() => abrirDetalle(cita.id)}
                                >
                                    {citaAbierta === cita.id ? 'Ocultar detalle' : 'Ver detalle'}
                                </button>
                                {citaAbierta === cita.id && (
                                    <div id={`detalle-cita-${cita.id}`} className="registro-detalle text-break">
                                        <p><strong>Correo del cliente</strong> {cita.correo}</p>
                                        <p><strong>Especie</strong> {cita.especie}</p>
                                        <p><strong>Motivo de consulta</strong> {cita.motivo}</p>
                                        <EstadoApi cargando={false} error={errorCitas} />
                                        {cita.estado === 'RESERVADA' && (
                                            <>
                                                <div className="acciones-cita mt-2">
                                                    {cita.fecha === hoy && (
                                                        <button type="button" className="btn btn-tienda" disabled={ocupado}
                                                            onClick={() => confirmarLlegada(cita)}>
                                                            Confirmar llegada
                                                        </button>
                                                    )}
                                                    <button type="button" className="btn btn-volver-tienda"
                                                        disabled={ocupado || reprogramando}
                                                        onClick={() => { setErrorCitas(''); setReprogramando(true); }}>
                                                        Reprogramar
                                                    </button>
                                                    <button type="button" className="btn btn-eliminar" disabled={ocupado}
                                                        onClick={() => cancelarCita(cita)}>
                                                        Cancelar cita
                                                    </button>
                                                </div>
                                                {reprogramando && (
                                                    <FormularioReprogramacion
                                                        citaId={cita.id}
                                                        ocupado={ocupado}
                                                        onCerrar={() => setReprogramando(false)}
                                                        onGuardar={(horarioId) => gestionarCita(
                                                            () => reprogramarCita(cita, horarioId),
                                                            `La cita de ${cita.mascota} fue reprogramada.`,
                                                        )}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <section className="mb-5" aria-labelledby="compras-recepcion">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <h2 id="compras-recepcion" className="h4 fw-bold mb-0">Compras recientes en clínica</h2>
                    <Link className="btn btn-volver-tienda" to={`${rutasPerfil.recepcionista}/compras#historial-compras`}>
                        Ver historial de compras
                    </Link>
                </div>
                <EstadoApi cargando={compras.cargando} error={compras.error} />
                {!compras.cargando && !compras.error && comprasRecientes.length === 0 && (
                    <div className="perfil-tarjeta agenda-formulario"><p>No hay compras en clínica registradas.</p></div>
                )}
                {comprasRecientes.length > 0 && (
                    <ul className="lista-registros list-unstyled">
                        {comprasRecientes.map((compra) => (
                            <li className="registro-cita" key={compra.id}>
                                <img className="registro-imagen" src="/img/historialcompra.png" alt="" />
                                <div className="text-break">
                                    <span className={`registro-estado ${['PAGADA', 'ENTREGADA'].includes(compra.estado) ? 'registro-realizada' : ''}`}>
                                        {compra.estado.charAt(0) + compra.estado.slice(1).toLowerCase()}
                                    </span>
                                    <h3 className="h5 fw-bold my-1">Compra #{compra.id} · {compra.nombreDueno}</h3>
                                    <p>{compra.fechaCompra.slice(0, 10)} · {moneda.format(compra.totalClp)}</p>
                                    <p>{compra.detalles.map(({ nombreComercial, cantidad }) => `${nombreComercial} × ${cantidad}`).join(', ')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
