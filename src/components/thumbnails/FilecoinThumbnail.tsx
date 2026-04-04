export default function FilecoinThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sector / seal icon — a disc with lock overlay */}
      <circle cx={60} cy={40} r={24} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.08} />
      <circle cx={60} cy={40} r={14} stroke="#6366f1" strokeWidth={1} strokeOpacity={0.5}
        fill="none" />
      {/* Inner seal lines */}
      <line x1={60} y1={16} x2={60} y2={26} stroke="#10b981" strokeWidth={1.5} />
      <line x1={60} y1={54} x2={60} y2={64} stroke="#10b981" strokeWidth={1.5} />
      <line x1={36} y1={40} x2={46} y2={40} stroke="#10b981" strokeWidth={1.5} />
      <line x1={74} y1={40} x2={84} y2={40} stroke="#10b981" strokeWidth={1.5} />
      {/* Center dot */}
      <circle cx={60} cy={40} r={3} fill="#f59e0b" fillOpacity={0.8} />
    </svg>
  );
}
