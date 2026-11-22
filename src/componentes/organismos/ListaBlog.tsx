import { useEffect, useState } from 'react';
import CardBlog from './CardBlog';
import type { PublicacionBlog } from './CardBlog';
import EstadoApi from '../moleculas/EstadoApi';
import { api, pedirDatos, mensajeError } from '../../servicios/api';

interface Props {
    onSelectPost?: (post: PublicacionBlog) => void;
}

export default function ListaBlog({ onSelectPost }: Props) {
    const [publicaciones, setPublicaciones] = useState<PublicacionBlog[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        pedirDatos<PublicacionBlog[]>(`${api.catalogo}/api/publicaciones`)
            .then(setPublicaciones)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    return (
        <>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && publicaciones.length === 0 && (
                <p>No hay publicaciones disponibles.</p>
            )}
            <div className="row g-4">
                {publicaciones.map((post) => (
                    <div key={post.id} className="col-md-4">
                        <CardBlog post={post} onSelectPost={onSelectPost} />
                    </div>
                ))}
            </div>
        </>
    );
}
