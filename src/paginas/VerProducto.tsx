
import Boton from '../componentes/atomos/Boton';
import BotonVolver from '../componentes/atomos/BotonVolver';
import type { Producto } from '../componentes/organismos/CardTienda';

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
  const {
    codigo,
    nombre,
    imagen,
    categoria,
    principioActivo,
    presentacion,
    especie,
    precio,
    stock,
  } = producto;

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

  const tieneStock = stock > 0;
  const productoAgregado = cantidad > 0;
  const puedeAgregar = cantidad < stock;

  function agregarAlCarrito() {
    onAgregar(producto);
  }

  function disminuirCantidad() {
    onCambiarCantidad(codigo, cantidad - 1);
  }

  function aumentarCantidad() {
    onCambiarCantidad(codigo, cantidad + 1);
  }

  return (
    <main className="container pagina-detalle-producto">
      <BotonVolver onClick={onVolver} />

      <article className="detalle-producto">
        <div className="detalle-producto-imagen">
          <img src={imagen} alt={nombre} />
        </div>

        <div className="detalle-producto-contenido">
          <span className="card-tienda-categoria">
            {categoria}
          </span>

          <h1>{nombre}</h1>

          <p className="detalle-principio-activo">
            {principioActivo}
          </p>

          <p>
            {presentacion} · {especie}
          </p>

          <p
            className={
              tieneStock
                ? 'stock-disponible'
                : 'stock-agotado'
            }
          >
            {tieneStock
              ? `${stock} unidades disponibles`
              : 'Sin stock'}
          </p>

          <strong className="detalle-precio">
            {precioFormateado}
          </strong>

          {productoAgregado ? (
            <div className="selector-cantidad detalle-accion">
              <Boton
                texto="−"
                type="button"
                className="btn btn-tienda"
                disabled={cantidad <= 0}
                onClick={disminuirCantidad}
              />

              <span>{cantidad}</span>

              <Boton
                texto="+"
                type="button"
                className="btn btn-tienda"
                disabled={!puedeAgregar}
                onClick={aumentarCantidad}
              />
            </div>
          ) : (
            <Boton
              texto="Agregar al carrito"
              type="button"
              className="btn btn-tienda detalle-accion"
              disabled={!tieneStock}
              onClick={agregarAlCarrito}
            />
          )}
        </div>
      </article>
    </main>
  );
}
