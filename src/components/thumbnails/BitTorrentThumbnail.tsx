export default function BitTorrentThumbnail() {
  const peers = [
    { x: 60, y: 40 }, // center
    { x: 24, y: 18 }, { x: 96, y: 18 },
    { x: 16, y: 54 }, { x: 104, y: 54 },
    { x: 40, y: 68 }, { x: 80, y: 68 },
  ];

  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines from each peer to center */}
      {peers.slice(1).map((p, i) => (
        <line key={i} x1={60} y1={40} x2={p.x} y2={p.y}
          stroke="#6366f1" strokeWidth={0.8} strokeOpacity={0.3} />
      ))}
      {/* Some peer-to-peer direct lines */}
      <line x1={24} y1={18} x2={16} y2={54} stroke="#10b981" strokeWidth={0.8} strokeOpacity={0.3} />
      <line x1={96} y1={18} x2={104} y2={54} stroke="#10b981" strokeWidth={0.8} strokeOpacity={0.3} />
      {/* Peer nodes */}
      {peers.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === 0 ? 6 : 5}
          stroke={i === 0 ? '#f59e0b' : '#6366f1'} strokeWidth={1.5}
          fill={i === 0 ? '#f59e0b' : '#6366f1'} fillOpacity={0.12} />
      ))}
    </svg>
  );
}
