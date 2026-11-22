import { useEffect, useState, type FormEvent } from 'react';
import CampoSesion from '../moleculas/CampoSesion';
import type { SesionUsuario } from './PerfilProtegido';
import { api, mostrarErrorFormulario, pedirDatos } from '../../servicios/api';

interface Props {
    onLogin: (sesion: SesionUsuario) => void;
    crearCuenta?: boolean;
}

export default function FormularioSesion({ onLogin, crearCuenta = false }: Props) {
    const [correo, setCorreo] = useState(
        () => localStorage.getItem('correo-recordado') || '',
    );
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [recordar, setRecordar] = useState(false);
    const [registrando, setRegistrando] = useState(crearCuenta);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [cuentaCreada, setCuentaCreada] = useState(false);
    const [sesionPendiente, setSesionPendiente] = useState<SesionUsuario | null>(null);
    const ocupado = enviando || sesionPendiente !== null;

    useEffect(() => {
        if (!sesionPendiente) return;

        const redireccion = window.setTimeout(() => onLogin(sesionPendiente), 2000);
        return () => window.clearTimeout(redireccion);
    }, [onLogin, sesionPendiente]);

    async function manejarEnvio(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) || !contrasena.trim()) {
            alert('Ingresa un correo válido y tu contraseña.');
            return;
        }
        if (registrando && !nombre.trim()) {
            alert('Ingresa tu nombre.');
            return;
        }

        setError('');
        setCuentaCreada(false);
        setEnviando(true);
        let registroCompletado = false;
        try {
            if (registrando) {
                await pedirDatos(`${api.usuarios}/registro/cliente`, {
                    method: 'POST',
                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        email: correo.trim(),
                        password: contrasena,
                        rol: 'CLIENTE',
                    }),
                });
                registroCompletado = true;
                setCuentaCreada(true);
            }
            const sesion = await pedirDatos<SesionUsuario>(
                `${api.usuarios}/registro/login`,
                {
                    method: 'POST',
                    body: JSON.stringify({ correo: correo.trim(), password: contrasena }),
                },
            );
            if (recordar) localStorage.setItem('correo-recordado', correo.trim());
            else localStorage.removeItem('correo-recordado');
            if (registroCompletado) {
                setSesionPendiente(sesion);
            } else {
                onLogin(sesion);
            }
        } catch (error) {
            if (registroCompletado) setRegistrando(false);
            mostrarErrorFormulario(error, setError);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <h2 className="titulo-login mb-4">
                {registrando ? 'Crear cuenta' : 'Ingresar'}
            </h2>
            {registrando && (
                <CampoSesion
                    etiqueta="Nombre"
                    tipo="text"
                    nombre="nombre"
                    valor={nombre}
                    alCambiar={setNombre}
                />
            )}
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
            {cuentaCreada && (
                <p role="status" className="alert alert-success">
                    Cuenta creada con éxito
                </p>
            )}
            {error && (
                <p role="alert" className="alert alert-danger">
                    {error}
                </p>
            )}
            {!registrando && (
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="mantenerCuenta"
                        checked={recordar}
                        onChange={(event) => setRecordar(event.target.checked)}
                        style={{
                            backgroundColor: recordar ? '#e8c746' : '#fff',
                            borderColor: recordar ? '#e8c746' : '#ced4da',
                        }}
                    />
                    <label className="form-check-label" htmlFor="mantenerCuenta">
                        Recordar cuenta
                    </label>
                </div>
            )}
            <button type="submit" className="btn btn-tienda w-100" disabled={ocupado}>
                {sesionPendiente ? 'Abriendo tu perfil…' : enviando ? 'Conectando…' : registrando ? 'Crear cuenta' : 'Ingresar'}
            </button>
            <div className="sesion-alternativa">
                <span>o</span>
                <button
                    type="button"
                    className="sesion-cambiar-modo"
                    disabled={ocupado}
                    onClick={() => {
                        setRegistrando(!registrando);
                        setError('');
                        setCuentaCreada(false);
                    }}
                >
                    {registrando ? 'Ingresar' : 'Crear cuenta'}
                </button>
            </div>
        </form>
    );
}
