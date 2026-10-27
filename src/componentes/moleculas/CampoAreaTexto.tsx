interface CampoAreaTextoProps {
  etiqueta: string;
  nombre: string;
  valor: string;
  filas?: number;
  alCambiar: (valor: string) => void;
  placeholder?: string;
}

export default function CampoAreaTexto({
  etiqueta,
  nombre,
  valor,
  filas = 4,
  alCambiar,
  placeholder,
}: CampoAreaTextoProps) {
  return (
    <div className="mb-3 text-start">
      <label className="form-label fw-bold">{etiqueta}</label>
      <textarea
        name={nombre}
        rows={filas}
        className="form-control"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}