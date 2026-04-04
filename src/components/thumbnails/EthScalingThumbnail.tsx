export default function EthScalingThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* L1 base layer */}
      <rect x={15} y={50} width={90} height={16} rx={4}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.15} />
      {/* L2 layers stacked */}
      <rect x={22} y={30} width={34} height={14} rx={3}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.1} />
      <rect x={64} y={30} width={34} height={14} rx={3}
        stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.1} />
      {/* Arrows down to L1 */}
      <line x1={39} y1={44} x2={39} y2={50} stroke="#f59e0b" strokeWidth={1} />
      <line x1={81} y1={44} x2={81} y2={50} stroke="#f59e0b" strokeWidth={1} />
      {/* L3 on top */}
      <rect x={28} y={12} width={22} height={12} rx={3}
        stroke="#f59e0b" strokeWidth={1} fill="#f59e0b" fillOpacity={0.08} />
      <line x1={39} y1={24} x2={39} y2={30} stroke="#f59e0b" strokeWidth={1} />
    </svg>
  );
}
