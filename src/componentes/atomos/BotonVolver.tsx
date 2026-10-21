import Boton from './Boton';

interface BotonVolverProps {
  onClick: () => void;
}

export default function BotonVolver({ onClick }: BotonVolverProps) {
  return (
    <Boton
      texto="← Volver a productos"
      type="button"
      className="btn btn-volver-tienda"
      onClick={onClick}
    />
  );
}
