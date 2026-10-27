import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="text-white pt-4 pb-2 mt-5" style={{backgroundColor: "#063d2f"}} >
            <div className="container py-3">
                <div className="row g-4">
                    <div className="col-md-4 mb-3">
                        <Link to="/" className="navbar-brand marca d-flex align-items-center gap-2 fw-bold text-white">
                            <img
                                src="/img/logo.png"
                                alt="Logo Veterinaria San Marcos"
                                className="logo-veterinaria"
                                height="25"
                            />
                            <span>Veterinaria San Marcos</span>
                        </Link>
                        <p className="text-white-50 mt-2 mb-0 small">
                            Cuidando la salud de tus mascotas desde 2009 en Rancagua.
                        </p>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h3 className="fw-bold text-white mb-3 fs-6">Horario</h3>
                        <ul className="list-unstyled text-white-50 mb-0 small">
                            <li className="mb-1">Lunes - Viernes: 13:30 - 19:30</li>
                            <li className="mb-1">Sábados: 9:00 - 13:00</li>
                            <li className="mb-1">Domingo: Cerrado</li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h3 className="fw-bold text-white mb-3 fs-6">Contacto</h3>
                        <ul className="list-unstyled text-white-50 mb-0 small">
                            <li className="mb-1">Av. Brasil 2140, Rancagua</li>
                            <li className="mb-1">+56 9 1234 5678</li>
                            <li className="mb-1">contacto@veterinariasanmarcos.cl</li>
                        </ul>
                    </div>
                </div>

                <div className="border-top border-secondary pt-3 mt-2 text-center">
                    <p className="text-white-50 mb-0 small">
                        © 2026 Veterinaria San Marcos. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;