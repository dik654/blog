export default function ZKPVMThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Logic gates */}
      <rect x={15} y={15} width={22} height={16} rx={3}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      <rect x={15} y={48} width={22} height={16} rx={3}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      <rect x={52} y={30} width={22} height={16} rx={3}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.1} />
      <rect x={88} y={30} width={22} height={16} rx={3}
        stroke="#f59e0b" strokeWidth={1.5} fill="#f59e0b" fillOpacity={0.1} />
      {/* Wires */}
      <line x1={37} y1={23} x2={52} y2={35} stroke="#6366f1" strokeWidth={1} />
      <line x1={37} y1={56} x2={52} y2={42} stroke="#6366f1" strokeWidth={1} />
      <line x1={74} y1={38} x2={88} y2={38} stroke="#10b981" strokeWidth={1} />
    </svg>
  );
}
