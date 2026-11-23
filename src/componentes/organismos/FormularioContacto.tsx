import { useState } from 'react';
import CampoTexto from '../moleculas/CampoTexto';
import CampoAreaTexto from '../moleculas/CampoAreaTexto';
import { api } from '../../servicios/api';

const urlContactos = import.meta.env.VITE_CONTACTOS_URL || `${api.mensajeria}/api/contactos`;

function esCorreoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function esTelefonoValido(telefono: string) {
    return telefono.trim() === '' ||
        /^(?:\+?56)?9[0-9]{8}$/.test(telefono.trim());
}



export default function FormularioContacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('Consulta General');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enviando) return;
    setErrorEnvio('');

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }

    if (!esCorreoValido(correo)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!esTelefonoValido(telefono)) {
      alert('El formato del telefono es de 9 digitos');
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(urlContactos, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: nombre.trim(),
          correo: correo.trim(),
          telefono: telefono.trim(),
          asunto,
          mensaje: mensaje.trim(),
        }),
      });

      if (respuesta.status === 400) {
        alert('Revisa el formato y la longitud de los datos antes de volver a enviar.');
        return;
      }
      if (!respuesta.ok) {
        throw new Error('No se pudo guardar el contacto.');
      }

      setEnviado(true);
    } catch {
      setErrorEnvio('No pudimos confirmar el envío. Inténtalo de nuevo en unos minutos.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="alert alert-success text-center p-4 rounded-3 shadow-sm border-0 h-100 d-flex flex-column justify-content-center">
        <h4 className="fw-bold">¡Mensaje enviado con éxito!</h4>
        <p className="mb-3">
          Gracias por escribir a <strong>Veterinaria San Marcos</strong>. Te responderemos a la brevedad.
        </p>
        <button
          type="button"
          className="btn btn-tienda align-self-center"
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
            placeholder="+56912345678"
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

      {errorEnvio && <p className="alert alert-danger mb-2" role="alert">{errorEnvio}</p>}

      <button
        type="submit"
        className="btn btn-tienda w-100 mt-2 py-2"
        disabled={enviando}
      >
        {enviando ? 'Enviando…' : 'Enviar Mensaje'}
      </button>
    </form>
  );
}
