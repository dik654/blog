import { motion } from 'framer-motion';

const C2 = '#10b981', C4 = '#ef4444';

export default function HashStep() {
  const buckets = ['-', '22', '-', '3', '-', '15', '7', '-'];
  return (
    <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C2}>해시 테이블</text>
      {buckets.map((v, i) => (
        <g key={i}>
          <rect x={40 + i * 44} y={30} width={40} height={30} rx={4}
            fill={v !== '-' ? `${C2}15` : 'var(--card)'} stroke={C2} strokeWidth={0.7} />
          <text x={60 + i * 44} y={50} textAnchor="middle" fontSize={10}
            fill={v !== '-' ? 'var(--foreground)' : 'var(--muted-foreground)'}>{v}</text>
          <text x={60 + i * 44} y={75} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">[{i}]</text>
        </g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={210} y={100} textAnchor="middle" fontSize={10} fill={C4}>
          "10~20 사이 키 조회" 불가능 (순서 없음)
        </text>
      </motion.g>
    </svg>
  );
}
