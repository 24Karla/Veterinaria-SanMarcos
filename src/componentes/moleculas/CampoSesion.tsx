import Input from "../atomos/Input";

type Props ={
    etiqueta: string;
    tipo: string;
    nombre: string;};

function CampoSesion({etiqueta, tipo, nombre}: Props){
    return(
        <div className="mb-3">
            <label className="form-label">
                {etiqueta}
            </label>
            <Input tipo={tipo} nombre={nombre} />
        </div>
    );
}
export default CampoSesion;
