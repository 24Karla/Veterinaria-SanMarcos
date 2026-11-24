import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    estadosCita,
    fechaClinica,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type ConsultaApi,
} from '../servicios/api';
import { useCitasActualizadas } from '../servicios/useCitasActualizadas';

interface Props {
    sesion: { nombre: string; correo: string };
}

export default function PerfilVeterinario({ sesion }: Props) {
    const id = obtenerSesion()?.id;
    const agenda = useCitasActualizadas(!id);
    const [consultas, setConsultas] = useState<ConsultaApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!id) return;
        pedirDatos<ConsultaApi[]>(`${api.ficha}/api/consultas?veterinarioId=${id}`)
            .then(setConsultas)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [id]);

    const citas = agenda.citas.filter((cita) =>
        cita.veterinario === sesion.nombre &&
        ['RESERVADA', 'EN_ESPERA', 'EN_ATENCION'].includes(cita.estado),
    );
    const hoy = fechaClinica();
    const citasHoy = citas.filter((cita) => cita.fecha === hoy);
    const pacientesEnEspera = citasHoy.filter((cita) => cita.estado === 'EN_ESPERA').length;
    const proximaCita = citasHoy.toSorted((a, b) => a.hora.localeCompare(b.hora))[0];

    return (
        <main className="container panel-perfil">
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PANEL VETERINARIO</span>
                <h1>Agenda de {sesion.nombre}</h1>
                <p>Revisa tus atenciones, recetas emitidas e historial clínico.</p>
            </header>

            <EstadoApi cargando={cargando} error={error} />
            <EstadoApi cargando={false} error={agenda.errorAgenda} />

            <section className="perfil-grid">
                <article className="perfil-tarjeta perfil-tarjeta-destacada">
                    <div>
                        <h2>Mi jornada</h2>
                        <p>
                            <strong>{agenda.cargando || agenda.errorAgenda ? '—' : citasHoy.length}</strong>{' '}
                            citas agendadas para hoy
                        </p>
                        <p>
                            {proximaCita
                                ? `Próxima atención: ${proximaCita.hora.slice(0, 5)} hrs`
                                : 'Consulta tus horarios en la agenda.'}
                        </p>
                    </div>
                    {pacientesEnEspera > 0 && (
                        <p role="status" className="fw-bold">
                            {pacientesEnEspera} {pacientesEnEspera === 1 ? 'paciente en sala de espera' : 'pacientes en sala de espera'}
                        </p>
                    )}
                    <Link className="btn btn-tienda" to="/perfil/veterinario/agenda">
                        Ver agenda
                    </Link>
                </article>

                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Citas agendadas</h2>
                    </div>
                    <div className="perfil-lista">
                        {citas.slice(0, 3).map((cita) => (
                            <div key={cita.id}>
                                <strong>
                                    {cita.hora.slice(0, 5)} · {cita.mascota}
                                </strong>
                                <span>
                                    {cita.motivo} · {cita.fecha} · {estadosCita[cita.estado]}
                                </span>
                            </div>
                        ))}
                        {!agenda.cargando && !agenda.errorAgenda && citas.length === 0 && (
                            <p>No hay citas agendadas.</p>
                        )}
                    </div>
                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/veterinario/agenda"
                    >
                        Ver agenda completa
                    </Link>
                </article>

                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Recetas emitidas</h2>
                    </div>
                    <div className="perfil-lista">
                        {consultas
                            .filter((consulta) => consulta.medicamentosRecetados)
                            .slice(0, 2)
                            .map((consulta) => (
                                <div key={consulta.id}>
                                    <strong>{consulta.medicamentosRecetados}</strong>
                                    <span>{consulta.fechaConsulta}</span>
                                </div>
                            ))}
                        {!cargando &&
                            !error &&
                            !consultas.some(
                                (consulta) => consulta.medicamentosRecetados,
                            ) && <p>No hay recetas registradas.</p>}
                    </div>
                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/veterinario/recetas"
                    >
                        Gestionar recetas
                    </Link>
                </article>

                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Historial clínico</h2>
                    </div>
                    <p className="perfil-texto">
                        Consulta los controles, diagnósticos y tratamientos de los
                        pacientes atendidos.
                    </p>
                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/veterinario/historial"
                    >
                        Ver historial clínico
                    </Link>
                </article>
            </section>
        </main>
    );
}
