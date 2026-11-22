import { api, pedirDatos, mensajeError } from '../servicios/api';
import EstadoApi from '../componentes/moleculas/EstadoApi';

import { useEffect, useMemo, useState } from 'react';
import Boton from '../componentes/atomos/Boton';

import type { Producto, ProductoCarrito } from '../componentes/organismos/CardTienda';

import CardTienda from '../componentes/organismos/CardTienda';

interface ProductosProps {
    onVerDetalle: (producto: Producto) => void;
    onAgregar: (producto: Producto) => void;
    carrito: ProductoCarrito[];
    onCambiarCantidad: (codigo: string, cantidad: number) => void;
}

export default function Productos({
    onVerDetalle,
    onAgregar,
    carrito,
    onCambiarCantidad,
}: ProductosProps) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controlador = new AbortController();
        pedirDatos<Producto[]>(`${api.productos}/api/productos`, {
            signal: controlador.signal,
        })
            .then(setProductos)
            .catch((error) => {
                if (!controlador.signal.aborted) setError(mensajeError(error));
            })
            .finally(() => {
                if (!controlador.signal.aborted) setCargando(false);
            });
        return () => controlador.abort();
    }, []);

    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('Todas');

    const categorias = useMemo(
        () => ['Todas', ...new Set(productos.map((producto) => producto.categoria))],
        [productos],
    );

    const productosFiltrados = useMemo(() => {
        const consulta = busqueda.trim().toLocaleLowerCase('es');

        return productos.filter((producto) => {
            const coincideTexto = [
                producto.codigo,
                producto.nombre,
                producto.principioActivo,
                producto.categoria,
            ].some((campo) => campo.toLocaleLowerCase('es').includes(consulta));

            const coincideCategoria =
                categoria === 'Todas' || producto.categoria === categoria;

            return coincideTexto && coincideCategoria;
        });
    }, [productos, busqueda, categoria]);

    return (
        <main>
            <div className="container pt-3">
                <EstadoApi cargando={cargando} error={error} />
            </div>
            <section className="tienda-portada">
                <div className="container">
                    <span className="tienda-etiqueta">VETERINARIA SAN MARCOS</span>

                    <h2>Productos</h2>

                    <p>Medicamentos y vacunas en stock</p>
                </div>
            </section>

            <section className="container seccion-catalogo" id="catalogo">
                <div className="catalogo-titulo">
                    <div>
                        <span className="tienda-etiqueta">NUESTRO CATÁLOGO</span>

                        <h2>Productos para su bienestar</h2>

                        <p>Encuentra lo que necesitas para su cuidado.</p>
                    </div>

                    <span className="catalogo-contador">
                        {productosFiltrados.length} productos
                    </span>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-7">
                        <label htmlFor="buscar" className="form-label">
                            Buscar producto
                        </label>

                        <input
                            id="buscar"
                            className="form-control"
                            type="search"
                            placeholder="Buscar por nombre..."
                            value={busqueda}
                            onChange={(event) => setBusqueda(event.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-5">
                        <label htmlFor="categoria" className="form-label">
                            Categoría
                        </label>

                        <select
                            id="categoria"
                            className="form-select"
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                        >
                            {categorias.map((item) => (
                                <option key={item} value={item}>
                                    {item === 'Todas' ? 'Todas las categorías' : item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {productosFiltrados.length > 0 ? (
                    <div className="row g-4">
                        {productosFiltrados.map((producto) => (
                            <div
                                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                key={producto.codigo}
                            >
                                <CardTienda
                                    producto={producto}
                                    onVerDetalle={onVerDetalle}
                                    onAgregar={onAgregar}
                                    cantidad={
                                        carrito.find(
                                            (item) => item.codigo === producto.codigo,
                                        )?.cantidad ?? 0
                                    }
                                    onCambiarCantidad={onCambiarCantidad}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <h3>No encontramos productos 🐾</h3>

                        <p>Intenta con otro nombre o categoría.</p>

                        <Boton
                            texto="Ver productos"
                            type="button"
                            className="btn-tienda"
                            onClick={() => {
                                setBusqueda('');
                                setCategoria('Todas');
                            }}
                        />
                    </div>
                )}
            </section>
        </main>
    );
}
