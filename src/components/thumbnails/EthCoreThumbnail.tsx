export default function EthCoreThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* EL box */}
      <rect x={12} y={18} width={40} height={44} rx={4}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      {/* CL box */}
      <rect x={68} y={18} width={40} height={44} rx={4}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.1} />
      {/* Engine API arrows */}
      <line x1={52} y1={34} x2={68} y2={34} stroke="#f59e0b" strokeWidth={1.5} />
      <line x1={68} y1={46} x2={52} y2={46} stroke="#f59e0b" strokeWidth={1.5} />
      <polygon points="66,31 68,34 66,37" fill="#f59e0b" />
      <polygon points="54,43 52,46 54,49" fill="#f59e0b" />
    </svg>
  );
}
