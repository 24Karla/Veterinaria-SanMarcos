import FormularioSesion from "../componentes/organismos/FormularioSesion";

interface LoginProps {
    onLogin: (sesion: {
        nombre: string;
        correo: string;
        rol: 'cliente' | 'veterinario' | 'administrador';
    }) => void;
}

function Login({ onLogin }: LoginProps) {
    return (
        <div className="container mt-5 login-container">
            <div className="row shadow-sm rounded-4 overflow-hidden">
                <div className="col-md-6 p-4 p-md-5 bg-white">
                    <h2 className="titulo-login mb-4">Inicio de sesión</h2>
                    <FormularioSesion onLogin={onLogin} />
                </div>

                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="/img/banner.jpg"
                        alt="Veterinaria San Marcos"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;