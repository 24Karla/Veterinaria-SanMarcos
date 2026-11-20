import FormularioContacto from '../componentes/organismos/FormularioContacto';

export default function PaginaContacto() {
  return (
    <section className="container my-4 px-3">
      <div className="text-start mb-4">
        <h2 className="fw-bold text-dark">Contacto - Veterinaria San Marcos</h2>
        <p className="text-muted">
          Estamos ubicados en Rancagua. Contáctanos si tienes consultas o necesitas atención médica para tu mascota.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {/* Información de Atención */}
        <div className="col-lg-5">
          <div
            className="p-4 rounded-3 text-white h-100 d-flex flex-column justify-content-between shadow-sm text-start"
            style={{ backgroundColor: '#2b4c3f' }}
          >
            <div>
              <h3 className="mb-4 text-white fw-bold">Información de Atención</h3>

              <div className="mb-3">
                <strong>📍 Ubicación:</strong>
                <p className="mb-0 text-white-50">Av. Brasil 2140, Rancagua</p>
              </div>

              <div className="mb-3">
                <strong>📞 Teléfono:</strong>
                <p className="mb-0 text-white-50">+56 9 1234 5678</p>
              </div>

              <div className="mb-3">
                <strong>✉️ Correo electrónico:</strong>
                <p className="mb-0 text-white-50">contacto@veterinariasanmarcos.cl</p>
              </div>

              <div className="mb-3">
                <strong>⏰ Horarios:</strong>
                <p className="mb-1 text-white-50">Lunes a Viernes: 13:30 - 19:30 hrs</p>
                <p className="mb-0 text-white-50">Sábados: 09:00 - 13:00 hrs</p>
              </div>
            </div>

            <div className="pt-3 border-top border-white-50">
              <small className="text-white-50">Atención médica para Perros, Gatos, Conejos y Aves.</small>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <FormularioContacto />
        </div>
      </div>

      {/* Mapa de Ubicación */}
      <div className="row">
        <div className="col-12 text-start mb-3">
          <h3 className="fw-bold text-dark">Nuestra Ubicación</h3>
          <p className="text-muted">Encuéntranos en Rancagua</p>
        </div>
        <div className="col-12">
          <div className="rounded-3 overflow-hidden shadow-sm border" style={{ height: '350px' }}>
            <iframe
              title="Ubicación Veterinaria San Marcos"
              src="https://maps.google.com/maps?q=-34.17013,-70.74312&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
