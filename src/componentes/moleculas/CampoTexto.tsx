interface CampoTextoProps {
  etiqueta: string;
  tipo?: string;
  nombre: string;
  valor: string;
  alCambiar: (valor: string) => void;
  placeholder?: string;
}

export default function CampoTexto({
  etiqueta,
  tipo = 'text',
  nombre,
  valor,
  alCambiar,
  placeholder,
}: CampoTextoProps) {
  return (
    <div className="mb-3 text-start">
      <label className="form-label fw-bold">{etiqueta}</label>
      <input
        type={tipo}
        name={nombre}
        className="form-control"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}