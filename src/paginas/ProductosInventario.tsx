import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import type { Producto } from '../componentes/organismos/CardTienda';
import { api, pedirDatos, mensajeError } from '../servicios/api';

const vacio = {
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    imagen: '',
    principioActivo: '',
    presentacion: '',
    especie: '',
};

export default function ProductosInventario() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [mostrar, setMostrar] = useState(false);
    const [editando, setEditando] = useState<string | null>(null);
    const [datos, setDatos] = useState(vacio);

    useEffect(() => {
        pedirDatos<Producto[]>(`${api.productos}/api/productos`)
            .then(setProductos)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    function editar(producto?: Producto) {
        setEditando(producto?.codigo || null);
        setDatos(
            producto
                ? {
                      ...producto,
                      precio: String(producto.precio),
                      stock: String(producto.stock),
                  }
                : vacio,
        );
        setMostrar(true);
    }

    async function guardar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        if (
            !datos.nombre.trim() ||
            !datos.categoria.trim() ||
            Number(datos.precio) <= 0 ||
            Number(datos.stock) < 0 ||
            !datos.codigo.trim()
        ) {
            setError(
                'Completa código, nombre, categoría, un precio mayor a cero y un stock válido.',
            );
            return;
        }
        setOcupado(true);
        setError('');
        try {
            const producto = await pedirDatos<Producto>(
                `${api.productos}/api/productos${editando ? '/' + encodeURIComponent(editando) : ''}`,
                {
                    method: editando ? 'PUT' : 'POST',
                    body: JSON.stringify({
                        ...datos,
                        codigo: datos.codigo.toUpperCase(),
                        precio: Number(datos.precio),
                        stock: Number(datos.stock),
                        imagen: datos.imagen || '/img/Amoxibay.jpg',
                    }),
                },
            );
            setProductos((actuales) =>
                editando
                    ? actuales.map((actual) =>
                          actual.codigo === editando ? producto : actual,
                      )
                    : [...actuales, producto],
            );
            setMostrar(false);
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function eliminar(codigo: string) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(
                `${api.productos}/api/productos/${encodeURIComponent(codigo)}`,
                { method: 'DELETE' },
            );
            setProductos((actuales) =>
                actuales.filter((actual) => actual.codigo !== codigo),
            );
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link className="btn btn-volver-tienda mb-4" to="/perfil/administrador">
                ← Volver a mi perfil
            </Link>
            <h1>Productos e inventario</h1>
            <EstadoApi cargando={cargando} error={error} />
            <button className="btn btn-tienda mb-3" onClick={() => editar()}>
                Agregar producto
            </button>
            {mostrar && (
                <form noValidate className="formulario-mascota mb-4" onSubmit={guardar}>
                    <h2>{editando ? 'Editar producto' : 'Nuevo producto'}</h2>
                    {(Object.keys(vacio) as (keyof typeof vacio)[]).map((campo) => (
                        <div className="mb-2" key={campo}>
                            <label htmlFor={`producto-${campo}`}>
                                {
                                    {
                                        codigo: 'Código',
                                        nombre: 'Nombre',
                                        categoria: 'Categoría',
                                        precio: 'Precio',
                                        stock: 'Stock',
                                        imagen: 'Ruta de imagen',
                                        principioActivo: 'Principio activo',
                                        presentacion: 'Presentación',
                                        especie: 'Especie',
                                    }[campo]
                                }
                            </label>
                            <input
                                id={`producto-${campo}`}
                                className="form-control"
                                required={!['imagen', 'principioActivo'].includes(campo)}
                                type={
                                    ['precio', 'stock'].includes(campo)
                                        ? 'number'
                                        : 'text'
                                }
                                min={campo === 'precio' ? 1 : 0}
                                readOnly={campo === 'codigo' && !!editando}
                                value={datos[campo]}
                                onChange={(event) =>
                                    setDatos({ ...datos, [campo]: event.target.value })
                                }
                            />
                        </div>
                    ))}
                    <button className="btn btn-tienda me-2" disabled={ocupado}>
                        Guardar producto
                    </button>
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setMostrar(false)}
                    >
                        Cancelar
                    </button>
                </form>
            )}
            {!cargando && !error && productos.length === 0 && (
                <p>No hay productos registrados.</p>
            )}
            <section className="lista-registros">
                {productos.map((producto) => (
                    <article className="registro-cita" key={producto.codigo}>
                        <img
                            className="registro-imagen"
                            src={producto.imagen}
                            alt={producto.nombre}
                        />
                        <div>
                            <h2>{producto.nombre}</h2>
                            <p>
                                {producto.codigo} · {producto.categoria} · Stock:{' '}
                                {producto.stock} · $
                                {producto.precio.toLocaleString('es-CL')}
                            </p>
                        </div>
                        <div>
                            <button
                                className="btn btn-volver-tienda me-2"
                                onClick={() => editar(producto)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                disabled={ocupado}
                                onClick={() => eliminar(producto.codigo)}
                            >
                                Desactivar
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
