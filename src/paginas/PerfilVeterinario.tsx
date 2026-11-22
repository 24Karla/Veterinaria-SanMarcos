import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type CitaApi,
    type ConsultaApi,
} from '../servicios/api';

interface Props {
    sesion: { nombre: string; correo: string };
}

export default function PerfilVeterinario({ sesion }: Props) {
    const id = obtenerSesion()?.id;
    const [citas, setCitas] = useState<CitaApi[]>([]);
    const [consultas, setConsultas] = useState<ConsultaApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!id) return;
        Promise.all([
            pedirDatos<CitaApi[]>(`${api.agenda}/api/citas`),
            pedirDatos<ConsultaApi[]>(`${api.ficha}/api/consultas?veterinarioId=${id}`),
        ])
            .then(([citas, consultas]) => {
                setCitas(
                    citas.filter(
                        (cita) =>
                            cita.veterinario === sesion.nombre &&
                            cita.estado === 'RESERVADA',
                    ),
                );
                setConsultas(consultas);
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [id, sesion.nombre]);

    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
    const citasHoy = citas.filter((cita) => cita.fecha === hoy);
    const proximaCita = citasHoy.toSorted((a, b) => a.hora.localeCompare(b.hora))[0];

    return (
        <main className="container panel-perfil">
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PANEL VETERINARIO</span>
                <h1>Agenda de {sesion.nombre}</h1>
                <p>Revisa tus atenciones, recetas emitidas e historial clínico.</p>
            </header>

            <EstadoApi cargando={cargando} error={error} />

            <section className="perfil-grid">
                <article className="perfil-tarjeta perfil-tarjeta-destacada">
                    <div>
                        <h2>Mi jornada</h2>
                        <p>
                            <strong>{cargando || error ? '—' : citasHoy.length}</strong>{' '}
                            citas agendadas para hoy
                        </p>
                        <p>
                            {proximaCita
                                ? `Próxima atención: ${proximaCita.hora.slice(0, 5)} hrs`
                                : 'Consulta tus horarios en la agenda.'}
                        </p>
                    </div>
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
                                    {cita.motivo} · {cita.fecha}
                                </span>
                            </div>
                        ))}
                        {!cargando && !error && citas.length === 0 && (
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
