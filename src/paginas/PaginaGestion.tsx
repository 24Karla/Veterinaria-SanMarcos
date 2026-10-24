
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegistroGestion {
    titulo: string;
    descripcion: string;
    imagen?: string;
}

interface PaginaGestionProps {
    etiqueta: string;
    titulo: string;
    descripcion: string;
    volverA: string;
    registros: RegistroGestion[];
}

export default function PaginaGestion({
    etiqueta,
    titulo,
    descripcion,
    volverA,
    registros,
}: PaginaGestionProps) {
    const [registroAbierto, setRegistroAbierto] = useState('');

    return (
        <main className="container panel-perfil">
            <Link
                to={volverA}
                className="btn btn-volver-tienda mb-4"
            >
                ← Volver a mi perfil
            </Link>

            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">
                    {etiqueta}
                </span>

                <h1>{titulo}</h1>
                <p>{descripcion}</p>
            </header>

            <section className="lista-registros">
                {registros.map((registro) => (
                    <article
                        key={registro.titulo}
                        className="registro-cita"
                    >
                        {registro.imagen ? (
                            <img
                                className="registro-imagen"
                                src={registro.imagen}
                                alt={registro.titulo}
                            />
                        ) : (
                            <div className="registro-fecha">
                                Detalle
                            </div>
                        )}

                        <div>
                            <h2>{registro.titulo}</h2>
                            <p>{registro.descripcion}</p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-volver-tienda"
                            onClick={() =>
                                setRegistroAbierto(
                                    registroAbierto === registro.titulo
                                        ? ''
                                        : registro.titulo
                                )
                            }
                        >
                            {registroAbierto === registro.titulo
                                ? 'Ocultar detalle'
                                : 'Ver detalle'}
                        </button>

                        {registroAbierto === registro.titulo && (
                            <div className="registro-detalle">
                                <strong>{registro.titulo}</strong>
                                <span>{registro.descripcion}</span>
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}
