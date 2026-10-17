import CampoSesion from "../moleculas/CampoSesion";

function FormularioSesion(){
    return (
        <form>
            <CampoSesion
                etiqueta="Correo electrónico"
                tipo="email"
                nombre="correo"
            />
            <CampoSesion
                etiqueta="Contraseña"
                tipo="password"
                nombre="contraseña"
            />

            <button type="submit" className="btn btn-primary" style={{backgroundColor: "#d99a3e"}}>
                Ingresar
            </button>

        </form>
    )
}