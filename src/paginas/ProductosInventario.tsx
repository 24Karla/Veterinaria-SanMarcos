
import { useEffect, useState, type FormEvent } from 'react';
import PaginaGestion from './PaginaGestion';

const productosInventario = [
    {
        titulo: 'Amoxibay 250mg',
        descripcion: 'Antibióticos · Stock: 45 unidades',
        imagen: '/img/Amoxibay.jpg',
    },
    {
        titulo: 'Enrox 50mg',
        descripcion: 'Antibióticos · Stock: 30 unidades',
        imagen: '/img/Enrox.jpg',
    },
    {
        titulo: 'Metrobay 250mg',
        descripcion: 'Antibióticos · Stock: 28 unidades',
        imagen: '/img/Metrobay.jpg',
    },
    {
        titulo: 'Nexgard',
        descripcion: 'Antiparasitarios · Stock: 60 unidades',
        imagen: '/img/Nexgard.jpg',
    },
    {
        titulo: 'Bravecto',
        descripcion: 'Antiparasitarios · Stock: 40 unidades',
        imagen: '/img/Bravecto.jpg',
    },
    {
        titulo: 'Revolution Plus',
        descripcion: 'Antiparasitarios · Stock: 35 unidades',
        imagen: '/img/Revolution.jpg',
    },
    {
        titulo: 'Drontal Plus',
        descripcion: 'Antiparasitarios · Stock: 80 unidades',
        imagen: '/img/Drontal.jpg',
    },
    {
        titulo: 'Milbemax Gato',
        descripcion: 'Antiparasitarios · Stock: 50 unidades',
        imagen: '/img/Milbemax.jpg',
    },
    {
        titulo: 'Meloxicam 1mg',
        descripcion: 'Antiinflamatorios · Stock: 55 unidades',
        imagen: '/img/Meloxicam.jpg',
    },
    {
        titulo: 'Carprofen 50mg',
        descripcion: 'Antiinflamatorios · Stock: 30 unidades',
        imagen: '/img/Carprofen.jpg',
    },
    {
        titulo: 'Clorhexidina shampoo',
        descripcion: 'Dermatología · Stock: 25 unidades',
        imagen: '/img/Clorhexidina.jpg',
    },
    {
        titulo: 'Malaseb shampoo',
        descripcion: 'Dermatología · Stock: 20 unidades',
        imagen: '/img/Malaseb.jpg',
    },
    {
        titulo: 'Apoquel 16mg',
        descripcion: 'Dermatología · Stock: 18 unidades',
        imagen: '/img/Apoquel.jpg',
    },
    {
        titulo: 'Probifor',
        descripcion: 'Digestivo · Stock: 40 unidades',
        imagen: '/img/Probifor.png',
    },
    {
        titulo: 'Omeprazol 10mg vet',
        descripcion: 'Digestivo · Stock: 35 unidades',
        imagen: '/img/Omeprazol.jpg',
    },
    {
        titulo: 'Vetmedin 2.5mg',
        descripcion: 'Cardíaco · Stock: 15 unidades',
        imagen: '/img/Vetmedin.jpg',
    },
    {
        titulo: 'Tramadol 50mg vet',
        descripcion: 'Analgésicos · Stock: 22 unidades',
        imagen: '/img/Tramadol.jpg',
    },
    {
        titulo: 'Nobivac DHPPi',
        descripcion: 'Vacunas · Stock: 48 unidades',
        imagen: '/img/Nobivac.jpg',
    },
    {
        titulo: 'Nobivac Rabies',
        descripcion: 'Vacunas · Stock: 60 unidades',
        imagen: '/img/NobivacR.jpg',
    },
    {
        titulo: 'Felocell CVR',
        descripcion: 'Vacunas · Stock: 36 unidades',
        imagen: '/img/Felocell.jpg',
    },
    {
        titulo: 'Omega vet 3,6',
        descripcion: 'Suplementos · Stock: 30 unidades',
        imagen: '/img/Omega.jpg',
    },
    {
        titulo: 'Condrovet forte',
        descripcion: 'Suplementos · Stock: 25 unidades',
        imagen: '/img/Condrovet.jpg',
    },
];

export default function ProductosInventario() {
    const [productos, setProductos] = useState(() => {
        try {
            const guardados = localStorage.getItem('productos-inventario');
            return guardados ? JSON.parse(guardados) : productosInventario;
        } catch {
            return productosInventario;
        }
    });
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [productoEditando, setProductoEditando] = useState<number | null>(null);
    const [datos, setDatos] = useState({
        nombre: '',
        categoria: '',
        precio: '',
        stock: '',
        imagen: '',
    });

    useEffect(() => {
        localStorage.setItem('productos-inventario', JSON.stringify(productos));
    }, [productos]);

    function cambiar(campo: keyof typeof datos, valor: string) {
        setDatos((actual) => ({ ...actual, [campo]: valor }));
    }

    function guardarProducto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const faltaPrecio = productoEditando === null && !datos.precio;

        if (!datos.nombre.trim() || !datos.categoria.trim() || faltaPrecio || !datos.stock) {
            alert('Completa nombre, categoría, precio y stock.');
            return;
        }

        if (datos.precio && Number(datos.precio) <= 0) {
            alert('El precio debe ser mayor a cero.');
            return;
        }

        if (Number(datos.stock) < 0) {
            alert('El stock no puede ser negativo.');
            return;
        }

        const producto = {
            titulo: datos.nombre.trim(),
            descripcion: `${datos.categoria.trim()} · Stock: ${datos.stock} unidades${datos.precio ? ` · Precio: $${datos.precio}` : ''}`,
            imagen: datos.imagen.trim() || '/img/Amoxibay.jpg',
        };

        if (productoEditando === null) {
            setProductos((actuales) => [...actuales, producto]);
        } else {
            setProductos((actuales) => actuales.map((actual, indice) => indice === productoEditando ? producto : actual));
        }

        cerrarFormulario();
    }

    function editarProducto(producto: { titulo: string; descripcion: string; imagen?: string }, indice: number) {
        const categoria = producto.descripcion.split(' · Stock:')[0];
        const stock = producto.descripcion.match(/Stock: (\d+) unidades/)?.[1] || '';
        const precio = producto.descripcion.match(/Precio: \$(\d+)/)?.[1] || '';

        setDatos({ nombre: producto.titulo, categoria, precio, stock, imagen: producto.imagen || '' });
        setProductoEditando(indice);
        setMostrarFormulario(false);
    }

    function eliminarProducto(indice: number) {
        setProductos((actuales) => actuales.filter((_, posicion) => posicion !== indice));
    }

    function cerrarFormulario() {
        setDatos({ nombre: '', categoria: '', precio: '', stock: '', imagen: '' });
        setProductoEditando(null);
        setMostrarFormulario(false);
    }

    function formularioProducto() {
        return (
            <form className="formulario-mascota" onSubmit={guardarProducto}>
                <h2>{productoEditando === null ? 'Nuevo producto' : 'Editar producto'}</h2>
                <input className="form-control" aria-label="Nombre del producto" value={datos.nombre} onChange={(event) => cambiar('nombre', event.target.value)} placeholder="Nombre" />
                <input className="form-control" aria-label="Categoría del producto" value={datos.categoria} onChange={(event) => cambiar('categoria', event.target.value)} placeholder="Categoría" />
                <input className="form-control" aria-label="Precio del producto" type="number" min="0" value={datos.precio} onChange={(event) => cambiar('precio', event.target.value)} placeholder="Precio" />
                <input className="form-control" aria-label="Stock del producto" type="number" min="0" value={datos.stock} onChange={(event) => cambiar('stock', event.target.value)} placeholder="Stock" />
                <input className="form-control" aria-label="Imagen del producto" value={datos.imagen} onChange={(event) => cambiar('imagen', event.target.value)} placeholder="Ruta de imagen (opcional)" />
                <div>
                    <button className="btn btn-tienda me-2" type="submit">{productoEditando === null ? 'Guardar producto' : 'Guardar cambios'}</button>
                    <button className="btn btn-volver-tienda" type="button" onClick={cerrarFormulario}>Cancelar</button>
                </div>
            </form>
        );
    }

    return (
        <PaginaGestion
            etiqueta="ADMINISTRACIÓN"
            titulo="Productos e inventario"
            descripcion="Revisa el estado de los productos de la veterinaria."
            volverA="/perfil/administrador"
            registros={productos}
            accion={
                mostrarFormulario ? (
                    <div className="mb-4">{formularioProducto()}</div>
                ) : (
                    <button className="btn btn-tienda mb-4" type="button" onClick={() => { setProductoEditando(null); setMostrarFormulario(true); }}>Agregar producto</button>
                )
            }
            onEditar={editarProducto}
            onEliminar={eliminarProducto}
            registroEditando={productoEditando}
            formularioEdicion={formularioProducto}
        />
    );
}
