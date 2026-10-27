import ListaServicios from '../componentes/organismos/ListaServicios';

export default function Servicios() {
  return (
    <section className="container my-4 px-3 text-start">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Nuestros Servicios Vet</h2>
        <p className="text-muted">
          Ofrecemos atención veterinaria integral con altos estándares de calidad y cariño para tu mascota en Rancagua.
        </p>
      </div>

      <ListaServicios />
    </section>
  );
}