function Inicio() {
    return (
        <div
            style={{
                backgroundImage: "url('/img/amigos.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "420px",
                display: "flex",
                alignItems: "center",
                padding: "30px"
            }}>
            <div className="text-white">
                <h1 className="mb-3 fw-bold">
                    Veterinaria San Marcos
                </h1>
                <p className="mb-4">
                    Cuidamos a tu mascota con cariño: consultas, vacunas,
                    cirugías y farmacia.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                    <button className="btn btn-warning rounded-pill px-4 py-2" style={{backgroundColor: "#e8c746"}}>
                        Ver servicios
                    </button>
                    <button className="btn btn-light rounded-pill px-4 py-2">
                        Ver productos
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Inicio;