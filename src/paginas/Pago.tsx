import { Link } from 'react-router-dom';
import OpcionesIngreso from '../componentes/moleculas/OpcionesIngreso';
import {
    api,
    mostrarErrorFormulario,
    pedirDatos,
    ErrorApi,
    obtenerSesion,
    type PedidoApi,
} from '../servicios/api';

import { useState, type FormEvent } from 'react';
import type { ProductoCarrito } from '../componentes/organismos/CardTienda';

interface PagoProps {
    carrito: ProductoCarrito[];
    onVolver: () => void;
    onIrProductos: () => void;
    onFinalizar: () => void;
}

export default function Pago({
    carrito,
    onVolver,
    onIrProductos,
    onFinalizar,
}: PagoProps) {
    const [continuarInvitado, setContinuarInvitado] = useState(false);
    const [datos, setDatos] = useState(() => {
        let guardados = { nombre: '', correo: '', direccion: '', metodo: '' };
        try {
            const borrador = sessionStorage.getItem('despacho-veterinaria');
            if (borrador) guardados = { ...guardados, ...JSON.parse(borrador) };
        } catch {
            /* Si no hay un borrador válido, se muestran los campos vacíos. */
        }
        const sesion = obtenerSesion();
        return {
            ...guardados,
            nombre: sesion?.nombre || guardados.nombre,
            correo: sesion?.correo || guardados.correo,
        };
    });

    const [totalPagado, setTotalPagado] = useState<number | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [pedidoPendiente, setPedidoPendiente] = useState<number | null>(null);
    const [referencia] = useState(() => {
        const clave = 'referencia-pedido-' + (obtenerSesion()?.correo || 'cliente');
        let valor = sessionStorage.getItem(clave);
        if (!valor) {
            valor = crypto.randomUUID();
            sessionStorage.setItem(clave, valor);
        }
        return valor;
    });

    const total = carrito.reduce(
        (suma, producto) => suma + producto.precio * producto.cantidad,
        0,
    );

    const formatoPrecio = (precio: number) =>
        new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
        }).format(precio);

    function cambiar(campo: keyof typeof datos, valor: string) {
        setDatos((actual) => ({
            ...actual,
            [campo]: valor,
        }));
    }

    async function confirmarPago(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (enviando) return;
        setError('');

        const nuevosErrores: Record<string, string> = {};

        if (!datos.nombre.trim()) {
            nuevosErrores.nombre = 'Ingresa tu nombre.';
        }

        if (!/^\S+@\S+\.\S+$/.test(datos.correo)) {
            nuevosErrores.correo = 'Ingresa un correo válido.';
        }

        if (!datos.direccion.trim()) {
            nuevosErrores.direccion = 'Ingresa una dirección de despacho.';
        }

        if (!datos.metodo) {
            nuevosErrores.metodo = 'Selecciona un medio de pago.';
        }

        if (Object.keys(nuevosErrores).length > 0) {
            alert(
                `Revisa los siguientes datos:\n\n${Object.values(nuevosErrores)
                    .map((error) => `• ${error}`)
                    .join('\n')}`,
            );

            return;
        }

        setEnviando(true);
        try {
            const pedido = pedidoPendiente
                ? await pedirDatos<PedidoApi>(
                      `${api.pedidos}/api/pedidos/${pedidoPendiente}/confirmar`,
                      {
                          method: 'POST',
                      },
                  )
                : await pedirDatos<PedidoApi>(`${api.pedidos}/api/pedidos`, {
                      method: 'POST',
                      headers: { 'Idempotency-Key': referencia },
                      body: JSON.stringify({
                          nombreCompleto: datos.nombre,
                          correo: obtenerSesion()?.correo || datos.correo,
                          direccion: datos.direccion,
                          metodo: datos.metodo,
                          productos: carrito.map((producto) => ({
                              codigo: producto.codigo,
                              cantidad: producto.cantidad,
                          })),
                      }),
                  });
            setTotalPagado(pedido.total);
            sessionStorage.removeItem(
                'referencia-pedido-' + (obtenerSesion()?.correo || 'cliente'),
            );
            sessionStorage.removeItem('despacho-veterinaria');
            onFinalizar();
        } catch (error) {
            if (error instanceof ErrorApi && error.pedidoId) {
                setPedidoPendiente(error.pedidoId);
            }
            mostrarErrorFormulario(error, setError);
        } finally {
            setEnviando(false);
        }
    }

    if (totalPagado !== null) {
        return (
            <main className="container pagina-pago">
                <section className="pago-confirmado">
                    <span>✓</span>

                    <h1>¡Pedido confirmado!</h1>

                    <p className="pago-confirmado-mensaje">
                        El pedido quedó registrado para <strong>{datos.correo}</strong>.
                    </p>

                    <div className="pago-confirmado-total">
                        <span>Total del pedido</span>

                        <strong>{formatoPrecio(totalPagado)}</strong>
                    </div>

                    <button
                        type="button"
                        className="btn btn-tienda pago-confirmado-accion"
                        onClick={onIrProductos}
                    >
                        ← Volver a productos
                    </button>
                </section>
            </main>
        );
    }

    if (carrito.length === 0) {
        return (
            <main className="container pagina-pago">
                <section className="pago-vacio">
                    <h1>No hay productos para pagar</h1>

                    <p>Agrega productos al carrito antes de continuar.</p>

                    <button
                        type="button"
                        className="btn btn-volver-tienda"
                        onClick={onVolver}
                    >
                        ← Volver a productos
                    </button>
                </section>
            </main>
        );
    }

    if (!obtenerSesion() && !continuarInvitado) {
        return (
            <main className="container pagina-pago">
                <button
                    type="button"
                    className="btn btn-volver-tienda"
                    onClick={onVolver}
                >
                    ← Volver al carrito
                </button>
                <h1>Finalizar compra</h1>
                <OpcionesIngreso
                    volverA="/tienda?pagina=pago"
                    onContinuarInvitado={() => setContinuarInvitado(true)}
                    onGuardarBorrador={() =>
                        sessionStorage.setItem(
                            'despacho-veterinaria',
                            JSON.stringify(datos),
                        )
                    }
                />
            </main>
        );
    }

    return (
        <main className="container pagina-pago">
            <button type="button" className="btn btn-volver-tienda" onClick={onVolver}>
                ← Volver al carrito
            </button>

            <h1>Finalizar compra</h1>

            <p className="pago-subtitulo">Completa tus datos para confirmar tu pedido.</p>
            {!obtenerSesion() && !pedidoPendiente && (
                <p className="mb-4">
                    Puedes comprar como invitado.{' '}
                    <Link
                        className="enlace-sesion-opcional"
                        to="/login"
                        state={{ volverA: '/tienda?pagina=pago' }}
                        onClick={() =>
                            sessionStorage.setItem(
                                'despacho-veterinaria',
                                JSON.stringify(datos),
                            )
                        }
                    >
                        Iniciar sesión (opcional)
                    </Link>
                </p>
            )}

            <div className="pago-contenido">
                <form className="pago-formulario" noValidate onSubmit={confirmarPago}>
                    <h2>Datos de despacho</h2>
                    {error && (
                        <p role="alert" className="alert alert-danger">
                            {error}
                        </p>
                    )}
                    {pedidoPendiente && (
                        <p>
                            Pedido #{pedidoPendiente} pendiente. Reintenta para confirmar
                            el stock.
                        </p>
                    )}
                    <fieldset disabled={enviando || pedidoPendiente !== null}>
                        <label htmlFor="nombre">Nombre completo</label>

                        <input
                            id="nombre"
                            className="form-control"
                            value={datos.nombre}
                            onChange={(event) => cambiar('nombre', event.target.value)}
                        />

                        <label htmlFor="correo">Correo electrónico</label>

                        <input
                            id="correo"
                            readOnly={!!obtenerSesion()}
                            type="email"
                            className="form-control"
                            value={datos.correo}
                            onChange={(event) => cambiar('correo', event.target.value)}
                        />

                        <label htmlFor="direccion">Dirección de despacho</label>

                        <input
                            id="direccion"
                            className="form-control"
                            value={datos.direccion}
                            onChange={(event) => cambiar('direccion', event.target.value)}
                        />

                        <label htmlFor="metodo">Medio de pago</label>

                        <select
                            id="metodo"
                            className="form-select"
                            value={datos.metodo}
                            onChange={(event) => cambiar('metodo', event.target.value)}
                        >
                            <option value="">Selecciona un medio de pago</option>

                            <option value="Debito">Tarjeta de débito</option>

                            <option value="Credito">Tarjeta de crédito</option>

                            <option value="Transferencia">Transferencia bancaria</option>
                        </select>
                    </fieldset>
                    <p className="small mt-3">
                        Se registra el pedido y el medio de pago. No se realiza un cobro
                        bancario en línea.
                    </p>
                    <button
                        type="submit"
                        className="btn btn-tienda w-100 mt-4"
                        disabled={enviando}
                    >
                        {enviando
                            ? 'Confirmando…'
                            : pedidoPendiente
                              ? 'Reintentar confirmación'
                              : 'Confirmar pedido'}
                    </button>
                </form>

                <aside className="pago-resumen">
                    <h2>Resumen del pedido</h2>

                    {carrito.map((producto) => (
                        <div className="pago-item" key={producto.codigo}>
                            <span>
                                {producto.nombre} × {producto.cantidad}
                            </span>

                            <strong>
                                {formatoPrecio(producto.precio * producto.cantidad)}
                            </strong>
                        </div>
                    ))}

                    <div className="pago-total">
                        <span>Total</span>

                        <strong>{formatoPrecio(total)}</strong>
                    </div>
                </aside>
            </div>
        </main>
    );
}
