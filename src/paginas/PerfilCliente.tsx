import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    type UsuarioApi,
    type MascotaApi,
    type CitaApi,
    type PedidoApi,
} from '../servicios/api';
import type { SesionUsuario } from '../componentes/organismos/PerfilProtegido';

interface Props {
    sesion: Pick<SesionUsuario, 'id' | 'nombre' | 'correo'>;
}

export default function PerfilCliente({ sesion }: Props) {
    const [perfil, setPerfil] = useState({
        nombre: sesion.nombre,
        telefono: '',
        ciudad: '',
    });
    const [mascotas, setMascotas] = useState<MascotaApi[]>([]);
    const [citas, setCitas] = useState<CitaApi[]>([]);
    const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [aviso, setAviso] = useState('');
    const [editandoPerfil, setEditandoPerfil] = useState(false);
    const [mostrarMascota, setMostrarMascota] = useState(false);
    const [editandoMascota, setEditandoMascota] = useState<number | null>(null);
    const [datos, setDatos] = useState({
        nombre: '',
        especie: 'PERRO',
        raza: '',
        edad: '',
        sexo: 'HEMBRA',
    });

    useEffect(() => {
        if (!sesion.id) return;
        Promise.allSettled([
            pedirDatos<UsuarioApi>(`${api.usuarios}/registro/usuario/${sesion.id}`).then(
                (usuario) => {
                    setPerfil({
                        nombre: usuario.nombre,
                        telefono: usuario.telefono || '',
                        ciudad: usuario.ciudad || '',
                    });
                },
            ),
            pedirDatos<MascotaApi[]>(
                `${api.mascotas}/api/mascotas?clienteId=${sesion.id}`,
            ).then(setMascotas),
            pedirDatos<CitaApi[]>(
                `${api.agenda}/api/citas?correo=${encodeURIComponent(sesion.correo)}`,
            ).then(setCitas),
            pedirDatos<PedidoApi[]>(
                `${api.pedidos}/api/pedidos?correo=${encodeURIComponent(sesion.correo)}`,
            ).then(setPedidos),
        ])
            .then((resultados) => {
                const fallos = resultados.filter(
                    (resultado) => resultado.status === 'rejected',
                );
                if (fallos.length)
                    setError(
                        'No se pudieron cargar todos los datos. Comprueba los servicios de usuarios, mascotas, agenda y pedidos.',
                    );
            })
            .finally(() => setCargando(false));
    }, [sesion.id, sesion.correo]);

    async function guardarPerfil(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        setAviso('');
        try {
            await pedirDatos(`${api.usuarios}/registro/usuario/${sesion.id}/perfil`, {
                method: 'PATCH',
                body: JSON.stringify(perfil),
            });
            localStorage.setItem(
                'sesion-veterinaria',
                JSON.stringify({ ...sesion, nombre: perfil.nombre }),
            );
            window.dispatchEvent(new Event('sesion-actualizada'));
            setEditandoPerfil(false);
            setAviso('Perfil actualizado.');
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function guardarMascota(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setError('');
        setAviso('');
        try {
            const mascota = await pedirDatos<MascotaApi>(
                `${api.mascotas}/api/mascotas/${editandoMascota || 'agregar'}`,
                {
                    method: editandoMascota ? 'PUT' : 'POST',
                    body: JSON.stringify({
                        ...datos,
                        edad: Number(datos.edad),
                        clienteId: sesion.id,
                        activo: true,
                    }),
                },
            );
            setMascotas((actuales) =>
                editandoMascota
                    ? actuales.map((actual) =>
                          actual.id === editandoMascota ? mascota : actual,
                      )
                    : [...actuales, mascota],
            );
            setMostrarMascota(false);
            setEditandoMascota(null);
            setAviso('Mascota guardada.');
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    async function eliminarMascota(id: number) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            await pedirDatos(`${api.mascotas}/api/mascotas/eliminar/${id}`, {
                method: 'DELETE',
            });
            setMascotas((actuales) => actuales.filter((mascota) => mascota.id !== id));
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    function editarMascota(mascota?: MascotaApi) {
        setEditandoMascota(mascota?.id || null);
        setDatos({
            nombre: mascota?.nombre || '',
            especie: mascota?.especie || 'PERRO',
            raza: mascota?.raza || '',
            edad: mascota ? String(mascota.edad) : '',
            sexo: mascota?.sexo || 'HEMBRA',
        });
        setMostrarMascota(true);
    }

    return (
        <main className="container panel-perfil">
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PORTAL CLIENTE</span>
                <h1>Hola, {perfil.nombre}</h1>
                <p>Tu perfil y los datos de tus mascotas.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            {aviso && (
                <p role="status" className="alert alert-success">
                    {aviso}
                </p>
            )}
            <section className="perfil-grid">
                <article className="perfil-tarjeta">
                    <h2>Mis datos</h2>
                    <p>{sesion.correo}</p>
                    <p>
                        {perfil.telefono} · {perfil.ciudad}
                    </p>
                    <button
                        className="btn btn-volver-tienda"
                        onClick={() => setEditandoPerfil(!editandoPerfil)}
                    >
                        Editar perfil
                    </button>
                    {editandoPerfil && (
                        <form onSubmit={guardarPerfil} className="mt-3">
                            <label htmlFor="nombre-perfil">Nombre</label>
                            <input
                                id="nombre-perfil"
                                required
                                maxLength={50}
                                className="form-control"
                                value={perfil.nombre}
                                onChange={(event) =>
                                    setPerfil({ ...perfil, nombre: event.target.value })
                                }
                            />
                            <label htmlFor="telefono-perfil">Teléfono</label>
                            <input
                                id="telefono-perfil"
                                maxLength={25}
                                className="form-control"
                                value={perfil.telefono}
                                onChange={(event) =>
                                    setPerfil({ ...perfil, telefono: event.target.value })
                                }
                            />
                            <label htmlFor="ciudad-perfil">Ciudad</label>
                            <input
                                id="ciudad-perfil"
                                maxLength={100}
                                className="form-control"
                                value={perfil.ciudad}
                                onChange={(event) =>
                                    setPerfil({ ...perfil, ciudad: event.target.value })
                                }
                            />
                            <button className="btn btn-tienda mt-3" disabled={ocupado}>
                                Guardar perfil
                            </button>
                        </form>
                    )}
                </article>
                <article className="perfil-tarjeta">
                    <h2>Mis mascotas</h2>
                    {!cargando && mascotas.length === 0 && (
                        <p>No tienes mascotas registradas.</p>
                    )}
                    {mascotas.map((mascota) => (
                        <div className="perfil-lista mb-3" key={mascota.id}>
                            <strong>{mascota.nombre}</strong>
                            <p>
                                {mascota.especie} · {mascota.raza} · {mascota.edad} años
                            </p>
                            <button
                                className="btn btn-volver-tienda me-2"
                                onClick={() => editarMascota(mascota)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                disabled={ocupado}
                                onClick={() => eliminarMascota(mascota.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button className="btn btn-tienda" onClick={() => editarMascota()}>
                        Agregar mascota
                    </button>
                    {mostrarMascota && (
                        <form
                            className="formulario-mascota mt-3"
                            onSubmit={guardarMascota}
                        >
                            <h3>
                                {editandoMascota ? 'Editar mascota' : 'Nueva mascota'}
                            </h3>
                            <label htmlFor="nombre-mascota">Nombre de la mascota</label>
                            <input
                                id="nombre-mascota"
                                className="form-control"
                                required
                                maxLength={60}
                                value={datos.nombre}
                                onChange={(event) =>
                                    setDatos({ ...datos, nombre: event.target.value })
                                }
                            />
                            <label htmlFor="especie-mascota">Especie</label>
                            <select
                                id="especie-mascota"
                                className="form-select"
                                value={datos.especie}
                                onChange={(event) =>
                                    setDatos({ ...datos, especie: event.target.value })
                                }
                            >
                                <option value="PERRO">Perro</option>
                                <option value="GATO">Gato</option>
                                <option value="OTRO">Otro</option>
                            </select>
                            <label htmlFor="raza-mascota">Raza</label>
                            <input
                                id="raza-mascota"
                                className="form-control"
                                maxLength={60}
                                value={datos.raza}
                                onChange={(event) =>
                                    setDatos({ ...datos, raza: event.target.value })
                                }
                            />
                            <label htmlFor="edad-mascota">Edad en años</label>
                            <input
                                id="edad-mascota"
                                className="form-control"
                                type="number"
                                min="0"
                                required
                                value={datos.edad}
                                onChange={(event) =>
                                    setDatos({ ...datos, edad: event.target.value })
                                }
                            />
                            <label htmlFor="sexo-mascota">Sexo</label>
                            <select
                                id="sexo-mascota"
                                className="form-select"
                                value={datos.sexo}
                                onChange={(event) =>
                                    setDatos({ ...datos, sexo: event.target.value })
                                }
                            >
                                <option value="HEMBRA">Hembra</option>
                                <option value="MACHO">Macho</option>
                            </select>
                            <button
                                className="btn btn-tienda mt-3 me-2"
                                disabled={ocupado}
                            >
                                Guardar mascota
                            </button>
                            <button
                                className="btn btn-link mt-3"
                                type="button"
                                onClick={() => setMostrarMascota(false)}
                            >
                                Cancelar
                            </button>
                        </form>
                    )}
                </article>
                <article className="perfil-tarjeta">
                    <h2>Mis próximas citas</h2>
                    {citas
                        .filter((cita) => cita.estado === 'RESERVADA')
                        .slice(0, 3)
                        .map((cita) => (
                            <p key={cita.id}>
                                {cita.mascota} · {cita.fecha} · {cita.hora.slice(0, 5)} ·{' '}
                                {cita.veterinario}
                            </p>
                        ))}
                    <Link
                        className="btn btn-tienda me-2"
                        to="/tienda?pagina=cita&origen=perfil"
                    >
                        Reservar cita
                    </Link>
                    <Link className="btn btn-volver-tienda" to="/perfil/cliente/citas">
                        Ver mis citas
                    </Link>
                </article>
                <article className="perfil-tarjeta">
                    <h2>Historial veterinario</h2>
                    <p>
                        Consulta diagnósticos, recetas e indicaciones registrados por el
                        veterinario.
                    </p>
                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/cliente/historial"
                    >
                        Ver historial completo
                    </Link>
                </article>
                <article className="perfil-tarjeta">
                    <h2>Mis compras</h2>
                    {pedidos.slice(0, 2).map((pedido) => (
                        <p key={pedido.id}>
                            Pedido #{pedido.id} · ${pedido.total.toLocaleString('es-CL')}{' '}
                            · {pedido.estado}
                        </p>
                    ))}
                    <Link className="btn btn-volver-tienda" to="/perfil/cliente/compras">
                        Ver historial de compras
                    </Link>
                </article>
            </section>
        </main>
    );
}
