export default function IrohThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Two peers behind NATs */}
      <rect x={6} y={24} width={30} height={32} rx={4}
        stroke="#6366f1" strokeWidth={1} fill="#6366f1" fillOpacity={0.06} strokeDasharray="3 2" />
      <circle cx={21} cy={40} r={6} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.15} />
      <rect x={84} y={24} width={30} height={32} rx={4}
        stroke="#6366f1" strokeWidth={1} fill="#6366f1" fillOpacity={0.06} strokeDasharray="3 2" />
      <circle cx={99} cy={40} r={6} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.15} />
      {/* QUIC hole punch - curved arrow through NATs */}
      <path d="M27 36 Q60 10 93 36" stroke="#10b981" strokeWidth={1.5} fill="none" />
      <polygon points="91,33 95,37 89,37" fill="#10b981" />
      <path d="M93 44 Q60 70 27 44" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
      <polygon points="29,47 25,43 31,43" fill="#f59e0b" />
    </svg>
  );
}
