import { useEffect, useState } from 'react';

import CardServicio from './CardServicio';
import type { Servicio } from './CardServicio';

import EstadoApi from '../moleculas/EstadoApi';

import {
    api,
    pedirDatos,
    mensajeError,
    type ServicioApi,
} from '../../servicios/api';

const imagenesServicios = [
    { codigo: 'SV001', imagen: '/img/consulta-general.jpg' },
    { codigo: 'SV002', imagen: '/img/consulta-urgencia.jpg' },
    { codigo: 'SV003', imagen: '/img/control-postoperatorio.jpg' },
    { codigo: 'SV004', imagen: '/img/consulta-ave-conejo.jpg' },
    { codigo: 'SV005', imagen: '/img/segunda-opinion-medica.jpg' },

    { codigo: 'SV006', imagen: '/img/vacuna-antirrabica-canina.jpg' },
    { codigo: 'SV007', imagen: '/img/vacuna-sextuple-canina.jpg' },
    { codigo: 'SV008', imagen: '/img/vacuna-bivalente-felina.jpg' },
    { codigo: 'SV009', imagen: '/img/vacuna-triple-felina.jpg' },
    { codigo: 'SV010', imagen: '/img/vacuna-bordetella-canina.jpg' },
    { codigo: 'SV011', imagen: '/img/vacuna-antirrabica-felina.jpg' },

    { codigo: 'SV012', imagen: '/img/esterilizacion-hembra-canina.jpg' },
    { codigo: 'SV013', imagen: '/img/esterilizacion-macho-canino.jpg' },
    { codigo: 'SV014', imagen: '/img/esterilizacion-hembra-felina.jpg' },
    { codigo: 'SV015', imagen: '/img/esterilizacion-macho-felino.jpg' },

    { codigo: 'SV016', imagen: '/img/extirpacion-tumor-cutaneo.jpg' },
    { codigo: 'SV017', imagen: '/img/cesarea-urgencia.jpg' },

    { codigo: 'SV018', imagen: '/img/desparasitacion-interna-pequenos.jpg' },
    { codigo: 'SV019', imagen: '/img/desparasitacion-interna-medianos.jpg' },
    { codigo: 'SV020', imagen: '/img/desparasitacion-interna-grandes.jpg' },
    { codigo: 'SV021', imagen: '/img/desparasitacion-interna-felina.jpg' },
    { codigo: 'SV022', imagen: '/img/antiparasitario-externo-pipeta.jpg' },

    { codigo: 'SV023', imagen: '/img/hemograma-completo.jpg' },
    { codigo: 'SV024', imagen: '/img/perfil-bioquimico-completo.jpg' },
    { codigo: 'SV025', imagen: '/img/radiografia-1-proyeccion.jpg' },
    { codigo: 'SV026', imagen: '/img/ecografia-abdominal.jpg' },
    { codigo: 'SV027', imagen: '/img/test-leishmaniasis.jpg' },

    { codigo: 'SV028', imagen: '/img/corte-de-unas.jpg' },
    { codigo: 'SV029', imagen: '/img/limpieza-dental.jpg' },
    { codigo: 'SV030', imagen: '/img/microchip-identificacion.jpg' },
    { codigo: 'SV031', imagen: '/img/hospitalizacion-por-dia.jpg' },
];

// Imagen predeterminada.
const IMAGEN_PREDETERMINADA = '/img/consulta-general.jpg';

function filtrarServicios(
    categoria: string,
    servicios: Servicio[]
): Servicio[] {
    if (categoria === 'Todas') {
        return servicios;
    }

    return servicios.filter(
        (servicio) => servicio.categoria === categoria
    );
}

// Convertir los datos de la API al formato de las tarjetas.
function convertirServicio(servicio: ServicioApi): Servicio {
    const imagenEncontrada = imagenesServicios.find(
        (item) => item.codigo === servicio.codigo
    );

    return {
        id: Number(servicio.codigo.replace(/^SV/, '')) || servicio.codigo,
        titulo: servicio.nombre,
        descripcion: servicio.observaciones || '',
        precio: `$${servicio.precioClp.toLocaleString('es-CL')}`,
        duracion: servicio.duracionAprox || '',
        categoria: servicio.categoria,

        imagen:
            servicio.imagen ||
            imagenEncontrada?.imagen ||
            IMAGEN_PREDETERMINADA,
    };
}
export default function ListaServicios() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] =
        useState('Todas');

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        pedirDatos<ServicioApi[]>(
            `${api.servicios}/api/servicios`
        )
            .then((datos) => {
                setServicios(datos.map(convertirServicio));
            })
            .catch((error) => {
                setError(mensajeError(error));
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const categorias = [
        'Todas',
        ...new Set(
            servicios.map((servicio) => servicio.categoria)
        ),
    ];

    const serviciosFiltrados = filtrarServicios(
        categoriaSeleccionada,
        servicios
    );

    return (
        <>
            {/* Estado de la API */}
            <EstadoApi
                cargando={cargando}
                error={error}
            />

            {/* Filtro por categoría */}
            <div
                className="mb-4"
                style={{ maxWidth: '320px' }}
            >
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
                    onChange={(event) =>
                        setCategoriaSeleccionada(event.target.value)
                    }
                >
                    {categorias.map((categoria) => (
                        <option
                            key={categoria}
                            value={categoria}
                        >
                            {categoria === 'Todas'
                                ? 'Todas las categorías'
                                : categoria}
                        </option>
                    ))}
                </select>
            </div>

            {/* Mensaje cuando no hay servicios */}
            {!cargando &&
                !error &&
                serviciosFiltrados.length === 0 && (
                    <p className="text-center py-4">
                        No hay servicios disponibles en esta categoría.
                    </p>
                )}

            {/* Listado de tarjetas */}
            <div className="row g-4">
                {serviciosFiltrados.map((servicio) => (
                    <div
                        key={servicio.id}
                        className="col-md-6 col-lg-4"
                    >
                        <CardServicio servicio={servicio} />
                    </div>
                ))}
            </div>
        </>
    );
}
