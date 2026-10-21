// Palabras colombianas agrupadas por nivel. La pista es su significado.
// Van en MAYÚSCULAS y sin tildes (la Ñ sí se queda) para compararlas fácil
// con el teclado.

export type Palabra = { palabra: string; pista: string };

export type Nivel = {
  nombre: string;
  palabras: Palabra[];
};

export const NIVELES: Nivel[] = [
  {
    nombre: "Fácil",
    palabras: [
      { palabra: "AREPA", pista: "Se come al desayuno y está hecha de maíz" },
      { palabra: "TINTO", pista: "Café negro, pequeño y caliente" },
      { palabra: "PARCE", pista: "Así le dices a tu amigo" },
      { palabra: "CHIVA", pista: "Bus de pueblo pintado de muchos colores" },
      { palabra: "BACANO", pista: "Algo muy bueno o genial" },
      { palabra: "MONO", pista: "Persona de pelo rubio" },
      { palabra: "LUCAS", pista: "Otra forma de decir pesos (plata)" },
      { palabra: "PAILA", pista: "¡Qué mala suerte!" },
      { palabra: "CUCHO", pista: "Persona mayor; también se les dice así a los papás" },
      { palabra: "FRESCO", pista: "Tranquilo, no te preocupes" },
    ],
  },
  {
    nombre: "Medio",
    palabras: [
      { palabra: "CHEVERE", pista: "Algo agradable o divertido" },
      { palabra: "PARCHE", pista: "Plan o grupo de amigos" },
      { palabra: "CAMELLO", pista: "Trabajo" },
      { palabra: "ÑAPA", pista: "Lo extra que te regalan al comprar" },
      { palabra: "BUÑUELO", pista: "Bolita frita de queso, típica en Navidad" },
      { palabra: "PATACON", pista: "Plátano verde frito y aplastado" },
      { palabra: "TRANCON", pista: "Mucho tráfico en la calle" },
      { palabra: "CHUSPA", pista: "Bolsa plástica" },
      { palabra: "GUAYABA", pista: "Fruta rosada por dentro y llena de semillas" },
      { palabra: "JARTERA", pista: "Aburrimiento o pereza" },
    ],
  },
  {
    nombre: "Difícil",
    palabras: [
      { palabra: "AGUAPANELA", pista: "Bebida de panela, fría o caliente" },
      { palabra: "SANCOCHO", pista: "Sopa espesa para el almuerzo del domingo" },
      { palabra: "BERRACO", pista: "Persona valiente y trabajadora" },
      { palabra: "MOTILAR", pista: "Cortar el pelo" },
      { palabra: "BOCADILLO", pista: "Dulce de guayaba, famoso el de Vélez" },
      { palabra: "MAZAMORRA", pista: "Bebida de maíz que se acompaña con panela" },
      { palabra: "CHOCOLO", pista: "Mazorca de maíz tierno" },
      { palabra: "ROSCON", pista: "Pan dulce relleno de bocadillo" },
      { palabra: "GUAYABO", pista: "Malestar del día después de una fiesta" },
      { palabra: "VUELTAS", pista: "Diligencias o mandados" },
    ],
  },
  {
    nombre: "Experto",
    palabras: [
      { palabra: "AJIACO", pista: "Sopa bogotana con tres papas y guascas" },
      { palabra: "MAMAGALLISTA", pista: "Alguien que siempre está bromeando" },
      { palabra: "ENGUAYABADO", pista: "Triste o con nostalgia" },
      { palabra: "ACHIRAS", pista: "Bizcochitos crocantes del Huila" },
      { palabra: "GUANDOLO", pista: "Así le dicen a la aguapanela en la Costa" },
      { palabra: "VALLENATO", pista: "Música con acordeón de la Costa" },
      { palabra: "CHICHARRON", pista: "Piel de cerdo frita y crocante" },
      { palabra: "LULO", pista: "Fruta ácida perfecta para jugo" },
      { palabra: "BOLETA", pista: "¡Qué ...! Algo que da vergüenza" },
      { palabra: "GUAMBITO", pista: "Niño, en Boyacá y Nariño" },
    ],
  },
];

// Elige al azar una palabra del nivel que no esté en la lista de "ya jugadas".
export function palabraAlAzar(nivel: number, yaJugadas: string[]): Palabra {
  const todas = NIVELES[nivel].palabras;
  const quedan = todas.filter((p) => !yaJugadas.includes(p.palabra));
  const opciones = quedan.length > 0 ? quedan : todas;
  return opciones[Math.floor(Math.random() * opciones.length)];
}
