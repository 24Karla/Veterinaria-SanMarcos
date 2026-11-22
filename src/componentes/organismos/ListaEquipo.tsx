import { useEffect, useState } from 'react';
import CardEquipo from './CardEquipo';
import EstadoApi from '../moleculas/EstadoApi';
import { api, pedirDatos, mensajeError, type UsuarioApi } from '../../servicios/api';

export interface MiembroEquipo {
    id: number;
    nombre: string;
    cargo: string;
    especialidad: string;
    experiencia: string;
    bio: string;
    imagen: string;
}

export default function ListaEquipo() {
    const [equipo, setEquipo] = useState<MiembroEquipo[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro/equipo`)
            .then((usuarios) =>
                setEquipo(
                    usuarios.map((usuario) => ({
                        id: usuario.id,
                        nombre: usuario.nombre,
                        cargo: 'Médico veterinario',
                        especialidad: usuario.especialidad || 'Medicina veterinaria',
                        experiencia: usuario.experiencia || '',
                        bio: usuario.bio || '',
                        imagen: usuario.imagen || '/img/veterinaria1.jpg',
                    })),
                ),
            )
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    return (
        <>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && equipo.length === 0 && (
                <p>Aún no hay veterinarios registrados en el equipo.</p>
            )}
            <div className="row g-4">
                {equipo.map((miembro) => (
                    <div key={miembro.id} className="col-md-4">
                        <CardEquipo miembro={miembro} />
                    </div>
                ))}
            </div>
        </>
    );
}
