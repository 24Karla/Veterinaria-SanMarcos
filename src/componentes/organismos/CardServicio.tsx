export interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  precio: string;
  duracion: string;
  categoria: string;
  imagen: string;
}

interface CardServicioProps {
  servicio: Servicio;
}

export default function CardServicio({ servicio }: CardServicioProps) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 text-start bg-white overflow-hidden">
      <img
        src={servicio.imagen}
        alt={servicio.titulo}
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
              {servicio.categoria}
            </span>
            <small className="text-muted">⏱️ {servicio.duracion}</small>
          </div>

          <h4 className="card-title fw-bold text-dark mb-2">{servicio.titulo}</h4>
          <p className="card-text text-muted small mb-3">{servicio.descripcion}</p>
        </div>

        <div className="pt-3 border-top d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5 text-dark">{servicio.precio}</span>
          <a
            href="/tienda?pagina=cita"
            className="btn btn-sm text-dark fw-bold"
            style={{ backgroundColor: '#e8c746' }}
          >
            Reservar hora
          </a>
        </div>
      </div>
    </div>
  );
}