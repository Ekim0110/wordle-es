// Frase grande en el centro de la pantalla ("¡BACANO!", "¡PAILA!"...).
// Aparece aunque el navegador no pueda hablar.
export default function Grito({ texto, ganaste }: { texto: string; ganaste: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <p
        className={`animate-grito text-center text-6xl font-black uppercase tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)] sm:text-8xl ${
          ganaste
            ? "bg-gradient-to-r from-amarillo via-azul to-rojo bg-clip-text text-transparent"
            : "text-rojo"
        }`}
      >
        {texto}
      </p>
    </div>
  );
}
