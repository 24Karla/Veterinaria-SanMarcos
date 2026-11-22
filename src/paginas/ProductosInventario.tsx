import { useEffect, useState, type FormEvent } from 'react';
import PaginaGestion from './PaginaGestion';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import type { Producto } from '../componentes/organismos/CardTienda';
import { api, mostrarErrorFormulario, pedirDatos, mensajeError } from '../servicios/api';

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
            !datos.precio.trim() ||
            !Number.isFinite(Number(datos.precio)) ||
            Number(datos.precio) <= 0 ||
            !datos.stock.trim() ||
            !Number.isInteger(Number(datos.stock)) ||
            Number(datos.stock) < 0 ||
            !datos.codigo.trim()
        ) {
            alert(
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
            mostrarErrorFormulario(error, setError);
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
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    function formularioProducto() {
        return (
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
                            type={['precio', 'stock'].includes(campo) ? 'number' : 'text'}
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
                    className="btn btn-volver-tienda"
                    onClick={() => setMostrar(false)}
                >
                    Cancelar
                </button>
            </form>
        );
    }

    return (
        <PaginaGestion
            etiqueta="ADMINISTRACIÓN"
            titulo="Productos e inventario"
            descripcion="Revisa el estado de los productos de la veterinaria."
            volverA="/perfil/administrador"
            registros={productos.map((producto) => ({
                titulo: producto.nombre,
                descripcion: `${producto.categoria} · Stock: ${producto.stock} unidades · Precio: $${producto.precio.toLocaleString('es-CL')}`,
                imagen: producto.imagen,
            }))}
            accion={
                <>
                    <EstadoApi cargando={cargando} error={error} />
                    {mostrar && !editando ? (
                        formularioProducto()
                    ) : (
                        <button className="btn btn-tienda mb-4" onClick={() => editar()}>
                            Agregar producto
                        </button>
                    )}
                    {!cargando && !error && productos.length === 0 && (
                        <p>No hay productos registrados.</p>
                    )}
                </>
            }
            onEditar={(_, indice) => editar(productos[indice])}
            onEliminar={(indice) => eliminar(productos[indice].codigo)}
            registroEditando={
                mostrar && editando
                    ? productos.findIndex((producto) => producto.codigo === editando)
                    : null
            }
            formularioEdicion={formularioProducto}
        />
    );
}
