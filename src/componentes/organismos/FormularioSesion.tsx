import { useState, type FormEvent } from 'react';
import CampoSesion from '../moleculas/CampoSesion';
import type { SesionUsuario } from './PerfilProtegido';
import { api, pedirDatos, mensajeError } from '../../servicios/api';

interface Props {
    onLogin: (sesion: SesionUsuario) => void;
}

export default function FormularioSesion({ onLogin }: Props) {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [registrando, setRegistrando] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    async function manejarEnvio(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (enviando) return;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) || !contrasena.trim()) {
            setError('Ingresa un correo válido y tu contraseña.');
            return;
        }
        if (registrando && !nombre.trim()) {
            setError('Ingresa tu nombre.');
            return;
        }

        setError('');
        setEnviando(true);
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
            }
            const sesion = await pedirDatos<SesionUsuario>(
                `${api.usuarios}/registro/login`,
                {
                    method: 'POST',
                    body: JSON.stringify({ correo: correo.trim(), password: contrasena }),
                },
            );
            onLogin(sesion);
        } catch (error) {
            setError(mensajeError(error));
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
            {error && (
                <p role="alert" className="alert alert-danger">
                    {error}
                </p>
            )}
            <button type="submit" className="btn btn-tienda w-100" disabled={enviando}>
                {enviando ? 'Conectando…' : registrando ? 'Crear cuenta' : 'Ingresar'}
            </button>
            <div className="sesion-alternativa">
                <span>o</span>
                <button
                    type="button"
                    className="sesion-cambiar-modo"
                    disabled={enviando}
                    onClick={() => {
                        setRegistrando(!registrando);
                        setError('');
                    }}
                >
                    {registrando ? 'Ingresar' : 'Crear cuenta'}
                </button>
            </div>
        </form>
    );
}
