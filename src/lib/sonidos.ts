// Sonidos del juego, creados con la "Web Audio API" del navegador.
// No usamos archivos de audio: generamos los tonos con código, así la
// página no tiene que descargar nada extra.

let contexto: AudioContext | null = null;
let activo = true; // false cuando la persona silencia el juego

export function activarSonido(prendido: boolean) {
  activo = prendido;
}

// El navegador solo deja reproducir sonido después de que la persona
// toca o teclea algo. Por eso creamos el "contexto de audio" la primera
// vez que hace falta (siempre después de una tecla).
function obtenerContexto(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    contexto ??= new AudioContext();
    if (contexto.state === "suspended") void contexto.resume();
    return contexto;
  } catch {
    return null; // navegador sin audio: el juego sigue sin sonido
  }
}

// Toca una nota: frecuencia (qué tan aguda), cuándo empieza y cuánto dura.
function nota(
  frecuencia: number,
  inicio: number,
  duracion: number,
  tipo: OscillatorType = "sine",
  volumen = 0.15,
) {
  if (!activo) return;
  const ctx = obtenerContexto();
  if (!ctx) return;
  const t = ctx.currentTime + inicio;
  const osc = ctx.createOscillator(); // genera el tono
  const gan = ctx.createGain(); // controla el volumen
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);
  // Sube rápido y baja suave, para que no suene a "clic" brusco.
  gan.gain.setValueAtTime(0, t);
  gan.gain.linearRampToValueAtTime(volumen, t + 0.01);
  gan.gain.exponentialRampToValueAtTime(0.001, t + duracion);
  osc.connect(gan).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duracion + 0.05);
}

export const sonidos = {
  // Dos notas que suben: ¡bien!
  acierto() {
    nota(660, 0, 0.12);
    nota(880, 0.08, 0.15);
  },
  // Un tono grave y áspero: fallaste
  error() {
    nota(180, 0, 0.25, "square", 0.08);
  },
  // Una escalita alegre
  ganar() {
    [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.1, 0.25, "triangle"));
  },
  // Notas que bajan, tristes
  perder() {
    [392, 330, 262, 196].forEach((f, i) => nota(f, i * 0.18, 0.3, "sawtooth", 0.06));
  },
  // Fanfarria para cuando subes de nivel
  subirNivel() {
    [523, 659, 784, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.22, "triangle"));
  },
};
