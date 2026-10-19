
import Productos from './paginas/productos';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container py-2">
          <a className="navbar-brand fw-bold" href="/">
            🐾 San Marcos
          </a>

          <span className="text-success fw-semibold">
            Salud y bienestar animal
          </span>
        </div>
      </nav>

      <Productos />
      
      <footer className="text-center py-4 mt-5 bg-light">
        <p className="mb-1 fw-bold">Veterinaria San Marcos</p>
        <small className="text-muted">
          Cuidamos a quienes hacen tu vida más feliz 🐶🐱
        </small>
      </footer>
    </>
  );
}

export default App;
