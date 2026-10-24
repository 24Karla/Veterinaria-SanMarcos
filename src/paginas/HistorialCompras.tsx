
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Compra {
    id: number;
    fecha: string;
    productos: { nombre: string; cantidad: number }[];
    total: number;
    estado: string;
}

export default function HistorialCompras() {
    const [pedidoAbierto, setPedidoAbierto] = useState('');
    const [compras] = useState<Compra[]>(() => {
        try {
            const guardadas = localStorage.getItem('compras-cliente');
            return guardadas ? JSON.parse(guardadas) : [];
        } catch {
            return [];
        }
    });

    const formatoPrecio = (precio: number) =>
        new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        }).format(precio);

    return (
        <main className="container panel-perfil">

            <Link
                to="/perfil/cliente"
                className="btn btn-volver-tienda mb-4"
            >
                ← Volver a mi perfil
            </Link>

            <header className="perfil-encabezado">
                <span className="perfil-etiqueta">
                    PORTAL CLIENTE
                </span>

                <h1>Historial de compras</h1>

                <p>
                    Revisa los pedidos que has realizado en la tienda.
                </p>
            </header>

            <section className="lista-registros">

                {compras.map((compra) => {
                    const identificador = String(compra.id);
                    const productos = compra.productos
                        .map((producto) => `${producto.nombre} x${producto.cantidad}`)
                        .join(', ');

                    return (
                        <article className="registro-cita" key={compra.id}>
                            <div className="registro-fecha">Pedido</div>

                            <div>
                                <h2>Pedido #{compra.id} · {compra.fecha}</h2>
                                <p>{productos} · Total: {formatoPrecio(compra.total)} · {compra.estado}.</p>
                            </div>

                            <button
                                type="button"
                                className="btn btn-volver-tienda"
                                onClick={() => setPedidoAbierto(pedidoAbierto === identificador ? '' : identificador)}
                            >
                                {pedidoAbierto === identificador ? 'Ocultar detalle' : 'Ver detalle'}
                            </button>

                            {pedidoAbierto === identificador && (
                                <div className="registro-detalle">
                                    <strong>Productos: {productos}</strong>
                                    <span>Total pagado: {formatoPrecio(compra.total)} · Estado: {compra.estado}</span>
                                </div>
                            )}
                        </article>
                    );
                })}

                <article className="registro-cita">
                    <div className="registro-fecha">
                        Pedido
                    </div>

                    <div>
                        <h2>Pedido #1024 · 20 de octubre de 2026</h2>

                        <p>
                            Amoxibay 250 mg y Enrox 50 mg ·
                            Total: $11.000 · Entregado.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-volver-tienda"
                        onClick={() =>
                            setPedidoAbierto(
                                pedidoAbierto === '1024' ? '' : '1024'
                            )
                        }
                    >
                        {pedidoAbierto === '1024'
                            ? 'Ocultar detalle'
                            : 'Ver detalle'}
                    </button>

                    {pedidoAbierto === '1024' && (
                        <div className="registro-detalle">
                            <strong>
                                Productos: Amoxibay 250 mg y Enrox 50 mg
                            </strong>

                            <span>
                                Total pagado: $11.000 · Estado: Entregado
                            </span>
                        </div>
                    )}
                </article>

                <article className="registro-cita">
                    <div className="registro-fecha">
                        Pedido
                    </div>

                    <div>
                        <h2>Pedido #1008 · 5 de octubre de 2026</h2>

                        <p>
                            Nexgard · Total: $9.500 · Entregado.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-volver-tienda"
                        onClick={() =>
                            setPedidoAbierto(
                                pedidoAbierto === '1008' ? '' : '1008'
                            )
                        }
                    >
                        {pedidoAbierto === '1008'
                            ? 'Ocultar detalle'
                            : 'Ver detalle'}
                    </button>

                    {pedidoAbierto === '1008' && (
                        <div className="registro-detalle">
                            <strong>
                                Producto: Nexgard
                            </strong>

                            <span>
                                Total pagado: $9.500 · Estado: Entregado
                            </span>
                        </div>
                    )}
                </article>

            </section>
        </main>
    );
}
