// Bandera de Colombia dibujada con SVG. Usamos esto en vez del emoji 🇨🇴
// porque Windows no muestra emojis de banderas (sale "CO" en letras).
export default function Bandera({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 6 4" className={`inline-block rounded-[2px] ${className}`} role="img" aria-label="Colombia">
      <rect width="6" height="2" fill="#fcd116" />
      <rect y="2" width="6" height="1" fill="#003893" />
      <rect y="3" width="6" height="1" fill="#ce1126" />
    </svg>
  );
}
