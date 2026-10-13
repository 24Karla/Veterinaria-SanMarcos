import { Link } from "react-router-dom";

function Navbar() {
    return(
        <nav className="navbar navbar-expand bg-white">
            <div className="container">
                <span className="navbar-brand text-black">
                    Veterinaria San Marcos
                </span>
                <div className="navbar-nav">
                    <Link className="nav-link text black" to="/servicios">
                        Servicios
                    </Link>

                </div>
            </div>
        </nav>
    )
}
export default Navbar;