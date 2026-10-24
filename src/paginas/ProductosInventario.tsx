
import PaginaGestion from './PaginaGestion';

const productosInventario = [
    {
        titulo: 'Amoxibay 250mg',
        descripcion: 'Antibióticos · Stock: 45 unidades',
        imagen: '/img/Amoxibay.jpg',
    },
    {
        titulo: 'Enrox 50mg',
        descripcion: 'Antibióticos · Stock: 30 unidades',
        imagen: '/img/Enrox.jpg',
    },
    {
        titulo: 'Metrobay 250mg',
        descripcion: 'Antibióticos · Stock: 28 unidades',
        imagen: '/img/Metrobay.jpg',
    },
    {
        titulo: 'Nexgard',
        descripcion: 'Antiparasitarios · Stock: 60 unidades',
        imagen: '/img/Nexgard.jpg',
    },
    {
        titulo: 'Bravecto',
        descripcion: 'Antiparasitarios · Stock: 40 unidades',
        imagen: '/img/Bravecto.jpg',
    },
    {
        titulo: 'Revolution Plus',
        descripcion: 'Antiparasitarios · Stock: 35 unidades',
        imagen: '/img/Revolution.jpg',
    },
    {
        titulo: 'Drontal Plus',
        descripcion: 'Antiparasitarios · Stock: 80 unidades',
        imagen: '/img/Drontal.jpg',
    },
    {
        titulo: 'Milbemax Gato',
        descripcion: 'Antiparasitarios · Stock: 50 unidades',
        imagen: '/img/Milbemax.jpg',
    },
    {
        titulo: 'Meloxicam 1mg',
        descripcion: 'Antiinflamatorios · Stock: 55 unidades',
        imagen: '/img/Meloxicam.jpg',
    },
    {
        titulo: 'Carprofen 50mg',
        descripcion: 'Antiinflamatorios · Stock: 30 unidades',
        imagen: '/img/Carprofen.jpg',
    },
    {
        titulo: 'Clorhexidina shampoo',
        descripcion: 'Dermatología · Stock: 25 unidades',
        imagen: '/img/Clorhexidina.jpg',
    },
    {
        titulo: 'Malaseb shampoo',
        descripcion: 'Dermatología · Stock: 20 unidades',
        imagen: '/img/Malaseb.jpg',
    },
    {
        titulo: 'Apoquel 16mg',
        descripcion: 'Dermatología · Stock: 18 unidades',
        imagen: '/img/Apoquel.jpg',
    },
    {
        titulo: 'Probifor',
        descripcion: 'Digestivo · Stock: 40 unidades',
        imagen: '/img/Probifor.png',
    },
    {
        titulo: 'Omeprazol 10mg vet',
        descripcion: 'Digestivo · Stock: 35 unidades',
        imagen: '/img/Omeprazol.jpg',
    },
    {
        titulo: 'Vetmedin 2.5mg',
        descripcion: 'Cardíaco · Stock: 15 unidades',
        imagen: '/img/Vetmedin.jpg',
    },
    {
        titulo: 'Tramadol 50mg vet',
        descripcion: 'Analgésicos · Stock: 22 unidades',
        imagen: '/img/Tramadol.jpg',
    },
    {
        titulo: 'Nobivac DHPPi',
        descripcion: 'Vacunas · Stock: 48 unidades',
        imagen: '/img/Nobivac.jpg',
    },
    {
        titulo: 'Nobivac Rabies',
        descripcion: 'Vacunas · Stock: 60 unidades',
        imagen: '/img/NobivacR.jpg',
    },
    {
        titulo: 'Felocell CVR',
        descripcion: 'Vacunas · Stock: 36 unidades',
        imagen: '/img/Felocell.jpg',
    },
    {
        titulo: 'Omega vet 3,6',
        descripcion: 'Suplementos · Stock: 30 unidades',
        imagen: '/img/Omega.jpg',
    },
    {
        titulo: 'Condrovet forte',
        descripcion: 'Suplementos · Stock: 25 unidades',
        imagen: '/img/Condrovet.jpg',
    },
];

export default function ProductosInventario() {
    return (
        <PaginaGestion
            etiqueta="ADMINISTRACIÓN"
            titulo="Productos e inventario"
            descripcion="Revisa el estado de los productos de la veterinaria."
            volverA="/perfil/administrador"
            registros={productosInventario}
        />
    );
}
