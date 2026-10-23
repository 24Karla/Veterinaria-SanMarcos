import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface PerfilClienteProps {
  sesion: { nombre: string; correo: string };
}

interface Mascota {
  nombre: string;
  detalle: string;
}

export default function PerfilCliente({ sesion }: PerfilClienteProps) {
  const [perfil, setPerfil] = useState(() => {
    const perfilInicial = {
      nombre: sesion.nombre,
      correo: sesion.correo,
      ciudad: 'Rancagua, Chile',
    };

    try {
      const guardado = localStorage.getItem('perfil-cliente');
      return guardado ? JSON.parse(guardado) : perfilInicial;
    } catch {
      return perfilInicial;
    }
  });
  const [mascotas, setMascotas] = useState<Mascota[]>(() => {
    const mascotasIniciales: Mascota[] = [
      { nombre: 'Luna', detalle: 'Perra · Golden Retriever · 4 años' },
      { nombre: 'Milo', detalle: 'Gato · Mestizo · 2 años' },
    ];

    try {
      const guardadas = localStorage.getItem('mascotas-cliente');
      return guardadas ? JSON.parse(guardadas) : mascotasIniciales;
    } catch {
      return mascotasIniciales;
    }
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreMascota, setNombreMascota] = useState('');
  const [especieMascota, setEspecieMascota] = useState('Perro');
  const [edadMascota, setEdadMascota] = useState('');
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState(perfil);

  useEffect(() => {
    localStorage.setItem('mascotas-cliente', JSON.stringify(mascotas));
  }, [mascotas]);

  useEffect(() => {
    localStorage.setItem('perfil-cliente', JSON.stringify(perfil));
  }, [perfil]);

  function agregarMascota(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMascotas((actuales) => [
      ...actuales,
      {
        nombre: nombreMascota.trim(),
        detalle: `${especieMascota} · ${edadMascota.trim()} años`,
      },
    ]);
    setNombreMascota('');
    setEdadMascota('');
    setMostrarFormulario(false);
  }

  function guardarPerfil(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPerfil(datosPerfil);
    setEditandoPerfil(false);
  }

  return (
    <main className="container panel-perfil">
      <header className="perfil-encabezado">
        <span className="perfil-etiqueta">PORTAL CLIENTE</span>
        <h1>Hola, {perfil.nombre}</h1>
        <p>Administra la salud y cuidados de tus mascotas en un solo lugar.</p>
      </header>

      <section className="perfil-grid">
        <article className="perfil-tarjeta perfil-tarjeta-destacada">
          <div>
            <h2>Mi perfil</h2>
            <p>{perfil.correo}</p>
            <p>{perfil.ciudad}</p>
          </div>
          {editandoPerfil ? (
            <form className="formulario-perfil" onSubmit={guardarPerfil}>
              <input
                className="form-control"
                value={datosPerfil.nombre}
                onChange={(event) => setDatosPerfil({ ...datosPerfil, nombre: event.target.value })}
                placeholder="Nombre"
                required
              />
              <input
                className="form-control"
                type="email"
                value={datosPerfil.correo}
                onChange={(event) => setDatosPerfil({ ...datosPerfil, correo: event.target.value })}
                placeholder="Correo"
                required
              />
              <input
                className="form-control"
                value={datosPerfil.ciudad}
                onChange={(event) => setDatosPerfil({ ...datosPerfil, ciudad: event.target.value })}
                placeholder="Ciudad"
                required
              />
              <div>
                <button className="btn btn-tienda me-2" type="submit">Guardar</button>
                <button className="btn btn-volver-tienda" type="button" onClick={() => setEditandoPerfil(false)}>Cancelar</button>
              </div>
            </form>
          ) : (
            <button
              className="btn btn-volver-tienda"
              type="button"
              onClick={() => {
                setDatosPerfil(perfil);
                setEditandoPerfil(true);
              }}
            >
              Editar perfil
            </button>
          )}
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Mis mascotas</h2></div>
          <div className="perfil-lista">
            {mascotas.map((mascota) => (
              <div key={mascota.nombre}>
                <strong>{mascota.nombre}</strong>
                <span>{mascota.detalle}</span>
              </div>
            ))}
          </div>
          {mostrarFormulario ? (
            <form className="formulario-mascota" onSubmit={agregarMascota}>
              <input
                className="form-control"
                value={nombreMascota}
                onChange={(event) => setNombreMascota(event.target.value)}
                placeholder="Nombre de la mascota"
                required
              />
              <select
                className="form-select"
                value={especieMascota}
                onChange={(event) => setEspecieMascota(event.target.value)}
              >
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
              <input
                className="form-control"
                value={edadMascota}
                onChange={(event) => setEdadMascota(event.target.value)}
                placeholder="Edad"
                type="number"
                min="0"
                required
              />
              <div>
                <button className="btn btn-tienda me-2" type="submit">Guardar</button>
                <button className="btn btn-volver-tienda" type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              </div>
            </form>
          ) : (
            <button className="btn btn-tienda" type="button" onClick={() => setMostrarFormulario(true)}>
              Agregar mascota
            </button>
          )}
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Próximas citas</h2></div>
          <div className="perfil-cita">
            <strong>Consulta general · Luna</strong>
            <span>28 de octubre · 11:00 hrs</span>
            <span>Dr. Martín Rojas</span>
          </div>
          <Link className="btn btn-volver-tienda" to="/perfil/cliente/citas">Ver mis citas</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Historial veterinario</h2></div>
          <div className="perfil-lista">
            <div><strong>Vacunación anual</strong><span>Luna · 12 de septiembre de 2026</span></div>
            <div><strong>Control general</strong><span>Milo · 4 de agosto de 2026</span></div>
          </div>
          <Link className="btn btn-volver-tienda" to="/perfil/cliente/historial">Ver historial completo</Link>
        </article>

        <article className="perfil-tarjeta">
          <div className="perfil-titulo"><h2>Mis compras</h2></div>
          <div className="perfil-lista">
            <div><strong>Pedido #1024</strong><span>20 de octubre de 2026 · $11.000 · Entregado</span></div>
            <div><strong>Pedido #1008</strong><span>5 de octubre de 2026 · $9.500 · Entregado</span></div>
          </div>
          <Link className="btn btn-volver-tienda" to="/perfil/cliente/compras">Ver historial de compras</Link>
        </article>
      </section>
    </main>
  );
}
