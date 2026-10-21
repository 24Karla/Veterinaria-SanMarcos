import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Footer from './componentes/organismos/Footer';
import Navbar from './componentes/organismos/Navbar';

import Inicio from './paginas/Inicio';
import Login from './paginas/Login';
import Servicios from './paginas/Servicios';

import type {
  Producto,
  ProductoCarrito,
} from './componentes/organismos/CardTienda';

import Carrito from './paginas/Carrito';
import Pago from './paginas/Pago';
import Productos from './paginas/Productos';
import ReservarCita from './paginas/ReservarCita';
import VerProducto from './paginas/VerProducto';

function App() {
  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f0e8',
      }}
    >
      <Navbar />

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/servicios" element={<Servicios />} /> 
          <Route path="/tienda/*" element={<RutaTienda />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

type PaginaTienda = 'productos' | 'carrito' | 'cita' | 'detalle' | 'pago';

function RutaTienda() {
  const { search } = useLocation();
  const paginaSolicitada = new URLSearchParams(search).get('pagina');
  const paginaInicial: PaginaTienda =
    paginaSolicitada === 'carrito' || paginaSolicitada === 'cita'
      ? paginaSolicitada
      : 'productos';

  return <Tienda key={search} paginaInicial={paginaInicial} />;
}

function Tienda({ paginaInicial }: { paginaInicial: PaginaTienda }) {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>(() => {
    try {
      const guardado = localStorage.getItem('carrito-veterinaria');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [pagina, setPagina] = useState<PaginaTienda>(paginaInicial);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

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
        if (producto.stock <= 0) {
          return actual;
        }

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

  return (
    <>
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
          cantidad={
            carrito.find(
              (item) =>
                item.codigo === productoSeleccionado.codigo
            )?.cantidad ?? 0
          }
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
      ) : pagina === 'cita' ? (
        <ReservarCita
          onVolver={() => setPagina('productos')}
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