import Input from "../atomos/Input";

type Props ={
    etiqueta: string;
    tipo: string;
    nombre: string;
    valor: string;
    alCambiar: (valor: string) => void;
};

function CampoSesion({etiqueta, tipo, nombre, valor, alCambiar}: Props){
    return(
        <div className="mb-3">
            <label className="form-label">
                {etiqueta}
            </label>
            <Input tipo={tipo} nombre={nombre} valor={valor} alCambiar={alCambiar} />
        </div>
    );
}
export default CampoSesion;
