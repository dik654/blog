export default function P2PFundamentalsThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Protocol layers stacked */}
      {[
        { y: 8, w: 90, color: '#f59e0b', label: 'app' },
        { y: 26, w: 80, color: '#10b981', label: 'transport' },
        { y: 44, w: 70, color: '#6366f1', label: 'network' },
        { y: 62, w: 60, color: '#6366f1', label: 'link' },
      ].map((layer, i) => (
        <rect key={i}
          x={(120 - layer.w) / 2} y={layer.y}
          width={layer.w} height={14} rx={3}
          stroke={layer.color} strokeWidth={1.5}
          fill={layer.color} fillOpacity={0.1} />
      ))}
    </svg>
  );
}
