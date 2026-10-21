import Input from "../atomos/Input";

type Props = {
  etiqueta: string;
  tipo?: string;
  nombre: string;
  valor: string;
  alCambiar: (valor: string) => void;
};

function CampoTexto({ etiqueta, tipo = "text", nombre, valor, alCambiar }: Props) {
  return (
    <div className="mb-3 text-start">
      <label className="form-label fw-bold">
        {etiqueta}
      </label>
      <Input tipo={tipo} nombre={nombre} valor={valor} alCambiar={alCambiar} />
    </div>
  );
}

export default CampoTexto;