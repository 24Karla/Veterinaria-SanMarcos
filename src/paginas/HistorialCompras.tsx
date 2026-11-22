import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type PedidoApi,
} from '../servicios/api';

export default function HistorialCompras() {
    const correo = obtenerSesion()?.correo;
    const [compras, setCompras] = useState<PedidoApi[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);

    useEffect(() => {
        if (!correo) return;
        pedirDatos<PedidoApi[]>(
            `${api.pedidos}/api/pedidos?correo=${encodeURIComponent(correo)}`,
        )
            .then(setCompras)
            .catch((error) => setError(mensajeError(error)))
            .finally(() => setCargando(false));
    }, [correo]);

    async function cambiar(pedido: PedidoApi, cancelar: boolean) {
        if (ocupado) return;
        setOcupado(true);
        setError('');
        try {
            const actualizado = await pedirDatos<PedidoApi>(
                `${api.pedidos}/api/pedidos/${pedido.id}/${cancelar ? 'estado' : 'confirmar'}`,
                cancelar
                    ? { method: 'PATCH', body: JSON.stringify({ estado: 'CANCELADO' }) }
                    : { method: 'POST' },
            );
            setCompras((actuales) =>
                actuales.map((actual) =>
                    actual.id === pedido.id ? actualizado : actual,
                ),
            );
        } catch (error) {
            setError(mensajeError(error));
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <h1>Historial de compras</h1>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && compras.length === 0 && (
                <p>No tienes pedidos registrados.</p>
            )}
            <section className="lista-registros">
                {compras.map((pedido) => (
                    <article className="perfil-tarjeta" key={pedido.id}>
                        <h2>Pedido #{pedido.id}</h2>
                        <p>
                            {new Date(pedido.fecha).toLocaleString('es-CL')} ·{' '}
                            {pedido.estado}
                        </p>
                        <p>
                            Total: ${pedido.total.toLocaleString('es-CL')} ·{' '}
                            {pedido.metodo}
                        </p>
                        <details>
                            <summary>Ver detalle</summary>
                            <p>Despacho: {pedido.direccion}</p>
                            {pedido.productos.map((producto) => (
                                <p key={producto.codigo}>
                                    {producto.nombre} × {producto.cantidad}: $
                                    {producto.subtotal.toLocaleString('es-CL')}
                                </p>
                            ))}
                        </details>
                        {pedido.estado === 'PENDIENTE' && (
                            <button
                                className="btn btn-tienda mt-2 me-2"
                                disabled={ocupado}
                                onClick={() => cambiar(pedido, false)}
                            >
                                Reintentar confirmación
                            </button>
                        )}
                        {['PENDIENTE', 'CONFIRMADO', 'CANCELACION_PENDIENTE'].includes(
                            pedido.estado,
                        ) && (
                            <button
                                className="btn btn-outline-danger mt-2"
                                disabled={ocupado}
                                onClick={() => cambiar(pedido, true)}
                            >
                                Cancelar pedido
                            </button>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}
