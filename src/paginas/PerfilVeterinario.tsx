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

    return (
        <main className="container panel-perfil">
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PANEL VETERINARIO</span>
                <h1>Hola, {sesion.nombre}</h1>
                <p>{sesion.correo}</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            <section className="perfil-grid">
                <article className="perfil-tarjeta">
                    <h2>Mi agenda</h2>
                    <p>
                        {cargando || error
                            ? 'Consulta tu agenda'
                            : `${citas.length} citas reservadas`}
                    </p>
                    <Link className="btn btn-tienda" to="/perfil/veterinario/agenda">
                        Ver mi agenda
                    </Link>
                </article>
                <article className="perfil-tarjeta">
                    <h2>Historial clínico</h2>
                    <p>
                        {cargando || error
                            ? 'Consulta las atenciones'
                            : `${consultas.length} atenciones registradas`}
                    </p>
                    <Link className="btn btn-tienda" to="/perfil/veterinario/historial">
                        Ver historial clínico
                    </Link>
                </article>
                <article className="perfil-tarjeta">
                    <h2>Recetas emitidas</h2>
                    <p>Revisa los medicamentos e indicaciones de tus atenciones.</p>
                    <Link className="btn btn-tienda" to="/perfil/veterinario/recetas">
                        Ver recetas
                    </Link>
                </article>
            </section>
        </main>
    );
}
