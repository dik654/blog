export default function StorageChainThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Distributed storage blocks in a grid */}
      {[
        [18, 15], [48, 15], [78, 15],
        [18, 40], [48, 40], [78, 40],
        [33, 58], [63, 58],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={22} height={16} rx={3}
          stroke="#6366f1" strokeWidth={1}
          fill="#6366f1" fillOpacity={i % 3 === 0 ? 0.15 : 0.07} />
      ))}
      {/* Connection lines */}
      <line x1={29} y1={31} x2={29} y2={40} stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} />
      <line x1={59} y1={31} x2={59} y2={40} stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} />
      <line x1={89} y1={31} x2={89} y2={40} stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} />
      <line x1={40} y1={48} x2={48} y2={48} stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} />
      <line x1={70} y1={48} x2={78} y2={48} stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} />
    </svg>
  );
}
