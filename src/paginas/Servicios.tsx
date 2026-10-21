import { useMemo, useState } from 'react';
import Boton from '../componentes/atomos/Boton';
import CardServicio, { type Servicio } from '../componentes/organismos/CardServicio';

const servicios: Servicio[] = [
  // Consultas
  { codigo: 'SV001', categoria: 'Consultas', nombre: 'Consulta general', especie: 'Perro / Gato', duracionAprox: '30 min', imagen: '/img/servicios/consulta.jpg' },
  { codigo: 'SV002', categoria: 'Consultas', nombre: 'Consulta urgencia', especie: 'Perro / Gato', duracionAprox: '30 min', imagen: '/img/servicios/urgencia.jpg' },
  { codigo: 'SV003', categoria: 'Consultas', nombre: 'Control postoperatorio', especie: 'Perro / Gato', duracionAprox: '20 min', imagen: '/img/servicios/postoperatorio.jpg' },
  { codigo: 'SV004', categoria: 'Consultas', nombre: 'Consulta ave / conejo', especie: 'Ave / Conejo', duracionAprox: '30 min', imagen: '/img/servicios/exoticos.jpg' },
  { codigo: 'SV005', categoria: 'Consultas', nombre: 'Segunda opinión médica', especie: 'Todas', duracionAprox: '40 min', imagen: '/img/servicios/opinion.jpg' },

  // Vacunación
  { codigo: 'VA001', categoria: 'Vacunación', nombre: 'Vacuna antirrábica canina', especie: 'Perro', duracionAprox: '10 min', imagen: '/img/servicios/vacuna.jpg' },
  { codigo: 'VA002', categoria: 'Vacunación', nombre: 'Vacuna séxtuple canina', especie: 'Perro', duracionAprox: '10 min', imagen: '/img/servicios/vacuna.jpg' },
  { codigo: 'VA003', categoria: 'Vacunación', nombre: 'Vacuna bivalente felina', especie: 'Gato', duracionAprox: '10 min', imagen: '/img/servicios/vacuna.jpg' },
  { codigo: 'VA004', categoria: 'Vacunación', nombre: 'Vacuna triple felina', especie: 'Gato', duracionAprox: '10 min', imagen: '/img/servicios/vacuna.jpg' },
  { codigo: 'VA005', categoria: 'Vacunación', nombre: 'Vacuna Bordetella canina', especie: 'Perro', duracionAprox: '10 min', imagen: '/img/servicios/vacuna.jpg' },
  { codigo: 'VA006', categoria: 'Vacunación', nombre: 'Vacuna antirrábica felina', especie: 'Gato', duracionAprox: '10 min', imagen: '/img/servicios/vacuna.jpg' },

  // Cirugía
  { codigo: 'CI001', categoria: 'Cirugía', nombre: 'Esterilización hembra canina', especie: 'Perra', duracionAprox: '90 min', imagen: '/img/servicios/cirugia.jpg' },
  { codigo: 'CI002', categoria: 'Cirugía', nombre: 'Esterilización macho canino', especie: 'Perro', duracionAprox: '60 min', imagen: '/img/servicios/cirugia.jpg' },
  { codigo: 'CI003', categoria: 'Cirugía', nombre: 'Esterilización hembra felina', especie: 'Gata', duracionAprox: '60 min', imagen: '/img/servicios/cirugia.jpg' },
  { codigo: 'CI004', categoria: 'Cirugía', nombre: 'Esterilización macho felino', especie: 'Gato', duracionAprox: '45 min', imagen: '/img/servicios/cirugia.jpg' },
  { codigo: 'CI005', categoria: 'Cirugía', nombre: 'Extirpación de tumor cutáneo', especie: 'Perro / Gato', duracionAprox: '60 min', imagen: '/img/servicios/cirugia.jpg' },
  { codigo: 'CI006', categoria: 'Cirugía', nombre: 'Cesárea de urgencia', especie: 'Perra / Gata', duracionAprox: '120 min', imagen: '/img/servicios/cirugia.jpg' },

  // Desparasitación
  { codigo: 'DE001', categoria: 'Desparasitación', nombre: 'Desparasitación interna pequeños (<10 kg)', especie: 'Perro', duracionAprox: '5 min', imagen: '/img/servicios/desparasitacion.jpg' },
  { codigo: 'DE002', categoria: 'Desparasitación', nombre: 'Desparasitación interna medianos (10-25 kg)', especie: 'Perro', duracionAprox: '5 min', imagen: '/img/servicios/desparasitacion.jpg' },
  { codigo: 'DE003', categoria: 'Desparasitación', nombre: 'Desparasitación interna grandes (>25 kg)', especie: 'Perro', duracionAprox: '5 min', imagen: '/img/servicios/desparasitacion.jpg' },
  { codigo: 'DE004', categoria: 'Desparasitación', nombre: 'Desparasitación interna felina', especie: 'Gato', duracionAprox: '5 min', imagen: '/img/servicios/desparasitacion.jpg' },
  { codigo: 'DE005', categoria: 'Desparasitación', nombre: 'Antiparasitario externo (pipeta)', especie: 'Perro / Gato', duracionAprox: '5 min', imagen: '/img/servicios/desparasitacion.jpg' },

  // Exámenes
  { codigo: 'EX001', categoria: 'Exámenes', nombre: 'Hemograma completo', especie: 'Perro / Gato', duracionAprox: '30 min', imagen: '/img/servicios/examenes.jpg' },
  { codigo: 'EX002', categoria: 'Exámenes', nombre: 'Perfil bioquímico completo', especie: 'Perro / Gato', duracionAprox: '30 min', imagen: '/img/servicios/examenes.jpg' },
  { codigo: 'EX003', categoria: 'Exámenes', nombre: 'Radiografía (1 proyección)', especie: 'Perro / Gato', duracionAprox: '20 min', imagen: '/img/servicios/examenes.jpg' },
  { codigo: 'EX004', categoria: 'Exámenes', nombre: 'Ecografía abdominal', especie: 'Perro / Gato', duracionAprox: '30 min', imagen: '/img/servicios/examenes.jpg' },
  { codigo: 'EX005', categoria: 'Exámenes', nombre: 'Test de leishmaniasis', especie: 'Perro', duracionAprox: '20 min', imagen: '/img/servicios/examenes.jpg' },

  // Otros
  { codigo: 'OT001', categoria: 'Otros', nombre: 'Corte de uñas', especie: 'Perro / Gato', duracionAprox: '15 min', imagen: '/img/servicios/otros.jpg' },
  { codigo: 'OT002', categoria: 'Otros', nombre: 'Limpieza dental', especie: 'Perro / Gato', duracionAprox: '45 min', imagen: '/img/servicios/otros.jpg' },
  { codigo: 'OT003', categoria: 'Otros', nombre: 'Microchip Identificación', especie: 'Perro / Gato', duracionAprox: '10 min', imagen: '/img/servicios/otros.jpg' },
  { codigo: 'OT004', categoria: 'Otros', nombre: 'Hospitalización (por día)', especie: 'Perro / Gato', duracionAprox: '24 h', imagen: '/img/servicios/otros.jpg' },
];

export default function PaginaServicios() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');

  const categorias = useMemo(() => {
    const cats = servicios.map((s) => s.categoria);
    return ['Todas', ...Array.from(new Set(cats))];
  }, []);

  const serviciosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === 'Todas') return servicios;
    return servicios.filter((s) => s.categoria === categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  const handleAgendar = (servicio: Servicio) => {
    alert(`Agendando hora para: ${servicio.nombre}`);
  };

  const handleVerDetalle = (servicio: Servicio) => {
    alert(`Detalles de ${servicio.nombre}:\nEspecie: ${servicio.especie}\nDuración: ${servicio.duracionAprox}`);
  };

  return (

    <section className="container my-4 px-3">
      <header className="mb-4 text-start">
        <h2 className="fw-bold text-dark mb-1">Veterinaria San Marcos - Catálogo de Servicios</h2>
        <p className="text-muted mb-3">Servicios disponibles para agendamiento</p>

        <div className="filtros-categoria d-flex gap-2 flex-wrap">
          {categorias.map((cat) => (
            <Boton
              key={cat}
              texto={cat}
              type="button"
              className={`btn btn-sm ${
                categoriaSeleccionada === cat ? 'btn-primary fw-bold' : 'btn-outline-primary'
              }`}
              onClick={() => setCategoriaSeleccionada(cat)}
            />
          ))}
        </div>
      </header>

      <div className="row g-4">
        {serviciosFiltrados.map((servicio) => (
          <div key={servicio.codigo} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <CardServicio
              servicio={servicio}
              onAgendar={handleAgendar}
              onVerDetalle={handleVerDetalle}
            />
          </div>
        ))}
      </div>
    </section>
  );
}