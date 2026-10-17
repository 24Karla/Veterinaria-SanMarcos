import CampoSesion from "../moleculas/CampoSesion";
import { useState } from "react";

function FormularioSesion(){
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    const manejarEnvio = (e: React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault();

        if(correo.trim() === ""){
            alert("Debe ingresar su correo");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){
            alert("Ingrese un correo válido");
            return;
        }
        if (contrasena.trim()===""){
            alert("Debe ingresar una contraseña");
            return;
        }
        alert("Inicio de sesión completado")
    };
    return (
        <form onSubmit={manejarEnvio} noValidate>
            <CampoSesion
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
                valor={correo}
                alCambiar={setCorreo}
            />
            <CampoSesion
                etiqueta="Contraseña"
                tipo="password"
                nombre="contraseña"
                valor={contrasena}
                alCambiar={setContrasena}
            />

            <button type="submit" className="btn btn-primary" style={{backgroundColor: "#d99a3e"}}>
                Ingresar
            </button>

        </form>
    );
}
export default FormularioSesion;