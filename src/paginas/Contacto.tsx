import { useState } from 'react';
import CampoTexto from '../componentes/moleculas/CampoTexto';
import CampoAreaTexto from '../componentes/moleculas/CampoAreaTexto';
import { esCorreoValido, esTelefonoValido } from '../componentes/moleculas/validacionesContacto';

export default function PaginaContacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('Consulta General');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      alert('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    if (!esCorreoValido(correo)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!esTelefonoValido(telefono)) {
      alert('El teléfono solo puede contener números y un + inicial');
      return;
    }

    setEnviado(true);
  };

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

        {/* Formulario de Contacto integrado */}
        <div className="col-lg-7">
          {enviado ? (
            <div className="alert alert-success text-center p-4 rounded-3 shadow-sm border-0 h-100 d-flex flex-column justify-content-center">
              <h4 className="fw-bold">¡Mensaje enviado con éxito!</h4>
              <p className="mb-3">
                Gracias por escribir a <strong>Veterinaria San Marcos</strong>. Te responderemos a la brevedad.
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-tienda"
                  onClick={() => {
                    setNombre('');
                    setCorreo('');
                    setTelefono('');
                    setMensaje('');
                    setEnviado(false);
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={manejarEnvio} noValidate className="card p-4 shadow-sm border-0 text-start bg-white rounded-3">
              <h3 className="mb-3 texto-marca fw-bold">Envíanos un mensaje</h3>

              <CampoTexto
                etiqueta="Nombre completo *"
                nombre="nombre"
                valor={nombre}
                alCambiar={setNombre}
              />

              <div className="row">
                <div className="col-md-6">
                  <CampoTexto
                    etiqueta="Correo electrónico *"
                    tipo="email"
                    nombre="correo"
                    valor={correo}
                    alCambiar={setCorreo}
                  />
                </div>

                <div className="col-md-6">
                  <CampoTexto
                    etiqueta="Teléfono"
                    tipo="tel"
                    nombre="telefono"
                    valor={telefono}
                    alCambiar={setTelefono}
                  />
                </div>
              </div>

              <div className="mb-3 text-start">
                <label className="form-label fw-bold">Asunto</label>
                <select
                  className="form-select"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                >
                  <option value="Consulta General">Consulta General</option>
                  <option value="Solicitud de Cita">Solicitud de Cita</option>
                  <option value="Historial y Vacunas">Historial y Vacunas</option>
                  <option value="Urgencia Veterinaria">Urgencia Veterinaria</option>
                </select>
              </div>

              <CampoAreaTexto
                etiqueta="Mensaje / Consulta *"
                nombre="mensaje"
                valor={mensaje}
                filas={4}
                alCambiar={setMensaje}
              />

              <button
                type="submit"
                className="btn btn-tienda w-100 mt-2 py-2"
              >
                Enviar Mensaje
              </button>
            </form>
          )}
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
