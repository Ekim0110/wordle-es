import { MAX_ERRORES } from "@/lib/reglas";

// Dibuja la horca y, según los errores, las partes del muñeco.
// Usamos SVG: una forma de dibujar con líneas y círculos dentro de la página.
// Cada parte nueva se "traza" con una animación (animate-draw).
export default function Dibujo({ errores }: { errores: number }) {
  // pathLength="1" hace que cada línea mida "1", así la animación
  // funciona igual para líneas largas y cortas.
  const trazo = { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1, className: "animate-draw" };

  const partes = [
    <circle key="cabeza" cx="140" cy="60" r="18" {...trazo} />,
    <line key="cuerpo" x1="140" y1="78" x2="140" y2="135" {...trazo} />,
    <line key="brazo-izq" x1="140" y1="95" x2="115" y2="118" {...trazo} />,
    <line key="brazo-der" x1="140" y1="95" x2="165" y2="118" {...trazo} />,
    <line key="pierna-izq" x1="140" y1="135" x2="118" y2="168" {...trazo} />,
    <line key="pierna-der" x1="140" y1="135" x2="162" y2="168" {...trazo} />,
  ];

  return (
    <svg
      viewBox="0 0 200 210"
      className="h-auto w-40 fill-none sm:w-48"
      strokeWidth="6"
      strokeLinecap="round"
      role="img"
      aria-label={`Ahorcado: ${errores} de ${MAX_ERRORES} errores`}
    >
      <defs>
        {/* Degradado para el muñeco: de amarillo (arriba) a rojo (abajo). "userSpaceOnUse"
            hace que funcione también en las líneas rectas verticales. */}
        <linearGradient id="muneco" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="170">
          <stop offset="0%" stopColor="#fcd116" />
          <stop offset="100%" stopColor="#ef3340" />
        </linearGradient>
      </defs>
      {/* La horca siempre se ve */}
      <g className="stroke-white/30">
        <line x1="20" y1="200" x2="180" y2="200" />
        <line x1="50" y1="200" x2="50" y2="15" />
        <line x1="50" y1="15" x2="140" y2="15" />
        <line x1="140" y1="15" x2="140" y2="42" />
      </g>
      <g stroke="url(#muneco)">
        {partes.slice(0, errores)}
      </g>
    </svg>
  );
}
