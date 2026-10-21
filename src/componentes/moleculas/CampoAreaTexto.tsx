type Props = {
  etiqueta: string;
  nombre: string;
  valor: string;
  filas?: number;
  alCambiar: (valor: string) => void;
};

function CampoAreaTexto({ etiqueta, nombre, valor, filas = 4, alCambiar }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label">{etiqueta}</label>
      <textarea
        name={nombre}
        className="form-control"
        rows={filas}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
      />
    </div>
  );
}

export default CampoAreaTexto;