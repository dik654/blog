export default function GenerativeThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Latent space cloud */}
      <ellipse cx={30} cy={40} rx={18} ry={22} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.08} />
      {/* Random dots in latent space */}
      {[
        [24, 32], [34, 38], [28, 46], [32, 28], [22, 42],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill="#6366f1" fillOpacity={0.5} />
      ))}
      {/* Arrow from latent to output */}
      <line x1={48} y1={40} x2={68} y2={40} stroke="#f59e0b" strokeWidth={1.5} />
      <polygon points="66,37 70,40 66,43" fill="#f59e0b" />
      {/* Generated image placeholder */}
      <rect x={74} y={22} width={36} height={36} rx={4}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.1} />
      {/* Abstract image content */}
      <rect x={78} y={26} width={12} height={12} rx={2} fill="#10b981" fillOpacity={0.2} />
      <rect x={94} y={26} width={12} height={12} rx={2} fill="#6366f1" fillOpacity={0.15} />
      <rect x={78} y={42} width={28} height={12} rx={2} fill="#f59e0b" fillOpacity={0.12} />
    </svg>
  );
}
