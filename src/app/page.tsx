// Página principal. Por ahora solo muestra el título y un tablero vacío.
// En las siguientes etapas le daremos vida.

const FILAS = 6; // intentos que tiene el jugador
const LETRAS = 5; // largo de cada palabra

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-8 p-6 bg-neutral-900 text-white">
      <h1 className="text-3xl font-bold tracking-widest uppercase">Wordle en español</h1>

      <div className="grid gap-1.5">
        {Array.from({ length: FILAS }).map((_, fila) => (
          <div key={fila} className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: LETRAS }).map((_, columna) => (
              <div
                key={columna}
                className="size-14 border-2 border-neutral-700"
              />
            ))}
          </div>
        ))}
      </div>

      <p className="text-neutral-400 text-sm">Próximamente: ¡a jugar!</p>
    </main>
  );
}
