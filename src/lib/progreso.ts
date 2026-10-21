// Guarda en el navegador el nivel más alto que has desbloqueado.
// Usamos localStorage: una pequeña memoria del navegador que no se borra al
// cerrar la página. Lo envolvemos en try/catch porque en modo incógnito
// a veces no está disponible, y el juego debe funcionar igual.

const CLAVE = "ahorcado-nivel-max";

export function leerNivelMax(): number {
  try {
    const valor = Number(localStorage.getItem(CLAVE));
    return Number.isInteger(valor) && valor > 0 ? valor : 0;
  } catch {
    return 0;
  }
}

export function guardarNivelMax(nivel: number) {
  try {
    localStorage.setItem(CLAVE, String(nivel));
  } catch {
    // Si no se puede guardar, simplemente no recordamos el avance.
  }
}
