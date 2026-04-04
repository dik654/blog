import { motion } from 'framer-motion';

const C2 = '#10b981', C5 = '#8b5cf6';

const leafData = [
  { x: 30, lbl: '3:v 7:v' },
  { x: 160, lbl: '10:v 15:v' },
  { x: 300, lbl: '20:v 25:v' },
];

export default function BPlusTreeStep() {
  return (
    <svg viewBox="0 0 440 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={220} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C5}>B+tree</text>
      <rect x={160} y={26} width={120} height={26} rx={5} fill={`${C5}10`} stroke={C5} strokeWidth={1} />
      <text x={220} y={43} textAnchor="middle" fontSize={10} fill="var(--foreground)">10 | 20</text>
      <text x={340} y={43} textAnchor="start" fontSize={9} fill="var(--muted-foreground)">키만 저장</text>
      {leafData.map((l, i) => (
        <g key={i}>
          <line x1={160 + i * 60} y1={52} x2={l.x + 45} y2={72}
            stroke="var(--border)" strokeWidth={0.7} />
          <rect x={l.x} y={72} width={90} height={28} rx={4}
            fill={`${C5}08`} stroke={C5} strokeWidth={0.7} />
          <text x={l.x + 45} y={90} textAnchor="middle" fontSize={9}
            fill="var(--foreground)">{l.lbl}</text>
        </g>
      ))}
      {[0, 1].map(i => (
        <motion.line key={i} x1={30 + i * 170 + 90} y1={86} x2={160 + i * 140} y2={86}
          stroke={C5} strokeWidth={1} strokeDasharray="4,2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          markerEnd="url(#arrBP)" />
      ))}
      <text x={220} y={125} textAnchor="middle" fontSize={10} fill={C2}>
        리프 연결 리스트 = 범위 검색 O(k)
      </text>
      <defs>
        <marker id="arrBP" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C5} />
        </marker>
      </defs>
    </svg>
  );
}
