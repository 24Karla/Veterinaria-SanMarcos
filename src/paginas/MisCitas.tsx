
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Cita {
    mascota: string;
    fecha: string;
    hora: string;
    motivo: string;
    veterinario: string;
}

function obtenerFecha(fecha: string) {
    const [, mes, dia] = fecha.split('-');
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    return {
        dia: dia || '28',
        mes: meses[Number(mes) - 1] || 'OCT',
    };
}

export default function MisCitas() {
    const [citaAbierta, setCitaAbierta] = useState('');
    const [citas] = useState<Cita[]>(() => {
        const citaInicial = {
            mascota: 'Luna',
            fecha: '2026-10-28',
            hora: '11:00 hrs',
            motivo: 'Consulta general',
            veterinario: 'Dr. Martín Rojas',
        };

        try {
            const guardadas = localStorage.getItem('citas-cliente');
            return guardadas ? JSON.parse(guardadas) : [citaInicial];
        } catch {
            return [citaInicial];
        }
    });

    return (
        <main className="container panel-perfil">

            <Link
                to="/perfil/cliente"
                className="btn btn-volver-tienda mb-4"
            >
                ← Volver a mi perfil
            </Link>

            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">
                    PORTAL CLIENTE
                </span>

                <h1>Mis citas veterinarias</h1>

                <p>
                    Revisa tus próximas atenciones y las citas realizadas.
                </p>
            </header>

            <section className="lista-registros">

                {citas.map((cita, indice) => {
                    const fecha = obtenerFecha(cita.fecha);
                    const identificador = `proxima-${indice}`;

                    return (
                        <article className="registro-cita registro-cita-proxima" key={identificador}>
                            <div className="registro-fecha">
                                <strong>{fecha.dia}</strong>
                                <span>{fecha.mes}</span>
                            </div>

                            <div>
                                <span className="registro-estado">Próxima cita</span>
                                <h2>{cita.motivo} · {cita.mascota}</h2>
                                <p>{cita.hora} · {cita.veterinario}</p>
                            </div>

                            <button
                                type="button"
                                className="btn btn-tienda"
                                onClick={() => setCitaAbierta(citaAbierta === identificador ? '' : identificador)}
                            >
                                {citaAbierta === identificador ? 'Ocultar detalle' : 'Ver detalle'}
                            </button>

                            {citaAbierta === identificador && (
                                <div className="registro-detalle">
                                    <strong>{cita.motivo} de {cita.mascota}</strong>
                                    <span>{cita.fecha} · {cita.hora} · {cita.veterinario}</span>
                                </div>
                            )}
                        </article>
                    );
                })}

                <article className="registro-cita">
                    <div className="registro-fecha">
                        <strong>12</strong>
                        <span>SEP</span>
                    </div>

                    <div>
                        <span className="registro-estado registro-realizada">
                            Realizada
                        </span>

                        <h2>Vacunación anual · Luna</h2>

                        <p>
                            10:30 hrs · Dra. Fernanda Soto
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-volver-tienda"
                        onClick={() =>
                            setCitaAbierta(
                                citaAbierta === 'vacuna' ? '' : 'vacuna'
                            )
                        }
                    >
                        {citaAbierta === 'vacuna'
                            ? 'Ocultar resumen'
                            : 'Ver resumen'}
                    </button>

                    {citaAbierta === 'vacuna' && (
                        <div className="registro-detalle">
                            <strong>
                                Vacunación anual de Luna
                            </strong>

                            <span>
                                Atención realizada el 12 de septiembre a las 10:30 hrs.
                            </span>
                        </div>
                    )}
                </article>

                <article className="registro-cita">
                    <div className="registro-fecha">
                        <strong>04</strong>
                        <span>AGO</span>
                    </div>

                    <div>
                        <span className="registro-estado registro-realizada">
                            Realizada
                        </span>

                        <h2>Control general · Milo</h2>

                        <p>
                            16:00 hrs · Dr. Martín Rojas
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-volver-tienda"
                        onClick={() =>
                            setCitaAbierta(
                                citaAbierta === 'milo' ? '' : 'milo'
                            )
                        }
                    >
                        {citaAbierta === 'milo'
                            ? 'Ocultar resumen'
                            : 'Ver resumen'}
                    </button>

                    {citaAbierta === 'milo' && (
                        <div className="registro-detalle">
                            <strong>
                                Control general de Milo
                            </strong>

                            <span>
                                Atención realizada el 4 de agosto a las 16:00 hrs.
                            </span>
                        </div>
                    )}
                </article>

            </section>
        </main>
    );
}
