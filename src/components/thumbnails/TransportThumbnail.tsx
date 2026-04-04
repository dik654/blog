export default function TransportThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* QUIC multiplexed streams */}
      {/* Left endpoint */}
      <rect x={8} y={20} width={20} height={40} rx={4}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      {/* Right endpoint */}
      <rect x={92} y={20} width={20} height={40} rx={4}
        stroke="#6366f1" strokeWidth={1.5} fill="#6366f1" fillOpacity={0.1} />
      {/* Multiplexed streams */}
      {[28, 38, 48, 58].map((y, i) => {
        const color = ['#6366f1', '#10b981', '#f59e0b', '#6366f1'][i];
        return (
          <g key={i}>
            <line x1={28} y1={y - 4} x2={92} y2={y - 4}
              stroke={color} strokeWidth={1.5} strokeOpacity={0.7} />
            {/* Data packets */}
            <rect x={40 + i * 10} y={y - 7} width={8} height={5} rx={1}
              fill={color} fillOpacity={0.4} />
          </g>
        );
      })}
    </svg>
  );
}
