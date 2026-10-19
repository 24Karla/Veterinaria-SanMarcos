
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

interface CardTiendaProps {
  producto: Producto;
  onVerDetalle?: (codigo: string) => void;
}

export default function CardTienda({
  producto,
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
        <span className="card-tienda-codigo">
          {producto.codigo}
        </span>
      </div>

      <div className="card-tienda-contenido">
        <span className="card-tienda-categoria">
          {producto.categoria}
        </span>

        <h3>{producto.nombre}</h3>

        <p className="card-tienda-principio">
          {producto.principioActivo}
        </p>

        <p className="card-tienda-presentacion">
          {producto.presentacion}
        </p>

        <p className="card-tienda-especie">
          🐾 {producto.especie}
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
              ? `${producto.stock} unidades`
              : 'Sin stock'}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-tienda w-100 mt-3"
          disabled={producto.stock === 0}
          onClick={() => onVerDetalle?.(producto.codigo)}
        >
          Ver producto
        </button>
      </div>
    </article>
  );
}
