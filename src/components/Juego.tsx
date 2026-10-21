"use client";
// "use client" le dice a Next.js que este componente corre en el navegador.
// Lo necesitamos porque reacciona a lo que el jugador teclea.

import { useCallback, useEffect, useRef, useState } from "react";
import Confeti from "./Confeti";
import Dibujo from "./Dibujo";
import Niveles from "./Niveles";
import Teclado from "./Teclado";
import Vidas from "./Vidas";
import { NIVELES, palabraAlAzar, type Palabra } from "@/lib/palabras";
import { MAX_ERRORES, VICTORIAS_PARA_SUBIR } from "@/lib/reglas";
import { guardarNivelMax, leerNivelMax } from "@/lib/progreso";

// Letras válidas en español (incluye la Ñ).
const ES_LETRA = /^[A-ZÑ]$/;
const ULTIMO_NIVEL = NIVELES.length - 1;

export default function Juego() {
  // "Estado": datos que cambian mientras juegas. Cuando cambian, React
  // vuelve a dibujar la pantalla automáticamente.
  const [nivel, setNivel] = useState(0); // 0 = Fácil, 1 = Medio...
  const [nivelMax, setNivelMax] = useState(0); // nivel más alto desbloqueado
  const [victorias, setVictorias] = useState(0); // palabras ganadas en este nivel
  const [jugadas, setJugadas] = useState<string[]>([]); // para no repetir palabras
  const [actual, setActual] = useState<Palabra | null>(null);
  const [usadas, setUsadas] = useState<string[]>([]); // letras ya probadas

  // Empieza una palabra nueva en el nivel indicado.
  const nuevaPalabra = useCallback((n: number, yaJugadas: string[]) => {
    const p = palabraAlAzar(n, yaJugadas);
    setActual(p);
    setJugadas([...yaJugadas, p.palabra]);
    setUsadas([]);
  }, []);

  // Cambiar de nivel reinicia el contador de victorias.
  const irANivel = useCallback(
    (n: number) => {
      setNivel(n);
      setVictorias(0);
      nuevaPalabra(n, []);
    },
    [nuevaPalabra],
  );

  // Al abrir la página: leemos el avance guardado y elegimos la primera palabra.
  // Se hace aquí (en el navegador) porque el servidor no conoce tu avance.
  useEffect(() => {
    const guardado = Math.min(leerNivelMax(), ULTIMO_NIVEL);
    setNivelMax(guardado);
    irANivel(guardado);
  }, [irANivel]);

  // Calculamos todo lo demás a partir del estado (no hace falta guardarlo).
  const palabra = actual?.palabra ?? "";
  const aciertos = new Set(usadas.filter((l) => palabra.includes(l)));
  const fallos = new Set(usadas.filter((l) => !palabra.includes(l)));
  const gano = palabra !== "" && [...palabra].every((l) => aciertos.has(l));
  const perdio = fallos.size >= MAX_ERRORES;
  const terminado = gano || perdio;
  // Con esta victoria, ¿completaste el nivel?
  const completoNivel = gano && victorias + 1 >= VICTORIAS_PARA_SUBIR;

  // Qué pasa al pulsar el botón cuando termina una palabra.
  const continuar = useCallback(() => {
    if (completoNivel) {
      const siguiente = Math.min(nivel + 1, ULTIMO_NIVEL);
      if (siguiente > nivelMax) {
        setNivelMax(siguiente);
        guardarNivelMax(siguiente);
      }
      irANivel(nivel === ULTIMO_NIVEL ? 0 : siguiente);
    } else {
      if (gano) setVictorias(victorias + 1);
      nuevaPalabra(nivel, jugadas);
    }
  }, [completoNivel, gano, nivel, nivelMax, victorias, jugadas, irANivel, nuevaPalabra]);

  const presionar = useCallback(
    (tecla: string) => {
      const letra = tecla.toUpperCase();
      if (terminado || !ES_LETRA.test(letra) || usadas.includes(letra)) return;
      setUsadas([...usadas, letra]);
    },
    [terminado, usadas],
  );

  // Escuchamos el teclado físico de la computadora.
  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // no robar atajos
      if (e.key === "Enter" && terminado) continuar();
      else presionar(e.key);
    }
    window.addEventListener("keydown", alTeclear);
    // Al terminar, dejamos de escuchar para no duplicar eventos.
    return () => window.removeEventListener("keydown", alTeclear);
  }, [presionar, terminado, continuar]);

  // Cuando fallas una letra, la tarjeta tiembla. Usamos una "ref" para
  // tocar directamente el elemento de la página y animarlo.
  const tarjeta = useRef<HTMLElement>(null);
  useEffect(() => {
    if (fallos.size === 0) return;
    tarjeta.current?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 350, easing: "ease-in-out" },
    );
  }, [fallos.size]);

  if (!actual) return null; // un instante, mientras se elige la palabra

  // Texto del mensaje y del botón al terminar una palabra.
  let titulo = "";
  let detalle = "";
  let boton = "";
  if (perdio) {
    titulo = "¡Paila! 😵";
    detalle = `La palabra era ${palabra}`;
    boton = "Intentar con otra palabra";
  } else if (completoNivel && nivel === ULTIMO_NIVEL) {
    titulo = "¡Usted es muy berraco! 🏆";
    detalle = "Completó todos los niveles";
    boton = "Volver a empezar";
  } else if (completoNivel) {
    titulo = "¡Bacano! 🎉";
    detalle = `Desbloqueaste el nivel ${NIVELES[nivel + 1].nombre}`;
    boton = "Siguiente nivel";
  } else if (gano) {
    titulo = "¡Qué chévere! 🎉";
    detalle = "Adivinaste la palabra";
    boton = "Siguiente palabra";
  }

  const ganadas = victorias + (gano ? 1 : 0);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Niveles actual={nivel} nivelMax={nivelMax} alElegir={irANivel} />

      {/* Tarjeta principal con efecto de vidrio (fondo semitransparente y borroso) */}
      <section
        ref={tarjeta}
        className="w-full rounded-3xl bg-white/5 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-7"
      >
        {/* Arriba: progreso del nivel y vidas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1" aria-label={`Ganadas ${ganadas} de ${VICTORIAS_PARA_SUBIR}`}>
            {Array.from({ length: VICTORIAS_PARA_SUBIR }).map((_, i) => (
              <span key={i} className={`text-lg ${i < ganadas ? "" : "opacity-20 grayscale"}`}>
                ⭐
              </span>
            ))}
          </div>
          <Vidas errores={fallos.size} />
        </div>

        <div className="mt-2 flex justify-center">
          <Dibujo errores={fallos.size} />
        </div>

        {/* La pista, en una etiqueta */}
        <p className="mx-auto mt-3 w-fit max-w-full rounded-2xl bg-azul/15 px-4 py-2 text-center text-sm ring-1 ring-azul/30 sm:text-base">
          <span className="mr-1">💡</span>
          {actual.pista}
        </p>

        {/* La palabra: una casilla por letra */}
        <div className="mt-5 flex flex-wrap justify-center gap-1 sm:gap-1.5" aria-label="Palabra">
          {[...palabra].map((letra, i) => {
            const adivinada = aciertos.has(letra);
            const visible = adivinada || perdio;
            let estilo = "bg-white/5 ring-white/15";
            if (adivinada) estilo = "bg-amarillo/15 ring-amarillo/60 text-amarillo animate-pop";
            else if (perdio) estilo = "bg-rojo/15 ring-rojo/50 text-rojo";
            return (
              <span
                key={`${i}-${visible}`}
                className={`flex h-10 w-7 items-center justify-center rounded-lg text-xl font-bold ring-1 sm:h-12 sm:w-10 sm:text-2xl ${estilo}`}
              >
                {visible ? letra : ""}
              </span>
            );
          })}
        </div>
      </section>

      {terminado ? (
        <div className="flex w-full flex-col items-center gap-3 rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/10 backdrop-blur-xl animate-aparecer">
          {gano && <Confeti />}
          <p className={`text-3xl font-extrabold ${gano ? "text-emerald-400" : "text-rojo"}`}>{titulo}</p>
          <p className="text-white/70">{detalle}</p>
          <button
            type="button"
            onClick={continuar}
            className="mt-1 rounded-2xl bg-gradient-to-r from-amarillo to-orange-400 px-7 py-3 font-bold text-neutral-900 shadow-lg shadow-amarillo/30 transition hover:-translate-y-0.5 active:scale-95"
          >
            {boton}
          </button>
          <p className="hidden text-xs text-white/40 sm:block">o pulsa Enter</p>
        </div>
      ) : (
        <Teclado aciertos={aciertos} fallos={fallos} bloqueado={terminado} alPresionar={presionar} />
      )}
    </div>
  );
}
