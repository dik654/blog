import { motion } from 'framer-motion';

const CI = '#6366f1', CG = '#10b981', CR = '#ef4444', CW = '#f59e0b';

export function Box({ x, y, keys, color, dashed, label }: {
  x: number; y: number; keys: string[]; color: string; dashed?: boolean; label?: string;
}) {
  const w = Math.max(keys.length * 28 + 12, 40);
  return (
    <g>
      {label && (
        <text x={x + w / 2} y={y - 5} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">{label}</text>
      )}
      <rect x={x} y={y} width={w} height={24} rx={4}
        fill={`${color}10`} stroke={color} strokeWidth={dashed ? 1.2 : 0.8}
        strokeDasharray={dashed ? '4,2' : 'none'} />
      {keys.map((k, i) => (
        <text key={i} x={x + 14 + i * 28} y={y + 16} textAnchor="middle"
          fontSize={11} fill="var(--foreground)">{k}</text>
      ))}
    </g>
  );
}

export function RedistributeStep() {
  return (
    <svg viewBox="0 0 420 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Box x={150} y={15} keys={['15', '30']} color={CI} label="부모 키 갱신: 25->30" />
      <line x1={165} y1={39} x2={75} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={185} y1={39} x2={188} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={208} y1={39} x2={310} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={54} keys={['10', '12']} color={CG} />
      <Box x={160} y={54} keys={['30']} color={CG} label="30을 빌려옴" />
      <Box x={280} y={54} keys={['35']} color={CG} label="형제: 여유 있음" />
      <motion.path d="M280,66 L200,66" stroke={CW} strokeWidth={1.5} fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }} markerEnd="url(#arrDM)" />
      <text x={240} y={58} textAnchor="middle" fontSize={9} fill={CW}>빌려오기</text>
      <text x={210} y={105} textAnchor="middle" fontSize={10} fill={CG}>
        재분배 완료: 최소 조건 충족
      </text>
      <defs>
        <marker id="arrDM" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CW} />
        </marker>
      </defs>
    </svg>
  );
}

export function MergeStep() {
  return (
    <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={14} textAnchor="middle" fontSize={10} fill={CR}>
        형제도 최소(1키)면 병합
      </text>
      <Box x={165} y={22} keys={['15']} color={CI} label="부모에서 25 제거" />
      <line x1={180} y1={46} x2={80} y2={58} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={192} y1={46} x2={230} y2={58} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={60} keys={['10', '12']} color={CG} />
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}>
        <Box x={190} y={60} keys={['30']} color={CG} label="두 leaf 병합" />
      </motion.g>
      <motion.line x1={97} y1={72} x2={190} y2={72} stroke={CI} strokeWidth={0.8}
        strokeDasharray="3,2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        markerEnd="url(#arrDM2)" />
      <text x={210} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        부모도 언더플로우면 재귀 전파 (높이 -1 가능)
      </text>
      <defs>
        <marker id="arrDM2" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CI} />
        </marker>
      </defs>
    </svg>
  );
}
