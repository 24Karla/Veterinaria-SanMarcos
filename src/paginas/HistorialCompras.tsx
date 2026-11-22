import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoApi from '../componentes/moleculas/EstadoApi';
import {
    api,
    mostrarErrorFormulario,
    pedirDatos,
    mensajeError,
    obtenerSesion,
    type PedidoApi,
} from '../servicios/api';

export default function HistorialCompras() {
    const correo = obtenerSesion()?.correo;
    const [pedidoAbierto, setPedidoAbierto] = useState<number | null>(null);
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
            mostrarErrorFormulario(error, setError);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <main className="container panel-perfil">
            <Link to="/perfil/cliente" className="btn btn-volver-tienda mb-4">
                ← Volver a mi perfil
            </Link>
            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">PORTAL CLIENTE</span>

                <h1>Historial de compras</h1>

                <p>Revisa los pedidos que has realizado en la tienda.</p>
            </header>
            <EstadoApi cargando={cargando} error={error} />
            {!cargando && !error && compras.length === 0 && (
                <p>No tienes pedidos registrados.</p>
            )}
            <section className="lista-registros">
                {compras.map((pedido) => (
                    <article className="registro-cita" key={pedido.id}>
                        <img
                            className="registro-imagen"
                            src="/img/historialcompra.png"
                            alt="Historial de compra"
                        />
                        <div>
                            <h2>
                                Pedido #{pedido.id} ·{' '}
                                {new Date(pedido.fecha).toLocaleDateString('es-CL')}
                            </h2>
                            <p>
                                {pedido.productos
                                    .map(
                                        (producto) =>
                                            `${producto.nombre} x${producto.cantidad}`,
                                    )
                                    .join(', ')}{' '}
                                · Total: ${pedido.total.toLocaleString('es-CL')} ·{' '}
                                {pedido.estado}.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-volver-tienda"
                            onClick={() =>
                                setPedidoAbierto(
                                    pedidoAbierto === pedido.id ? null : pedido.id,
                                )
                            }
                        >
                            {pedidoAbierto === pedido.id
                                ? 'Ocultar detalle'
                                : 'Ver detalle'}
                        </button>
                        {pedidoAbierto === pedido.id && (
                            <div className="registro-detalle">
                                <strong>Despacho: {pedido.direccion}</strong>
                                <span>Medio de pago: {pedido.metodo}</span>
                                {pedido.productos.map((producto) => (
                                    <span key={producto.codigo}>
                                        {producto.nombre} × {producto.cantidad}: $
                                        {producto.subtotal.toLocaleString('es-CL')}
                                    </span>
                                ))}
                                {pedido.estado === 'PENDIENTE' && (
                                    <button
                                        className="btn btn-tienda"
                                        disabled={ocupado}
                                        onClick={() => cambiar(pedido, false)}
                                    >
                                        Reintentar confirmación
                                    </button>
                                )}
                                {[
                                    'PENDIENTE',
                                    'CONFIRMADO',
                                    'CANCELACION_PENDIENTE',
                                ].includes(pedido.estado) && (
                                    <button
                                        className="btn btn-eliminar"
                                        disabled={ocupado}
                                        onClick={() => cambiar(pedido, true)}
                                    >
                                        Cancelar pedido
                                    </button>
                                )}
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}
