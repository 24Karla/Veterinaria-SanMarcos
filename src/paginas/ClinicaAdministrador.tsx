import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import { api, pedirDatos, mensajeError, type UsuarioApi } from '../servicios/api';

interface Catalogo {
    id: number;
    codigo: string;
    categoria: string;
    nombre: string;
    principioActivo: string;
    presentacion: string;
    especie: string;
    stock: number;
    precio: number;
}
interface Suministro {
    codigo: string;
    categoria: string;
    nombreComercial: string;
    principioActivo: string;
    presentacion: string;
    especie: string;
    stockActual: number;
    precioUnitarioClp: number;
    activo: boolean;
}
interface Compra {
    id: number;
    nombreDueno: string;
    fechaCompra: string;
    totalClp: number;
    estado: string;
    detalles: { codigoProducto: string; nombreProducto: string; cantidad: number }[];
}
const vacio = {
    codigo: '',
    categoria: '',
    nombre: '',
    principioActivo: '',
    presentacion: '',
    especie: '',
    stock: '',
    precio: '',
};

export default function ClinicaAdministrador() {
    const [catalogo, setCatalogo] = useState<Catalogo[]>([]);
    const [suministros, setSuministros] = useState<Suministro[]>([]);
    const [compras, setCompras] = useState<Compra[]>([]);
    const [clientes, setClientes] = useState<UsuarioApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [tipo, setTipo] = useState<'catalogo' | 'suministros'>('catalogo');
    const [mostrar, setMostrar] = useState(false);
    const [editando, setEditando] = useState<string | number | null>(null);
    const [datos, setDatos] = useState(vacio);
    const [venta, setVenta] = useState({
        duenoId: '',
        codigoProducto: '',
        cantidad: '1',
    });

    useEffect(() => {
        Promise.all([
            pedirDatos<Catalogo[]>(`${api.catalogo}/productos/listar`),
            pedirDatos<Suministro[]>(`${api.compras}/api/productos`),
            pedirDatos<Compra[]>(`${api.compras}/api/compras`),
            pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro`),
        ])
            .then(([catalogo, suministros, compras, usuarios]) => {
                setCatalogo(catalogo);
                setSuministros(suministros);
                setCompras(compras);
                setClientes(usuarios.filter((usuario) => usuario.rol === 'CLIENTE'));
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    async function guardar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            if (tipo === 'catalogo') {
                await pedirDatos(
                    `${api.catalogo}/productos/${editando ? 'actualizar/' + editando : 'agregar'}`,
                    {
                        method: editando ? 'PUT' : 'POST',
                        body: JSON.stringify({
                            ...datos,
                            stock: Number(datos.stock),
                            precio: Number(datos.precio),
                        }),
                    },
                );
                setCatalogo(
                    await pedirDatos<Catalogo[]>(`${api.catalogo}/productos/listar`),
                );
            } else {
                await pedirDatos(`${api.compras}/api/productos`, {
                    method: 'POST',
                    body: JSON.stringify({
                        codigo: datos.codigo.toUpperCase(),
                        categoria: datos.categoria,
                        nombreComercial: datos.nombre,
                        principioActivo: datos.principioActivo,
                        presentacion: datos.presentacion,
                        especie: datos.especie,
                        stockActual: Number(datos.stock),
                        precioUnitarioClp: Number(datos.precio),
                        activo: true,
                    }),
                });
                setSuministros(
                    await pedirDatos<Suministro[]>(`${api.compras}/api/productos`),
                );
            }
            setMostrar(false);
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function eliminar(id: number) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.catalogo}/productos/eliminar/${id}`, {
                method: 'DELETE',
            });
            setCatalogo((actuales) => actuales.filter((producto) => producto.id !== id));
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function registrarCompra(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        const dueno = clientes.find((cliente) => cliente.id === Number(venta.duenoId));
        if (!dueno) {
            setError('Selecciona un cliente.');
            return;
        }
        setOcupado(true);
        setError('');
        try {
            const compra = await pedirDatos<Compra>(`${api.compras}/api/compras`, {
                method: 'POST',
                body: JSON.stringify({
                    duenoId: dueno.id,
                    nombreDueno: dueno.nombre,
                    items: [
                        {
                            codigoProducto: venta.codigoProducto,
                            cantidad: Number(venta.cantidad),
                        },
                    ],
                }),
            });
            setCompras((actuales) => [compra, ...actuales]);
            setSuministros(
                await pedirDatos<Suministro[]>(`${api.compras}/api/productos`),
            );
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function cambiarCompra(id: number, estado: string) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const compra = await pedirDatos<Compra>(
                `${api.compras}/api/compras/${id}/estado?estado=${estado}`,
                { method: 'PATCH' },
            );
            setCompras((actuales) =>
                actuales.map((actual) => (actual.id === id ? compra : actual)),
            );
            setSuministros(
                await pedirDatos<Suministro[]>(`${api.compras}/api/productos`),
            );
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/administrador" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <h1>Catálogo y compras clínicas</h1>
            <EstadoApi cargando={cargando} error={error} />
            <p>
                Este panel gestiona el catálogo clínico y sus suministros. La tienda web
                utiliza Productos y Pedidos.
            </p>
            <div className="mb-3">
                <button
                    className="btn btn-tienda me-2"
                    onClick={() => {
                        setTipo('catalogo');
                        setMostrar(false);
                    }}
                >
                    Catálogo clínico
                </button>
                <button
                    className="btn btn-volver-tienda"
                    onClick={() => {
                        setTipo('suministros');
                        setMostrar(false);
                    }}
                >
                    Suministros de atención
                </button>
            </div>
            <button
                className="btn btn-volver-tienda mb-3"
                onClick={() => {
                    setEditando(null);
                    setDatos(vacio);
                    setMostrar(true);
                }}
            >
                Agregar producto clínico
            </button>
            {mostrar && (
                <form className="perfil-tarjeta mb-3" onSubmit={guardar}>
                    {(Object.keys(vacio) as (keyof typeof vacio)[]).map((campo) => (
                        <div className="mb-2" key={campo}>
                            <label htmlFor={`clinico-${campo}`}>
                                {
                                    {
                                        codigo: 'Código',
                                        categoria: 'Categoría',
                                        nombre: 'Nombre',
                                        principioActivo: 'Principio activo',
                                        presentacion: 'Presentación',
                                        especie: 'Especie',
                                        stock: 'Stock',
                                        precio: 'Precio',
                                    }[campo]
                                }
                            </label>
                            <input
                                id={`clinico-${campo}`}
                                className="form-control"
                                required
                                value={datos[campo]}
                                readOnly={campo === 'codigo' && !!editando}
                                type={
                                    ['stock', 'precio'].includes(campo)
                                        ? 'number'
                                        : 'text'
                                }
                                min={campo === 'precio' ? 1 : 0}
                                onChange={(event) =>
                                    setDatos({ ...datos, [campo]: event.target.value })
                                }
                            />
                        </div>
                    ))}
                    <button className="btn btn-tienda me-2" disabled={ocupado}>
                        Guardar producto clínico
                    </button>
                    <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => setMostrar(false)}
                    >
                        Cancelar
                    </button>
                </form>
            )}
            {tipo === 'catalogo'
                ? catalogo.map((producto) => (
                      <article className="perfil-tarjeta mb-2" key={producto.id}>
                          <h3>{producto.nombre}</h3>
                          <p>
                              {producto.codigo} · {producto.categoria} · Stock:{' '}
                              {producto.stock} · ${producto.precio}
                          </p>
                          <button
                              className="btn btn-volver-tienda me-2"
                              onClick={() => {
                                  setEditando(producto.id);
                                  setDatos({
                                      codigo: producto.codigo,
                                      categoria: producto.categoria,
                                      nombre: producto.nombre,
                                      principioActivo: producto.principioActivo || '',
                                      presentacion: producto.presentacion || '',
                                      especie: producto.especie,
                                      stock: String(producto.stock),
                                      precio: String(producto.precio),
                                  });
                                  setMostrar(true);
                              }}
                          >
                              Editar
                          </button>
                          <button
                              className="btn btn-outline-danger"
                              disabled={ocupado}
                              onClick={() => eliminar(producto.id)}
                          >
                              Eliminar
                          </button>
                      </article>
                  ))
                : suministros.map((producto) => (
                      <article className="perfil-tarjeta mb-2" key={producto.codigo}>
                          <h3>{producto.nombreComercial}</h3>
                          <p>
                              {producto.codigo} · Stock: {producto.stockActual} · $
                              {producto.precioUnitarioClp}
                          </p>
                          <button
                              className="btn btn-volver-tienda"
                              onClick={() => {
                                  setEditando(producto.codigo);
                                  setDatos({
                                      codigo: producto.codigo,
                                      categoria: producto.categoria,
                                      nombre: producto.nombreComercial,
                                      principioActivo: producto.principioActivo,
                                      presentacion: producto.presentacion,
                                      especie: producto.especie,
                                      stock: String(producto.stockActual),
                                      precio: String(producto.precioUnitarioClp),
                                  });
                                  setMostrar(true);
                              }}
                          >
                              Editar
                          </button>
                      </article>
                  ))}
            <h2 className="mt-4">Registrar compra de suministros</h2>
            <form className="perfil-tarjeta mb-3" onSubmit={registrarCompra}>
                <label htmlFor="compra-cliente">Cliente</label>
                <select
                    className="form-select"
                    id="compra-cliente"
                    required
                    value={venta.duenoId}
                    onChange={(event) =>
                        setVenta({ ...venta, duenoId: event.target.value })
                    }
                >
                    <option value="">Selecciona</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                        </option>
                    ))}
                </select>
                <label htmlFor="compra-producto">Suministro</label>
                <select
                    className="form-select"
                    id="compra-producto"
                    required
                    value={venta.codigoProducto}
                    onChange={(event) =>
                        setVenta({ ...venta, codigoProducto: event.target.value })
                    }
                >
                    <option value="">Selecciona</option>
                    {suministros.map((producto) => (
                        <option key={producto.codigo} value={producto.codigo}>
                            {producto.nombreComercial} · Stock {producto.stockActual}
                        </option>
                    ))}
                </select>
                <label htmlFor="compra-cantidad">Cantidad</label>
                <input
                    className="form-control"
                    id="compra-cantidad"
                    type="number"
                    min="1"
                    required
                    value={venta.cantidad}
                    onChange={(event) =>
                        setVenta({ ...venta, cantidad: event.target.value })
                    }
                />
                <button className="btn btn-tienda mt-3" disabled={ocupado}>
                    Registrar compra clínica
                </button>
            </form>
            <h2>Compras clínicas registradas</h2>
            {compras.map((compra) => (
                <article className="perfil-tarjeta mb-2" key={compra.id}>
                    <h3>
                        Compra #{compra.id} · {compra.nombreDueno}
                    </h3>
                    <p>
                        ${compra.totalClp} · {compra.estado}
                    </p>
                    <details>
                        <summary>Ver detalle</summary>
                        {compra.detalles.map((detalle, indice) => (
                            <p key={indice}>
                                {detalle.nombreProducto} × {detalle.cantidad}
                            </p>
                        ))}
                    </details>
                    {compra.estado === 'PENDIENTE' && (
                        <button
                            className="btn btn-tienda me-2"
                            disabled={ocupado}
                            onClick={() => cambiarCompra(compra.id, 'PAGADA')}
                        >
                            Marcar pagada
                        </button>
                    )}
                    {compra.estado === 'PAGADA' && (
                        <button
                            className="btn btn-tienda me-2"
                            disabled={ocupado}
                            onClick={() => cambiarCompra(compra.id, 'ENTREGADA')}
                        >
                            Marcar entregada
                        </button>
                    )}
                    {compra.estado !== 'CANCELADA' && (
                        <button
                            className="btn btn-outline-danger"
                            disabled={ocupado}
                            onClick={() => cambiarCompra(compra.id, 'CANCELADA')}
                        >
                            Cancelar compra
                        </button>
                    )}
                </article>
            ))}
        </main>
    );
}
