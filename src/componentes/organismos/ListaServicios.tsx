import { useEffect, useState } from 'react';
import CardServicio from './CardServicio';
import type { Servicio } from './CardServicio';
import EstadoApi from '../moleculas/EstadoApi';
import { api, pedirDatos, mensajeError, type ServicioApi } from '../../servicios/api';

function filtrarServicios(categoria: string, servicios: Servicio[] = []) {
    return categoria === 'Todas'
        ? servicios
        : servicios.filter((servicio) => servicio.categoria === categoria);
}

export default function ListaServicios() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        pedirDatos<ServicioApi[]>(`${api.compras}/api/catalogo/servicios`)
            .then((datos) =>
                setServicios(
                    datos.map((servicio) => ({
                        id: Number(servicio.codigo.replace(/^SV/, '')) || servicio.codigo,
                        titulo: servicio.nombre,
                        descripcion: servicio.observaciones || '',
                        precio: '$' + servicio.precioClp.toLocaleString('es-CL'),
                        duracion: servicio.duracionAprox || '',
                        categoria: servicio.categoria,
                        imagen: servicio.imagen || '/img/consulta-general.jpg',
                    })),
                ),
            )
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    const categorias = [
        'Todas',
        ...new Set(servicios.map((servicio) => servicio.categoria)),
    ];
    const filtrados = filtrarServicios(categoriaSeleccionada, servicios);

    return (
        <>
            <EstadoApi cargando={cargando} error={error} />
            <div className="mb-4" style={{ maxWidth: '320px' }}>
                <label
                    htmlFor="categoria-servicio"
                    className="form-label fw-bold texto-marca"
                >
                    Filtrar por categoría
                </label>
                <select
                    id="categoria-servicio"
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(event) => setCategoriaSeleccionada(event.target.value)}
                >
                    {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria === 'Todas' ? 'Todas las categorías' : categoria}
                        </option>
                    ))}
                </select>
            </div>
            {!cargando && !error && filtrados.length === 0 && (
                <p>No hay servicios disponibles en esta categoría.</p>
            )}
            <div className="row g-4">
                {filtrados.map((servicio) => (
                    <div key={servicio.id} className="col-md-6 col-lg-4">
                        <CardServicio servicio={servicio} />
                    </div>
                ))}
            </div>
        </>
    );
}
