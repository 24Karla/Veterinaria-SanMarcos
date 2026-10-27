
import ItemCarrito from '../moleculas/ItemCarrito';
import type { ProductoCarrito } from './CardTienda';

interface ListaCarritoProps {
    carrito: ProductoCarrito[];
    onCambiarCantidad: (codigo: string, cantidad: number) => void;
    onEliminar: (codigo: string) => void;
}

export default function ListaCarrito({
    carrito,
    onCambiarCantidad,
    onEliminar,
}: ListaCarritoProps) {
    return (
        <>
            {carrito.map((producto) => (
                <ItemCarrito
                    key={producto.codigo}
                    producto={producto}
                    onCambiarCantidad={onCambiarCantidad}
                    onEliminar={onEliminar}
                />
            ))}
        </>
    );
}
