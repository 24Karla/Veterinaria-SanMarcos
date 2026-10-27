
import { useState, type ReactNode } from 'react';
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
    accion?: ReactNode;
    onEditar?: (registro: RegistroGestion, indice: number) => void;
    onEliminar?: (indice: number) => void;
    registroEditando?: number | null;
    formularioEdicion?: () => ReactNode;
}

export default function PaginaGestion({
    etiqueta,
    titulo,
    descripcion,
    volverA,
    registros,
    accion,
    onEditar,
    onEliminar,
    registroEditando,
    formularioEdicion,
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

            {accion}

            <section className="lista-registros">
                {registros.map((registro, indice) => (
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

                        <div className="acciones-registro">
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

                            {onEditar && (
                                <button className="btn btn-volver-tienda" type="button" onClick={() => onEditar(registro, indice)}>
                                    Editar
                                </button>
                            )}

                            {onEliminar && (
                                <button className="btn btn-eliminar" type="button" onClick={() => onEliminar(indice)}>
                                    Eliminar
                                </button>
                            )}
                        </div>

                        {registroAbierto === registro.titulo && (
                            <div className="registro-detalle">
                                <strong>{registro.titulo}</strong>
                                <span>{registro.descripcion}</span>
                            </div>
                        )}

                        {registroEditando === indice && formularioEdicion && formularioEdicion()}
                    </article>
                ))}
            </section>
        </main>
    );
}
