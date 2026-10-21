"use client";
// "use client" le dice a Next.js que este componente corre en el navegador.
// Lo necesitamos porque reacciona a lo que el jugador teclea.

import { useCallback, useEffect, useState } from "react";
import Dibujo from "./Dibujo";
import Niveles from "./Niveles";
import Teclado from "./Teclado";
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

  if (!actual) return null; // un instante, mientras se elige la palabra

  // Texto del mensaje y del botón al terminar una palabra.
  let mensaje = "";
  let boton = "";
  if (perdio) {
    mensaje = "¡Paila! Perdiste 😵";
    boton = "Intentar con otra palabra";
  } else if (completoNivel && nivel === ULTIMO_NIVEL) {
    mensaje = "¡Usted es muy berraco! Completó todos los niveles 🏆";
    boton = "Volver a empezar";
  } else if (completoNivel) {
    mensaje = `¡Bacano! Pasaste al nivel ${nivel + 2} 🎉`;
    boton = "Siguiente nivel";
  } else if (gano) {
    mensaje = "¡Qué chévere, ganaste! 🎉";
    boton = "Siguiente palabra";
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Niveles actual={nivel} nivelMax={nivelMax} alElegir={irANivel} />

      {/* Cuántas palabras llevas en este nivel: ● ganada, ○ pendiente */}
      <p className="text-neutral-400 text-sm" aria-label="Progreso del nivel">
        Nivel {nivel + 1}: {NIVELES[nivel].nombre} ·{" "}
        <span className="text-yellow-400 tracking-widest">
          {"●".repeat(victorias + (gano ? 1 : 0))}
          {"○".repeat(Math.max(0, VICTORIAS_PARA_SUBIR - victorias - (gano ? 1 : 0)))}
        </span>
      </p>

      <p className="text-center max-w-sm">
        <span className="text-neutral-400">Pista: </span>
        <span className="font-semibold">{actual.pista}</span>
      </p>

      <Dibujo errores={fallos.size} />

      <p className="text-neutral-400 text-sm">
        Errores: {fallos.size} / {MAX_ERRORES}
      </p>

      {/* La palabra: muestra las letras adivinadas y espacios en las demás */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" aria-label="Palabra">
        {[...palabra].map((letra, i) => {
          const visible = aciertos.has(letra) || perdio;
          const color = perdio && !aciertos.has(letra) ? "text-red-400" : "";
          return (
            <span
              key={i}
              className={`w-6 sm:w-9 border-b-4 border-neutral-400 text-center text-2xl sm:text-3xl font-bold ${color}`}
            >
              {visible ? letra : " "}
            </span>
          );
        })}
      </div>

      {terminado ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className={`text-2xl font-bold ${gano ? "text-green-400" : "text-red-400"}`}>{mensaje}</p>
          <button
            type="button"
            onClick={continuar}
            className="px-6 py-3 rounded bg-green-600 hover:bg-green-500 font-bold"
          >
            {boton}
          </button>
        </div>
      ) : (
        <Teclado aciertos={aciertos} fallos={fallos} bloqueado={terminado} alPresionar={presionar} />
      )}
    </div>
  );
}
