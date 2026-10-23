import { Link } from 'react-router-dom';

interface PerfilAdministradorProps {
  sesion: { nombre: string; correo: string };
}

export default function PerfilAdministrador({ sesion }: PerfilAdministradorProps) {
  return (
    <main className="container panel-perfil">
      <header className="perfil-encabezado">
        <span className="perfil-etiqueta">ADMINISTRACIÓN</span>
        <h1>Resumen de la veterinaria</h1>
        <p>Hola, {sesion.nombre}. Gestiona las operaciones diarias de San Marcos.</p>
      </header>

      <section className="indicadores-admin" aria-label="Indicadores de la veterinaria">
        <article><span>Citas de hoy</span><strong>18</strong><small>6 pendientes</small></article>
        <article><span>Productos con poco stock</span><strong>7</strong><small>Requieren reposición</small></article>
        <article><span>Ventas del día</span><strong>$324.500</strong><small>12 pedidos confirmados</small></article>
      </section>

      <section className="perfil-grid">
        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Productos e inventario</h2></div>
          <div className="perfil-lista">
            <div><strong>7 productos bajo mínimo</strong><span>Revisa las alertas de stock.</span></div>
            <div><strong>3 solicitudes de compra</strong><span>Pendientes de aprobación.</span></div>
          </div>
          <Link className="btn btn-tienda" to="/perfil/administrador/productos">Gestionar productos</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Flujo de citas</h2></div>
          <div className="perfil-lista">
            <div><strong>18 citas para hoy</strong><span>12 confirmadas · 6 pendientes.</span></div>
            <div><strong>4 veterinarios en turno</strong><span>Agenda disponible hasta las 19:30 hrs.</span></div>
          </div>
          <Link className="btn btn-volver-tienda" to="/perfil/administrador/citas">Administrar agenda</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Pedidos y ventas</h2></div>
          <p className="perfil-texto">Consulta pagos recibidos, pedidos en preparación y el historial de ventas.</p>
          <Link className="btn btn-volver-tienda" to="/perfil/administrador/ventas">Ver ventas</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Equipo y clientes</h2></div>
          <p className="perfil-texto">Administra usuarios, permisos y fichas de clientes de la veterinaria.</p>
          <Link className="btn btn-volver-tienda" to="/perfil/administrador/usuarios">Gestionar usuarios</Link>
        </article>
      </section>
    </main>
  );
}
