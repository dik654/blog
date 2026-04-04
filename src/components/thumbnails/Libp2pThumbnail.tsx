export default function Libp2pThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Modular stack blocks */}
      {[
        { x: 20, y: 10, w: 80, color: '#f59e0b' },
        { x: 25, y: 28, w: 35, color: '#10b981' },
        { x: 65, y: 28, w: 30, color: '#10b981' },
        { x: 20, y: 46, w: 25, color: '#6366f1' },
        { x: 50, y: 46, w: 22, color: '#6366f1' },
        { x: 77, y: 46, w: 23, color: '#6366f1' },
        { x: 20, y: 64, w: 80, color: '#6366f1' },
      ].map((block, i) => (
        <rect key={i} x={block.x} y={block.y} width={block.w} height={14} rx={3}
          stroke={block.color} strokeWidth={1.5} fill={block.color} fillOpacity={0.1} />
      ))}
    </svg>
  );
}
