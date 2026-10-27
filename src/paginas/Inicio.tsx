
import { Link } from 'react-router-dom';

function Inicio() {
    return (
        <>
            {/* Portada principal */}

            <div
                style={{
                    backgroundImage: "url('/img/amigos.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '420px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '30px',
                }}
            >
                <div className="text-white">
                    <h1 className="mb-3 fw-bold">
                        Veterinaria San Marcos
                    </h1>

                    <p className="mb-4">
                        Cuidamos a tu mascota con cariño: consultas, vacunas,
                        cirugías y farmacia.
                    </p>

                    <div className="d-flex gap-3 flex-wrap">
                        <Link
                            to="/servicios"
                            className="btn btn-warning rounded-pill px-4 py-2"
                            style={{
                                backgroundColor: '#e8c746',
                            }}
                        >
                            Ver servicios
                        </Link>

                        <Link
                            to="/tienda"
                            className="btn btn-light rounded-pill px-4 py-2"
                        >
                            Ver productos
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sección de servicios */}

            <section
                className="py-5"
                id="servicios"
            >
                <div className="container text-center mb-4">
                    <h2 className="fw-bold text-dark">
                        Nuestros servicios
                    </h2>

                    <p className="text-secondary">
                        Todo lo que tu mascota necesita en un solo lugar
                    </p>
                </div>

                <div className="container">
                    <div className="row g-4">

                        {/* Consultas */}

                        <div className="col-md-6 col-lg-3">
                            <div
                                className="card h-100 shadow-sm border-0 d-flex flex-column"
                                style={{
                                    backgroundImage: "url('/img/consulta.avif')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <Link
                                    to="/servicios"
                                    className="btn text-white text-nowrap rounded-pill px-4 py-2 mt-auto mx-auto mb-3"
                                    style={{
                                        backgroundColor: '#e8c746',
                                    }}
                                >
                                    Consultas
                                </Link>
                            </div>
                        </div>

                        {/* Vacunación */}

                        <div className="col-md-6 col-lg-3">
                            <div
                                className="card h-100 shadow-sm border-0 d-flex flex-column"
                                style={{
                                    backgroundImage: "url('/img/vacunacion.jpg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <Link
                                    to="/servicios"
                                    className="btn text-white text-nowrap rounded-pill px-4 py-2 mt-auto mx-auto mb-3"
                                    style={{
                                        backgroundColor: '#e8c746',
                                    }}
                                >
                                    Vacunación
                                </Link>
                            </div>
                        </div>

                        {/* Cirugía */}

                        <div className="col-md-6 col-lg-3">
                            <div
                                className="card h-100 shadow-sm border-0 d-flex flex-column"
                                style={{
                                    backgroundImage: "url('/img/cirugia.jpg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <Link
                                    to="/servicios"
                                    className="btn text-white text-nowrap rounded-pill px-4 py-2 mt-auto mx-auto mb-3"
                                    style={{
                                        backgroundColor: '#e8c746',
                                    }}
                                >
                                    Cirugía
                                </Link>
                            </div>
                        </div>

                        {/* Desparasitación */}

                        <div className="col-md-6 col-lg-3">
                            <div
                                className="card h-100 shadow-sm border-0 d-flex flex-column"
                                style={{
                                    backgroundImage: "url('/img/desparasitación.jpg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <Link
                                    to="/servicios"
                                    className="btn text-white text-nowrap rounded-pill px-4 py-2 mt-auto mx-auto mb-3"
                                    style={{
                                        backgroundColor: '#e8c746',
                                    }}
                                >
                                    Desparasitación
                                </Link>
                            </div>
                        </div>

                        {/* Exámenes */}

                        <div className="col-md-6 col-lg-6">
                            <div
                                className="card h-100 shadow-sm border-0 d-flex flex-column"
                                style={{
                                    backgroundImage: "url('/img/examenes.jpg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <Link
                                    to="/servicios"
                                    className="btn text-white text-nowrap rounded-pill px-4 py-2 mt-auto mx-auto mb-3"
                                    style={{
                                        backgroundColor: '#e8c746',
                                    }}
                                >
                                    Exámenes
                                </Link>
                            </div>
                        </div>

                        {/* Otros servicios */}

                        <div className="col-md-6 col-lg-6">
                            <div
                                className="card h-100 shadow-sm border-0 d-flex flex-column"
                                style={{
                                    backgroundImage: "url('/img/otro.jpg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <Link
                                    to="/servicios"
                                    className="btn text-white text-nowrap rounded-pill px-4 py-2 mt-auto mx-auto mb-3"
                                    style={{
                                        backgroundColor: '#e8c746',
                                    }}
                                >
                                    Otros
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Inicio;
