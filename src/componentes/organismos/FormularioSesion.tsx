import CampoSesion from "../moleculas/CampoSesion";
import { useState } from "react";

interface FormularioSesionProps {
    onLogin: (sesion: {
        nombre: string;
        correo: string;
        rol: 'cliente' | 'veterinario' | 'administrador';
    }) => void;
}

function FormularioSesion({ onLogin }: FormularioSesionProps){
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [recordar, setRecordar] = useState(false);
    const [error, setError] = useState("");

    const manejarEnvio = (e: React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault();

        if(correo.trim() === ""){
            setError("Debe ingresar su correo.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){
            setError("Ingresa un correo válido.");
            return;
        }
        if (contrasena.trim()===""){
            setError("Debe ingresar una contraseña.");
            return;
        }

        const cuentas = {
            'sofia@gmail.com': { nombre: 'Sofía', rol: 'cliente' as const },
            'fabian@vetsanmarcos.cl': { nombre: 'Fabián', rol: 'veterinario' as const },
            'admin@vetsanmarcos.cl': { nombre: 'Administrador', rol: 'administrador' as const },
        };
        const cuenta = cuentas[correo.trim().toLowerCase() as keyof typeof cuentas];

        if (!cuenta || contrasena !== '1234') {
            setError('El correo o la contraseña no corresponden a una cuenta de prueba.');
            return;
        }

        setError("");
        onLogin({ nombre: cuenta.nombre, correo: correo.trim().toLowerCase(), rol: cuenta.rol });
    };
    return (
        <form onSubmit={manejarEnvio} noValidate>
            {error && <div className="alert alert-warning" role="alert">{error}</div>}

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
            <section className="cuentas-prueba" aria-label="Cuentas de prueba">
                <h3>Ingresa con una de estas cuentas</h3>
                <p><strong>Cliente:</strong> sofia@gmail.com <span>· Clave: 1234</span></p>
                <p><strong>Veterinario:</strong> fabian@vetsanmarcos.cl <span>· Clave: 1234</span></p>
                <p><strong>Administrador:</strong> admin@vetsanmarcos.cl <span>· Clave: 1234</span></p>
            </section>
            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="mantenerCuenta"
                    checked={recordar}
                    onChange={(e) => setRecordar(e.target.checked)}
                    style={{backgroundColor: recordar ? "#e8c746" : "#fff", borderColor: recordar ? "#e8c746" : "#ced4da",}}
                />
                <label className="form-check-label" htmlFor="mantenerCuenta">
                    Recordar cuenta
                </label>
            </div>

            <button type="submit" className="btn btn-tienda w-100">
                Ingresar
            </button>


        </form>
    );
}
export default FormularioSesion;
