import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../componentes/organismos/CardTienda';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    type CitaApi,
    type PedidoApi,
} from '../servicios/api';

interface Props {
    sesion: { nombre: string; correo: string };
}

export default function PerfilAdministrador({ sesion }: Props) {
    const [resumen, setResumen] = useState({ citas: 0, productos: 0, ventas: 0 });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            pedirDatos<CitaApi[]>(`${api.agenda}/api/citas`),
            pedirDatos<Producto[]>(`${api.productos}/api/productos`),
            pedirDatos<PedidoApi[]>(`${api.pedidos}/api/pedidos`),
        ])
            .then(([citas, productos, pedidos]) => {
                const hoy = new Date().toLocaleDateString('en-CA', {
                    timeZone: 'America/Santiago',
                });
                setResumen({
                    citas: citas.filter(
                        (cita) => cita.fecha === hoy && cita.estado !== 'CANCELADA',
                    ).length,
                    productos: productos.length,
                    ventas: pedidos
                        .filter(
                            (pedido) =>
                                pedido.fecha.startsWith(hoy) &&
                                ['CONFIRMADO', 'ENVIADO', 'ENTREGADO'].includes(
                                    pedido.estado,
                                ),
                        )
                        .reduce((total, pedido) => total + pedido.total, 0),
                });
            })
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, []);

    const secciones = [
        [
            'productos',
            'Productos e inventario',
            'Gestionar productos y stock de la tienda.',
        ],
        ['citas', 'Flujo de citas', 'Habilitar horarios y gestionar reservas.'],
        ['ventas', 'Pedidos y ventas', 'Consultar pedidos y actualizar sus estados.'],
        [
            'usuarios',
            'Equipo y clientes',
            'Administrar usuarios y perfiles veterinarios.',
        ],
        ['mensajes', 'Mensajes de contacto', 'Revisar y atender consultas de contacto.'],
        [
            'contenido',
            'Servicios y blog',
            'Administrar servicios clínicos y publicaciones.',
        ],
        [
            'clinica',
            'Catálogo y compras clínicas',
            'Consultar catálogo, suministros y compras de atención.',
        ],
    ];

    return (
        <main className="container panel-perfil">
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">ADMINISTRACIÓN</span>

                <h1>Resumen de la veterinaria</h1>

                <p>
                    Hola, {sesion.nombre}. Gestiona las operaciones diarias de la
                    Veterinaria San Marcos.
                </p>
            </header>

            <EstadoApi cargando={cargando} error={error} />

            <section
                className="indicadores-admin"
                aria-label="Indicadores de la veterinaria"
            >
                <article>
                    <span>Citas de hoy</span>
                    <strong>{cargando || error ? '—' : resumen.citas}</strong>
                    <small>Citas registradas para hoy</small>
                </article>

                <article>
                    <span>Productos en inventario</span>
                    <strong>{cargando || error ? '—' : resumen.productos}</strong>
                    <small>Catálogo disponible para administración</small>
                </article>

                <article>
                    <span>Ventas del día</span>
                    <strong>
                        {cargando || error
                            ? '—'
                            : `$${resumen.ventas.toLocaleString('es-CL')}`}
                    </strong>
                    <small>Total de pedidos confirmados hoy</small>
                </article>
            </section>

            <section className="perfil-grid">
                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Productos e inventario</h2>
                    </div>

                    <div className="perfil-lista">
                        <div>
                            <strong>
                                {cargando || error
                                    ? 'Consulta los productos registrados'
                                    : `${resumen.productos} productos registrados`}
                            </strong>
                            <span>Revisa categoría, imagen y stock disponible.</span>
                        </div>

                        <div>
                            <strong>Stock disponible</strong>
                            <span>
                                Consulta las unidades de cada producto en el inventario.
                            </span>
                        </div>
                    </div>

                    <Link className="btn btn-tienda" to="/perfil/administrador/productos">
                        Gestionar productos
                    </Link>
                </article>

                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Flujo de citas</h2>
                    </div>

                    <div className="perfil-lista">
                        <div>
                            <strong>
                                {cargando || error
                                    ? 'Consulta las citas de hoy'
                                    : `${resumen.citas} citas para hoy`}
                            </strong>
                            <span>Revisa las reservas y sus estados.</span>
                        </div>

                        <div>
                            <strong>Horarios de atención</strong>
                            <span>Consulta los horarios disponibles de la agenda.</span>
                        </div>
                    </div>

                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/administrador/citas"
                    >
                        Administrar agenda
                    </Link>
                </article>

                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Pedidos y ventas</h2>
                    </div>

                    <p className="perfil-texto">
                        Consulta pagos recibidos, pedidos en preparación y el historial de
                        ventas.
                    </p>

                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/administrador/ventas"
                    >
                        Ver ventas
                    </Link>
                </article>

                <article className="perfil-tarjeta">
                    <div className="perfil-titulo">
                        <h2>Equipo y clientes</h2>
                    </div>

                    <p className="perfil-texto">
                        Administra usuarios, permisos y fichas de clientes de la
                        veterinaria.
                    </p>

                    <Link
                        className="btn btn-volver-tienda"
                        to="/perfil/administrador/usuarios"
                    >
                        Gestionar usuarios
                    </Link>
                </article>

                {secciones.slice(4).map(([ruta, titulo, descripcion]) => (
                    <article className="perfil-tarjeta" key={ruta}>
                        <div className="perfil-titulo">
                            <h2>{titulo}</h2>
                        </div>
                        <p className="perfil-texto">{descripcion}</p>
                        <Link
                            className="btn btn-volver-tienda"
                            to={`/perfil/administrador/${ruta}`}
                        >
                            Abrir {titulo.toLowerCase()}
                        </Link>
                    </article>
                ))}
            </section>
        </main>
    );
}
