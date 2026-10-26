export interface ArticuloBlog {
  id: number;
  titulo: string;
  resumen: string;
  fecha: string;
  categoria: string;
  imagen: string;
  autor: string;
}

interface CardBlogProps {
  articulo: ArticuloBlog;
}

export default function CardBlog({ articulo }: CardBlogProps) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 text-start bg-white overflow-hidden">
      <img
        src={articulo.imagen}
        alt={articulo.titulo}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="badge text-dark fw-bold"
              style={{ backgroundColor: '#e8c746' }}
            >
              {articulo.categoria}
            </span>
            <small className="text-muted">{articulo.fecha}</small>
          </div>

          <h4 className="card-title fw-bold text-dark mb-2">{articulo.titulo}</h4>
          <p className="card-text text-muted small mb-3">{articulo.resumen}</p>
        </div>

        <div className="pt-3 border-top d-flex justify-content-between align-items-center">
          <small className="text-muted">Por <strong>{articulo.autor}</strong></small>
          <button className="btn btn-sm btn-outline-dark fw-bold">
            Leer más
          </button>
        </div>
      </div>
    </div>
  );
}