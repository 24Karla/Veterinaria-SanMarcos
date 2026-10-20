
import { useEffect, useState } from 'react';
import type {
  Producto,
  ProductoCarrito,
} from './organismos/CardTienda';
import Carrito from './paginas/Carrito';
import Productos from './paginas/Productos';
import VerProducto from './paginas/VerProducto';
import Pago from './paginas/Pago';

function App() {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>(() => {
    try {
      const guardado = localStorage.getItem('carrito-veterinaria');

      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [pagina, setPagina] = useState('productos');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    localStorage.setItem(
      'carrito-veterinaria',
      JSON.stringify(carrito)
    );
  }, [carrito]);

  function agregarProducto(producto: Producto) {
    setCarrito((actual) => {
      const existe = actual.find(
        (item) => item.codigo === producto.codigo
      );

      if (existe) {
        return actual.map((item) =>
          item.codigo === producto.codigo
            ? {
                ...item,
                cantidad: Math.min(
                  item.cantidad + 1,
                  item.stock
                ),
              }
            : item
        );
      }

      if (producto.stock <= 0) {
        return actual;
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(codigo: string, cantidad: number) {
    if (cantidad <= 0) {
      eliminarProducto(codigo);
      return;
    }

    setCarrito((actual) =>
      actual.map((item) =>
        item.codigo === codigo
          ? {
              ...item,
              cantidad: Math.min(cantidad, item.stock),
            }
          : item
      )
    );
  }

  function eliminarProducto(codigo: string) {
    setCarrito((actual) =>
      actual.filter((item) => item.codigo !== codigo)
    );
  }

  function verDetalle(producto: Producto) {
    setProductoSeleccionado(producto);
    setPagina('detalle');
  }

  function finalizarPago() {
    setCarrito([]);
  }

  const cantidadProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container py-2">
          <button
            type="button"
            className="btn btn-link nav-link"
            onClick={() => setPagina('productos')}
          >
            Productos
          </button>

          <button
            type="button"
            className="btn btn-link nav-link"
            onClick={() => setPagina('carrito')}
          >
            Carrito ({cantidadProductos})
          </button>
        </div>
      </nav>

      {pagina === 'productos' ? (
        <Productos
          onVerDetalle={verDetalle}
          onAgregar={agregarProducto}
          carrito={carrito}
          onCambiarCantidad={cambiarCantidad}
        />
      ) : pagina === 'detalle' && productoSeleccionado ? (
        <VerProducto
          producto={productoSeleccionado}
          cantidad={carrito.find((item) => item.codigo === productoSeleccionado.codigo)?.cantidad ?? 0}
          onAgregar={agregarProducto}
          onCambiarCantidad={cambiarCantidad}
          onVolver={() => setPagina('productos')}
        />
      ) : pagina === 'pago' ? (
        <Pago
          carrito={carrito}
          onVolver={() => setPagina('carrito')}
          onIrProductos={() => setPagina('productos')}
          onFinalizar={finalizarPago}
        />
      ) : (
        <Carrito
          carrito={carrito}
          onCambiarCantidad={cambiarCantidad}
          onEliminar={eliminarProducto}
          onVolver={() => setPagina('productos')}
          onPagar={() => setPagina('pago')}
        />
      )}
    </>
  );
}

export default App;
