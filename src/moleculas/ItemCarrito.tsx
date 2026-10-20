import Boton from '../atomos/Boton';
import type { ProductoCarrito } from '../organismos/CardTienda';

interface ItemCarritoProps {
  producto: ProductoCarrito;
  onCambiarCantidad: (codigo: string, cantidad: number) => void;
  onEliminar: (codigo: string) => void;
}

export default function ItemCarrito({
  producto,
  onCambiarCantidad,
  onEliminar,
}: ItemCarritoProps) {
  const subtotal = producto.precio * producto.cantidad;

  const formatoPrecio = (precio: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(precio);

  return (
    <article className="item-carrito">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="item-carrito-imagen"
      />

      <div className="item-carrito-info">
        <h3>{producto.nombre}</h3>
        <p>{formatoPrecio(producto.precio)} por unidad</p>

        <div className="item-carrito-cantidad">
          <Boton
            texto="-"
            className="btn btn-cantidad-carrito"
            disabled={producto.cantidad <= 1}
            onClick={() =>
              onCambiarCantidad(
                producto.codigo,
                producto.cantidad - 1
              )
            }
          />

          <span>{producto.cantidad}</span>

          <Boton
            texto="+"
            className="btn btn-cantidad-carrito"
            disabled={producto.cantidad >= producto.stock}
            onClick={() =>
              onCambiarCantidad(
                producto.codigo,
                producto.cantidad + 1
              )
            }
          />
        </div>

        <p>Subtotal: {formatoPrecio(subtotal)}</p>

        <Boton
          texto="Eliminar"
          className="btn btn-eliminar"
          onClick={() => onEliminar(producto.codigo)}
        />
      </div>
    </article>
  );
}
