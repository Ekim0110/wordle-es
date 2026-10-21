import Juego from "@/components/Juego";

// Página principal: el título y el juego.
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-8 p-4 bg-neutral-900 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-center uppercase">Wordle en español</h1>
      <Juego />
    </main>
  );
}
