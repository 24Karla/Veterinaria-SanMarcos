export interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  especialidad: string;
  experiencia: string;
  bio: string;
  imagen: string;
}

interface CardEquipoProps {
  miembro: MiembroEquipo;
}

export default function CardEquipo({ miembro }: CardEquipoProps) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 text-start bg-white overflow-hidden">
      <img
        src={miembro.imagen}
        alt={miembro.nombre}
        className="card-img-top"
        style={{ height: '260px', objectFit: 'cover' }}
      />
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <span
            className="badge text-dark fw-bold mb-2"
            style={{ backgroundColor: '#e8c746' }}
          >
            {miembro.especialidad}
          </span>
          <h4 className="card-title fw-bold text-dark mb-1">{miembro.nombre}</h4>
          <p className="text-muted small fw-semibold mb-3">{miembro.cargo}</p>
          <p className="card-text text-muted small">{miembro.bio}</p>
        </div>

        <div className="pt-3 border-top mt-3">
          <small className="text-secondary">
            <strong>Experiencia:</strong> {miembro.experiencia}
          </small>
        </div>
      </div>
    </div>
  );
}