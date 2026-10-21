// Teclado en pantalla con distribución en español (incluye la Ñ).
const FILAS_TECLADO = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type Props = {
  aciertos: Set<string>; // letras usadas que SÍ están en la palabra
  fallos: Set<string>; // letras usadas que NO están
  bloqueado: boolean; // true cuando la partida terminó
  alPresionar: (letra: string) => void;
};

export default function Teclado({ aciertos, fallos, bloqueado, alPresionar }: Props) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg">
      {FILAS_TECLADO.map((fila, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {fila.map((letra) => {
            // Elegimos el color según si la letra ya se usó.
            let color = "bg-neutral-600 hover:bg-neutral-500";
            if (aciertos.has(letra)) color = "bg-green-600";
            if (fallos.has(letra)) color = "bg-red-800 text-neutral-400";
            const usada = aciertos.has(letra) || fallos.has(letra);

            return (
              <button
                key={letra}
                type="button"
                onClick={() => alPresionar(letra)}
                disabled={usada || bloqueado}
                aria-label={letra}
                className={`h-14 flex-1 max-w-11 rounded font-bold text-lg select-none disabled:cursor-not-allowed ${color}`}
              >
                {letra}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
