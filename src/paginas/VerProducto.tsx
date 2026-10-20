import Boton from '../atomos/Boton';
import BotonVolver from '../atomos/BotonVolver';
import type { Producto } from '../organismos/CardTienda';

interface VerProductoProps {
  producto: Producto;
  cantidad: number;
  onAgregar: (producto: Producto) => void;
  onCambiarCantidad: (codigo: string, cantidad: number) => void;
  onVolver: () => void;
}

export default function VerProducto({
  producto,
  cantidad,
  onAgregar,
  onCambiarCantidad,
  onVolver,
}: VerProductoProps) {
  const precio = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(producto.precio);

  return (
    <main className="container pagina-detalle-producto">
      <BotonVolver onClick={onVolver} />

      <article className="detalle-producto">
        <div className="detalle-producto-imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detalle-producto-contenido">
          <span className="card-tienda-categoria">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          <p className="detalle-principio-activo">{producto.principioActivo}</p>
          <p>{producto.presentacion} · {producto.especie}</p>
          <p className={producto.stock > 0 ? 'stock-disponible' : 'stock-agotado'}>
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
          </p>
          <strong className="detalle-precio">{precio}</strong>

          {cantidad === 0 ? (
            <Boton
              texto="Agregar al carrito"
              type="button"
              className="btn btn-tienda detalle-accion"
              disabled={producto.stock === 0}
              onClick={() => onAgregar(producto)}
            />
          ) : (
            <div className="selector-cantidad detalle-accion">
              <Boton
                texto="−"
                type="button"
                className="btn btn-tienda"
                onClick={() => onCambiarCantidad(producto.codigo, cantidad - 1)}
              />
              <span>{cantidad}</span>
              <Boton
                texto="+"
                type="button"
                className="btn btn-tienda"
                disabled={cantidad >= producto.stock}
                onClick={() => onCambiarCantidad(producto.codigo, cantidad + 1)}
              />
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
