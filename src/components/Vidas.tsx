import { MAX_ERRORES } from "@/lib/reglas";

// Muestra las vidas como corazones: llenos los que te quedan, grises los perdidos.
export default function Vidas({ errores }: { errores: number }) {
  return (
    <div className="flex gap-1" aria-label={`Te quedan ${MAX_ERRORES - errores} vidas`}>
      {Array.from({ length: MAX_ERRORES }).map((_, i) => {
        const perdida = i >= MAX_ERRORES - errores;
        return (
          <span
            key={`${i}-${perdida}`}
            className={`text-lg transition ${perdida ? "opacity-25 grayscale animate-pop" : ""}`}
          >
            ❤️
          </span>
        );
      })}
    </div>
  );
}
