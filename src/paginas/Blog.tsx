import { useState } from 'react';
import ListaBlog from '../componentes/organismos/ListaBlog';
import type { PublicacionBlog } from '../componentes/organismos/CardBlog';

export default function Blog() {
  const [postSeleccionado, setPostSeleccionado] = useState<PublicacionBlog | null>(null);

  return (
    <section className="container my-4 px-3 text-start">
      {postSeleccionado ? (
        <div className="bg-white p-4 p-md-5 rounded-3 shadow-sm border">
          <button
            onClick={() => setPostSeleccionado(null)}
            className="btn btn-outline-dark btn-sm mb-4 fw-bold"
          >
            ← Volver al Blog
          </button>

          <span
            className="badge text-dark fw-bold mb-2 d-inline-block"
            style={{ backgroundColor: '#e8c746' }}
          >
            {postSeleccionado.categoria}
          </span>

          <h1 className="fw-bold text-dark mb-3">{postSeleccionado.titulo}</h1>

          <div className="d-flex align-items-center text-muted mb-4 small">
            <span className="me-3">✍️ Por <strong>{postSeleccionado.autor}</strong></span>
            <span>📅 {postSeleccionado.fecha}</span>
          </div>

          <img
            src={postSeleccionado.imagen}
            alt={postSeleccionado.titulo}
            className="img-fluid rounded-3 mb-4 w-100"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />

          <div className="fs-5 text-secondary leading-relaxed">
            <p className="fw-bold text-dark mb-3">{postSeleccionado.resumen}</p>
            <p>
              En la Veterinaria San Marcos nos preocupamos día a día por la salud y bienestar de tus mascotas.
              Mantener sus chequeos al día, asegurar una correcta nutrición y reaccionar a tiempo ante cualquier síntoma
              anormal son los pilares clave para una vida larga y feliz.
            </p>
            <p>
              Si tienes dudas específicas sobre este tema o deseas agendar una consulta médica, nuestro equipo de especialistas
              está siempre disponible para atenderte en nuestra clínica.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="fw-bold text-dark">Blog de Salud y Cuidados Vet</h2>
            <p className="text-muted">
              Consejos, artículos y novedades preparados por nuestros médicos veterinarios.
            </p>
          </div>

          <ListaBlog onSelectPost={(post) => setPostSeleccionado(post)} />
        </>
      )}
    </section>
  );
}