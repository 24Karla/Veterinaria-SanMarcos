import ListaBlog from '../componentes/organismos/ListaBlog';

export default function Blog() {
  return (
    <section className="container my-4 px-3">
      <div className="text-start mb-4">
        <h2 className="fw-bold text-dark">Blog San Marcos</h2>
        <p className="text-muted">
          Artículos, consejos e información veterinaria para el cuidado responsable de tus mascotas.
        </p>
      </div>

      <ListaBlog />
    </section>
  );
}