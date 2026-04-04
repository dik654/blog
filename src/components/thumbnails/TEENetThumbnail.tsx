export default function TEENetThumbnail() {
  const nodes = [
    { x: 30, y: 20 }, { x: 90, y: 20 },
    { x: 20, y: 55 }, { x: 60, y: 60 }, { x: 100, y: 55 },
  ];

  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Network links */}
      {[
        [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 3], [3, 4],
      ].map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#6366f1" strokeWidth={0.8} strokeOpacity={0.3} />
      ))}
      {/* TEE nodes with enclave indicator */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={8} stroke="#6366f1" strokeWidth={1.5}
            fill="#6366f1" fillOpacity={0.08} />
          <rect x={n.x - 4} y={n.y - 4} width={8} height={8} rx={2}
            stroke="#10b981" strokeWidth={1} fill="#10b981" fillOpacity={0.2} />
        </g>
      ))}
    </svg>
  );
}
