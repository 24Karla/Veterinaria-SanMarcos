export interface PublicacionBlog {
  id: number;
  titulo: string;
  resumen: string;
  autor: string;
  fecha: string;
  categoria: string;
  imagen: string;
  contenido?: string;
}

interface CardBlogProps {
  post: PublicacionBlog;
  onSelectPost?: (post: PublicacionBlog) => void;
}

export default function CardBlog({ post, onSelectPost }: CardBlogProps) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 text-start bg-white overflow-hidden">
      <img
        src={post.imagen}
        alt={post.titulo}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span
              className="badge text-dark fw-bold"
              style={{ backgroundColor: '#e8c746' }}
            >
              {post.categoria}
            </span>
            <small className="text-muted">{post.fecha}</small>
          </div>

          <h5 className="card-title fw-bold text-dark mb-2">{post.titulo}</h5>
          <p className="card-text text-muted small mb-3">{post.resumen}</p>
        </div>

        <div className="pt-3 border-top d-flex justify-content-between align-items-center">
          <small className="text-muted fw-bold">Por {post.autor}</small>
          {onSelectPost ? (
            <button
              onClick={() => onSelectPost(post)}
              className="btn btn-sm text-dark fw-bold"
              style={{ backgroundColor: '#e8c746' }}
            >
              Leer más
            </button>
          ) : (
            <a
              href={`#post-${post.id}`}
              className="btn btn-sm text-dark fw-bold"
              style={{ backgroundColor: '#e8c746' }}
            >
              Leer más
            </a>
          )}
        </div>
      </div>
    </div>
  );
}