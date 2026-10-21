
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
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

        <div
          className="collapse navbar-collapse"
          id="navbarContenido"
        >
          <div className="navbar-nav me-auto ms-lg-4 gap-lg-2">
            <Link
              className="nav-link fw-semibold"
              to="/#servicios"
            >
              Servicios
            </Link>

            <Link
              className="nav-link fw-semibold"
              to="/#equipo"
            >
              Equipo
            </Link>

            <Link
              className="nav-link fw-semibold"
              to="/#contacto"
            >
              Contacto
            </Link>

            <Link
              className="nav-link fw-semibold"
              to="/#blog"
            >
              Blog
            </Link>

            <NavLink
              className="nav-link fw-semibold"
              to="/tienda"
            >
              Tienda
            </NavLink>
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <Link
              to="/tienda?pagina=carrito"
              className="btn btn-carrito"
              aria-label="Ir al carrito"
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
            </Link>

            <Link
              to="/login"
              className="btn btn-tienda text-nowrap"
            >
              Iniciar sesión
            </Link>

            <Link
              to="/tienda?pagina=cita"
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
