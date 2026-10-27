import { useState } from 'react';
import CampoTexto from '../moleculas/CampoTexto';
import CampoAreaTexto from '../moleculas/CampoAreaTexto';
import { esCorreoValido, esTelefonoValido } from '../moleculas/validacionesContacto';

export default function FormularioContacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('Consulta General');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      alert('Por favor completa los campos obligatorios (*)');
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

  if (enviado) {
    return (
      <div className="alert alert-success text-center p-4 rounded-3 shadow-sm border-0">
        <h4 className="fw-bold">¡Mensaje enviado con éxito!</h4>
        <p className="mb-3">
          Gracias por escribir a <strong>Veterinaria San Marcos</strong>. Te responderemos a la brevedad.
        </p>
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
    );
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="card p-4 shadow-sm border-0 text-start bg-white rounded-3">
      <h3 className="mb-3 texto-marca fw-bold">Envíanos un mensaje</h3>

      <CampoTexto
        etiqueta="Nombre completo *"
        nombre="nombre"
        valor={nombre}
        alCambiar={setNombre}
        placeholder="Ej: María González"
      />

      <div className="row">
        <div className="col-md-6">
          <CampoTexto
            etiqueta="Correo electrónico *"
            tipo="email"
            nombre="correo"
            valor={correo}
            alCambiar={setCorreo}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="col-md-6">
          <CampoTexto
            etiqueta="Teléfono"
            tipo="tel"
            nombre="telefono"
            valor={telefono}
            alCambiar={setTelefono}
            placeholder="+56 9 1234 5678"
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
        placeholder="Escribe tu consulta aquí..."
      />

      <button
        type="submit"
        className="btn btn-tienda w-100 mt-2 py-2"
      >
        Enviar Mensaje
      </button>
    </form>
  );
}
