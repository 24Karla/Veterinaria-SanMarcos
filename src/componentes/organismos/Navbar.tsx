import { Link } from "react-router-dom";

function Navbar() {
    return(
        <nav className="navbar navbar-expand bg-white">
            <div className="container-fluid px-4">
                <Link to="/" className="navbar-brand marca d-flex align-items-center gap-2 fw-bold">
                    <img
                        src="/img/logo.png"
                        alt="Logo Veterinaria San Marcos"
                        className="logo-veterinaria"
                        height="40"
                    />
                    <span>Veterinaria San Marcos</span>
                </Link>
                <div className="navbar-nav me-auto ms-4 gap-2">
                    <Link className="nav-link text-dark fw-semibold" to="/servicios">
                        Servicios
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/equipo">
                        Equipo
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/contacto">
                        Contacto
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/blog">
                        Blog
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/tienda">
                        Tienda
                    </Link>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <Link
                        to="/login"
                        className="btn text-white text-nowrap"
                        style={{ backgroundColor: "#e8c746" }}
                    >
                        Iniciar sesión
                    </Link>
                    <Link
                        to="/reservar"
                        className="btn text-white text-nowrap"
                        style={{ backgroundColor: "#e8c746" }}
                    >
                        Reservar cita
                    </Link>
                    <Link to="/carrito" className="text-secondary fs-5">
                        <i className="bi bi-cart"></i>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;