import CardServicio from './CardServicio';
import type { Servicio } from './CardServicio';

const SERVICIOS_MOCK: Servicio[] = [
  // Consultas
  {
    id: 1,
    titulo: 'Consulta General',
    descripcion: 'Evaluación física completa y diagnóstico para perro o gato.',
    precio: '$15.000',
    duracion: '30 min',
    categoria: 'Consultas',
    imagen: '/img/consulta.png'
  },
  {
    id: 2,
    titulo: 'Consulta Urgencia',
    descripcion: 'Atención prioritaria inmediata (Fuera de horario +$10.000).',
    precio: '$25.000',
    duracion: '30 min',
    categoria: 'Consultas',
    imagen: '/img/urgencias.png'
  },
  {
    id: 3,
    titulo: 'Control Postoperatorio',
    descripcion: 'Revisión y seguimiento del estado postquirúrgico.',
    precio: '$10.000',
    duracion: '20 min',
    categoria: 'Consultas',
    imagen: '/img/consulta.png'
  },
  {
    id: 4,
    titulo: 'Consulta Ave / Conejo',
    descripcion: 'Atención médica especializada para mascotas exóticas.',
    precio: '$18.000',
    duracion: '30 min',
    categoria: 'Consultas',
    imagen: '/img/consulta.png'
  },
  {
    id: 5,
    titulo: 'Segunda Opinión Médica',
    descripcion: 'Evaluación de caso clínico previo (requiere ficha).',
    precio: '$20.000',
    duracion: '40 min',
    categoria: 'Consultas',
    imagen: '/img/consulta.png'
  },

  // Vacunación
  {
    id: 6,
    titulo: 'Vacuna Antirrábica Canina',
    descripcion: 'Inmunización obligatoria por ley para caninos.',
    precio: '$12.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 7,
    titulo: 'Vacuna Séxtuple Canina',
    descripcion: 'Protección completa con refuerzo anual para perros.',
    precio: '$18.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 8,
    titulo: 'Vacuna Bivalente Felina',
    descripcion: 'Protección e inmunización felina con refuerzo anual.',
    precio: '$15.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 9,
    titulo: 'Vacuna Triple Felina',
    descripcion: 'Protección felina integral con refuerzo anual.',
    precio: '$17.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 10,
    titulo: 'Vacuna Bordetella Canina',
    descripcion: 'Prevención contra la tos de las perreras.',
    precio: '$14.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 11,
    titulo: 'Vacuna Antirrábica Felina',
    descripcion: 'Inmunización preventiva contra la rabia en gatos.',
    precio: '$12.000',
    duracion: '10 min',
    categoria: 'Vacunación',
    imagen: '/img/vacunacion.png'
  },

  // Cirugía
  {
    id: 12,
    titulo: 'Esterilización Hembra Canina',
    descripcion: 'Incluye anestesia y hospitalización por 24 horas.',
    precio: '$80.000',
    duracion: '90 min',
    categoria: 'Cirugía',
    imagen: '/img/cirugia.png'
  },
  {
    id: 13,
    titulo: 'Esterilización Macho Canino',
    descripcion: 'Procedimiento quirúrgico seguro, incluye anestesia.',
    precio: '$60.000',
    duracion: '60 min',
    categoria: 'Cirugía',
    imagen: '/img/cirugia.png'
  },
  {
    id: 14,
    titulo: 'Esterilización Hembra Felina',
    descripcion: 'Incluye anestesia y hospitalización por 12 horas.',
    precio: '$65.000',
    duracion: '60 min',
    categoria: 'Cirugía',
    imagen: '/img/cirugia.png'
  },
  {
    id: 15,
    titulo: 'Esterilización Macho Felino',
    descripcion: 'Procedimiento quirúrgico felino con anestesia.',
    precio: '$50.000',
    duracion: '45 min',
    categoria: 'Cirugía',
    imagen: '/img/cirugia.png'
  },
  {
    id: 16,
    titulo: 'Extirpación de Tumor Cutáneo',
    descripcion: 'Precio referencial según tamaño de la masa.',
    precio: '$120.000',
    duracion: '60 min',
    categoria: 'Cirugía',
    imagen: '/img/cirugia.png'
  },
  {
    id: 17,
    titulo: 'Cesárea de Urgencia',
    descripcion: 'Atención quirúrgica de emergencia para perras o gatas.',
    precio: '$180.000',
    duracion: '120 min',
    categoria: 'Cirugía',
    imagen: '/img/cirugia.png'
  },

  // Desparasitación
  {
    id: 18,
    titulo: 'Desparasitación Interna (<10 kg)',
    descripcion: 'Tratamiento antiparasitario para perros pequeños.',
    precio: '$8.000',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 19,
    titulo: 'Desparasitación Interna (10-25 kg)',
    descripcion: 'Tratamiento antiparasitario para perros medianos.',
    precio: '$9.500',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 20,
    titulo: 'Desparasitación Interna (>25 kg)',
    descripcion: 'Tratamiento antiparasitario para perros grandes.',
    precio: '$11.000',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 21,
    titulo: 'Desparasitación Interna Felina',
    descripcion: 'Control y tratamiento de parásitos internos para gatos.',
    precio: '$8.000',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/vacunacion.png'
  },
  {
    id: 22,
    titulo: 'Antiparasitario Externo (Pipeta)',
    descripcion: 'Aplicación de pipeta para pulgas y garrapatas.',
    precio: '$7.500',
    duracion: '5 min',
    categoria: 'Desparasitación',
    imagen: '/img/vacunacion.png'
  },

  // Exámenes
  {
    id: 23,
    titulo: 'Hemograma Completo',
    descripcion: 'Análisis de sangre integral con entrega en 24-48 horas.',
    precio: '$22.000',
    duracion: '30 min',
    categoria: 'Exámenes',
    imagen: '/img/laboratorio.png'
  },
  {
    id: 24,
    titulo: 'Perfil Bioquímico Completo',
    descripcion: 'Evaluación de función de órganos en 24-48 horas.',
    precio: '$35.000',
    duracion: '30 min',
    categoria: 'Exámenes',
    imagen: '/img/laboratorio.png'
  },
  {
    id: 25,
    titulo: 'Radiografía (1 Proyección)',
    descripcion: 'Estudio de imagenología digital diagnóstica.',
    precio: '$28.000',
    duracion: '20 min',
    categoria: 'Exámenes',
    imagen: '/img/laboratorio.png'
  },
  {
    id: 26,
    titulo: 'Ecografía Abdominal',
    descripcion: 'Examen de ultrasonido abdominal detallado.',
    precio: '$45.000',
    duracion: '30 min',
    categoria: 'Exámenes',
    imagen: '/img/laboratorio.png'
  },
  {
    id: 27,
    titulo: 'Test de Leishmaniasis',
    descripcion: 'Prueba rápida de diagnóstico en sangre para caninos.',
    precio: '$18.000',
    duracion: '20 min',
    categoria: 'Exámenes',
    imagen: '/img/laboratorio.png'
  },

  // Otros
  {
    id: 28,
    titulo: 'Corte de Uñas',
    descripcion: 'Atención de higiene para perros y gatos.',
    precio: '$5.000',
    duracion: '15 min',
    categoria: 'Otros',
    imagen: '/img/peluqueria.png'
  },
  {
    id: 29,
    titulo: 'Limpieza Dental',
    descripcion: 'Profilaxis con ultrasonido, requiere anestesia.',
    precio: '$55.000',
    duracion: '45 min',
    categoria: 'Otros',
    imagen: '/img/peluqueria.png'
  },
  {
    id: 30,
    titulo: 'Microchip Identificación',
    descripcion: 'Implantación e inclusión en el registro oficial.',
    precio: '$15.000',
    duracion: '10 min',
    categoria: 'Otros',
    imagen: '/img/consulta.png'
  },
  {
    id: 31,
    titulo: 'Hospitalización (Por día)',
    descripcion: 'Incluye monitoreo constante y alimentación básica.',
    precio: '$30.000',
    duracion: '24 h',
    categoria: 'Otros',
    imagen: '/img/urgencias.png'
  }
];

export default function ListaServicios() {
  return (
    <div className="row g-4">
      {SERVICIOS_MOCK.map((servicio) => (
        <div key={servicio.id} className="col-md-6 col-lg-4">
          <CardServicio servicio={servicio} />
        </div>
      ))}
    </div>
  );
}