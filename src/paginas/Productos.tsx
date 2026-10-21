
import { useMemo, useState } from 'react';
import Boton from '../componentes/atomos/Boton';
import type {
  Producto,
  ProductoCarrito,
} from '../componentes/organismos/CardTienda';
import CardTienda from '../componentes/organismos/CardTienda';

const productos: Producto[] = [
  {
    codigo: 'ME001',
    categoria: 'Antibióticos',
    nombre: 'Amoxibay 250mg',
    principioActivo: 'Amoxicilina',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stock: 45,
    precio: 4200,
    imagen: '/img/Amoxibay.jpg',
  },
  {
    codigo: 'ME002',
    categoria: 'Antibióticos',
    nombre: 'Enrox 50mg',
    principioActivo: 'Enrofloxacino',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stock: 30,
    precio: 6800,
    imagen: '/img/Enrox.jpg',
  },
  {
    codigo: 'ME003',
    categoria: 'Antibióticos',
    nombre: 'Metrobay 250mg',
    principioActivo: 'Metronidazol',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stock: 28,
    precio: 3900,
    imagen: '/img/Metrobay.jpg',
  },
  {
    codigo: 'ME004',
    categoria: 'Antiparasitarios',
    nombre: 'Nexgard',
    principioActivo: 'Afoxolaner',
    presentacion: 'Masticable 1 unid.',
    especie: 'Perro',
    stock: 60,
    precio: 9500,
    imagen: '/img/Nexgard.jpg',
  },
  {
    codigo: 'ME005',
    categoria: 'Antiparasitarios',
    nombre: 'Bravecto',
    principioActivo: 'Fluralaner',
    presentacion: 'Masticable 1 unid.',
    especie: 'Perro',
    stock: 40,
    precio: 18900,
    imagen: '/img/Bravecto.jpg',
  },
  {
    codigo: 'ME006',
    categoria: 'Antiparasitarios',
    nombre: 'Revolution Plus',
    principioActivo: 'Selamectina + Sarolaner',
    presentacion: 'Pipeta 1 unid.',
    especie: 'Gato',
    stock: 35,
    precio: 14500,
    imagen: '/img/Revolution.jpg',
  },
  {
    codigo: 'ME007',
    categoria: 'Antiparasitarios',
    nombre: 'Drontal Plus',
    principioActivo: 'Praziquantel + Pamoato',
    presentacion: 'Comprimido 1 unid.',
    especie: 'Perro',
    stock: 80,
    precio: 3200,
    imagen: '/img/Drontal.jpg',
  },
  {
    codigo: 'ME008',
    categoria: 'Antiparasitarios',
    nombre: 'Milbemax Gato',
    principioActivo: 'Milbemicina + Praziq.',
    presentacion: 'Comprimido 2 unid.',
    especie: 'Gato',
    stock: 50,
    precio: 6800,
    imagen: '/img/Milbemax.jpg',
  },
  {
    codigo: 'ME009',
    categoria: 'Antiinflamatorios',
    nombre: 'Meloxicam 1mg',
    principioActivo: 'Meloxicam',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stock: 55,
    precio: 4500,
    imagen: '/img/Meloxicam.jpg',
  },
  {
    codigo: 'ME010',
    categoria: 'Antiinflamatorios',
    nombre: 'Carprofen 50mg',
    principioActivo: 'Carprofeno',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro',
    stock: 30,
    precio: 9800,
    imagen: '/img/Carprofen.jpg',
  },
  {
    codigo: 'ME011',
    categoria: 'Dermatología',
    nombre: 'Clorhexidina shampoo',
    principioActivo: 'Clorhexidina 2%',
    presentacion: 'Frasco 250ml',
    especie: 'Perro / Gato',
    stock: 25,
    precio: 8900,
    imagen: '/img/Clorhexidina.jpg',
  },
  {
    codigo: 'ME012',
    categoria: 'Dermatología',
    nombre: 'Malaseb shampoo',
    principioActivo: 'Miconazol + Clorhex.',
    presentacion: 'Frasco 250ml',
    especie: 'Perro / Gato',
    stock: 20,
    precio: 12500,
    imagen: '/img/Malaseb.jpg',
  },
  {
    codigo: 'ME013',
    categoria: 'Dermatología',
    nombre: 'Apoquel 16mg',
    principioActivo: 'Oclacitinib',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro',
    stock: 18,
    precio: 22000,
    imagen: '/img/Apoquel.jpg',
  },
  {
    codigo: 'ME014',
    categoria: 'Digestivo',
    nombre: 'Probifor',
    principioActivo: 'Bacillus clausii',
    presentacion: 'Sobre 5ml x10',
    especie: 'Perro / Gato',
    stock: 40,
    precio: 5600,
    imagen: '/img/Probifor.png',
  },
  {
    codigo: 'ME015',
    categoria: 'Digestivo',
    nombre: 'Omeprazol 10mg vet',
    principioActivo: 'Omeprazol',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stock: 35,
    precio: 3800,
    imagen: '/img/Omeprazol.jpg',
  },
  {
    codigo: 'ME016',
    categoria: 'Cardíaco',
    nombre: 'Vetmedin 2.5mg',
    principioActivo: 'Pimobendan',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro',
    stock: 15,
    precio: 28000,
    imagen: '/img/Vetmedin.jpg',
  },
  {
    codigo: 'ME017',
    categoria: 'Analgésicos',
    nombre: 'Tramadol 50mg vet',
    principioActivo: 'Tramadol',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro',
    stock: 22,
    precio: 5200,
    imagen: '/img/Tramadol.jpg',
  },
  {
    codigo: 'ME018',
    categoria: 'Vacunas',
    nombre: 'Nobivac DHPPi',
    principioActivo: 'Vacuna polivalente',
    presentacion: 'Vial 1 dosis',
    especie: 'Perro',
    stock: 48,
    precio: 8500,
    imagen: '/img/Nobivac.jpg',
  },
  {
    codigo: 'ME019',
    categoria: 'Vacunas',
    nombre: 'Nobivac Rabies',
    principioActivo: 'Vacuna antirrábica',
    presentacion: 'Vial 1 dosis',
    especie: 'Perro / Gato',
    stock: 60,
    precio: 5800,
    imagen: '/img/NobivacR.jpg',
  },
  {
    codigo: 'ME020',
    categoria: 'Vacunas',
    nombre: 'Felocell CVR',
    principioActivo: 'Vacuna triple felina',
    presentacion: 'Vial 1 dosis',
    especie: 'Gato',
    stock: 36,
    precio: 7200,
    imagen: '/img/Felocell.jpg',
  },
  {
    codigo: 'ME021',
    categoria: 'Suplementos',
    nombre: 'Omega vet 3,6',
    principioActivo: 'Ácidos grasos omega',
    presentacion: 'Frasco 100ml',
    especie: 'Perro / Gato',
    stock: 30,
    precio: 9900,
    imagen: '/img/Omega.jpg',
  },
  {
    codigo: 'ME022',
    categoria: 'Suplementos',
    nombre: 'Condrovet forte',
    principioActivo: 'Condroitín + Glucos.',
    presentacion: 'Blíster 30 comp.',
    especie: 'Perro',
    stock: 25,
    precio: 14500,
    imagen: '/img/Condrovet.jpg',
  },
];

interface ProductosProps {
  onVerDetalle: (producto: Producto) => void;
  onAgregar: (producto: Producto) => void;
  carrito: ProductoCarrito[];
  onCambiarCantidad: (codigo: string, cantidad: number) => void;
}

export default function Productos({
  onVerDetalle,
  onAgregar,
  carrito,
  onCambiarCantidad,
}: ProductosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const categorias = useMemo(
    () => [
      'Todas',
      ...new Set(productos.map((producto) => producto.categoria)),
    ],
    [],
  );

  const productosFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es');

    return productos.filter((producto) => {
      const coincideTexto = [
        producto.codigo,
        producto.nombre,
        producto.principioActivo,
        producto.categoria,
      ].some((campo) =>
        campo.toLocaleLowerCase('es').includes(consulta),
      );

      const coincideCategoria =
        categoria === 'Todas' || producto.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  }, [busqueda, categoria]);

  return (
    <main>
      <section className="tienda-portada">
        <div className="container">
          <span className="tienda-etiqueta">
            VETERINARIA SAN MARCOS
          </span>

          <h2>Productos</h2>
          <p>Medicamentos y vacunas en stock</p>
        </div>
      </section>

      <section className="container seccion-catalogo" id="catalogo">
        <div className="catalogo-titulo">
          <div>
            <span className="tienda-etiqueta">
              NUESTRO CATÁLOGO
            </span>
            <h2>Productos para su bienestar</h2>
            <p>Encuentra lo que necesitas para su cuidado.</p>
          </div>

          <span className="catalogo-contador">
            {productosFiltrados.length} productos
          </span>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-7">
            <label htmlFor="buscar" className="form-label">
              Buscar producto
            </label>

            <input
              id="buscar"
              className="form-control"
              type="search"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <div className="col-12 col-md-5">
            <label htmlFor="categoria" className="form-label">
              Categoría
            </label>

            <select
              id="categoria"
              className="form-select"
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item === 'Todas' ? 'Todas las categorías' : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="row g-4">
            {productosFiltrados.map((producto) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={producto.codigo}
              >
                <CardTienda
                  producto={producto}
                  onVerDetalle={onVerDetalle}
                  onAgregar={onAgregar}
                  cantidad={
                    carrito.find(
                      (item) => item.codigo === producto.codigo,
                    )?.cantidad ?? 0
                  }
                  onCambiarCantidad={onCambiarCantidad}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h3>No encontramos productos 🐾</h3>
            <p>Intenta con otro nombre o categoría.</p>

            <Boton
              texto="Ver productos"
              type="button"
              className="btn-tienda"
              onClick={() => {
                setBusqueda('');
                setCategoria('Todas');
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}
