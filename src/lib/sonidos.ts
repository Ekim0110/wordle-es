// Sonidos con sabor colombiano, creados con la "Web Audio API" del navegador.
// No usamos grabaciones: imitamos los instrumentos con código.
//  - Acordeón (vallenato): dos tonos "serrucho" un poquito desafinados entre
//    sí, que es lo que le da ese sonido vibrante.
//  - Guacharaca y maracas: "ruido" (como la estática de un radio) filtrado y
//    cortado en golpecitos.
//  - Tambora: un tono grave que baja rápido, como un golpe de tambor.
// Así la página no descarga archivos y no hay problemas de derechos de autor.

let contexto: AudioContext | null = null;
let salidaGeneral: AudioNode | null = null;
let ruido: AudioBuffer | null = null;
let activo = true; // false cuando la persona silencia el juego

export function activarSonido(prendido: boolean) {
  activo = prendido;
  if (!prendido) window.speechSynthesis?.cancel();
}

// El navegador solo deja reproducir sonido después de que la persona
// toca o teclea algo. Por eso creamos el "contexto de audio" la primera
// vez que hace falta (siempre después de una tecla).
function obtenerContexto(): AudioContext | null {
  if (!activo || typeof window === "undefined") return null;
  try {
    contexto ??= new AudioContext();
    if (contexto.state === "suspended") void contexto.resume();
    return contexto;
  } catch {
    return null; // navegador sin audio: el juego sigue sin sonido
  }
}

// Todo pasa por un "compresor" antes de llegar a los parlantes: si varios
// instrumentos suenan a la vez, evita que el sonido se distorsione.
function salida(ctx: AudioContext): AudioNode {
  if (!salidaGeneral) {
    const compresor = ctx.createDynamicsCompressor();
    compresor.threshold.value = -12;
    compresor.ratio.value = 6;
    compresor.connect(ctx.destination);
    salidaGeneral = compresor;
  }
  return salidaGeneral;
}

// Un segundo de ruido aleatorio que reutilizamos para las percusiones.
function obtenerRuido(ctx: AudioContext): AudioBuffer {
  if (!ruido) {
    ruido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const datos = ruido.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
  }
  return ruido;
}

// Volumen que sube rápido y baja suave, para que no suene a "clic" brusco.
function envolvente(ctx: AudioContext, t: number, duracion: number, volumen: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volumen, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
  g.connect(salida(ctx));
  return g;
}

// ---------- Instrumentos ----------

// Una nota de acordeón. "nota" es la frecuencia (qué tan aguda suena).
function acordeon(ctx: AudioContext, nota: number, t: number, duracion: number, volumen = 0.07) {
  const salida = envolvente(ctx, t, duracion, volumen);
  // Filtro que suaviza el sonido para que no sea tan chillón.
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 2200;
  filtro.connect(salida);
  // Dos "lengüetas" levemente desafinadas, como un acordeón de verdad.
  for (const desafine of [-6, 6]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = nota;
    osc.detune.value = desafine;
    osc.connect(filtro);
    osc.start(t);
    osc.stop(t + duracion + 0.05);
  }
}

// Un golpecito de ruido filtrado: sirve para guacharaca y maracas.
function raspado(
  ctx: AudioContext,
  t: number,
  duracion: number,
  frecuencia: number,
  volumen: number,
) {
  const fuente = ctx.createBufferSource();
  fuente.buffer = obtenerRuido(ctx);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = frecuencia;
  filtro.Q.value = 1.2;
  fuente.connect(filtro).connect(envolvente(ctx, t, duracion, volumen));
  fuente.start(t, Math.random() * 0.5);
  fuente.stop(t + duracion + 0.02);
}

// Maracas: "chas" agudo y corto.
function maracas(ctx: AudioContext, t: number) {
  raspado(ctx, t, 0.07, 6000, 0.25);
}

// Guacharaca: "chiqui-chá", tres raspados seguidos, el último más largo.
function guacharaca(ctx: AudioContext, t: number) {
  raspado(ctx, t, 0.04, 3500, 0.2);
  raspado(ctx, t + 0.06, 0.04, 3500, 0.2);
  raspado(ctx, t + 0.12, 0.12, 3200, 0.25);
}

// Tambora: golpe grave que baja de tono.
function tambora(ctx: AudioContext, t: number, volumen = 0.5) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(140, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.25);
  osc.connect(envolvente(ctx, t, 0.35, volumen));
  osc.start(t);
  osc.stop(t + 0.4);
}

// ---------- Voz ----------

// El navegador puede hablar ("speechSynthesis"). Buscamos una voz de
// Colombia y, si no hay, cualquier voz en español.
function decir(frase: string) {
  if (!activo || typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    const voces = window.speechSynthesis.getVoices();
    const voz =
      voces.find((v) => v.lang === "es-CO") ??
      voces.find((v) => v.lang.startsWith("es-4")) ?? // español de Latinoamérica
      voces.find((v) => v.lang.startsWith("es"));
    const mensaje = new SpeechSynthesisUtterance(frase);
    mensaje.lang = voz?.lang ?? "es-CO";
    if (voz) mensaje.voice = voz;
    mensaje.rate = 1.05;
    mensaje.pitch = 1.1;
    window.speechSynthesis.cancel(); // que no se amontonen las frases
    window.speechSynthesis.speak(mensaje);
  } catch {
    // Sin voz disponible: no pasa nada.
  }
}

// ---------- Notas musicales (en Hz) ----------
const SOL = 392, LA = 440, SI = 494, DO = 523, RE = 587, MI = 659, FA = 698, SOL2 = 784;

// ---------- Sonidos del juego ----------
export const sonidos = {
  // Acertaste una letra: maracas y una notica de acordeón.
  acierto() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime;
    maracas(ctx, t);
    maracas(ctx, t + 0.08);
    acordeon(ctx, SOL2, t, 0.15, 0.07);
  },

  // Fallaste: golpe de tambora.
  error() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    tambora(ctx, ctx.currentTime);
  },

  // Ganaste la palabra: frase de acordeón con ritmo de cumbia.
  ganar() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime;
    const negra = 0.15; // duración de cada paso del ritmo
    [SOL, SI, RE, SOL2, RE, SOL2].forEach((n, i) => acordeon(ctx, n, t + i * negra, negra * 1.4));
    for (let i = 0; i < 4; i++) {
      tambora(ctx, t + i * negra * 2, 0.35);
      guacharaca(ctx, t + i * negra * 2 + negra);
    }
    decir("¡Bacano!");
  },

  // Perdiste: acordeón que baja, tristón, y un último golpe de tambora.
  perder() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime;
    [MI, RE, DO, SI, LA].forEach((n, i) => acordeon(ctx, n, t + i * 0.2, 0.3));
    tambora(ctx, t + 1.0, 0.6);
    setTimeout(() => decir("¡Paila!"), 900);
  },

  // Subiste de nivel: frase vallenata más larga con toda la percusión.
  subirNivel() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime;
    const paso = 0.13;
    const melodia = [SOL, LA, SI, DO, RE, MI, RE, SI, DO, LA, SI, SOL, RE, SOL2, FA, SOL2];
    melodia.forEach((n, i) => acordeon(ctx, n, t + i * paso, paso * 1.3));
    for (let i = 0; i < 8; i++) {
      tambora(ctx, t + i * paso * 2, 0.35);
      guacharaca(ctx, t + i * paso * 2 + paso);
    }
    decir("¡Qué berraquera! ¡Subiste de nivel!");
  },
};
