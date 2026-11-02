// Décor fixe derrière la page : guirlande lumineuse accrochée au mur de briques.
// Purement décoratif (aria-hidden), sans aléatoire pour rester identique au rendu serveur.
const LARGEUR = 1200;
const PORTEE = 300;

const flecheY = (x: number) => 16 + 54 * Math.sin((Math.PI * (x % PORTEE)) / PORTEE);

const FIL = Array.from({ length: LARGEUR / 15 + 1 }, (_, i) => {
  const x = i * 15;
  return `${i === 0 ? "M" : "L"}${x} ${flecheY(x).toFixed(1)}`;
}).join(" ");

const AMPOULES = Array.from({ length: 16 }, (_, i) => {
  const x = i * 75 + 37;
  return { x, y: flecheY(x) + 8, chaude: i % 2 === 0 };
});

export function Ambiance() {
  return (
    <div className="ambiance" aria-hidden="true">
      <svg className="guirlande" viewBox={`0 0 ${LARGEUR} 120`} preserveAspectRatio="xMidYMin slice">
        <path d={FIL} fill="none" stroke="#120a08" strokeWidth="2.5" />
        {AMPOULES.map((a, i) => (
          <g key={i} className="ampoule" style={{ animationDelay: `${-((i * 7) % 11) * 0.45}s` }}>
            <circle cx={a.x} cy={a.y} r="26" fill="#ffd36b" opacity="0.22" />
            <circle cx={a.x} cy={a.y} r="14" fill="#ffd36b" opacity="0.28" />
            <rect x={a.x - 3} y={a.y - 15} width="6" height="8" fill="#120a08" />
            <circle cx={a.x} cy={a.y} r="7" fill={a.chaude ? "#ffd36b" : "#ffe9a0"} />
          </g>
        ))}
      </svg>
      <div className="voile" />
    </div>
  );
}
