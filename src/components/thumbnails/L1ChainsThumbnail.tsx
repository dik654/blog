export default function L1ChainsThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Multiple parallel chains */}
      {[20, 40, 60].map((y, i) => {
        const color = ['#6366f1', '#10b981', '#f59e0b'][i];
        return (
          <g key={i}>
            {[15, 38, 61, 84].map((x, j) => (
              <g key={j}>
                <rect x={x} y={y - 5} width={16} height={10} rx={3}
                  stroke={color} strokeWidth={1} fill={color} fillOpacity={0.12} />
                {j < 3 && (
                  <line x1={x + 16} y1={y} x2={x + 22} y2={y}
                    stroke={color} strokeWidth={1} strokeOpacity={0.5} />
                )}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
