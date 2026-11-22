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
            <h1>Historial veterinario</h1>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && fichas.length === 0 && (
                <p>Aún no hay fichas clínicas registradas para tus mascotas.</p>
            )}
            <section className="perfil-grid">
                {fichas.map((ficha) => (
                    <article className="perfil-tarjeta" key={ficha.id}>
                        <h2>
                            {ficha.nombre} · {ficha.especie}
                        </h2>
                        {!ficha.historialConsultas?.length && (
                            <p>Sin consultas registradas.</p>
                        )}
                        {ficha.historialConsultas?.map((consulta) => (
                            <details className="mb-3" key={consulta.id}>
                                <summary>
                                    {new Date(consulta.fechaConsulta).toLocaleDateString(
                                        'es-CL',
                                    )}{' '}
                                    · {consulta.tipoServicio}
                                </summary>
                                <p>Veterinario: {consulta.nombreVeterinario}</p>
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
                            </details>
                        ))}
                    </article>
                ))}
            </section>
        </main>
    );
}
