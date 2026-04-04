export default function WalrusThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 2D erasure coding grid */}
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const x = 18 + col * 18;
          const y = 12 + row * 16;
          const isData = row < 2 && col < 3;
          return (
            <rect key={`${row}-${col}`} x={x} y={y} width={14} height={12} rx={2}
              stroke={isData ? '#6366f1' : '#10b981'} strokeWidth={1}
              fill={isData ? '#6366f1' : '#10b981'}
              fillOpacity={isData ? 0.15 : 0.08} />
          );
        })
      )}
    </svg>
  );
}
