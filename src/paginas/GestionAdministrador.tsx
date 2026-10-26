
import PaginaGestion from './PaginaGestion';

export function CitasAdministrador() {
    return (
        <PaginaGestion
            etiqueta="ADMINISTRACIÓN"
            titulo="Flujo de citas"
            descripcion="Organiza las atenciones y disponibilidad de la veterinaria."
            volverA="/perfil/administrador"
            registros={[
                    {
                        titulo: '18 citas para hoy',
                        descripcion: '12 confirmadas · 6 pendientes.',
                        imagen: '/img/calendario.webp',
                    },
                {
                    titulo: '4 veterinarios en turno',
                    descripcion: 'Agenda disponible hasta las 19:30 hrs.',
                    imagen: '/img/turno.png',
                },
            ]}
        />
    );
}

export function VentasAdministrador() {
    return (
        <PaginaGestion
            etiqueta="ADMINISTRACIÓN"
            titulo="Pedidos y ventas"
            descripcion="Consulta los pagos y pedidos de la tienda."
            volverA="/perfil/administrador"
            registros={[
                {
                    titulo: '12 pedidos confirmados',
                    descripcion: 'Ventas acumuladas de hoy: $324.500.',
                    imagen: '/img/pedidos.png',
                },
                {
                    titulo: '4 pedidos en preparación',
                    descripcion: 'Pendientes de entrega o retiro.',
                    imagen: '/img/preparacion.png',
                },
            ]}
        />
    );
}

export function UsuariosAdministrador() {
    return (
        <PaginaGestion
            etiqueta="ADMINISTRACIÓN"
            titulo="Equipo y clientes"
            descripcion="Administra los usuarios de la veterinaria."
            volverA="/perfil/administrador"
            registros={[
                {
                    titulo: '4 veterinarios activos',
                    descripcion: 'Todos cuentan con agenda asignada.',
                    imagen: '/img/veterinarios.jpg',
                },
                {
                    titulo: '156 clientes registrados',
                    descripcion: '8 nuevos clientes durante este mes.',
                    imagen: '/img/mascotasclientes.png',
                },
            ]}
        />
    );
}
