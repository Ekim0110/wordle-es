import { NIVELES } from "@/lib/palabras";

type Props = {
  actual: number; // nivel que estás jugando
  nivelMax: number; // nivel más alto desbloqueado
  alElegir: (nivel: number) => void;
};

// Botones para elegir nivel. Los que no has desbloqueado salen con candado.
export default function Niveles({ actual, nivelMax, alElegir }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {NIVELES.map((nivel, i) => {
        const bloqueado = i > nivelMax;
        const elegido = i === actual;
        return (
          <button
            key={nivel.nombre}
            type="button"
            onClick={() => alElegir(i)}
            disabled={bloqueado}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${
              elegido
                ? "bg-gradient-to-r from-amarillo to-orange-400 text-neutral-900 shadow-lg shadow-amarillo/30"
                : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10 enabled:hover:-translate-y-0.5"
            }`}
          >
            {bloqueado ? "🔒 " : ""}
            {nivel.nombre}
          </button>
        );
      })}
    </div>
  );
}
