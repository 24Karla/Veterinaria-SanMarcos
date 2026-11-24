export const rutasPerfil = {
    cliente: '/perfil/cliente',
    veterinario: '/perfil/veterinario',
    recepcionista: '/perfil/recepcionista',
    administrador: '/perfil/administrador',
};

export function crearRutaReserva(titulo: string) {
    return `/tienda?pagina=cita&origen=servicios&servicio=${encodeURIComponent(titulo)}`;
}
