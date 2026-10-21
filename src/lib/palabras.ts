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
      { palabra: "PLATA", pista: "Dinero" },
      { palabra: "RUANA", pista: "Abrigo de lana típico de Boyacá" },
      { palabra: "TAMAL", pista: "Masa de maíz con carne, envuelta en hoja de plátano" },
      { palabra: "PANELA", pista: "Bloque dulce hecho de caña de azúcar" },
      { palabra: "CHINO", pista: "Niño, como se dice en Bogotá" },
      { palabra: "BUSETA", pista: "Bus pequeño de servicio público" },
      { palabra: "SAPO", pista: "Persona chismosa o soplona" },
      { palabra: "QUIUBO", pista: "Saludo: ¿qué hubo?" },
      { palabra: "MECATO", pista: "Paquetes, dulces y golosinas para picar" },
      { palabra: "ROLO", pista: "Persona de Bogotá" },
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
      { palabra: "GOMELO", pista: "Persona presumida, de plata" },
      { palabra: "CANSON", pista: "Persona que fastidia mucho" },
      { palabra: "PELAO", pista: "Niño o joven, como se dice en la Costa" },
      { palabra: "CHICHA", pista: "Bebida tradicional de maíz fermentado" },
      { palabra: "MORRAL", pista: "Mochila para cargar cosas" },
      { palabra: "PAISA", pista: "Persona de Antioquia o del Eje Cafetero" },
      { palabra: "COSTEÑO", pista: "Persona de la costa Caribe" },
      { palabra: "FILO", pista: "Hambre" },
      { palabra: "VACA", pista: "Colecta de plata entre amigos" },
      { palabra: "CHANDA", pista: "Algo de mala calidad" },
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
      { palabra: "ESCULCAR", pista: "Buscar entre las cosas de otro" },
      { palabra: "CORRONCHO", pista: "Persona de gustos poco refinados" },
      { palabra: "GUACHAFITA", pista: "Desorden o relajo" },
      { palabra: "EMBARRARLA", pista: "Cometer un error" },
      { palabra: "ARRUNCHARSE", pista: "Acurrucarse con alguien" },
      { palabra: "CHICHIGUA", pista: "Muy poquita plata" },
      { palabra: "GUARAPO", pista: "Bebida de jugo de caña" },
      { palabra: "LECHONA", pista: "Cerdo relleno de arroz, típico del Tolima" },
      { palabra: "MAMONA", pista: "Carne asada al estilo llanero" },
      { palabra: "CUCHUCO", pista: "Sopa espesa de trigo o maíz de Boyacá" },
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
      { palabra: "BAMBUCO", pista: "Ritmo tradicional de la región andina" },
      { palabra: "BOROJO", pista: "Fruta del Pacífico, muy espesa y nutritiva" },
      { palabra: "CHONTADURO", pista: "Fruto de palma que se come con sal y miel" },
      { palabra: "MAMONCILLO", pista: "Frutica de cáscara verde y pulpa jugosa" },
      { palabra: "CHAMPUS", pista: "Bebida del Valle con maíz, lulo y panela" },
      { palabra: "TUSA", pista: "Tristeza por un amor que se acabó" },
      { palabra: "PANDEBONO", pista: "Pan de queso y almidón de yuca del Valle" },
      { palabra: "AREQUIPE", pista: "Dulce de leche cremoso" },
      { palabra: "ATARRAYA", pista: "Red redonda de pesca que se lanza al agua" },
      { palabra: "CUMBIA", pista: "Música y baile tradicional del Caribe" },
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
