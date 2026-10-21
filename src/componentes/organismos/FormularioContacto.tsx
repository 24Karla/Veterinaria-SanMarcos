import { useState } from "react";
import CampoTexto from "../moleculas/CampoTexto";
import CampoAreaTexto from "../moleculas/CampoAreaTexto";

function FormularioContacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("Consulta General");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nombre.trim() === "") {
      alert("Debe ingresar su nombre completo");
      return;
    }

    if (correo.trim() === "") {
      alert("Debe ingresar su correo electrónico");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert("Ingrese un correo válido");
      return;
    }

    if (mensaje.trim() === "") {
      alert("Debe escribir un mensaje");
      return;
    }

    alert("Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.");

    setNombre("");
    setCorreo("");
    setTelefono("");
    setAsunto("Consulta General");
    setMensaje("");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate className="p-4 rounded shadow-sm bg-white">
      <h3 className="mb-3 text-start fw-bold">Envíanos un mensaje</h3>

      <CampoTexto
        etiqueta="Nombre completo"
        tipo="text"
        nombre="nombre"
        valor={nombre}
        alCambiar={setNombre}
      />

      <CampoTexto
        etiqueta="Correo electrónico"
        tipo="email"
        nombre="correo"
        valor={correo}
        alCambiar={setCorreo}
      />

      <CampoTexto
        etiqueta="Teléfono de contacto"
        tipo="tel"
        nombre="telefono"
        valor={telefono}
        alCambiar={setTelefono}
      />

      <div className="mb-3 text-start">
        <label className="form-label">Asunto</label>
        <select
          className="form-select"
          name="asunto"
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
        etiqueta="Mensaje"
        nombre="mensaje"
        valor={mensaje}
        filas={5}
        alCambiar={setMensaje}
      />

      <button
        type="submit"
        className="btn text-dark fw-bold w-100 mt-2"
        style={{ backgroundColor: "#e8c746", borderColor: "#e8c746" }}
      >
        Enviar Mensaje
      </button>
    </form>
  );
}

export default FormularioContacto;