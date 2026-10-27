import ListaEquipo from '../componentes/organismos/ListaEquipo';

export default function Equipo() {
  return (
    <section className="container my-4 px-3 text-start">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Nuestro Equipo Médico</h2>
        <p className="text-muted">
          Conoce a los profesionales de la Veterinaria San Marcos dedicados al cuidado y salud de tu mascota en Rancagua.
        </p>
      </div>

      <ListaEquipo />
    </section>
  );
}