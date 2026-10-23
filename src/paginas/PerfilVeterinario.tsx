import { Link } from 'react-router-dom';

interface PerfilVeterinarioProps {
  sesion: { nombre: string; correo: string };
}

export default function PerfilVeterinario({ sesion }: PerfilVeterinarioProps) {
  return (
    <main className="container panel-perfil">
      <header className="perfil-encabezado">
        <span className="perfil-etiqueta">PANEL VETERINARIO</span>
        <h1>Agenda de {sesion.nombre}</h1>
        <p>Revisa tus atenciones, recetas emitidas e historial clínico.</p>
      </header>

      <section className="perfil-grid">
        <article className="perfil-tarjeta perfil-tarjeta-destacada">
          <div>
            <h2>Mi jornada</h2>
            <p><strong>5</strong> citas agendadas para hoy</p>
            <p>Próxima atención: 11:00 hrs</p>
          </div>
          <Link className="btn btn-tienda" to="/perfil/veterinario/agenda">Ver agenda</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Citas agendadas</h2></div>
          <div className="perfil-lista">
            <div><strong>11:00 · Luna Morales</strong><span>Consulta general · Golden Retriever</span></div>
            <div><strong>12:30 · Tomás Silva</strong><span>Control postoperatorio · Gato</span></div>
            <div><strong>16:00 · Bruno Pérez</strong><span>Vacunación · Mestizo</span></div>
          </div>
          <Link className="btn btn-volver-tienda" to="/perfil/veterinario/agenda">Ver agenda completa</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Recetas emitidas</h2></div>
          <div className="perfil-lista">
            <div><strong>Amoxicilina 250 mg</strong><span>Luna Morales · Emitida hoy</span></div>
            <div><strong>Meloxicam 1 mg</strong><span>Rocky Fuentes · 20 de octubre</span></div>
          </div>
          <Link className="btn btn-volver-tienda" to="/perfil/veterinario/recetas">Gestionar recetas</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Historial clínico</h2></div>
          <p className="perfil-texto">Consulta los controles, diagnósticos y tratamientos de los pacientes atendidos.</p>
          <Link className="btn btn-volver-tienda" to="/perfil/veterinario/historial">Buscar paciente</Link>
        </article>
      </section>
    </main>
  );
}
