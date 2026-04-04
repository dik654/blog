export default function CosmosThumbnail() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central hub */}
      <circle cx={60} cy={40} r={10} stroke="#6366f1" strokeWidth={1.5}
        fill="#6366f1" fillOpacity={0.15} />
      {/* Satellite zones */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const r = 28;
        const x = 60 + r * Math.cos((angle * Math.PI) / 180);
        const y = 40 + r * Math.sin((angle * Math.PI) / 180);
        return (
          <g key={i}>
            <line x1={60} y1={40} x2={x} y2={y} stroke="#6366f1" strokeWidth={1} strokeOpacity={0.4} />
            <circle cx={x} cy={y} r={5} stroke="#10b981" strokeWidth={1}
              fill="#10b981" fillOpacity={0.15} />
          </g>
        );
      })}
    </svg>
  );
}
