import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { rutasPerfil } from '../../servicios/rutas';
import type { ProductoCarrito } from './CardTienda';
import type { SesionUsuario } from './PerfilProtegido';

function obtenerCantidadCarrito() {
    try {
        const productos: ProductoCarrito[] = JSON.parse(
            localStorage.getItem('carrito-veterinaria') || '[]',
        );
        if (!Array.isArray(productos)) return 0;
        return productos.reduce((total, producto) => total + producto.cantidad, 0);
    } catch {
        return 0;
    }
}

interface NavbarProps {
    sesion: SesionUsuario | null;
    onCerrarSesion: () => void;
}

function Navbar({ sesion, onCerrarSesion }: NavbarProps) {
    const ubicacion = useLocation();
    const esReserva = new URLSearchParams(ubicacion.search).get('pagina') === 'cita';
    const [cantidadCarrito, setCantidadCarrito] = useState(obtenerCantidadCarrito);

    useEffect(() => {
        function actualizarCantidad() {
            setCantidadCarrito(obtenerCantidadCarrito());
        }

        window.addEventListener('carrito-actualizado', actualizarCantidad);
        window.addEventListener('storage', actualizarCantidad);
        return () => {
            window.removeEventListener('carrito-actualizado', actualizarCantidad);
            window.removeEventListener('storage', actualizarCantidad);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light navbar-veterinaria">
            <div className="container-fluid px-4">
                <Link
                    to="/"
                    className="navbar-brand marca d-flex align-items-center gap-2 fw-bold"
                >
                    <img
                        src="/img/logo.png"
                        alt="Logo Veterinaria San Marcos"
                        className="logo-veterinaria"
                        height="40"
                    />

                    <span>Veterinaria San Marcos</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContenido"
                    aria-controls="navbarContenido"
                    aria-expanded="false"
                    aria-label="Abrir menú de navegación"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarContenido">
                    <div className="navbar-nav me-auto ms-lg-4 gap-lg-2">
                        <NavLink className="nav-link fw-semibold" to="/servicios">
                            Servicios
                        </NavLink>

                        <NavLink className="nav-link fw-semibold" to="/equipo">
                            Equipo
                        </NavLink>

                        <NavLink className="nav-link fw-semibold" to="/contacto">
                            Contacto
                        </NavLink>

                        <NavLink className="nav-link fw-semibold" to="/blog">
                            Blog
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                `nav-link fw-semibold${isActive && !esReserva ? ' active' : ''}`
                            }
                            to="/tienda"
                        >
                            Tienda
                        </NavLink>
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                        <Link
                            to="/tienda?pagina=carrito"
                            className="btn btn-carrito"
                            aria-label={
                                cantidadCarrito > 0
                                    ? `Ir al carrito, ${cantidadCarrito} ${cantidadCarrito === 1 ? 'producto' : 'productos'}`
                                    : 'Ir al carrito'
                            }
                            title="Carrito"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="9" cy="20" r="1" />
                                <circle cx="19" cy="20" r="1" />

                                <path d="M2 3h3l2.7 12.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                            </svg>
                            {cantidadCarrito > 0 && (
                                <span className="carrito-cantidad" aria-hidden="true">
                                    {cantidadCarrito}
                                </span>
                            )}
                        </Link>

                        {sesion ? (
                            <>
                                <Link
                                    to={rutasPerfil[sesion.rol]}
                                    className="btn btn-tienda text-nowrap"
                                >
                                    Mi perfil
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-sesion-cerrar text-nowrap"
                                    onClick={onCerrarSesion}
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-tienda text-nowrap">
                                Iniciar sesión
                            </Link>
                        )}

                        <Link
                            to="/tienda?pagina=cita&origen=navbar"
                            className="btn btn-tienda text-nowrap"
                        >
                            Reservar cita
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
