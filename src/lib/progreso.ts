// Guarda en el navegador tu avance y tus preferencias.
// Usamos localStorage: una pequeña memoria del navegador que no se borra al
// cerrar la página. Lo envolvemos en try/catch porque en modo incógnito
// a veces no está disponible, y el juego debe funcionar igual.

const CLAVE_NIVEL = "ahorcado-nivel-max";
const CLAVE_SONIDO = "ahorcado-sonido";

export function leerNivelMax(): number {
  try {
    const valor = Number(localStorage.getItem(CLAVE_NIVEL));
    return Number.isInteger(valor) && valor > 0 ? valor : 0;
  } catch {
    return 0;
  }
}

export function guardarNivelMax(nivel: number) {
  try {
    localStorage.setItem(CLAVE_NIVEL, String(nivel));
  } catch {
    // Si no se puede guardar, simplemente no recordamos el avance.
  }
}

// El sonido está prendido salvo que la persona lo haya apagado antes.
export function leerSonido(): boolean {
  try {
    return localStorage.getItem(CLAVE_SONIDO) !== "no";
  } catch {
    return true;
  }
}

export function guardarSonido(prendido: boolean) {
  try {
    localStorage.setItem(CLAVE_SONIDO, prendido ? "si" : "no");
  } catch {
    // Sin memoria disponible: la elección dura solo esta visita.
  }
}
