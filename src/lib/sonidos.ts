// Sonidos con sabor colombiano, creados con la "Web Audio API" del navegador.
// No usamos grabaciones: imitamos los instrumentos con código. Así la página
// no descarga archivos y no hay problemas de derechos de autor.
//
// Cómo se arma el sonido:
//  - Acordeón: cada nota son varias "lengüetas" (osciladores) un poquito
//    desafinadas entre sí + un vibrato, como el fuelle de un acordeón.
//  - Bajo y acordes: la mano izquierda del acordeonero.
//  - Percusión de cumbia: tambora, llamador, guacharaca y maracas, hechas
//    con "ruido" (como la estática de un radio) filtrado y recortado.
//  - Eco de sala (reverberación), para que no suene seco ni "plano".

let contexto: AudioContext | null = null;
let seco: AudioNode | null = null; // camino directo a los parlantes
let eco: AudioNode | null = null; // camino que pasa por la reverberación
let ruido: AudioBuffer | null = null;
let lengueta: PeriodicWave | null = null;
let activo = true; // false cuando la persona silencia el juego

export function activarSonido(prendido: boolean) {
  activo = prendido;
  if (!prendido && typeof window !== "undefined") window.speechSynthesis?.cancel();
}

// ---------- Preparación ----------

// El navegador solo deja reproducir sonido después de que la persona toca
// o teclea algo. Por eso lo preparamos la primera vez que hace falta.
function obtenerContexto(): AudioContext | null {
  if (!activo || typeof window === "undefined") return null;
  try {
    if (!contexto) {
      contexto = new AudioContext();
      prepararSalidas(contexto);
    }
    if (contexto.state === "suspended") void contexto.resume();
    return contexto;
  } catch {
    return null; // navegador sin audio: el juego sigue sin sonido
  }
}

function prepararSalidas(ctx: AudioContext) {
  // Compresor: si suenan muchos instrumentos a la vez, evita la distorsión.
  const compresor = ctx.createDynamicsCompressor();
  compresor.threshold.value = -18;
  compresor.ratio.value = 10;
  const volumen = ctx.createGain();
  volumen.gain.value = 0.8;
  compresor.connect(volumen).connect(ctx.destination);
  seco = compresor;

  // Reverberación: "convolucionamos" el sonido con un eco artificial
  // (ruido que se apaga poco a poco, como el eco de una sala).
  const sala = ctx.createConvolver();
  const largo = Math.floor(ctx.sampleRate * 1.4);
  const impulso = ctx.createBuffer(2, largo, ctx.sampleRate);
  for (let canal = 0; canal < 2; canal++) {
    const d = impulso.getChannelData(canal);
    for (let i = 0; i < largo; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / largo) ** 3;
  }
  sala.buffer = impulso;
  const cantidadEco = ctx.createGain();
  cantidadEco.gain.value = 0.28;
  sala.connect(cantidadEco).connect(compresor);
  eco = sala;

  // Forma de onda de la lengüeta del acordeón: muchos armónicos que se
  // van suavizando, con los pares un poco más débiles (sonido "nasal").
  const n = 24;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let k = 1; k < n; k++) imag[k] = (k % 2 === 0 ? 0.55 : 1) / k ** 0.9;
  lengueta = ctx.createPeriodicWave(real, imag);
}

function obtenerRuido(ctx: AudioContext): AudioBuffer {
  if (!ruido) {
    ruido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return ruido;
}

// Conecta un sonido a los parlantes, con algo de eco.
function alParlante(nodo: AudioNode, conEco = true) {
  if (seco) nodo.connect(seco);
  if (conEco && eco) nodo.connect(eco);
}

// Nota MIDI (60 = Do central) a frecuencia en Hz.
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

// ---------- Instrumentos ----------

type OpcionesAcordeon = { volumen?: number; brillo?: number; caida?: number };

// Una nota de acordeón.
function acordeon(ctx: AudioContext, midi: number, t: number, dur: number, op: OpcionesAcordeon = {}) {
  const { volumen = 0.06, brillo = 3200, caida = 0 } = op;

  // Volumen: entra suave como el fuelle, se sostiene y se suelta.
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volumen, t + 0.03);
  env.gain.setValueAtTime(volumen * 0.85, t + Math.max(0.04, dur - 0.02));
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);

  // Vibrato de volumen (trémolo), típico del acordeón vallenato.
  const tremolo = ctx.createGain();
  const lfo = ctx.createOscillator();
  const profundidad = ctx.createGain();
  lfo.frequency.value = 6;
  profundidad.gain.value = 0.18;
  lfo.connect(profundidad).connect(tremolo.gain);
  tremolo.gain.value = 0.82;

  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = brillo;
  filtro.Q.value = 0.7;

  filtro.connect(env).connect(tremolo);
  alParlante(tremolo);

  // Tres lengüetas desafinadas (efecto "musette") y una una octava abajo.
  const voces: [number, number, number][] = [
    [0, -11, 1],
    [0, 0, 1],
    [0, 13, 1],
    [-12, 0, 0.45],
  ];
  for (const [octava, desafine, nivel] of voces) {
    const osc = ctx.createOscillator();
    if (lengueta) osc.setPeriodicWave(lengueta);
    osc.frequency.value = hz(midi + octava);
    osc.detune.setValueAtTime(desafine, t);
    // "caida": la nota se dobla hacia abajo al final (suena triste).
    if (caida) osc.detune.linearRampToValueAtTime(desafine - caida, t + dur + 0.1);
    const g = ctx.createGain();
    g.gain.value = nivel;
    osc.connect(g).connect(filtro);
    osc.start(t);
    osc.stop(t + dur + 0.2);
  }
  lfo.start(t);
  lfo.stop(t + dur + 0.2);
}

// Bajo (mano izquierda): una nota grave y redonda.
function bajo(ctx: AudioContext, midi: number, t: number, dur: number) {
  acordeon(ctx, midi, t, dur, { volumen: 0.09, brillo: 700 });
}

// Acorde corto en el contratiempo ("chun"), como el acompañamiento.
function acorde(ctx: AudioContext, notas: number[], t: number, dur = 0.1) {
  for (const n of notas) acordeon(ctx, n, t, dur, { volumen: 0.025, brillo: 2200 });
}

// Golpe de ruido filtrado: base de toda la percusión.
function golpeRuido(
  ctx: AudioContext,
  t: number,
  dur: number,
  tipo: BiquadFilterType,
  frecuencia: number,
  volumen: number,
  conEco = true,
) {
  const fuente = ctx.createBufferSource();
  fuente.buffer = obtenerRuido(ctx);
  const filtro = ctx.createBiquadFilter();
  filtro.type = tipo;
  filtro.frequency.value = frecuencia;
  filtro.Q.value = tipo === "bandpass" ? 2 : 0.7;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volumen, t + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  fuente.connect(filtro).connect(env);
  alParlante(env, conEco);
  fuente.start(t, Math.random() * 0.8);
  fuente.stop(t + dur + 0.02);
}

// Tambora: parche grave que baja de tono + el golpe del palo.
function tambora(ctx: AudioContext, t: number, volumen = 0.5) {
  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(170, t);
  osc.frequency.exponentialRampToValueAtTime(58, t + 0.2);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volumen, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  osc.connect(env);
  alParlante(env);
  osc.start(t);
  osc.stop(t + 0.5);
  golpeRuido(ctx, t, 0.03, "highpass", 1800, volumen * 0.4);
}

// Llamador: tambor pequeño y agudo que marca el contratiempo.
function llamador(ctx: AudioContext, t: number, volumen = 0.22) {
  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(330, t);
  osc.frequency.exponentialRampToValueAtTime(210, t + 0.08);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volumen, t + 0.003);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
  osc.connect(env);
  alParlante(env);
  osc.start(t);
  osc.stop(t + 0.2);
  golpeRuido(ctx, t, 0.02, "highpass", 3000, volumen * 0.5);
}

// Guacharaca: se raspa un palo con ranuras. Lo imitamos con ruido que se
// "corta" muchas veces por segundo (las ranuras) mientras sube de tono.
function raspado(ctx: AudioContext, t: number, dur: number, volumen: number) {
  const fuente = ctx.createBufferSource();
  fuente.buffer = obtenerRuido(ctx);
  const filtro = ctx.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.Q.value = 1.5;
  filtro.frequency.setValueAtTime(2600, t);
  filtro.frequency.linearRampToValueAtTime(5200, t + dur);
  // Las ranuras: un oscilador cuadrado que prende y apaga el sonido.
  const ranuras = ctx.createGain();
  ranuras.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.type = "square";
  lfo.frequency.value = 85;
  const prof = ctx.createGain();
  prof.gain.value = 0.5;
  lfo.connect(prof).connect(ranuras.gain);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volumen, t + dur * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  fuente.connect(filtro).connect(ranuras).connect(env);
  alParlante(env);
  fuente.start(t, Math.random() * 0.8);
  fuente.stop(t + dur + 0.02);
  lfo.start(t);
  lfo.stop(t + dur + 0.02);
}

// "Chi-ki-chá" de la guacharaca en un tiempo de la música.
function guacharaca(ctx: AudioContext, t: number, paso: number) {
  raspado(ctx, t, paso * 0.45, 0.18);
  raspado(ctx, t + paso * 0.5, paso * 0.45, 0.18);
  raspado(ctx, t + paso, paso * 0.9, 0.26);
}

function maracas(ctx: AudioContext, t: number, volumen = 0.12) {
  golpeRuido(ctx, t, 0.05, "highpass", 7000, volumen, false);
}

// Ritmo de cumbia durante "compases" compases. "paso" = duración de una corchea.
function ritmoCumbia(ctx: AudioContext, t: number, paso: number, compases: number) {
  for (let c = 0; c < compases; c++) {
    const inicio = t + c * paso * 4;
    tambora(ctx, inicio, 0.45); // tiempo 1
    tambora(ctx, inicio + paso * 3, 0.3); // contratiempo del 2
    llamador(ctx, inicio + paso); // los "y" del compás
    llamador(ctx, inicio + paso * 3);
    guacharaca(ctx, inicio, paso);
    guacharaca(ctx, inicio + paso * 2, paso);
    for (let i = 0; i < 8; i++) maracas(ctx, inicio + (i * paso) / 2, i % 2 ? 0.06 : 0.11);
  }
}

// ---------- Voz ----------

// El navegador puede hablar ("speechSynthesis"). Para que funcione bien:
//  - Hay que hablar justo después de que la persona toca una tecla
//    (por eso no esperamos con setTimeout).
//  - Guardamos la frase en una variable: si no, algunos navegadores la
//    "botan a la basura" antes de decirla y no suena nada.
//  - Solo hablamos con una voz en español: una voz en inglés diciendo
//    "Bacano" suena rarísimo. Si no hay, queda la frase en pantalla.
let fraseActual: SpeechSynthesisUtterance | null = null;

function vozEspanol(): SpeechSynthesisVoice | undefined {
  const voces = window.speechSynthesis.getVoices();
  return (
    voces.find((v) => v.lang.replace("_", "-") === "es-CO") ??
    voces.find((v) => /^es[-_](US|MX|419|AR|CL|PE|VE)/.test(v.lang)) ??
    voces.find((v) => v.lang.startsWith("es"))
  );
}

// La lista de voces se carga después de abrir la página: la pedimos
// temprano para que esté lista cuando haga falta.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => window.speechSynthesis.getVoices());
}

function decir(frase: string) {
  if (!activo || typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    const hayVoces = window.speechSynthesis.getVoices().length > 0;
    const voz = vozEspanol();
    if (hayVoces && !voz) return; // no hay voz en español en este equipo
    fraseActual = new SpeechSynthesisUtterance(frase);
    fraseActual.lang = voz?.lang ?? "es-CO";
    if (voz) fraseActual.voice = voz;
    fraseActual.rate = 1.05;
    fraseActual.pitch = 1.15;
    fraseActual.volume = 1;
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fraseActual);
  } catch {
    // Sin voz disponible: no pasa nada, la frase sale en pantalla.
  }
}

// ---------- Notas (números MIDI) y acordes en Sol mayor ----------
const [SOL3, SI3, RE4, MI4, FA_S4, SOL4, LA4, SI4, DO5, RE5, MI5, FA_S5, SOL5, LA5, SI5] =
  [55, 59, 62, 64, 66, 67, 69, 71, 72, 74, 76, 78, 79, 81, 83];
const SOL2 = 43, DO3 = 48, RE3 = 50;
const ACORDE_SOL = [SOL3, SI3, RE4];
const ACORDE_DO = [DO3 + 12, MI4, SOL4];
const ACORDE_RE = [RE4, FA_S4, LA4];

// Toca una melodía: lista de [nota, cuántos pasos dura].
function melodia(ctx: AudioContext, t: number, paso: number, notas: [number, number][]) {
  let tiempo = t;
  for (const [nota, pasos] of notas) {
    acordeon(ctx, nota, tiempo, paso * pasos * 0.95);
    tiempo += paso * pasos;
  }
}

// ---------- Sonidos del juego ----------
export const sonidos = {
  // Acertaste una letra: dos noticas alegres y un raspado de guacharaca.
  acierto() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    acordeon(ctx, SI4, t, 0.08, { volumen: 0.05 });
    acordeon(ctx, RE5, t + 0.08, 0.14, { volumen: 0.05 });
    raspado(ctx, t, 0.06, 0.14);
    raspado(ctx, t + 0.08, 0.12, 0.18);
  },

  // Fallaste: golpe de tambora y una nota grave que se cae.
  error() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    tambora(ctx, t, 0.55);
    acordeon(ctx, 58, t, 0.22, { volumen: 0.05, brillo: 1500, caida: 60 });
  },

  // Ganaste la palabra: dos compases de cumbia con melodía de acordeón.
  ganar() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02;
    const paso = 0.17;
    ritmoCumbia(ctx, t, paso, 2);
    bajo(ctx, SOL2, t, paso * 1.5);
    bajo(ctx, RE3, t + paso * 2, paso * 1.5);
    bajo(ctx, SOL2, t + paso * 4, paso * 1.5);
    bajo(ctx, RE3, t + paso * 6, paso * 1.5);
    for (const i of [1, 3, 5, 7]) acorde(ctx, i < 4 ? ACORDE_SOL : ACORDE_RE, t + i * paso);
    melodia(ctx, t, paso, [
      [RE5, 1], [SI4, 1], [RE5, 1], [SOL5, 1],
      [FA_S5, 1], [SOL5, 1], [LA5, 1], [SI5, 2],
    ]);
    bajo(ctx, SOL2, t + paso * 8, paso * 2);
    acorde(ctx, ACORDE_SOL, t + paso * 8, paso * 2);
    decir("¡Bacano!");
  },

  // Perdiste: acordeón tristón que baja y se "cae" al final.
  perder() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02;
    const paso = 0.26;
    const notas = [74, 72, 70, 69];
    notas.forEach((n, i) => acordeon(ctx, n, t + i * paso, paso * 0.9));
    acordeon(ctx, 67, t + notas.length * paso, 0.9, { caida: 80 });
    bajo(ctx, SOL2, t, paso * 2);
    bajo(ctx, 46, t + paso * 2, paso * 2); // si bemol, más oscuro
    bajo(ctx, SOL2, t + paso * 4, 0.9);
    acorde(ctx, [55, 58, 62], t + paso * 4, 0.6); // sol menor
    tambora(ctx, t + paso * 4, 0.6);
    decir("¡Paila!");
  },

  // Subiste de nivel: cuatro compases de cumbia con melodía vallenata.
  subirNivel() {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02;
    const paso = 0.16;
    ritmoCumbia(ctx, t, paso, 4);
    const armonia = [
      [SOL2, ACORDE_SOL],
      [DO3, ACORDE_DO],
      [RE3, ACORDE_RE],
      [SOL2, ACORDE_SOL],
    ] as const;
    armonia.forEach(([nota, notasAcorde], c) => {
      const inicio = t + c * paso * 4;
      bajo(ctx, nota, inicio, paso * 1.5);
      bajo(ctx, nota + 7, inicio + paso * 2, paso * 1.5);
      acorde(ctx, [...notasAcorde], inicio + paso);
      acorde(ctx, [...notasAcorde], inicio + paso * 3);
    });
    melodia(ctx, t, paso, [
      [SI4, 1], [RE5, 1], [SOL5, 1], [RE5, 1],
      [MI5, 1], [SOL5, 1], [DO5, 1], [MI5, 1],
      [FA_S5, 1], [LA5, 1], [RE5, 1], [FA_S5, 1],
      [SOL5, 1], [SI5, 1], [SOL5, 2],
    ]);
    bajo(ctx, SOL2, t + paso * 16, paso * 3);
    acorde(ctx, ACORDE_SOL, t + paso * 16, paso * 3);
    tambora(ctx, t + paso * 16, 0.5);
    decir("¡Qué berraquera!");
  },
};
