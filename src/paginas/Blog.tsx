import { useState } from 'react';
import ListaBlog from '../componentes/organismos/ListaBlog';
import type { PublicacionBlog } from '../componentes/organismos/CardBlog';

export default function Blog() {
  const [postSeleccionado, setPostSeleccionado] = useState<PublicacionBlog | null>(null);

  return (
    <section className="container my-4 px-3 text-start">
      {postSeleccionado ? (
        <div className="detalle-blog bg-white p-4 p-md-5 rounded-3 shadow-sm border">
          <div className="detalle-blog-imagen">
            <img
              src={postSeleccionado.imagen}
              alt={postSeleccionado.titulo}
              className="rounded-3 imagen-blog-detalle"
            />
          </div>

          <div className="detalle-blog-contenido">
            <button
              onClick={() => setPostSeleccionado(null)}
              className="btn btn-outline-dark btn-sm mb-4 fw-bold"
            >
              ← Volver al Blog
            </button>

            <div className="mb-3">
              <span className="badge etiqueta-categoria fw-bold">
                {postSeleccionado.categoria}
              </span>
            </div>

            <h1 className="fw-bold texto-marca mb-3">{postSeleccionado.titulo}</h1>

            <div className="d-flex align-items-center text-muted mb-4 small">
              <span className="me-3">Por <strong>{postSeleccionado.autor}</strong></span>
              <span>Fecha: {postSeleccionado.fecha}</span>
            </div>

            <div className="fs-5 text-secondary leading-relaxed">
              <p className="fw-bold texto-marca mb-3">{postSeleccionado.resumen}</p>
              <p>
                {postSeleccionado.contenido}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="fw-bold texto-marca">Blog de Salud y Cuidados Vet</h2>
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
