import { Link } from 'react-router-dom';

export default function MisCitas() {
  return (
    <main className="container panel-perfil">
      <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
        ← Volver a mi perfil
      </Link>

      <header className="perfil-encabezado">
        <span className="perfil-etiqueta">PORTAL CLIENTE</span>
        <h1>Mis citas veterinarias</h1>
        <p>Revisa tus próximas atenciones y las citas realizadas.</p>
      </header>

      <section className="lista-registros">
        <article className="registro-cita registro-cita-proxima">
          <div className="registro-fecha"><strong>28</strong><span>OCT</span></div>
          <div>
            <span className="registro-estado">Próxima cita</span>
            <h2>Consulta general · Luna</h2>
            <p>11:00 hrs · Dr. Martín Rojas · Sala 2</p>
          </div>
          <button type="button" className="btn btn-tienda">Ver detalle</button>
        </article>

        <article className="registro-cita">
          <div className="registro-fecha"><strong>12</strong><span>SEP</span></div>
          <div>
            <span className="registro-estado registro-realizada">Realizada</span>
            <h2>Vacunación anual · Luna</h2>
            <p>10:30 hrs · Dra. Fernanda Soto</p>
          </div>
          <button type="button" className="btn btn-volver-tienda">Ver resumen</button>
        </article>

        <article className="registro-cita">
          <div className="registro-fecha"><strong>04</strong><span>AGO</span></div>
          <div>
            <span className="registro-estado registro-realizada">Realizada</span>
            <h2>Control general · Milo</h2>
            <p>16:00 hrs · Dr. Martín Rojas</p>
          </div>
          <button type="button" className="btn btn-volver-tienda">Ver resumen</button>
        </article>
      </section>
    </main>
  );
}
