import FormularioSesion from "../componentes/organismos/FormularioSesion";

function Login(){
    return(
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h2 className="mb-4">Inicio se sesión</h2>
                        <FormularioSesion />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;