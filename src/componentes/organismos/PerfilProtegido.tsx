
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export type RolUsuario =
    | 'cliente'
    | 'veterinario'
    | 'administrador';

export interface SesionUsuario {
    nombre: string;
    correo: string;
    rol: RolUsuario;
}

const rutasPerfil = {
    cliente: '/perfil/cliente',
    veterinario: '/perfil/veterinario',
    administrador: '/perfil/administrador',
};

interface PerfilProtegidoProps {
    sesion: SesionUsuario | null;
    rol: RolUsuario;
    children: (sesion: SesionUsuario) => ReactNode;
}

export default function PerfilProtegido({
    sesion,
    rol,
    children,
}: PerfilProtegidoProps) {
    if (!sesion) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (sesion.rol !== rol) {
        return (
            <Navigate
                to={rutasPerfil[sesion.rol]}
                replace
            />
        );
    }

    return <>{children(sesion)}</>;
}

export { rutasPerfil };
