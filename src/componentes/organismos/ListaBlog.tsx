import CardBlog from './CardBlog';

export interface PublicacionBlog {
  id: number;
  titulo: string;
  resumen: string;
  autor: string;
  fecha: string;
  categoria: string;
  imagen: string;
}

const BLOG_MOCK: PublicacionBlog[] = [
  {
    id: 1,
    titulo: 'Cuidados esenciales para tu perro en época de verano',
    resumen: 'Aprende a proteger a tu canino del golpe de calor, deshidratación y quemaduras en las almohadillas.',
    autor: 'Dra. María Paz Fernández',
    fecha: '15 Oct 2024',
    categoria: 'Cuidados Caninos',
    imagen: '/img/perro.jpg'
  },
  {
    id: 2,
    titulo: 'Guía de nutrición felina: ¿Qué necesita realmente tu gato?',
    resumen: 'Descubre la importancia de las proteínas de alta calidad y la hidratación en la dieta diaria felina.',
    autor: 'Dr. Carlos Silva Reyes',
    fecha: '10 Oct 2024',
    categoria: 'Salud Felina',
    imagen: '/img/gato.jpg'
  },
  {
    id: 3,
    titulo: 'Conejos y exóticos: Prevención de problemas dentales',
    resumen: 'El crecimiento continuo de los dientes en roedores y conejos requiere una dieta adecuada en heno.',
    autor: 'Dra. Ana López Castro',
    fecha: '02 Oct 2024',
    categoria: 'Mascotas Exóticas',
    imagen: '/img/conejo.jpg'
  }
];

export default function ListaBlog() {
  return (
    <div className="row g-4">
      {BLOG_MOCK.map((post) => (
        <div key={post.id} className="col-md-4">
          <CardBlog post={post} />
        </div>
      ))}
    </div>
  );
}