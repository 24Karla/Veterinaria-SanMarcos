
import Boton from '../atomos/Boton';

export interface Producto {
    codigo: string;
    categoria: string;
    nombre: string;
    principioActivo: string;
    presentacion: string;
    especie: string;
    stock: number;
    precio: number;
    imagen: string;
}

export interface ProductoCarrito extends Producto {
    cantidad: number;
}

interface CardTiendaProps {
    producto: Producto;
    cantidad: number;
    onAgregar: (producto: Producto) => void;
    onCambiarCantidad: (codigo: string, cantidad: number) => void;
    onVerDetalle: (producto: Producto) => void;
}

export default function CardTienda({
    producto,
    cantidad,
    onAgregar,
    onCambiarCantidad,
    onVerDetalle,
}: CardTiendaProps) {
    const precioFormateado = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(producto.precio);

    return (
        <article className="card-tienda h-100">

            <div className="card-tienda-imagen">
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    loading="lazy"
                />
            </div>

            <div className="card-tienda-contenido">

                <span className="card-tienda-categoria">
                    {producto.categoria}
                </span>

                <h3>{producto.nombre}</h3>

                <p className="card-tienda-descripcion">
                    {producto.presentacion} · {producto.especie}
                </p>

                <div className="card-tienda-pie">
                    <strong>{precioFormateado}</strong>

                    <span
                        className={
                            producto.stock > 0
                                ? 'stock-disponible'
                                : 'stock-agotado'
                        }
                    >
                        {producto.stock > 0
                            ? `Stock: ${producto.stock}`
                            : 'Sin stock'}
                    </span>
                </div>

                <Boton
                    texto="Ver producto"
                    type="button"
                    className="btn btn-ver-producto w-100 mt-2"
                    onClick={() => onVerDetalle(producto)}
                />

                {cantidad === 0 ? (
                    <Boton
                        texto="Agregar al carrito"
                        type="button"
                        className="btn btn-tienda w-100 mt-3"
                        disabled={producto.stock === 0}
                        onClick={() => onAgregar(producto)}
                    />
                ) : (
                    <div
                        className="selector-cantidad mt-3"
                        aria-label={`Cantidad de ${producto.nombre}`}
                    >
                        <Boton
                            texto="−"
                            type="button"
                            className="btn btn-tienda"
                            onClick={() =>
                                onCambiarCantidad(
                                    producto.codigo,
                                    cantidad - 1
                                )
                            }
                        />

                        <span>{cantidad}</span>

                        <Boton
                            texto="+"
                            type="button"
                            className="btn btn-tienda"
                            disabled={cantidad >= producto.stock}
                            onClick={() =>
                                onCambiarCantidad(
                                    producto.codigo,
                                    cantidad + 1
                                )
                            }
                        />
                    </div>
                )}

            </div>
        </article>
    );
}
