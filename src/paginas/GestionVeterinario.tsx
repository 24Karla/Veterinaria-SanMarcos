
import PaginaGestion from './PaginaGestion';

export function AgendaVeterinario() {
    return (
        <PaginaGestion
            etiqueta="PANEL VETERINARIO"
            titulo="Mi agenda"
            descripcion="Citas agendadas para tu jornada de atención."
            volverA="/perfil/veterinario"
            registros={[
                {
                    titulo: '11:00 · Luna Morales',
                    descripcion: 'Consulta general · Golden Retriever',
                    imagen: '/img/calendario.webp',
                },
                {
                    titulo: '12:30 · Tomás Silva',
                    descripcion: 'Control postoperatorio · Gato',
                    imagen: '/img/calendario.webp',
                },
                {
                    titulo: '16:00 · Bruno Pérez',
                    descripcion: 'Vacunación · Mestizo',
                    imagen: '/img/calendario.webp',
                },
            ]}
        />
    );
}

export function RecetasVeterinario() {
    return (
        <PaginaGestion
            etiqueta="PANEL VETERINARIO"
            titulo="Recetas emitidas"
            descripcion="Revisa los tratamientos y recetas de tus pacientes."
            volverA="/perfil/veterinario"
            registros={[
                {
                    titulo: 'Amoxicilina 250 mg',
                    descripcion: 'Luna Morales · Emitida hoy',
                    imagen: '/img/receta.png',
                },
                {
                    titulo: 'Meloxicam 1 mg',
                    descripcion: 'Rocky Fuentes · Emitida el 20 de octubre',
                    imagen: '/img/receta.png',
                },
            ]}
        />
    );
}

export function HistorialVeterinario() {
    return (
        <PaginaGestion
            etiqueta="PANEL VETERINARIO"
            titulo="Historial clínico"
            descripcion="Consulta controles, diagnósticos y tratamientos de tus pacientes."
            volverA="/perfil/veterinario"
            registros={[
                {
                    titulo: 'Luna Morales',
                    descripcion: 'Última atención: vacuna anual · 12 de septiembre',
                    imagen: '/img/historialclinico.png',
                },
                {
                    titulo: 'Milo Pérez',
                    descripcion: 'Última atención: control general · 4 de agosto',
                    imagen: '/img/historialclinico.png',
                },
            ]}
        />
    );
}
