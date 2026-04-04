import { motion } from 'framer-motion';

const CITIES = [
  { name: '마드리드', lon: -3.7, x: 120, y: 80, color: '#ef4444' },
  { name: '파리', lon: 2.35, x: 200, y: 45, color: '#3b82f6' },
  { name: '베를린', lon: 13.4, x: 320, y: 40, color: '#10b981' },
];
const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.6 };

export default function GPSMapViz() {
  return (
    <div className="rounded-xl border bg-muted/20 p-5">
      <p className="text-xs font-semibold text-muted-foreground mb-3">경도(longitude) 하나로 도시 분류</p>
      <svg viewBox="0 0 420 130" className="w-full max-w-xl" style={{ height: 'auto' }}>
        {/* background */}
        <rect x={40} y={10} width={320} height={85} rx={8}
          className="fill-muted/30 stroke-border" strokeWidth={0.8} />

        {/* longitude axis */}
        <line x1={60} y1={105} x2={350} y2={105} className="stroke-border" strokeWidth={0.8} />
        {[-5, 0, 5, 10, 15].map((v, i) => (
          <text key={i} x={60 + i * 72.5} y={118} textAnchor="middle" fontSize={9}
            className="fill-muted-foreground">{v}°</text>
        ))}

        {/* cities */}
        {CITIES.map((c, i) => (
          <motion.g key={c.name} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <circle cx={c.x} cy={c.y} r={14} fill={`${c.color}20`}
              stroke={c.color} strokeWidth={1.5} />
            <text x={c.x} y={c.y + 3} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={c.color}>{c.name}</text>
            <text x={c.x} y={c.y + 16} textAnchor="middle" fontSize={9}
              fill={c.color} fillOpacity={0.7}>{c.lon}°</text>
          </motion.g>
        ))}

        {/* model description */}
        <g>
          <rect x={340} y={35} width={75} height={40} rx={6}
            fill="none" className="stroke-border" strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={377} y={52} textAnchor="middle" fontSize={9}
            className="fill-foreground" fontWeight={600}>모델</text>
          <text x={377} y={64} textAnchor="middle" fontSize={9}
            className="fill-muted-foreground">경도 → 확률</text>
        </g>
      </svg>
    </div>
  );
}
