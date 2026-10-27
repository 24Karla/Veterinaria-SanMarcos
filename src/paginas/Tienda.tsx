
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type {
    Producto,
    ProductoCarrito,
} from '../componentes/organismos/CardTienda';

import Carrito from './Carrito';
import Pago from './Pago';
import Productos from './Productos';
import ReservarCita from './ReservarCita';
import VerProducto from './VerProducto';

type PaginaTienda =
    | 'productos'
    | 'carrito'
    | 'cita'
    | 'detalle'
    | 'pago';

export default function Tienda() {
    const { search } = useLocation();

    return <ContenidoTienda key={search} />;
}

function ContenidoTienda() {
    const { search } = useLocation();
    const navigate = useNavigate();

    const parametros = new URLSearchParams(search);

    const paginaSolicitada = parametros.get('pagina');
    const origenCita = parametros.get('origen');
    const servicioSeleccionado = parametros.get('servicio') ?? '';

    const paginaInicial: PaginaTienda =
        paginaSolicitada === 'carrito' || paginaSolicitada === 'cita'
            ? paginaSolicitada
            : 'productos';

    const [carrito, setCarrito] = useState<ProductoCarrito[]>(() => {
        try {
            const guardado = localStorage.getItem('carrito-veterinaria');

            return guardado
                ? JSON.parse(guardado)
                : [];
        } catch {
            return [];
        }
    });

    const [pagina, setPagina] = useState<PaginaTienda>(paginaInicial);

    const [productoSeleccionado, setProductoSeleccionado] =
        useState<Producto | null>(null);

    useEffect(() => {
        localStorage.setItem(
            'carrito-veterinaria',
            JSON.stringify(carrito)
        );
    }, [carrito]);

    function agregarProducto(producto: Producto) {
        setCarrito((actual) => {
            const existe = actual.find(
                (item) => item.codigo === producto.codigo
            );

            if (existe) {
                if (producto.stock <= 0) {
                    return actual;
                }

                return actual.map((item) =>
                    item.codigo === producto.codigo
                        ? {
                              ...item,
                              cantidad: Math.min(
                                  item.cantidad + 1,
                                  item.stock
                              ),
                          }
                        : item
                );
            }

            if (producto.stock <= 0) {
                return actual;
            }

            return [
                ...actual,
                {
                    ...producto,
                    cantidad: 1,
                },
            ];
        });
    }

    function cambiarCantidad(codigo: string, cantidad: number) {
        if (cantidad <= 0) {
            eliminarProducto(codigo);
            return;
        }

        setCarrito((actual) =>
            actual.map((item) =>
                item.codigo === codigo
                    ? {
                          ...item,
                          cantidad: Math.min(
                              cantidad,
                              item.stock
                          ),
                      }
                    : item
            )
        );
    }

    function eliminarProducto(codigo: string) {
        setCarrito((actual) =>
            actual.filter(
                (item) => item.codigo !== codigo
            )
        );
    }

    if (pagina === 'productos') {
        return (
            <Productos
                onVerDetalle={(producto) => {
                    setProductoSeleccionado(producto);
                    setPagina('detalle');
                }}
                onAgregar={agregarProducto}
                carrito={carrito}
                onCambiarCantidad={cambiarCantidad}
            />
        );
    }

    if (pagina === 'detalle' && productoSeleccionado) {
        return (
            <VerProducto
                producto={productoSeleccionado}
                cantidad={
                    carrito.find(
                        (item) =>
                            item.codigo === productoSeleccionado.codigo
                    )?.cantidad ?? 0
                }
                onAgregar={agregarProducto}
                onCambiarCantidad={cambiarCantidad}
                onVolver={() => setPagina('productos')}
            />
        );
    }

    if (pagina === 'pago') {
        return (
            <Pago
                carrito={carrito}
                onVolver={() => setPagina('carrito')}
                onIrProductos={() => setPagina('productos')}
                onFinalizar={() => setCarrito([])}
            />
        );
    }

    if (pagina === 'cita') {
        const volverAlInicio =
            origenCita === 'navbar' ||
            origenCita === 'servicios';

        const textoVolver =
            origenCita === 'perfil'
                ? 'Volver a mi perfil'
                : volverAlInicio
                  ? 'Volver al inicio'
                  : 'Volver a productos';

        return (
            <ReservarCita
                onVolver={() => {
                    if (origenCita === 'perfil') {
                        navigate('/perfil/cliente');
                    } else if (volverAlInicio) {
                        navigate('/');
                    } else {
                        setPagina('productos');
                    }
                }}
                textoVolver={textoVolver}
                servicioSeleccionado={servicioSeleccionado}
            />
        );
    }

    return (
        <Carrito
            carrito={carrito}
            onCambiarCantidad={cambiarCantidad}
            onEliminar={eliminarProducto}
            onVolver={() => setPagina('productos')}
            onPagar={() => setPagina('pago')}
        />
    );
}
