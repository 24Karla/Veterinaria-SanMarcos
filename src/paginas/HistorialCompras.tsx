
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HistorialCompras() {
    const [pedidoAbierto, setPedidoAbierto] = useState('');

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
