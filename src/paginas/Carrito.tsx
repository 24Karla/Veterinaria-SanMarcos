
import ResumenCarrito from '../componentes/moleculas/ResumenCarrito';
import type { ProductoCarrito } from '../componentes/organismos/CardTienda';
import ListaCarrito from '../componentes/organismos/ListaCarrito';

interface CarritoProps {
    carrito: ProductoCarrito[];
    onCambiarCantidad: (codigo: string, cantidad: number) => void;
    onEliminar: (codigo: string) => void;
    onVolver: () => void;
    onPagar: () => void;
}

export default function Carrito({
    carrito,
    onCambiarCantidad,
    onEliminar,
    onVolver,
    onPagar,
}: CarritoProps) {
    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    const cantidadProductos = carrito.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    );

    return (
        <main className="container pagina-carrito">

            <span className="tienda-etiqueta">
                VETERINARIA SAN MARCOS
            </span>

            <h1>Mi carrito</h1>

            <p>
                Revisa los productos que deseas comprar.
            </p>

            <div className="carrito-contenido">

                <section>
                    {carrito.length === 0 ? (
                        <div className="carrito-vacio">
                            <h3>Tu carrito está vacío</h3>

                            <p>
                                Agrega productos para comenzar tu compra.
                            </p>
                        </div>
                    ) : (
                        <ListaCarrito
                            carrito={carrito}
                            onCambiarCantidad={onCambiarCantidad}
                            onEliminar={onEliminar}
                        />
                    )}
                </section>

                <ResumenCarrito
                    total={total}
                    cantidadProductos={cantidadProductos}
                    onContinuar={onPagar}
                />

            </div>

            <button
                type="button"
                className="btn btn-volver-tienda mt-4"
                onClick={onVolver}
            >
                ← Seguir comprando
            </button>

        </main>
    );
}
