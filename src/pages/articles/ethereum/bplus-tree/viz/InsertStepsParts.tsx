import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', CW = '#f59e0b';

export function Box({ x, y, keys, color, label }: {
  x: number; y: number; keys: string[]; color: string; label?: string;
}) {
  const w = keys.length * 28 + 12;
  return (
    <g>
      {label && (
        <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">{label}</text>
      )}
      <rect x={x} y={y} width={w} height={26} rx={5}
        fill={`${color}10`} stroke={color} strokeWidth={1} />
      {keys.map((k, i) => (
        <text key={i} x={x + 14 + i * 28} y={y + 17} textAnchor="middle"
          fontSize={11} fill="var(--foreground)">{k}</text>
      ))}
    </g>
  );
}

export function SplitStep() {
  return (
    <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Box x={130} y={20} keys={['15', '25']} color={C1} label="root (25 올라옴)" />
      <motion.path d="M210,10 L210,20" stroke={CW} strokeWidth={1.2} fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
        markerEnd="url(#arrIS)" />
      <text x={230} y={14} fontSize={9} fill={CW}>중간키 25 승격</text>
      <line x1={148} y1={46} x2={80} y2={64} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={180} y1={46} x2={200} y2={64} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={210} y1={46} x2={320} y2={64} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={66} keys={['10', '12']} color={C2} />
      <Box x={168} y={66} keys={['20', '22']} color={C2} label="왼쪽 분할" />
      <Box x={296} y={66} keys={['25', '30']} color={C2} label="오른쪽 분할" />
      <motion.line x1={97} y1={79} x2={168} y2={79} stroke={C1} strokeWidth={0.8} strokeDasharray="3,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} markerEnd="url(#arrIS)" />
      <motion.line x1={237} y1={79} x2={296} y2={79} stroke={C1} strokeWidth={0.8} strokeDasharray="3,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} markerEnd="url(#arrIS)" />
      <text x={210} y={115} textAnchor="middle" fontSize={10} fill={C2}>
        leaf 연결 유지, 모든 leaf는 같은 깊이
      </text>
      <defs>
        <marker id="arrIS" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C1} />
        </marker>
      </defs>
    </svg>
  );
}

export function RootSplitStep() {
  return (
    <svg viewBox="0 0 440 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box x={185} y={10} keys={['25']} color={CW} label="새 root 생성 (높이+1)" />
      </motion.g>
      <line x1={200} y1={36} x2={120} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={218} y1={36} x2={310} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={80} y={54} keys={['15']} color={C1} label="내부 분할" />
      <Box x={290} y={54} keys={['35']} color={C1} label="내부 분할" />
      {[20, 120, 230, 340].map((x, i) => (
        <g key={i}>
          <line x1={i < 2 ? 100 : 310} y1={80} x2={x + 30} y2={95}
            stroke="var(--border)" strokeWidth={0.6} />
          <rect x={x} y={97} width={60} height={22} rx={4}
            fill={`${C2}10`} stroke={C2} strokeWidth={0.6} />
          <text x={x + 30} y={112} textAnchor="middle" fontSize={10}
            fill="var(--foreground)">{['10,12', '20,22', '25,30', '35,40'][i]}</text>
        </g>
      ))}
      <text x={220} y={140} textAnchor="middle" fontSize={10} fill={CW}>
        root 분할 = 트리 높이가 증가하는 유일한 경우
      </text>
    </svg>
  );
}
