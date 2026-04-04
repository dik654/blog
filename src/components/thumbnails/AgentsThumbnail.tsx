export default function AgentsThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Think node */}
      <circle cx={60} cy={18} r={10} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.12} />
      {/* Act node */}
      <circle cx={92} cy={58} r={10} stroke="#10b981" strokeWidth={1.5}
        fill="#10b981" fillOpacity={0.12} />
      {/* Observe node */}
      <circle cx={28} cy={58} r={10} stroke="#f59e0b" strokeWidth={1.5}
        fill="#f59e0b" fillOpacity={0.12} />
      {/* Loop arrows */}
      <path d="M69 23 L84 50" stroke="#6366f1" strokeWidth={1.5} />
      <polygon points="82,47 86,52 80,51" fill="#6366f1" />
      <path d="M82 62 L38 62" stroke="#10b981" strokeWidth={1.5} />
      <polygon points="41,59 36,62 41,65" fill="#10b981" />
      <path d="M22 50 L54 23" stroke="#f59e0b" strokeWidth={1.5} />
      <polygon points="51,25 56,21 54,27" fill="#f59e0b" />
    </svg>
  );
}
