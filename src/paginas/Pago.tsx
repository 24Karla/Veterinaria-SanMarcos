
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
    const [datos, setDatos] = useState({
        nombre: '',
        correo: '',
        direccion: '',
        metodo: '',
    });

    const [totalPagado, setTotalPagado] = useState<number | null>(null);

    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
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

    function confirmarPago(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

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
                    .join('\n')}`
            );

            return;
        }

        const pedidoNuevo = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-CL'),
            productos: carrito.map((producto) => ({
                nombre: producto.nombre,
                cantidad: producto.cantidad,
            })),
            total,
            estado: 'Confirmado',
        };

        try {
            const guardados = localStorage.getItem('compras-cliente');
            const comprasAnteriores = guardados ? JSON.parse(guardados) : [];
            localStorage.setItem('compras-cliente', JSON.stringify([pedidoNuevo, ...comprasAnteriores]));
        } catch {
            localStorage.setItem('compras-cliente', JSON.stringify([pedidoNuevo]));
        }

        setTotalPagado(total);
        onFinalizar();
    }

    if (totalPagado !== null) {
        return (
            <main className="container pagina-pago">
                <section className="pago-confirmado">
                    <span>✓</span>

                    <h1>¡Compra realizada!</h1>

                    <p className="pago-confirmado-mensaje">
                        Enviaremos la confirmación a{' '}
                        <strong>{datos.correo}</strong>.
                    </p>

                    <div className="pago-confirmado-total">
                        <span>Total pagado</span>

                        <strong>
                            {formatoPrecio(totalPagado)}
                        </strong>
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

                    <p>
                        Agrega productos al carrito antes de continuar.
                    </p>

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

            <p className="pago-subtitulo">
                Completa tus datos para confirmar tu pedido.
            </p>

            <div className="pago-contenido">
                <form
                    className="pago-formulario"
                    noValidate
                    onSubmit={confirmarPago}
                >
                    <h2>Datos de despacho</h2>

                    <label htmlFor="nombre">
                        Nombre completo
                    </label>

                    <input
                        id="nombre"
                        className="form-control"
                        value={datos.nombre}
                        onChange={(event) =>
                            cambiar('nombre', event.target.value)
                        }
                    />

                    <label htmlFor="correo">
                        Correo electrónico
                    </label>

                    <input
                        id="correo"
                        type="email"
                        className="form-control"
                        value={datos.correo}
                        onChange={(event) =>
                            cambiar('correo', event.target.value)
                        }
                    />

                    <label htmlFor="direccion">
                        Dirección de despacho
                    </label>

                    <input
                        id="direccion"
                        className="form-control"
                        value={datos.direccion}
                        onChange={(event) =>
                            cambiar('direccion', event.target.value)
                        }
                    />

                    <label htmlFor="metodo">
                        Medio de pago
                    </label>

                    <select
                        id="metodo"
                        className="form-select"
                        value={datos.metodo}
                        onChange={(event) =>
                            cambiar('metodo', event.target.value)
                        }
                    >
                        <option value="">
                            Selecciona un medio de pago
                        </option>

                        <option value="Debito">
                            Tarjeta de débito
                        </option>

                        <option value="Credito">
                            Tarjeta de crédito
                        </option>

                        <option value="Transferencia">
                            Transferencia bancaria
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="btn btn-tienda w-100 mt-4"
                    >
                        Confirmar pago
                    </button>
                </form>

                <aside className="pago-resumen">
                    <h2>Resumen del pedido</h2>

                    {carrito.map((producto) => (
                        <div
                            className="pago-item"
                            key={producto.codigo}
                        >
                            <span>
                                {producto.nombre} × {producto.cantidad}
                            </span>

                            <strong>
                                {formatoPrecio(
                                    producto.precio * producto.cantidad
                                )}
                            </strong>
                        </div>
                    ))}

                    <div className="pago-total">
                        <span>Total</span>

                        <strong>
                            {formatoPrecio(total)}
                        </strong>
                    </div>
                </aside>
            </div>
        </main>
    );
}
