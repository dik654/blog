export default function DHTDiscoveryThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* XOR distance binary tree */}
      <circle cx={60} cy={12} r={4} stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.15} />
      {/* Level 1 */}
      <line x1={60} y1={16} x2={36} y2={30} stroke="#6366f1" strokeWidth={1} />
      <line x1={60} y1={16} x2={84} y2={30} stroke="#6366f1" strokeWidth={1} />
      <circle cx={36} cy={34} r={4} stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.15} />
      <circle cx={84} cy={34} r={4} stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.15} />
      {/* Level 2 */}
      <line x1={36} y1={38} x2={22} y2={52} stroke="#10b981" strokeWidth={1} />
      <line x1={36} y1={38} x2={50} y2={52} stroke="#10b981" strokeWidth={1} />
      <line x1={84} y1={38} x2={70} y2={52} stroke="#10b981" strokeWidth={1} />
      <line x1={84} y1={38} x2={98} y2={52} stroke="#10b981" strokeWidth={1} />
      {[22, 50, 70, 98].map((x, i) => (
        <circle key={i} cx={x} cy={56} r={4} stroke="#f59e0b" strokeWidth={1}
          fill="#f59e0b" fillOpacity={0.15} />
      ))}
      {/* Highlight one path */}
      <line x1={60} y1={16} x2={84} y2={30} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.6} />
      <line x1={84} y1={38} x2={70} y2={52} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.6} />
    </svg>
  );
}
