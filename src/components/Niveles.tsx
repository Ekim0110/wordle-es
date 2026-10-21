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
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 disabled:opacity-40 disabled:cursor-not-allowed ${
              elegido
                ? "bg-yellow-400 border-yellow-400 text-neutral-900"
                : "border-neutral-600 hover:border-neutral-400"
            }`}
          >
            {bloqueado ? "🔒 " : ""}
            {i + 1}. {nivel.nombre}
          </button>
        );
      })}
    </div>
  );
}
