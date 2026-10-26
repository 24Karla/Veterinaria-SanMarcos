import CardEquipo from './CardEquipo';
import type { MiembroEquipo } from './CardEquipo';

const EQUIPO_MOCK: MiembroEquipo[] = [
  {
    id: 1,
    nombre: 'Dra. María Paz Fernández',
    cargo: 'Médico Veterinario Directora',
    especialidad: 'Medicina General y Cirugía',
    experiencia: '12 años',
    bio: 'Especialista en medicina interna y cirugía de animales de compañía. Apasionada por el bienestar animal y la atención preventiva.',
    imagen: '/img/equipo/veterinaria1.png'
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Silva Reyes',
    cargo: 'Médico Veterinario',
    especialidad: 'Dermatología y Felinos',
    experiencia: '8 años',
    bio: 'Dedicado al diagnóstico dermatológico avanzado y al manejo clínico amigable para pacientes felinos (Cat Friendly).',
    imagen: '/img/equipo/veterinario2.png'
  },
  {
    id: 3,
    nombre: 'Dra. Ana López Castro',
    cargo: 'Médico Veterinario Exóticos',
    especialidad: 'Mascotas Exóticas',
    experiencia: '6 años',
    bio: 'Especialista en el cuidado, nutrición y tratamientos médicos para conejos, hurones, aves y pequeños roedores.',
    imagen: '/img/equipo/veterinaria3.png'
  }
];

export default function ListaEquipo() {
  return (
    <div className="row g-4">
      {EQUIPO_MOCK.map((miembro) => (
        <div key={miembro.id} className="col-md-6 col-lg-4">
          <CardEquipo miembro={miembro} />
        </div>
      ))}
    </div>
  );
}