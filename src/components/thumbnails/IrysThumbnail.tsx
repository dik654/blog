export default function IrysThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* VDF chain — linked time blocks */}
      {[16, 40, 64, 88].map((x, i) => (
        <g key={i}>
          <rect x={x} y={28} width={20} height={24} rx={4}
            stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
          {/* Clock / time indicator inside */}
          <circle cx={x + 10} cy={37} r={4} stroke="#f59e0b" strokeWidth={1} fill="none" />
          <line x1={x + 10} y1={37} x2={x + 10} y2={34} stroke="#f59e0b" strokeWidth={1} />
          <line x1={x + 10} y1={37} x2={x + 13} y2={37} stroke="#f59e0b" strokeWidth={0.8} />
        </g>
      ))}
      {/* Chain arrows */}
      <line x1={36} y1={40} x2={40} y2={40} stroke="#10b981" strokeWidth={1.5} />
      <line x1={60} y1={40} x2={64} y2={40} stroke="#10b981" strokeWidth={1.5} />
      <line x1={84} y1={40} x2={88} y2={40} stroke="#10b981" strokeWidth={1.5} />
    </svg>
  );
}
