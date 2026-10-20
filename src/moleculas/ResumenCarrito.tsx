
import Boton from '../atomos/Boton';

interface ResumenCarritoProps {
  total: number;
  cantidadProductos: number;
  onContinuar: () => void;
}

export default function ResumenCarrito({
  total,
  cantidadProductos,
  onContinuar,
}: ResumenCarritoProps) {
  const formatoPrecio = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(total);

  return (
    <aside className="resumen-carrito">
      <h2>Resumen de compra</h2>

      <p>Unidades: {cantidadProductos}</p>

      <div className="resumen-carrito-total">
        <strong>Total:</strong>
        <strong>{formatoPrecio}</strong>
      </div>

      <Boton
        texto="Continuar compra"
        className="btn btn-tienda w-100 mt-3"
        disabled={cantidadProductos === 0}
        onClick={onContinuar}
      />
    </aside>
  );
}
