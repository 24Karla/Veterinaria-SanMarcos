import { useState } from 'react';
import Boton from '../atomos/Boton';

export interface Servicio {
  codigo: string;
  categoria: string;
  nombre: string;
  especie: string;
  duracionAprox: string;
  precio?: number;
  imagen?: string;
}

interface CardServicioProps {
  servicio: Servicio;
  onAgendar: (servicio: Servicio) => void;
  onVerDetalle: (servicio: Servicio) => void;
}

export default function CardServicio({
  servicio,
  onAgendar,
  onVerDetalle,
}: CardServicioProps) {
  // Manejo de fallback por si la imagen falla al cargar
  const [errorImagen, setErrorImagen] = useState(false);

  const precioFormateado = servicio.precio
    ? new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
      }).format(servicio.precio)
    : 'Consultar precio';

  // Si falla la imagen, usa una imagen por defecto de placeholder
  const imagenSrc = errorImagen || !servicio.imagen
    ? 'https://via.placeholder.com/400x200?text=Veterinaria+San+Marcos'
    : servicio.imagen;

  return (
    <article className="card h-100 shadow-sm border-0 overflow-hidden">
      <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={imagenSrc}
          alt={servicio.nombre}
          className="card-img-top w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={() => setErrorImagen(true)}
        />
      </div>

      <div className="card-body d-flex flex-column text-start p-3">
        <span className="badge bg-primary text-uppercase mb-2 align-self-start" style={{ fontSize: '0.75rem' }}>
          {servicio.categoria}
        </span>
        
        <h3 className="card-title h5 fw-bold mb-2 text-dark">{servicio.nombre}</h3>
        
        <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
          <strong>Especie:</strong> {servicio.especie}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top mb-3">
          <span className="badge bg-light text-dark border">
            ⏱️ {servicio.duracionAprox}
          </span>
          <strong className="text-success fw-bold">{precioFormateado}</strong>
        </div>

        <div className="d-flex flex-column gap-2">
          <Boton
            texto="Ver detalle"
            type="button"
            className="btn btn-outline-secondary w-100 btn-sm"
            onClick={() => onVerDetalle(servicio)}
          />

          <Boton
            texto="Agendar hora"
            type="button"
            className="btn btn-warning text-dark fw-bold w-100 btn-sm"
            onClick={() => onAgendar(servicio)}
          />
        </div>
      </div>
    </article>
  );
}