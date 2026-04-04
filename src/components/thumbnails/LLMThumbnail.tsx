export default function LLMThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Token boxes */}
      {[18, 42, 66, 90].map((x, i) => (
        <rect key={i} x={x} y={54} width={18} height={14} rx={3}
          stroke="#6366f1" strokeWidth={1} fill="#6366f1" fillOpacity={0.12} />
      ))}
      {/* Self-attention arcs */}
      <path d="M27 54 Q27 30 51 54" stroke="#10b981" strokeWidth={1.2} fill="none" />
      <path d="M27 54 Q27 22 75 54" stroke="#f59e0b" strokeWidth={1} fill="none" strokeOpacity={0.7} />
      <path d="M51 54 Q51 34 75 54" stroke="#10b981" strokeWidth={1} fill="none" strokeOpacity={0.6} />
      <path d="M75 54 Q75 38 99 54" stroke="#6366f1" strokeWidth={1} fill="none" strokeOpacity={0.5} />
      {/* Attention dots */}
      <circle cx={27} cy={54} r={2} fill="#10b981" />
      <circle cx={51} cy={54} r={2} fill="#10b981" />
      <circle cx={75} cy={54} r={2} fill="#f59e0b" />
      <circle cx={99} cy={54} r={2} fill="#6366f1" />
    </svg>
  );
}
