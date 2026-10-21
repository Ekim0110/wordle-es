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
    <div className="flex w-full flex-col gap-1.5 sm:gap-2">
      {FILAS_TECLADO.map((fila, i) => (
        <div key={i} className="flex justify-center gap-1.5 sm:gap-2">
          {fila.map((letra) => {
            // Elegimos el estilo según si la letra ya se usó.
            let estilo =
              "bg-white/10 ring-1 ring-white/10 shadow-md hover:bg-white/20 hover:-translate-y-0.5 active:scale-90";
            if (aciertos.has(letra))
              estilo = "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
            if (fallos.has(letra)) estilo = "bg-rojo/15 text-white/30 line-through";
            const usada = aciertos.has(letra) || fallos.has(letra);

            return (
              <button
                key={letra}
                type="button"
                onClick={() => alPresionar(letra)}
                disabled={usada || bloqueado}
                aria-label={letra}
                className={`h-12 max-w-11 flex-1 select-none rounded-xl text-lg font-semibold transition duration-150 disabled:cursor-not-allowed sm:h-14 ${estilo}`}
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
