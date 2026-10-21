// Lluvia de confeti con los colores de Colombia. Solo CSS, sin librerías.
const COLORES = ["bg-amarillo", "bg-azul", "bg-rojo", "bg-white"];

export default function Confeti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className={`absolute top-0 h-3 w-2 rounded-sm animate-caer ${COLORES[i % COLORES.length]}`}
          style={{
            // Posición y retraso "aleatorios" pero fijos, calculados con el índice
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 10) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
