import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    mostrarErrorFormulario,
    pedirDatos,
    mensajeError,
    type CitaApi,
    type HorarioApi,
    type PedidoApi,
    type UsuarioApi,
    type ContactoApi,
} from '../servicios/api';

const formatoFechaHorario = new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
});

export function CitasAdministrador() {
    const [citas, setCitas] = useState<CitaApi[]>([]);
    const [horarios, setHorarios] = useState<HorarioApi[]>([]);
    const [equipo, setEquipo] = useState<UsuarioApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [datos, setDatos] = useState({ fecha: '', hora: '', veterinario: '' });
    const horariosOrdenados = [...horarios].sort((a, b) =>
        `${a.fecha}T${a.hora}`.localeCompare(`${b.fecha}T${b.hora}`),
    );

    useEffect(() => {
        Promise.all([
            pedirDatos<CitaApi[]>(`${api.agenda}/api/citas`),
            pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`),
            pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro/equipo`),
        ])
            .then(([citas, horarios, equipo]) => {
                setCitas(citas);
                setHorarios(horarios);
                setEquipo(equipo);
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    async function crearHorario(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const horario = await pedirDatos<HorarioApi>(`${api.agenda}/api/horarios`, {
                method: 'POST',
                body: JSON.stringify(datos),
            });
            setHorarios((actuales) => [...actuales, horario]);
            setDatos({ ...datos, hora: '' });
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    async function cambiarCita(cita: CitaApi, atender: boolean) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(
                `${api.agenda}/api/citas/${cita.id}${atender ? '/atendida' : ''}`,
                { method: atender ? 'PUT' : 'DELETE' },
            );
            setCitas((actuales) =>
                actuales.map((actual) =>
                    actual.id === cita.id
                        ? { ...actual, estado: atender ? 'ATENDIDA' : 'CANCELADA' }
                        : actual,
                ),
            );
            setHorarios(await pedirDatos<HorarioApi[]>(`${api.agenda}/api/horarios`));
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    async function desactivarHorario(id: number) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.agenda}/api/horarios/${id}`, { method: 'DELETE' });
            setHorarios((actuales) => actuales.filter((horario) => horario.id !== id));
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/administrador" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">ADMINISTRACIÓN</span>
                <h1>Flujo de citas</h1>
                <p>Organiza las atenciones y disponibilidad de la veterinaria.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            <form className="perfil-tarjeta agenda-formulario mb-4" onSubmit={crearHorario}>
                <h2>Habilitar un horario</h2>
                <div className="agenda-formulario-campos">
                    <div>
                        <label className="form-label" htmlFor="fecha-horario">Fecha</label>
                        <input
                            className="form-control"
                            id="fecha-horario"
                            type="date"
                            required
                            value={datos.fecha}
                            onChange={(event) =>
                                setDatos({ ...datos, fecha: event.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="hora-horario">Hora</label>
                        <input
                            className="form-control"
                            id="hora-horario"
                            type="time"
                            required
                            value={datos.hora}
                            onChange={(event) => setDatos({ ...datos, hora: event.target.value })}
                        />
                    </div>
                    <div className="agenda-formulario-veterinario">
                        <label className="form-label" htmlFor="vet-horario">Veterinario</label>
                        <select
                            className="form-select"
                            id="vet-horario"
                            required
                            value={datos.veterinario}
                            onChange={(event) =>
                                setDatos({ ...datos, veterinario: event.target.value })
                            }
                        >
                            <option value="">Selecciona un veterinario</option>
                            {equipo.map((usuario) => (
                                <option key={usuario.id} value={usuario.nombre}>
                                    {usuario.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-tienda" disabled={ocupado}>
                        Crear horario
                    </button>
                </div>
            </form>
            <section aria-labelledby="titulo-horarios">
                <h2 className="agenda-titulo" id="titulo-horarios">Horarios disponibles</h2>
                {!cargando && !error && horarios.length === 0 && (
                    <p className="agenda-horarios-vacios">Todavía no hay horarios disponibles.</p>
                )}
                {horarios.length > 0 && (
                    <ul className="agenda-horarios">
                        {horariosOrdenados.map((horario) => {
                            const fecha = formatoFechaHorario.format(new Date(horario.fecha));
                            const hora = horario.hora.slice(0, 5);
                            return (
                                <li className="agenda-horario" key={horario.id}>
                                    <div className="agenda-horario-fecha">
                                        <time dateTime={horario.fecha}>{fecha}</time>
                                        <time dateTime={hora}>{hora}</time>
                                    </div>
                                    <span className="agenda-horario-veterinario">{horario.veterinario}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        aria-label={`Desactivar horario del ${fecha} a las ${hora} con ${horario.veterinario}`}
                                        disabled={ocupado}
                                        onClick={() => desactivarHorario(horario.id)}
                                    >
                                        Desactivar
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
            <h2 className="mt-4">Citas registradas</h2>
            {!cargando && !error && citas.length === 0 && (
                <p>No hay citas registradas.</p>
            )}
            <section className="lista-registros">
                {citas.map((cita) => (
                    <article className="registro-cita" key={cita.id}>
                        <img
                            className="registro-imagen"
                            src="/img/calendario.webp"
                            alt=""
                        />
                        <div>
                            <h3>
                                {cita.mascota} · {cita.servicio}
                            </h3>
                            <p>
                                {cita.dueno} · {cita.correo}
                            </p>
                            <p>
                                {cita.fecha} · {cita.hora.slice(0, 5)} ·{' '}
                                {cita.veterinario} · {cita.estado}
                            </p>
                        </div>
                        <div className="acciones-registro">
                            {cita.estado === 'RESERVADA' && (
                                <>
                                    <button
                                        className="btn btn-tienda me-2"
                                        disabled={ocupado}
                                        onClick={() => cambiarCita(cita, true)}
                                    >
                                        Marcar atendida
                                    </button>
                                    <button
                                        className="btn btn-eliminar"
                                        disabled={ocupado}
                                        onClick={() => cambiarCita(cita, false)}
                                    >
                                        Cancelar cita
                                    </button>
                                </>
                            )}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export function VentasAdministrador() {
    const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    useEffect(() => {
        pedirDatos<PedidoApi[]>(`${api.pedidos}/api/pedidos`)
            .then(setPedidos)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    async function cambiarEstado(id: number, estado: string) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const actualizado = await pedirDatos<PedidoApi>(
                `${api.pedidos}/api/pedidos/${id}/estado`,
                { method: 'PATCH', body: JSON.stringify({ estado }) },
            );
            setPedidos((actuales) =>
                actuales.map((pedido) => (pedido.id === id ? actualizado : pedido)),
            );
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/administrador" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">ADMINISTRACIÓN</span>
                <h1>Pedidos y ventas</h1>
                <p>Consulta los pagos y pedidos de la tienda.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && pedidos.length === 0 && (
                <p>No hay pedidos registrados.</p>
            )}
            <section className="lista-registros">
                {pedidos.map((pedido) => (
                    <article className="registro-cita" key={pedido.id}>
                        <img className="registro-imagen" src="/img/pedidos.png" alt="" />
                        <div>
                            <h2>
                                Pedido #{pedido.id} · {pedido.nombreCompleto}
                            </h2>
                            <p>
                                {pedido.correo} · {pedido.estado} · $
                                {pedido.total.toLocaleString('es-CL')}
                            </p>
                            <details>
                                <summary>Ver detalle</summary>
                                <p>Despacho: {pedido.direccion}</p>
                                {pedido.productos.map((producto) => (
                                    <p key={producto.codigo}>
                                        {producto.nombre} × {producto.cantidad}
                                    </p>
                                ))}
                            </details>
                        </div>
                        <div className="acciones-registro">
                            {pedido.estado === 'CONFIRMADO' && (
                                <button
                                    className="btn btn-tienda me-2 mt-2"
                                    disabled={ocupado}
                                    onClick={() => cambiarEstado(pedido.id, 'ENVIADO')}
                                >
                                    Marcar enviado
                                </button>
                            )}
                            {pedido.estado === 'ENVIADO' && (
                                <button
                                    className="btn btn-tienda mt-2"
                                    disabled={ocupado}
                                    onClick={() => cambiarEstado(pedido.id, 'ENTREGADO')}
                                >
                                    Marcar entregado
                                </button>
                            )}
                            {[
                                'PENDIENTE',
                                'CONFIRMADO',
                                'CANCELACION_PENDIENTE',
                            ].includes(pedido.estado) && (
                                <button
                                    className="btn btn-eliminar mt-2"
                                    disabled={ocupado}
                                    onClick={() => cambiarEstado(pedido.id, 'CANCELADO')}
                                >
                                    Cancelar pedido
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

const usuarioVacio = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    telefono: '',
    ciudad: '',
    especialidad: '',
    experiencia: '',
    bio: '',
    imagen: '',
};

export function UsuariosAdministrador() {
    const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [editando, setEditando] = useState<number | null>(null);
    const [mostrar, setMostrar] = useState(false);
    const [datos, setDatos] = useState(usuarioVacio);
    useEffect(() => {
        pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro`)
            .then(setUsuarios)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    function editar(usuario?: UsuarioApi) {
        setEditando(usuario?.id || null);
        setDatos(
            usuario
                ? {
                      ...usuarioVacio,
                      ...usuario,
                      password: '',
                      telefono: usuario.telefono || '',
                      ciudad: usuario.ciudad || '',
                      especialidad: usuario.especialidad || '',
                      experiencia: usuario.experiencia || '',
                      bio: usuario.bio || '',
                      imagen: usuario.imagen || '',
                  }
                : usuarioVacio,
        );
        setMostrar(true);
    }

    async function guardar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            // Se envían solo los campos editables, nunca el ID de otro usuario.
            const cuerpo = {
                nombre: datos.nombre,
                email: datos.email,
                password: datos.password,
                rol: datos.rol,
                telefono: datos.telefono,
                ciudad: datos.ciudad,
                especialidad: datos.especialidad,
                experiencia: datos.experiencia,
                bio: datos.bio,
                imagen: datos.imagen,
            };
            await pedirDatos(
                `${api.usuarios}/registro/${editando ? 'actualizar/' + editando : 'agregar'}`,
                { method: editando ? 'PUT' : 'POST', body: JSON.stringify(cuerpo) },
            );
            setUsuarios(await pedirDatos<UsuarioApi[]>(`${api.usuarios}/registro`));
            setMostrar(false);
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    async function eliminar(id: number) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.usuarios}/registro/eliminar/${id}`, {
                method: 'DELETE',
            });
            setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== id));
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/administrador" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">ADMINISTRACIÓN</span>
                <h1>Equipo y clientes</h1>
                <p>Administra los usuarios de la veterinaria.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            <button className="btn btn-tienda mb-3" onClick={() => editar()}>
                Agregar usuario
            </button>
            {mostrar && (
                <form className="perfil-tarjeta mb-4" onSubmit={guardar}>
                    <h2>{editando ? 'Editar usuario' : 'Nuevo usuario'}</h2>
                    {(Object.keys(usuarioVacio) as (keyof typeof usuarioVacio)[])
                        .filter((campo) => campo !== 'rol')
                        .map((campo) => (
                            <div key={campo} className="mb-2">
                                <label htmlFor={`usuario-${campo}`}>
                                    {
                                        {
                                            nombre: 'Nombre',
                                            email: 'Correo',
                                            password: 'Contraseña',
                                            rol: 'Rol',
                                            telefono: 'Teléfono',
                                            ciudad: 'Ciudad',
                                            especialidad: 'Especialidad',
                                            experiencia: 'Experiencia',
                                            bio: 'Biografía',
                                            imagen: 'Ruta de imagen',
                                        }[campo]
                                    }
                                </label>
                                <input
                                    id={`usuario-${campo}`}
                                    className="form-control"
                                    type={
                                        campo === 'password'
                                            ? 'password'
                                            : campo === 'email'
                                              ? 'email'
                                              : 'text'
                                    }
                                    required={
                                        ['nombre', 'email'].includes(campo) ||
                                        (campo === 'password' && !editando)
                                    }
                                    value={datos[campo]}
                                    onChange={(event) =>
                                        setDatos({
                                            ...datos,
                                            [campo]: event.target.value,
                                        })
                                    }
                                />
                            </div>
                        ))}
                    {editando && <p>Deja la contraseña vacía para conservarla.</p>}
                    <label htmlFor="usuario-rol">Rol</label>
                    <select
                        className="form-select"
                        id="usuario-rol"
                        value={datos.rol}
                        onChange={(event) =>
                            setDatos({ ...datos, rol: event.target.value })
                        }
                    >
                        <option>CLIENTE</option>
                        <option>VETERINARIO</option>
                        <option>ADMINISTRADOR</option>
                        <option>RECEPCIONISTA</option>
                    </select>
                    <button className="btn btn-tienda mt-3 me-2" disabled={ocupado}>
                        Guardar usuario
                    </button>
                    <button
                        className="btn btn-volver-tienda mt-3"
                        type="button"
                        onClick={() => setMostrar(false)}
                    >
                        Cancelar
                    </button>
                </form>
            )}
            <section className="lista-registros">
                {usuarios.map((usuario) => (
                    <article className="registro-cita" key={usuario.id}>
                        <img
                            className="registro-imagen"
                            src="/img/veterinarios.jpg"
                            alt=""
                        />
                        <div>
                            <h2>{usuario.nombre}</h2>
                            <p>
                                {usuario.email} · {usuario.rol}
                            </p>
                            <p>{usuario.especialidad}</p>
                        </div>
                        <div className="acciones-registro">
                            <button
                                className="btn btn-volver-tienda me-2"
                                onClick={() => editar(usuario)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-eliminar"
                                disabled={ocupado}
                                onClick={() => eliminar(usuario.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export function MensajesAdministrador() {
    const [mensajes, setMensajes] = useState<ContactoApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    useEffect(() => {
        pedirDatos<ContactoApi[]>(`${api.mensajeria}/api/contactos`)
            .then(setMensajes)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    async function cambiar(mensaje: ContactoApi, eliminar: boolean) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(
                `${api.mensajeria}/api/contactos/${mensaje.id}${eliminar ? '' : '/atendido'}`,
                { method: eliminar ? 'DELETE' : 'PUT' },
            );
            setMensajes((actuales) =>
                eliminar
                    ? actuales.filter((actual) => actual.id !== mensaje.id)
                    : actuales.map((actual) =>
                          actual.id === mensaje.id
                              ? { ...actual, estado: 'ATENDIDO' }
                              : actual,
                      ),
            );
        } catch (error) {
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/administrador" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">ADMINISTRACIÓN</span>
                <h1>Mensajes de contacto</h1>
                <p>Revisa las consultas enviadas desde el formulario de contacto.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && mensajes.length === 0 && (
                <p>No hay mensajes registrados.</p>
            )}
            <section className="lista-registros">
                {mensajes.map((mensaje) => (
                    <article className="registro-cita" key={mensaje.id}>
                        <img
                            className="registro-imagen"
                            src="/img/historialcompra.png"
                            alt=""
                        />
                        <div>
                            <h2>{mensaje.asunto}</h2>
                            <p>
                                {mensaje.nombreCompleto} · {mensaje.correo} ·{' '}
                                {mensaje.telefono}
                            </p>
                            <p>{mensaje.mensaje}</p>
                            <p>{mensaje.estado}</p>
                        </div>
                        <div className="acciones-registro">
                            {mensaje.estado === 'PENDIENTE' && (
                                <button
                                    className="btn btn-tienda me-2"
                                    disabled={ocupado}
                                    onClick={() => cambiar(mensaje, false)}
                                >
                                    Marcar atendido
                                </button>
                            )}
                            <button
                                className="btn btn-eliminar"
                                disabled={ocupado}
                                onClick={() => cambiar(mensaje, true)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
