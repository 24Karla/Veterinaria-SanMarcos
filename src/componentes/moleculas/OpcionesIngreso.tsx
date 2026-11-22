import { Link } from 'react-router-dom';

interface Props {
    volverA: string;
    onContinuarInvitado: () => void;
    onGuardarBorrador: () => void;
}

export default function OpcionesIngreso({
    volverA,
    onContinuarInvitado,
    onGuardarBorrador,
}: Props) {
    return (
        <section className="perfil-tarjeta opciones-ingreso">
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <button
                    type="button"
                    className="btn btn-tienda"
                    onClick={onContinuarInvitado}
                >
                    Continuar como invitado
                </button>
                <Link
                    className="btn btn-volver-tienda text-secondary"
                    to="/login"
                    state={{ volverA }}
                    onClick={onGuardarBorrador}
                >
                    Iniciar sesión
                </Link>
            </div>
            <p className="mb-0 mt-3">
                ¿Todavía no tienes cuenta?{' '}
                <Link
                    className="enlace-sesion-opcional"
                    to="/login"
                    state={{ volverA, crearCuenta: true }}
                    onClick={onGuardarBorrador}
                >
                    Crear cuenta
                </Link>
            </p>
        </section>
    );
}
