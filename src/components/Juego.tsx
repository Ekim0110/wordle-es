"use client";
// "use client" le dice a Next.js que este componente corre en el navegador.
// Lo necesitamos porque reacciona a lo que el jugador teclea.

import { useCallback, useEffect, useState } from "react";
import Tablero from "./Tablero";
import Teclado from "./Teclado";
import { FILAS, LETRAS } from "@/lib/reglas";

// Letras válidas en español (incluye la Ñ).
const ES_LETRA = /^[a-zñ]$/i;

export default function Juego() {
  // "Estado": datos que cambian mientras juegas. Cuando cambian, React
  // vuelve a dibujar la pantalla automáticamente.
  const [intentos, setIntentos] = useState<string[]>([]); // filas ya enviadas
  const [actual, setActual] = useState(""); // lo que estás escribiendo

  // Qué hacer con cada tecla, venga del teclado físico o del de pantalla.
  const presionar = useCallback(
    (tecla: string) => {
      if (intentos.length >= FILAS) return; // ya no quedan filas

      if (tecla === "ENTER") {
        if (actual.length < LETRAS) return; // falta completar la palabra
        // Por ahora solo pasamos a la siguiente fila.
        // En la etapa 3 aquí revisaremos los colores.
        setIntentos([...intentos, actual]);
        setActual("");
      } else if (tecla === "BORRAR") {
        setActual(actual.slice(0, -1));
      } else if (ES_LETRA.test(tecla) && actual.length < LETRAS) {
        setActual(actual + tecla.toUpperCase());
      }
    },
    [intentos, actual],
  );

  // Escuchamos el teclado físico de la computadora.
  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // no robar atajos
      if (e.key === "Enter") presionar("ENTER");
      else if (e.key === "Backspace") presionar("BORRAR");
      else presionar(e.key);
    }
    window.addEventListener("keydown", alTeclear);
    // Al terminar, dejamos de escuchar para no duplicar eventos.
    return () => window.removeEventListener("keydown", alTeclear);
  }, [presionar]);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <Tablero intentos={intentos} actual={actual} />
      <Teclado alPresionar={presionar} />
    </div>
  );
}
