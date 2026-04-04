export default function BFTConsensusThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Voting nodes in a ring */}
      {[
        { x: 60, y: 14, ok: true },
        { x: 92, y: 32, ok: true },
        { x: 84, y: 64, ok: false },
        { x: 36, y: 64, ok: true },
        { x: 28, y: 32, ok: true },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={8}
            stroke={n.ok ? '#10b981' : '#ef4444'} strokeWidth={1.5}
            fill={n.ok ? '#10b981' : '#ef4444'} fillOpacity={0.1} />
          {n.ok && (
            <polyline points={`${n.x - 3},${n.y} ${n.x - 1},${n.y + 3} ${n.x + 4},${n.y - 3}`}
              stroke="#10b981" strokeWidth={1.5} strokeLinecap="round" fill="none" />
          )}
          {!n.ok && (
            <>
              <line x1={n.x - 3} y1={n.y - 3} x2={n.x + 3} y2={n.y + 3} stroke="#ef4444" strokeWidth={1.5} />
              <line x1={n.x + 3} y1={n.y - 3} x2={n.x - 3} y2={n.y + 3} stroke="#ef4444" strokeWidth={1.5} />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
