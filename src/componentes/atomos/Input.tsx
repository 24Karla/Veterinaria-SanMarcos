type Props = {
    tipo: string,
    nombre: string;
};

function Input({tipo, nombre}: Props){
    return(
        <input
            type={tipo}
            name={nombre}
            className="form-control"
        />
    );
}
export default Input;