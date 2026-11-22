import type { SesionUsuario } from '../componentes/organismos/PerfilProtegido';

// Cada dirección se puede cambiar en .env.local sin editar las pantallas.
export const api = {
    usuarios: import.meta.env.VITE_USUARIOS_URL || 'http://127.0.0.1:8081',
    mensajeria: import.meta.env.VITE_MENSAJERIA_URL || 'http://127.0.0.1:8082',
    mascotas: import.meta.env.VITE_MASCOTAS_URL || 'http://127.0.0.1:8083',
    catalogo: import.meta.env.VITE_CATALOGO_URL || 'http://127.0.0.1:8084',
    ficha: import.meta.env.VITE_FICHA_URL || 'http://127.0.0.1:8085',
    productos: import.meta.env.VITE_PRODUCTOS_URL || 'http://127.0.0.1:8086',
    pedidos: import.meta.env.VITE_PEDIDOS_URL || 'http://127.0.0.1:8087',
    agenda: import.meta.env.VITE_AGENDA_URL || 'http://127.0.0.1:8088',
    compras: import.meta.env.VITE_COMPRAS_URL || 'http://127.0.0.1:8089',
};

export class ErrorApi extends Error {
    pedidoId?: number;
    estado: number;

    constructor(mensaje: string, estado: number, pedidoId?: number) {
        super(mensaje);
        this.estado = estado;
        this.pedidoId = pedidoId;
    }
}

export async function pedirDatos<T>(url: string, opciones: RequestInit = {}): Promise<T> {
    let respuesta: Response;

    try {
        respuesta = await fetch(url, {
            ...opciones,
            headers: {
                ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
                ...opciones.headers,
            },
        });
    } catch {
        throw new Error(
            'No se pudo conectar con el servicio. Comprueba que esté iniciado.',
        );
    }

    const texto = await respuesta.text();
    let datos;

    try {
        datos = texto ? JSON.parse(texto) : undefined;
    } catch {
        datos = texto;
    }

    if (!respuesta.ok) {
        const mensaje =
            datos?.mensaje ||
            datos?.detail ||
            datos?.message ||
            `No se pudo completar la operación (${respuesta.status}).`;
        throw new ErrorApi(mensaje, respuesta.status, datos?.pedidoId);
    }

    return datos as T;
}

export function obtenerSesion(): SesionUsuario | null {
    try {
        const sesion = JSON.parse(localStorage.getItem('sesion-veterinaria') || 'null');
        return sesion && Number.isInteger(sesion.id) ? sesion : null;
    } catch {
        return null;
    }
}

export function mensajeError(error: unknown) {
    return error instanceof Error ? error.message : 'No se pudo completar la operación.';
}

export interface UsuarioApi {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    telefono?: string;
    ciudad?: string;
    especialidad?: string;
    experiencia?: string;
    bio?: string;
    imagen?: string;
}

export interface MascotaApi {
    id: number;
    nombre: string;
    especie: string;
    raza?: string;
    edad: number;
    sexo?: string;
    pesoKg?: number;
    clienteId: number;
    activo: boolean;
}

export interface HorarioApi {
    id: number;
    fecha: string;
    hora: string;
    veterinario: string;
    reservado: boolean;
    activo: boolean;
}

export interface CitaApi {
    id: number;
    horarioId: number;
    dueno: string;
    correo: string;
    mascota: string;
    especie: string;
    servicio: string;
    motivo: string;
    fecha: string;
    hora: string;
    veterinario: string;
    estado: string;
}

export interface PedidoApi {
    id: number;
    nombreCompleto: string;
    correo: string;
    direccion: string;
    metodo: string;
    fecha: string;
    estado: string;
    total: number;
    productos: {
        codigo: string;
        nombre: string;
        cantidad: number;
        precioUnitario: number;
        subtotal: number;
    }[];
}

export interface ConsultaApi {
    id: number;
    pacienteId: number;
    nombrePaciente: string;
    veterinarioId: number;
    nombreVeterinario: string;
    fechaConsulta: string;
    tipoServicio: string;
    motivoConsulta: string;
    diagnostico: string;
    medicamentosRecetados?: string;
    indicaciones?: string;
    pesoKg?: number;
    proximoControl?: string;
}

export interface FichaApi {
    id: number;
    nombre: string;
    especie: string;
    raza?: string;
    duenoId: number;
    nombreDueno: string;
    telefonoDueno?: string;
    historialConsultas?: ConsultaApi[];
}

export interface ContactoApi {
    id: number;
    nombreCompleto: string;
    correo: string;
    telefono?: string;
    asunto: string;
    mensaje: string;
    estado: string;
}

export interface ServicioApi {
    codigo: string;
    nombre: string;
    categoria: string;
    precioClp: number;
    duracionAprox?: string;
    observaciones?: string;
    imagen?: string;
    tipoItem: string;
    especie: string;
    activo: boolean;
}
