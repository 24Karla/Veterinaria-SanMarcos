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
                <p>Hola, {sesion.nombre}.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && (
                <section className="indicadores-admin">
                    <article>
                        <span>Citas de hoy</span>
                        <strong>{resumen.citas}</strong>
                    </article>
                    <article>
                        <span>Productos en inventario</span>
                        <strong>{resumen.productos}</strong>
                    </article>
                    <article>
                        <span>Total de pedidos confirmados hoy</span>
                        <strong>${resumen.ventas.toLocaleString('es-CL')}</strong>
                    </article>
                </section>
            )}
            <section className="perfil-grid">
                {secciones.map(([ruta, titulo, descripcion]) => (
                    <article className="perfil-tarjeta" key={ruta}>
                        <h2>{titulo}</h2>
                        <p>{descripcion}</p>
                        <Link
                            className="btn btn-tienda"
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
