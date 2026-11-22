import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import type { PublicacionBlog } from '../componentes/organismos/CardBlog';
import {
    api,
    mostrarErrorFormulario,
    pedirDatos,
    mensajeError,
    type ServicioApi,
} from '../servicios/api';

const publicacionVacia = {
    titulo: '',
    resumen: '',
    autor: '',
    fecha: '',
    categoria: '',
    imagen: '',
    contenido: '',
};
const servicioVacio = {
    codigo: '',
    nombre: '',
    categoria: '',
    precioClp: '',
    duracionAprox: '',
    observaciones: '',
    imagen: '',
    especie: 'Perro / Gato / Otros',
};

export default function ContenidoAdministrador() {
    const [publicaciones, setPublicaciones] = useState<PublicacionBlog[]>([]);
    const [servicios, setServicios] = useState<ServicioApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [publicacionId, setPublicacionId] = useState<number | null>(null);
    const [servicioCodigo, setServicioCodigo] = useState<string | null>(null);
    const [mostrarBlog, setMostrarBlog] = useState(false);
    const [mostrarServicio, setMostrarServicio] = useState(false);
    const [publicacion, setPublicacion] = useState(publicacionVacia);
    const [servicio, setServicio] = useState(servicioVacio);

    useEffect(() => {
        Promise.all([
            pedirDatos<PublicacionBlog[]>(`${api.catalogo}/api/publicaciones`),
            pedirDatos<ServicioApi[]>(`${api.compras}/api/catalogo/servicios`),
        ])
            .then(([publicaciones, servicios]) => {
                setPublicaciones(publicaciones);
                setServicios(servicios);
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    async function guardarPublicacion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const guardada = await pedirDatos<PublicacionBlog>(
                `${api.catalogo}/api/publicaciones${publicacionId ? '/' + publicacionId : ''}`,
                {
                    method: publicacionId ? 'PUT' : 'POST',
                    body: JSON.stringify(publicacion),
                },
            );
            setPublicaciones((actuales) =>
                publicacionId
                    ? actuales.map((actual) =>
                          actual.id === publicacionId ? guardada : actual,
                      )
                    : [guardada, ...actuales],
            );
            setMostrarBlog(false);
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    async function eliminarPublicacion(id: number) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.catalogo}/api/publicaciones/${id}`, {
                method: 'DELETE',
            });
            setPublicaciones((actuales) => actuales.filter((actual) => actual.id !== id));
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    async function guardarServicio(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const guardado = await pedirDatos<ServicioApi>(
                `${api.compras}/api/catalogo`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        ...servicio,
                        codigo: servicio.codigo.toUpperCase(),
                        precioClp: Number(servicio.precioClp),
                        tipoItem: 'SERVICIO',
                        activo: true,
                    }),
                },
            );
            setServicios((actuales) =>
                servicioCodigo
                    ? actuales.map((actual) =>
                          actual.codigo === servicioCodigo ? guardado : actual,
                      )
                    : [...actuales, guardado],
            );
            setMostrarServicio(false);
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    async function desactivarServicio(servicio: ServicioApi) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.compras}/api/catalogo`, {
                method: 'POST',
                body: JSON.stringify({ ...servicio, activo: false }),
            });
            setServicios((actuales) =>
                actuales.filter((actual) => actual.codigo !== servicio.codigo),
            );
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/administrador" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <h1>Servicios y blog</h1>
            <EstadoApi cargando={cargando} error={error} />
            <h2>Servicios de la veterinaria</h2>
            <button
                className="btn btn-tienda mb-3"
                onClick={() => {
                    setServicioCodigo(null);
                    setServicio(servicioVacio);
                    setMostrarServicio(true);
                }}
            >
                Agregar servicio
            </button>
            {mostrarServicio && (
                <form className="perfil-tarjeta mb-3" onSubmit={guardarServicio}>
                    {(Object.keys(servicioVacio) as (keyof typeof servicioVacio)[]).map(
                        (campo) => (
                            <div key={campo} className="mb-2">
                                <label htmlFor={`servicio-${campo}`}>
                                    {
                                        {
                                            codigo: 'Código',
                                            nombre: 'Nombre del servicio',
                                            categoria: 'Categoría',
                                            precioClp: 'Precio en CLP',
                                            duracionAprox: 'Duración aproximada',
                                            observaciones: 'Descripción',
                                            imagen: 'Ruta de imagen',
                                            especie: 'Especies',
                                        }[campo]
                                    }
                                </label>
                                <input
                                    id={`servicio-${campo}`}
                                    className="form-control"
                                    value={servicio[campo]}
                                    required={
                                        ![
                                            'imagen',
                                            'observaciones',
                                            'duracionAprox',
                                        ].includes(campo)
                                    }
                                    type={campo === 'precioClp' ? 'number' : 'text'}
                                    min="0"
                                    readOnly={campo === 'codigo' && !!servicioCodigo}
                                    onChange={(event) =>
                                        setServicio({
                                            ...servicio,
                                            [campo]: event.target.value,
                                        })
                                    }
                                />
                            </div>
                        ),
                    )}
                    <button className="btn btn-tienda me-2" disabled={ocupado}>
                        Guardar servicio
                    </button>
                    <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => setMostrarServicio(false)}
                    >
                        Cancelar
                    </button>
                </form>
            )}
            {servicios.map((actual) => (
                <article className="perfil-tarjeta mb-2" key={actual.codigo}>
                    <h3>{actual.nombre}</h3>
                    <p>
                        {actual.codigo} · ${actual.precioClp.toLocaleString('es-CL')} ·{' '}
                        {actual.categoria}
                    </p>
                    <button
                        className="btn btn-volver-tienda me-2"
                        onClick={() => {
                            setServicioCodigo(actual.codigo);
                            setServicio({
                                codigo: actual.codigo,
                                nombre: actual.nombre,
                                categoria: actual.categoria,
                                precioClp: String(actual.precioClp),
                                duracionAprox: actual.duracionAprox || '',
                                observaciones: actual.observaciones || '',
                                imagen: actual.imagen || '',
                                especie: actual.especie,
                            });
                            setMostrarServicio(true);
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        disabled={ocupado}
                        onClick={() => desactivarServicio(actual)}
                    >
                        Desactivar
                    </button>
                </article>
            ))}
            <h2 className="mt-4">Publicaciones del blog</h2>
            <button
                className="btn btn-tienda mb-3"
                onClick={() => {
                    setPublicacionId(null);
                    setPublicacion(publicacionVacia);
                    setMostrarBlog(true);
                }}
            >
                Agregar publicación
            </button>
            {mostrarBlog && (
                <form className="perfil-tarjeta mb-3" onSubmit={guardarPublicacion}>
                    {(
                        Object.keys(publicacionVacia) as (keyof typeof publicacionVacia)[]
                    ).map((campo) => (
                        <div key={campo} className="mb-2">
                            <label htmlFor={`blog-${campo}`}>
                                {
                                    {
                                        titulo: 'Título',
                                        resumen: 'Resumen',
                                        autor: 'Autor',
                                        fecha: 'Fecha',
                                        categoria: 'Categoría',
                                        imagen: 'Ruta de imagen',
                                        contenido: 'Contenido',
                                    }[campo]
                                }
                            </label>
                            {['contenido', 'resumen'].includes(campo) ? (
                                <textarea
                                    id={`blog-${campo}`}
                                    className="form-control"
                                    required
                                    rows={4}
                                    value={publicacion[campo]}
                                    onChange={(event) =>
                                        setPublicacion({
                                            ...publicacion,
                                            [campo]: event.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <input
                                    id={`blog-${campo}`}
                                    className="form-control"
                                    required
                                    value={publicacion[campo]}
                                    onChange={(event) =>
                                        setPublicacion({
                                            ...publicacion,
                                            [campo]: event.target.value,
                                        })
                                    }
                                />
                            )}
                        </div>
                    ))}
                    <button className="btn btn-tienda me-2" disabled={ocupado}>
                        Guardar publicación
                    </button>
                    <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => setMostrarBlog(false)}
                    >
                        Cancelar
                    </button>
                </form>
            )}
            {publicaciones.map((post) => (
                <article className="perfil-tarjeta mb-2" key={post.id}>
                    <h3>{post.titulo}</h3>
                    <p>
                        {post.autor} · {post.fecha}
                    </p>
                    <button
                        className="btn btn-volver-tienda me-2"
                        onClick={() => {
                            setPublicacionId(post.id);
                            setPublicacion({
                                titulo: post.titulo,
                                resumen: post.resumen,
                                autor: post.autor,
                                fecha: post.fecha,
                                categoria: post.categoria,
                                imagen: post.imagen,
                                contenido: post.contenido || '',
                            });
                            setMostrarBlog(true);
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        disabled={ocupado}
                        onClick={() => eliminarPublicacion(post.id)}
                    >
                        Eliminar
                    </button>
                </article>
            ))}
        </main>
    );
}
