export default function ZKAccelThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* GPU chip */}
      <rect x={50} y={14} width={56} height={52} rx={5}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.08} />
      {/* Mini cores grid inside GPU */}
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => (
          <rect key={`${r}-${c}`}
            x={56 + c * 15} y={22 + r * 14}
            width={10} height={9} rx={1}
            fill="#10b981" fillOpacity={0.2} />
        ))
      )}
      {/* MSM curve input */}
      <path d="M10 55 Q20 25 35 40" stroke="#6366f1" strokeWidth={1.5} fill="none" />
      <circle cx={20} cy={36} r={2} fill="#6366f1" />
      <circle cx={30} cy={38} r={2} fill="#6366f1" />
      {/* Arrow to GPU */}
      <line x1={35} y1={40} x2={50} y2={40} stroke="#f59e0b" strokeWidth={1.5} />
      <polygon points="48,37 52,40 48,43" fill="#f59e0b" />
    </svg>
  );
}
