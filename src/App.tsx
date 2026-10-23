
import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Footer from './componentes/organismos/Footer';
import Navbar from './componentes/organismos/Navbar';

import Inicio from './paginas/Inicio';
import HistorialCliente from './paginas/HistorialCliente';
import Login from './paginas/Login';
import MisCitas from './paginas/MisCitas';
import PaginaGestion from './paginas/PaginaGestion';
import PerfilAdministrador from './paginas/PerfilAdministrador';
import PerfilCliente from './paginas/PerfilCliente';
import PerfilVeterinario from './paginas/PerfilVeterinario';

import type {
  Producto,
  ProductoCarrito,
} from './componentes/organismos/CardTienda';

import Carrito from './paginas/Carrito';
import Pago from './paginas/Pago';
import Productos from './paginas/Productos';
import ReservarCita from './paginas/ReservarCita';
import VerProducto from './paginas/VerProducto';

type RolUsuario = 'cliente' | 'veterinario' | 'administrador';

interface SesionUsuario {
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

const rutasPerfil = {
  cliente: '/perfil/cliente',
  veterinario: '/perfil/veterinario',
  administrador: '/perfil/administrador',
};

function App() {
  const [sesion, setSesion] = useState<SesionUsuario | null>(() => {
    try {
      const guardada = localStorage.getItem('sesion-veterinaria');
      return guardada ? JSON.parse(guardada) : null;
    } catch {
      return null;
    }
  });

  function iniciarSesion(nuevaSesion: SesionUsuario) {
    setSesion(nuevaSesion);
    localStorage.setItem('sesion-veterinaria', JSON.stringify(nuevaSesion));
  }

  function cerrarSesion() {
    setSesion(null);
    localStorage.removeItem('sesion-veterinaria');
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f0e8',
      }}
    >
      <Navbar sesion={sesion} onCerrarSesion={cerrarSesion} />

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route
            path="/login"
            element={
              sesion ? (
                <Navigate to={rutasPerfil[sesion.rol]} replace />
              ) : (
                <Login onLogin={iniciarSesion} />
              )
            }
          />
          <Route path="/tienda/*" element={<RutaTienda />} />
          <Route
            path="/perfil/cliente"
            element={
              <PerfilProtegido sesion={sesion} rol="cliente">
                {(usuario) => <PerfilCliente sesion={usuario} />}
              </PerfilProtegido>
            }
          />
          <Route
            path="/perfil/cliente/citas"
            element={
              <PerfilProtegido sesion={sesion} rol="cliente">
                {() => <MisCitas />}
              </PerfilProtegido>
            }
          />
          <Route
            path="/perfil/cliente/historial"
            element={
              <PerfilProtegido sesion={sesion} rol="cliente">
                {() => <HistorialCliente />}
              </PerfilProtegido>
            }
          />
          <Route
            path="/perfil/veterinario"
            element={
              <PerfilProtegido sesion={sesion} rol="veterinario">
                {(usuario) => <PerfilVeterinario sesion={usuario} />}
              </PerfilProtegido>
            }
          />
          <Route
            path="/perfil/veterinario/agenda"
            element={<PerfilProtegido sesion={sesion} rol="veterinario">{() => <PaginaGestion etiqueta="PANEL VETERINARIO" titulo="Mi agenda" descripcion="Citas agendadas para tu jornada de atención." volverA="/perfil/veterinario" registros={[{ titulo: '11:00 · Luna Morales', descripcion: 'Consulta general · Golden Retriever' }, { titulo: '12:30 · Tomás Silva', descripcion: 'Control postoperatorio · Gato' }, { titulo: '16:00 · Bruno Pérez', descripcion: 'Vacunación · Mestizo' }]} />}</PerfilProtegido>}
          />
          <Route
            path="/perfil/veterinario/recetas"
            element={<PerfilProtegido sesion={sesion} rol="veterinario">{() => <PaginaGestion etiqueta="PANEL VETERINARIO" titulo="Recetas emitidas" descripcion="Revisa los tratamientos y recetas de tus pacientes." volverA="/perfil/veterinario" registros={[{ titulo: 'Amoxicilina 250 mg', descripcion: 'Luna Morales · Emitida hoy' }, { titulo: 'Meloxicam 1 mg', descripcion: 'Rocky Fuentes · Emitida el 20 de octubre' }]} />}</PerfilProtegido>}
          />
          <Route
            path="/perfil/veterinario/historial"
            element={<PerfilProtegido sesion={sesion} rol="veterinario">{() => <PaginaGestion etiqueta="PANEL VETERINARIO" titulo="Historial clínico" descripcion="Consulta controles, diagnósticos y tratamientos de tus pacientes." volverA="/perfil/veterinario" registros={[{ titulo: 'Luna Morales', descripcion: 'Última atención: vacuna anual · 12 de septiembre' }, { titulo: 'Milo Pérez', descripcion: 'Última atención: control general · 4 de agosto' }]} />}</PerfilProtegido>}
          />
          <Route
            path="/perfil/administrador"
            element={
              <PerfilProtegido sesion={sesion} rol="administrador">
                {(usuario) => <PerfilAdministrador sesion={usuario} />}
              </PerfilProtegido>
            }
          />
          <Route
            path="/perfil/administrador/productos"
            element={<PerfilProtegido sesion={sesion} rol="administrador">{() => <PaginaGestion etiqueta="ADMINISTRACIÓN" titulo="Productos e inventario" descripcion="Revisa el estado de los productos de la veterinaria." volverA="/perfil/administrador" registros={[{ titulo: '7 productos bajo mínimo', descripcion: 'Requieren reposición pronta.' }, { titulo: '3 solicitudes de compra', descripcion: 'Pendientes de aprobación.' }]} />}</PerfilProtegido>}
          />
          <Route
            path="/perfil/administrador/citas"
            element={<PerfilProtegido sesion={sesion} rol="administrador">{() => <PaginaGestion etiqueta="ADMINISTRACIÓN" titulo="Flujo de citas" descripcion="Organiza las atenciones y disponibilidad de la veterinaria." volverA="/perfil/administrador" registros={[{ titulo: '18 citas para hoy', descripcion: '12 confirmadas · 6 pendientes.' }, { titulo: '4 veterinarios en turno', descripcion: 'Agenda disponible hasta las 19:30 hrs.' }]} />}</PerfilProtegido>}
          />
          <Route
            path="/perfil/administrador/ventas"
            element={<PerfilProtegido sesion={sesion} rol="administrador">{() => <PaginaGestion etiqueta="ADMINISTRACIÓN" titulo="Pedidos y ventas" descripcion="Consulta los pagos y pedidos de la tienda." volverA="/perfil/administrador" registros={[{ titulo: '12 pedidos confirmados', descripcion: 'Ventas acumuladas de hoy: $324.500.' }, { titulo: '4 pedidos en preparación', descripcion: 'Pendientes de entrega o retiro.' }]} />}</PerfilProtegido>}
          />
          <Route
            path="/perfil/administrador/usuarios"
            element={<PerfilProtegido sesion={sesion} rol="administrador">{() => <PaginaGestion etiqueta="ADMINISTRACIÓN" titulo="Equipo y clientes" descripcion="Administra los usuarios de la veterinaria." volverA="/perfil/administrador" registros={[{ titulo: '4 veterinarios activos', descripcion: 'Todos cuentan con agenda asignada.' }, { titulo: '156 clientes registrados', descripcion: '8 nuevos clientes durante este mes.' }]} />}</PerfilProtegido>}
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

interface PerfilProtegidoProps {
  sesion: SesionUsuario | null;
  rol: RolUsuario;
  children: (sesion: SesionUsuario) => ReactNode;
}

function PerfilProtegido({ sesion, rol, children }: PerfilProtegidoProps) {
  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (sesion.rol !== rol) {
    return <Navigate to={rutasPerfil[sesion.rol]} replace />;
  }

  return <>{children(sesion)}</>;
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
