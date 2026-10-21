import { FILAS, LETRAS } from "@/lib/reglas";

type Props = {
  intentos: string[]; // palabras ya enviadas
  actual: string; // palabra que se está escribiendo
};

// Dibuja la cuadrícula de 6 filas por 5 casillas.
export default function Tablero({ intentos, actual }: Props) {
  return (
    <div className="grid gap-1.5">
      {Array.from({ length: FILAS }).map((_, fila) => {
        // ¿Qué texto va en esta fila?
        const palabra =
          fila < intentos.length ? intentos[fila] : fila === intentos.length ? actual : "";

        return (
          <div key={fila} className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: LETRAS }).map((_, col) => {
              const letra = palabra[col] ?? "";
              return (
                <div
                  key={col}
                  className={`size-14 flex items-center justify-center text-3xl font-bold border-2 ${
                    letra ? "border-neutral-400" : "border-neutral-700"
                  }`}
                >
                  {letra}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
