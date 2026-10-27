import CardEquipo from './CardEquipo';

export interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  especialidad: string;
  experiencia: string;
  bio: string;
  imagen: string;
}

export const EQUIPO_MOCK: MiembroEquipo[] = [
  {
    id: 1,
    nombre: 'Dra. María Paz Fernández',
    cargo: 'Médico Veterinario Directora',
    especialidad: 'Medicina General y Cirugía',
    experiencia: '12 años',
    bio: 'Especialista en medicina interna y cirugía de animales de compañía.',
    imagen: '/img/veterinaria1.jpg'
  },
  {
    id: 2,
    nombre: 'Dr. Fabián',
    cargo: 'Médico Veterinario',
    especialidad: 'Dermatología y Felinos',
    experiencia: '8 años',
    bio: 'Dedicado al diagnóstico dermatológico avanzado y al manejo amigable felino.',
    imagen: '/img/veterinario2.jpg'
  },
  {
    id: 3,
    nombre: 'Dra. Ana López Castro',
    cargo: 'Médico Veterinario Exóticos',
    especialidad: 'Mascotas Exóticas',
    experiencia: '6 años',
    bio: 'Especialista en el cuidado y tratamientos para conejos, aves y pequeños roedores.',
    imagen: '/img/veterinaria3.jpg'
  }
];

export default function ListaEquipo() {
  return (
    <div className="row g-4">
      {EQUIPO_MOCK.map((miembro) => (
        <div key={miembro.id} className="col-md-4">
          <CardEquipo miembro={miembro} />
        </div>
      ))}
    </div>
  );
}
