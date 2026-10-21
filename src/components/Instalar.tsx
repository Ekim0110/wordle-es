"use client";

import { useEffect, useState } from "react";

// Este evento lo dan Chrome, Edge y Android cuando la app se puede instalar.
// TypeScript no lo trae, así que describimos lo que usamos de él.
type EventoInstalar = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// Registra el service worker y muestra un botón "Instalar app" cuando se puede.
export default function Instalar() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [esIphone, setEsIphone] = useState(false);
  const [verAyuda, setVerAyuda] = useState(false);

  useEffect(() => {
    // 1. Registrar el service worker (para jugar sin internet).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Si falla, el juego funciona igual, solo que necesita internet.
      });
    }

    // 2. ¿Ya está instalada? Entonces no mostramos el botón.
    const yaInstalada =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (yaInstalada) return;

    // 3. En iPhone no hay botón automático: hay que explicar los pasos.
    setEsIphone(/iphone|ipad|ipod/i.test(navigator.userAgent));

    // 4. En Chrome/Edge/Android guardamos el evento para usarlo al tocar el botón.
    function alPoderInstalar(e: Event) {
      e.preventDefault();
      setEvento(e as EventoInstalar);
    }
    function alInstalar() {
      setEvento(null);
    }
    window.addEventListener("beforeinstallprompt", alPoderInstalar);
    window.addEventListener("appinstalled", alInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", alPoderInstalar);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  async function instalar() {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice;
    setEvento(null);
  }

  const estilo =
    "rounded-full bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/10";

  if (evento) {
    return (
      <button type="button" onClick={instalar} className={estilo}>
        📲 Instalar app
      </button>
    );
  }

  if (esIphone) {
    return (
      <div className="text-center">
        <button type="button" onClick={() => setVerAyuda(!verAyuda)} className={estilo}>
          📲 Instalar en iPhone
        </button>
        {verAyuda && (
          <p className="mt-2 max-w-xs text-sm text-white/70">
            Toca el botón <b>Compartir</b> (el cuadrito con la flecha) y luego{" "}
            <b>Agregar a pantalla de inicio</b>.
          </p>
        )}
      </div>
    );
  }

  return null;
}
