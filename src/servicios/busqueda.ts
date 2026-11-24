export function normalizarBusqueda(texto: string) {
    return texto.trim().normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}
