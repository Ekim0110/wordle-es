// Teclado en pantalla con distribución en español (incluye la Ñ).
const FILAS_TECLADO = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BORRAR"],
];

type Props = {
  alPresionar: (tecla: string) => void;
};

export default function Teclado({ alPresionar }: Props) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg">
      {FILAS_TECLADO.map((fila, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {fila.map((tecla) => {
            const esEspecial = tecla === "ENTER" || tecla === "BORRAR";
            return (
              <button
                key={tecla}
                type="button"
                onClick={() => alPresionar(tecla)}
                aria-label={tecla === "BORRAR" ? "Borrar" : tecla === "ENTER" ? "Enviar" : tecla}
                className={`h-14 rounded bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400 font-bold select-none ${
                  esEspecial ? "flex-[1.5] text-xs" : "flex-1 text-lg"
                }`}
              >
                {tecla === "BORRAR" ? "⌫" : tecla === "ENTER" ? "ENVIAR" : tecla}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
