export function esCorreoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function esTelefonoValido(telefono: string) {
  return telefono.trim() === '' || /^\+?[0-9]+$/.test(telefono.trim());
}
