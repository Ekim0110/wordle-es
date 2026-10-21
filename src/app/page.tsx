import Bandera from "@/components/Bandera";
import Instalar from "@/components/Instalar";
import Juego from "@/components/Juego";

// Página principal: el título y el juego.
// El fondo con manchas de colores está en globals.css (es más liviano así).
export default function Home() {
  return (
    <main className="flex min-h-screen w-full justify-center px-4 py-6 sm:py-10">
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <header className="text-center">
          <h1 className="bg-gradient-to-r from-amarillo via-azul to-rojo bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            El Ahorcado
          </h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-white/60">
            Adivina las palabras más colombianas <Bandera className="h-3 w-[18px]" />
          </p>
        </header>
        <Juego />
        <Instalar />
      </div>
    </main>
  );
}
