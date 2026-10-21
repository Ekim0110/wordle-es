import { MAX_ERRORES } from "@/lib/reglas";

// Dibuja la horca y, según los errores, las partes del muñeco.
// Usamos SVG: una forma de dibujar con líneas y círculos dentro de la página.
export default function Dibujo({ errores }: { errores: number }) {
  // Cada parte aparece cuando hay suficientes errores.
  const partes = [
    <circle key="cabeza" cx="140" cy="60" r="18" />,
    <line key="cuerpo" x1="140" y1="78" x2="140" y2="135" />,
    <line key="brazo-izq" x1="140" y1="95" x2="115" y2="118" />,
    <line key="brazo-der" x1="140" y1="95" x2="165" y2="118" />,
    <line key="pierna-izq" x1="140" y1="135" x2="118" y2="168" />,
    <line key="pierna-der" x1="140" y1="135" x2="162" y2="168" />,
  ];

  return (
    <svg
      viewBox="0 0 200 210"
      className="w-48 h-auto stroke-current fill-none"
      strokeWidth="5"
      strokeLinecap="round"
      role="img"
      aria-label={`Ahorcado: ${errores} de ${MAX_ERRORES} errores`}
    >
      {/* La horca siempre se ve */}
      <line x1="20" y1="200" x2="180" y2="200" />
      <line x1="50" y1="200" x2="50" y2="15" />
      <line x1="50" y1="15" x2="140" y2="15" />
      <line x1="140" y1="15" x2="140" y2="42" />
      {/* Las partes del muñeco, en rojo */}
      <g className="stroke-red-400">{partes.slice(0, errores)}</g>
    </svg>
  );
}
