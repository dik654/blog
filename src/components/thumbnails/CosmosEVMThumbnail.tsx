export default function CosmosEVMThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left chain */}
      <rect x={10} y={25} width={30} height={30} rx={5}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      {/* Right chain */}
      <rect x={80} y={25} width={30} height={30} rx={5}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.1} />
      {/* Bridge arch */}
      <path d="M40 40 Q60 12 80 40" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
      {/* Bridge pillars */}
      <line x1={40} y1={40} x2={40} y2={52} stroke="#f59e0b" strokeWidth={1} />
      <line x1={80} y1={40} x2={80} y2={52} stroke="#f59e0b" strokeWidth={1} />
      {/* Data dots on bridge */}
      <circle cx={52} cy={28} r={2} fill="#f59e0b" fillOpacity={0.8} />
      <circle cx={60} cy={23} r={2} fill="#f59e0b" fillOpacity={0.8} />
      <circle cx={68} cy={28} r={2} fill="#f59e0b" fillOpacity={0.8} />
    </svg>
  );
}
