import CardBlog from './CardBlog';
import type { PublicacionBlog } from './CardBlog';

interface ListaBlogProps {
  onSelectPost?: (post: PublicacionBlog) => void;
}

const BLOG_MOCK: PublicacionBlog[] = [
  {
    id: 1,
    titulo: 'Cuidados esenciales para tu perro en época de verano',
    resumen: 'Aprende a proteger a tu canino del golpe de calor, deshidratación y quemaduras en las almohadillas.',
    autor: 'Dra. María Paz Fernández',
    fecha: '15 Oct 2024',
    categoria: 'Cuidados Caninos',
    imagen: '/img/perro.jpg',
    contenido: 'Durante los días de calor, procura que tu perro tenga agua fresca disponible, evite paseos en las horas de mayor temperatura y descanse en un lugar con sombra. Revisa también el suelo antes de salir: el pavimento caliente puede dañar sus almohadillas. Si notas jadeo excesivo, decaimiento o vómitos, consulta con un médico veterinario.'
  },
  {
    id: 2,
    titulo: 'Guía de nutrición felina: ¿Qué necesita realmente tu gato?',
    resumen: 'Descubre la importancia de las proteínas de alta calidad y la hidratación en la dieta diaria felina.',
    autor: 'Dr. Carlos Silva Reyes',
    fecha: '10 Oct 2024',
    categoria: 'Salud Felina',
    imagen: '/img/gato.jpg',
    contenido: 'Los gatos necesitan una alimentación rica en proteínas de origen animal y acceso constante a agua limpia. Combinar alimento húmedo y seco puede ayudar a mejorar su hidratación. Mantén sus porciones según indicación veterinaria y evita darles alimentos de consumo humano que puedan afectar su salud.'
  },
  {
    id: 3,
    titulo: 'Conejos y exóticos: Prevención de problemas dentales',
    resumen: 'El crecimiento continuo de los dientes en roedores y conejos requiere una dieta adecuada en heno.',
    autor: 'Dra. Ana López Castro',
    fecha: '02 Oct 2024',
    categoria: 'Mascotas Exóticas',
    imagen: '/img/conejo.jpg',
    contenido: 'Los dientes de conejos y pequeños roedores crecen continuamente. Por eso, una dieta con heno de buena calidad es fundamental para desgastarlos de forma natural. Si tu mascota deja de comer, babea o presenta dificultad para masticar, necesita una evaluación veterinaria lo antes posible.'
  }
];

// 2. Aplicamos ListaBlogProps en el componente
export default function ListaBlog({ onSelectPost }: ListaBlogProps) {
  return (
    <div className="row g-4">
      {BLOG_MOCK.map((post) => (
        <div key={post.id} className="col-md-4">
          <CardBlog post={post} onSelectPost={onSelectPost} />
        </div>
      ))}
    </div>
  );
}
