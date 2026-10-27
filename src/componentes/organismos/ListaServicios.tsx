import { useState } from 'react';
import CardServicio from './CardServicio';
import type { Servicio } from './CardServicio';

const SERVICIOS_MOCK: Servicio[] = [
  // --- CONSULTAS ---
  {
    id: 1,
    titulo: 'Consulta general',
    descripcion: 'Atención médica integral para perros y gatos.',
    precio: '$15.000',
    duracion: '30 min',
    categoria: 'Consultas',
    imagen: '/img/consulta-general.jpg'
  },
  {
    id: 2,
    titulo: 'Consulta urgencia',
    descripcion: 'Atención de urgencia. Fuera de horario +$10.000.',
    precio: '$25.000',
    duracion: '30 min',
    categoria: 'Consultas',
    imagen: '/img/consulta-urgencia.jpg'
  },
  {
    id: 3,
    titulo: 'Control postoperatorio',
    descripcion: 'Evaluación y control tras intervenciones quirúrgicas.',
    precio: '$10.000',
    duracion: '20 min',
    categoria: 'Consultas',
    imagen: '/img/control-postoperatorio.jpg'
  },
  {
    id: 4,
    titulo: 'Consulta ave / conejo',
    descripcion: 'Consulta especializada para aves y conejos.',
    precio: '$18.000',
    duracion: '30 min',
    categoria: 'Consultas',
    imagen: '/img/consulta-ave-conejo.jpg'
  },
  {
    id: 5,
    titulo: 'Segunda opinión médica',
    descripcion: 'Evaluación de caso clínico. Requiere ficha previa.',
    precio: '$20.000',
    duracion: '40 min',
    categoria: 'Consultas',
    imagen: '/img/segunda-opinion-medica.jpg'
  },

  // --- VACUNACIÓN ---
  {
    id: 6,
    titulo: 'Vacuna antirrábica canina',
    descripcion: 'Inmunización canina obligatoria por ley.',
    precio: '$12.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacuna-antirrabica-canina.jpg'
  },
  {
    id: 7,
    titulo: 'Vacuna sextuple canina',
    descripcion: 'Protección polivalente canina. Refuerzo anual.',
    precio: '$18.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacuna-sextuple-canina.jpg'
  },
  {
    id: 8,
    titulo: 'Vacuna bivalente felina',
    descripcion: 'Protección para gatos. Refuerzo anual.',
    precio: '$15.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacuna-bivalente-felina.jpg'
  },
  {
    id: 9,
    titulo: 'Vacuna triple felina',
    descripcion: 'Inmunización integral felina. Refuerzo anual.',
    precio: '$17.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacuna-triple-felina.jpg'
  },
  {
    id: 10,
    titulo: 'Vacuna Bordetella canina',
    descripcion: 'Prevención de la tos de las perreras en perros.',
    precio: '$14.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacuna-bordetella-canina.jpg'
  },
  {
    id: 11,
    titulo: 'Vacuna antirrábica felina',
    descripcion: 'Inmunización antirrábica para gatos.',
    precio: '$12.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacuna-antirrabica-felina.jpg'
  },

  // --- CIRUGÍA ---
  {
    id: 12,
    titulo: 'Esterilización hembra canina',
    descripcion: 'Incluye anestesia y hospitalización 24h.',
    precio: '$80.000',
    duracion: '90 min',
    categoria: 'Cirugía',
    imagen: '/img/esterilizacion-hembra-canina.jpg'
  },
  {
    id: 13,
    titulo: 'Esterilización macho canino',
    descripcion: 'Cirugía canina, incluye anestesia.',
    precio: '$60.000',
    duracion: '60 min',
    categoria: 'Cirugía',
    imagen: '/img/esterilizacion-macho-canino.jpg'
  },
  {
    id: 14,
    titulo: 'Esterilización hembra felina',
    descripcion: 'Incluye anestesia y hospitalización 12h.',
    precio: '$65.000',
    duracion: '60 min',
    categoria: 'Cirugía',
    imagen: '/img/esterilizacion-hembra-felina.jpg'
  },
  {
    id: 15,
    titulo: 'Esterilización macho felino',
    descripcion: 'Cirugía felina, incluye anestesia.',
    precio: '$50.000',
    duracion: '45 min',
    categoria: 'Cirugía',
    imagen: '/img/esterilizacion-macho-felino.jpg'
  },
  {
    id: 16,
    titulo: 'Extirpación de tumor cutáneo',
    descripcion: 'Precio referencial; varía según tamaño.',
    precio: '$120.000',
    duracion: '60 min',
    categoria: 'Cirugía',
    imagen: '/img/extirpacion-tumor-cutaneo.jpg'
  },
  {
    id: 17,
    titulo: 'Cesárea de urgencia',
    descripcion: 'Intervención quirúrgica de emergencia.',
    precio: '$180.000',
    duracion: '120 min',
    categoria: 'Cirugía',
    imagen: '/img/cesarea-urgencia.jpg'
  },

  // --- DESPARASITACIÓN ---
  {
    id: 18,
    titulo: 'Desparasitación interna pequeños (<10 kg)',
    descripcion: 'Tratamiento desparasitante interno para perros pequeños.',
    precio: '$8.000',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/desparasitacion-interna-pequenos.jpg'
  },
  {
    id: 19,
    titulo: 'Desparasitación interna medianos (10-25 kg)',
    descripcion: 'Tratamiento desparasitante interno para perros medianos.',
    precio: '$9.500',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/desparasitacion-interna-medianos.jpg'
  },
  {
    id: 20,
    titulo: 'Desparasitación interna grandes (>25 kg)',
    descripcion: 'Tratamiento desparasitante interno para perros grandes.',
    precio: '$11.000',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/desparasitacion-interna-grandes.jpg'
  },
  {
    id: 21,
    titulo: 'Desparasitación interna felina',
    descripcion: 'Tratamiento antiparasitario interno para gatos.',
    precio: '$8.000',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/desparasitacion-interna-felina.jpg'
  },
  {
    id: 22,
    titulo: 'Antiparasitario externo (pipeta)',
    descripcion: 'Tratamiento externo. Incluye aplicación.',
    precio: '$7.500',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/antiparasitario-externo-pipeta.jpg'
  },

  // --- EXÁMENES ---
  {
    id: 23,
    titulo: 'Hemograma completo',
    descripcion: 'Análisis de sangre. Resultado en 24-48 h.',
    precio: '$22.000',
    duracion: '30 min',
    categoria: 'Exámenes',
    imagen: '/img/hemograma-completo.jpg'
  },
  {
    id: 24,
    titulo: 'Perfil bioquímico completo',
    descripcion: 'Análisis bioquímico. Resultado en 24-48 h.',
    precio: '$35.000',
    duracion: '30 min',
    categoria: 'Exámenes',
    imagen: '/img/perfil-bioquimico-completo.jpg'
  },
  {
    id: 25,
    titulo: 'Radiografía (1 proyección)',
    descripcion: 'Estudio radiográfico digital.',
    precio: '$28.000',
    duracion: '20 min',
    categoria: 'Exámenes',
    imagen: '/img/radiografia-1-proyeccion.jpg'
  },
  {
    id: 26,
    titulo: 'Ecografía abdominal',
    descripcion: 'Examen de diagnóstico por ultrasonido.',
    precio: '$45.000',
    duracion: '30 min',
    categoria: 'Exámenes',
    imagen: '/img/ecografia-abdominal.jpg'
  },
  {
    id: 27,
    titulo: 'Test de leishmaniasis',
    descripcion: 'Prueba diagnóstica específica para caninos.',
    precio: '$18.000',
    duracion: '20 min',
    categoria: 'Exámenes',
    imagen: '/img/test-leishmaniasis.jpg'
  },

  // --- OTROS ---
  {
    id: 28,
    titulo: 'Corte de uñas',
    descripcion: 'Servicio de corte de uñas para perro o gato.',
    precio: '$5.000',
    duracion: '15 min',
    categoria: 'Otros',
    imagen: '/img/corte-de-unas.jpg'
  },
  {
    id: 29,
    titulo: 'Limpieza dental',
    descripcion: 'Profilaxis dental. Requiere anestesia.',
    precio: '$55.000',
    duracion: '45 min',
    categoria: 'Otros',
    imagen: '/img/limpieza-dental.jpg'
  },
  {
    id: 30,
    titulo: 'Microchip identificación',
    descripcion: 'Implantación de microchip. Incluye registro.',
    precio: '$15.000',
    duracion: '10 min',
    categoria: 'Otros',
    imagen: '/img/microchip-identificacion.jpg'
  },
  {
    id: 31,
    titulo: 'Hospitalización (por día)',
    descripcion: 'Incluye monitoreo y alimentación básica.',
    precio: '$30.000',
    duracion: '24 h',
    categoria: 'Otros',
    imagen: '/img/hospitalizacion-por-dia.jpg'
  }
];

export default function ListaServicios() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const categorias = ['Todas', ...new Set(SERVICIOS_MOCK.map((servicio) => servicio.categoria))];
  const serviciosFiltrados = categoriaSeleccionada === 'Todas'
    ? SERVICIOS_MOCK
    : SERVICIOS_MOCK.filter((servicio) => servicio.categoria === categoriaSeleccionada);

  return (
    <>
      <div className="mb-4" style={{ maxWidth: '320px' }}>
        <label htmlFor="categoria-servicio" className="form-label fw-bold texto-marca">
          Filtrar por categoría
        </label>
        <select
          id="categoria-servicio"
          className="form-select"
          value={categoriaSeleccionada}
          onChange={(event) => setCategoriaSeleccionada(event.target.value)}
        >
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria === 'Todas' ? 'Todas las categorías' : categoria}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-4">
        {serviciosFiltrados.map((servicio) => (
          <div key={servicio.id} className="col-md-6 col-lg-4">
            <CardServicio servicio={servicio} />
          </div>
        ))}
      </div>
    </>
  );
}
