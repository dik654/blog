export default function ContentAddressingThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* CID hash label */}
      <rect x={8} y={30} width={28} height={16} rx={3}
        stroke="#f59e0b" strokeWidth={1.5} fill="#f59e0b" fillOpacity={0.12} />
      {/* Arrow to root */}
      <line x1={36} y1={38} x2={48} y2={38} stroke="#f59e0b" strokeWidth={1.5} />
      <polygon points="46,35 50,38 46,41" fill="#f59e0b" />
      {/* Merkle DAG root */}
      <circle cx={58} cy={38} r={6} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.15} />
      {/* Children */}
      <line x1={62} y1={33} x2={80} y2={20} stroke="#6366f1" strokeWidth={1} />
      <line x1={62} y1={43} x2={80} y2={56} stroke="#6366f1" strokeWidth={1} />
      <circle cx={84} cy={18} r={5} stroke="#10b981" strokeWidth={1.5}
        fill="#10b981" fillOpacity={0.12} />
      <circle cx={84} cy={58} r={5} stroke="#10b981" strokeWidth={1.5}
        fill="#10b981" fillOpacity={0.12} />
      {/* Leaf nodes */}
      <line x1={88} y1={15} x2={102} y2={12} stroke="#10b981" strokeWidth={1} />
      <line x1={88} y1={21} x2={102} y2={26} stroke="#10b981" strokeWidth={1} />
      <rect x={100} y={8} width={12} height={8} rx={2} stroke="#10b981" strokeWidth={1}
        fill="#10b981" fillOpacity={0.08} />
      <rect x={100} y={22} width={12} height={8} rx={2} stroke="#10b981" strokeWidth={1}
        fill="#10b981" fillOpacity={0.08} />
    </svg>
  );
}
