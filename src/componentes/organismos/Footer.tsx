import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-dark text-white pt-4 pb-2 mt-5" >
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <Link to="/" className="navbar-brand marca d-flex align-items-center gap-2 fw-bold text-white">
                            <img
                                src="/img/logo.png"
                                alt="Logo Veterinaria San Marcos"
                                className="logo-veterinaria"
                                height="40"
                            />
                            <span>Veterinaria San Marcos</span>
                        </Link>
                        <p className="text-white-50 mt-2 mb-0">
                            Cuidando la salud de tus mascotas desde 2009 en Rancagua.
                        </p>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h5 className="text-warning">Horario</h5>
                        <ul className="list-unstyled text-white-50 mb-0">
                            <li>Lunes - Viernes: 13:30 - 19:30</li>
                            <li>Sábados: 9:00 - 13:00</li>
                            <li>Domingo: Cerrado</li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h5 className="text-warning">Contacto</h5>
                        <ul className="list-unstyled text-white-50 mb-0">
                            <li>Av. Brasil 2140, Rancagua</li>
                            <li>+56 9 1234 5678</li>
                            <li>contacto@veterinariasanmarcos.cl</li>
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