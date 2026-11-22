import { useEffect, useState } from 'react';
import CardServicio from './CardServicio';
import type { Servicio } from './CardServicio';
import EstadoApi from '../moleculas/EstadoApi';
import { api, pedirDatos, mensajeError, type ServicioApi } from '../../servicios/api';

// Imágenes que utilizaba el diseño original de los servicios.
const imagenesServicios: Record<string, string> = {
    SV001: '/img/consulta-general.jpg',
    SV002: '/img/consulta-urgencia.jpg',
    SV003: '/img/control-postoperatorio.jpg',
    SV004: '/img/consulta-ave-conejo.jpg',
    SV005: '/img/segunda-opinion-medica.jpg',
    SV006: '/img/vacuna-antirrabica-canina.jpg',
    SV007: '/img/vacuna-sextuple-canina.jpg',
    SV008: '/img/vacuna-bivalente-felina.jpg',
    SV009: '/img/vacuna-triple-felina.jpg',
    SV010: '/img/vacuna-bordetella-canina.jpg',
    SV011: '/img/vacuna-antirrabica-felina.jpg',
    SV012: '/img/esterilizacion-hembra-canina.jpg',
    SV013: '/img/esterilizacion-macho-canino.jpg',
    SV014: '/img/esterilizacion-hembra-felina.jpg',
    SV015: '/img/esterilizacion-macho-felino.jpg',
    SV016: '/img/extirpacion-tumor-cutaneo.jpg',
    SV017: '/img/cesarea-urgencia.jpg',
    SV018: '/img/desparasitacion-interna-pequenos.jpg',
    SV019: '/img/desparasitacion-interna-medianos.jpg',
    SV020: '/img/desparasitacion-interna-grandes.jpg',
    SV021: '/img/desparasitacion-interna-felina.jpg',
    SV022: '/img/antiparasitario-externo-pipeta.jpg',
    SV023: '/img/hemograma-completo.jpg',
    SV024: '/img/perfil-bioquimico-completo.jpg',
    SV025: '/img/radiografia-1-proyeccion.jpg',
    SV026: '/img/ecografia-abdominal.jpg',
    SV027: '/img/test-leishmaniasis.jpg',
    SV028: '/img/corte-de-unas.jpg',
    SV029: '/img/limpieza-dental.jpg',
    SV030: '/img/microchip-identificacion.jpg',
    SV031: '/img/hospitalizacion-por-dia.jpg',
};

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
                        imagen:
                            servicio.imagen ||
                            imagenesServicios[servicio.codigo] ||
                            '/img/consulta-general.jpg',
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
