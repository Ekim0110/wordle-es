import Juego from "@/components/Juego";

// Página principal: el fondo, el título y el juego.
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:py-10">
      {/* Manchas de color borrosas en el fondo (amarillo, azul y rojo) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 size-80 rounded-full bg-amarillo/25 blur-3xl animate-flotar" />
        <div className="absolute top-1/3 -right-24 size-96 rounded-full bg-azul/25 blur-3xl animate-flotar [animation-delay:-3s]" />
        <div className="absolute -bottom-24 left-1/4 size-80 rounded-full bg-rojo/20 blur-3xl animate-flotar [animation-delay:-5s]" />
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <header className="text-center">
          <h1 className="bg-gradient-to-r from-amarillo via-azul to-rojo bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            El Ahorcado
          </h1>
          <p className="mt-1 text-sm text-white/60">Adivina las palabras más colombianas 🇨🇴</p>
        </header>
        <Juego />
      </div>
    </main>
  );
}
