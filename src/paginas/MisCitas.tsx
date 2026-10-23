import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MisCitas() {
  const [citaAbierta, setCitaAbierta] = useState('');

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
          <button type="button" className="btn btn-tienda" onClick={() => setCitaAbierta(citaAbierta === 'luna' ? '' : 'luna')}>
            {citaAbierta === 'luna' ? 'Ocultar detalle' : 'Ver detalle'}
          </button>
          {citaAbierta === 'luna' && (
            <div className="registro-detalle">
              <strong>Consulta general de Luna</strong>
              <span>28 de octubre · 11:00 hrs · Dr. Martín Rojas · Sala 2</span>
            </div>
          )}
        </article>

        <article className="registro-cita">
          <div className="registro-fecha"><strong>12</strong><span>SEP</span></div>
          <div>
            <span className="registro-estado registro-realizada">Realizada</span>
            <h2>Vacunación anual · Luna</h2>
            <p>10:30 hrs · Dra. Fernanda Soto</p>
          </div>
          <button type="button" className="btn btn-volver-tienda" onClick={() => setCitaAbierta(citaAbierta === 'vacuna' ? '' : 'vacuna')}>
            {citaAbierta === 'vacuna' ? 'Ocultar resumen' : 'Ver resumen'}
          </button>
          {citaAbierta === 'vacuna' && (
            <div className="registro-detalle">
              <strong>Vacunación anual de Luna</strong>
              <span>Atención realizada el 12 de septiembre a las 10:30 hrs.</span>
            </div>
          )}
        </article>

        <article className="registro-cita">
          <div className="registro-fecha"><strong>04</strong><span>AGO</span></div>
          <div>
            <span className="registro-estado registro-realizada">Realizada</span>
            <h2>Control general · Milo</h2>
            <p>16:00 hrs · Dr. Martín Rojas</p>
          </div>
          <button type="button" className="btn btn-volver-tienda" onClick={() => setCitaAbierta(citaAbierta === 'milo' ? '' : 'milo')}>
            {citaAbierta === 'milo' ? 'Ocultar resumen' : 'Ver resumen'}
          </button>
          {citaAbierta === 'milo' && (
            <div className="registro-detalle">
              <strong>Control general de Milo</strong>
              <span>Atención realizada el 4 de agosto a las 16:00 hrs.</span>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
