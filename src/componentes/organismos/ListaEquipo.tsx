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

const equipoOriginal: MiembroEquipo[] = [
    {
        id: 1,
        nombre: 'Dra. María Paz Fernández',
        cargo: 'Médico Veterinario Directora',
        especialidad: 'Medicina General y Cirugía',
        experiencia: '12 años',
        bio: 'Especialista en medicina interna y cirugía de animales de compañía.',
        imagen: '/img/veterinaria1.jpg',
    },
    {
        id: 2,
        nombre: 'Dr. Fabián Gómez',
        cargo: 'Médico Veterinario',
        especialidad: 'Dermatología y Felinos',
        experiencia: '8 años',
        bio: 'Dedicado al diagnóstico dermatológico avanzado y al manejo amigable felino.',
        imagen: '/img/veterinario2.jpg',
    },
    {
        id: 3,
        nombre: 'Dra. Ana López Castro',
        cargo: 'Médico Veterinario Exóticos',
        especialidad: 'Mascotas Exóticas',
        experiencia: '6 años',
        bio: 'Especialista en el cuidado y tratamientos para conejos, aves y pequeños roedores.',
        imagen: '/img/veterinaria3.jpg',
    },
];

export default function ListaEquipo() {
    const [equipo, setEquipo] = useState<MiembroEquipo[]>(equipoOriginal);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro/equipo`)
            .then((usuarios) => {
                const datosDelServidor = usuarios.map((usuario) => {
                    const nombre = usuario.nombre.replace(/^Dra?\.\s*/i, '');
                    const perfilOriginal = equipoOriginal.find(
                        (miembro) =>
                            miembro.nombre.includes(nombre) ||
                            (miembro.nombre.includes('Fabián') &&
                                nombre.includes('Fabián')),
                    );
                    return {
                        id: usuario.id,
                        nombre: perfilOriginal?.nombre || usuario.nombre,
                        cargo: perfilOriginal?.cargo || 'Médico veterinario',
                        especialidad:
                            usuario.especialidad ||
                            perfilOriginal?.especialidad ||
                            'Medicina veterinaria',
                        experiencia:
                            usuario.experiencia || perfilOriginal?.experiencia || '',
                        bio: usuario.bio || perfilOriginal?.bio || '',
                        imagen:
                            usuario.imagen ||
                            perfilOriginal?.imagen ||
                            '/img/veterinaria1.jpg',
                    };
                });
                const originales = equipoOriginal.map(
                    (miembro) =>
                        datosDelServidor.find((dato) => dato.nombre === miembro.nombre) ||
                        miembro,
                );
                const nuevos = datosDelServidor.filter(
                    (dato) =>
                        !equipoOriginal.some((miembro) => miembro.nombre === dato.nombre),
                );
                setEquipo([...originales, ...nuevos]);
            })
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
