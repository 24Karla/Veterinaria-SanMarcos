import Boton from './Boton';

interface BotonVolverProps {
  onClick: () => void;
  texto?: string;
}

export default function BotonVolver({ onClick, texto = '← Volver a productos' }: BotonVolverProps) {
  return (
    <Boton
      texto={texto}
      type="button"
      className="btn btn-volver-tienda"
      onClick={onClick}
    />
  );
}
