import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type FichaApi,
} from '../servicios/api';

export default function HistorialCliente() {
    const id = obtenerSesion()?.id;
    const [fichas, setFichas] = useState<FichaApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        pedirDatos<FichaApi[]>(`${api.ficha}/api/fichas/dueno/${id}`)
            .then(setFichas)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [id]);

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PORTAL CLIENTE</span>

                <h1>Historial veterinario</h1>

                <p>Consulta las atenciones, vacunas y tratamientos de tus mascotas.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && fichas.length === 0 && (
                <p>Aún no hay fichas clínicas registradas para tus mascotas.</p>
            )}
            <section className="historial-mascotas">
                {fichas.map((ficha) => (
                    <article className="perfil-tarjeta" key={ficha.id}>
                        <div className="perfil-titulo">
                            <h2>
                                {ficha.nombre} · {ficha.raza || ficha.especie}
                            </h2>
                        </div>
                        {!ficha.historialConsultas?.length && (
                            <p>Sin consultas registradas.</p>
                        )}
                        <div className="perfil-lista">
                            {ficha.historialConsultas?.map((consulta) => (
                                <div key={consulta.id}>
                                    <strong>
                                        {new Date(
                                            consulta.fechaConsulta,
                                        ).toLocaleDateString('es-CL')}{' '}
                                        · {consulta.tipoServicio}
                                    </strong>
                                    <span>Veterinario: {consulta.nombreVeterinario}</span>
                                    <p>Motivo: {consulta.motivoConsulta}</p>
                                    <p>Diagnóstico: {consulta.diagnostico}</p>
                                    <p>
                                        Medicamentos:{' '}
                                        {consulta.medicamentosRecetados || 'Sin receta'}
                                    </p>
                                    <p>
                                        Indicaciones:{' '}
                                        {consulta.indicaciones ||
                                            'Sin indicaciones adicionales'}
                                    </p>
                                    {consulta.proximoControl && (
                                        <p>Próximo control: {consulta.proximoControl}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
