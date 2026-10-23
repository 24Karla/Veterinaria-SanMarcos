import { Link } from 'react-router-dom';

export default function HistorialCliente() {
  return (
    <main className="container panel-perfil">
      <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
        ← Volver a mi perfil
      </Link>

      <header className="perfil-encabezado">
        <span className="perfil-etiqueta">PORTAL CLIENTE</span>
        <h1>Historial veterinario</h1>
        <p>Consulta las atenciones, vacunas y tratamientos de tus mascotas.</p>
      </header>

      <section className="historial-mascotas">
        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Luna · Golden Retriever</h2></div>
          <div className="perfil-lista">
            <div><strong>12 de septiembre de 2026 · Vacunación anual</strong><span>Vacuna óctuple y antirrábica. Próximo control: septiembre de 2027.</span></div>
            <div><strong>15 de junio de 2026 · Consulta general</strong><span>Control preventivo, peso 24,5 kg y condición general saludable.</span></div>
            <div><strong>4 de marzo de 2026 · Desparasitación</strong><span>Tratamiento oral indicado por la Dra. Fernanda Soto.</span></div>
          </div>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Milo · Gato mestizo</h2></div>
          <div className="perfil-lista">
            <div><strong>4 de agosto de 2026 · Control general</strong><span>Examen clínico sin observaciones. Próximo control en seis meses.</span></div>
            <div><strong>22 de abril de 2026 · Vacunación triple felina</strong><span>Vacuna aplicada correctamente, sin reacciones adversas.</span></div>
          </div>
        </article>
      </section>
    </main>
  );
}
