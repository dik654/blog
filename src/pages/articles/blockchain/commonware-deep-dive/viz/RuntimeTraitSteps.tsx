import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const F = { initial: { opacity: 0 }, animate: { opacity: 1 } };

export function RunnerStep() {
  const traits = ['Clock', 'Network', 'Storage', 'Spawner', 'Metrics'];
  return (
    <motion.g {...F}>
      <rect x={150} y={8} width={140} height={32} rx={6} fill="var(--card)" />
      <rect x={150} y={8} width={140} height={32} rx={6} fill={`${C1}12`} stroke={C1} strokeWidth={1.2} />
      <text x={220} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={C1}>Runner::start()</text>
      <text x={220} y={34} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">|context| async {'{ ... }'}</text>
      <line x1={220} y1={40} x2={220} y2={55} stroke="var(--border)" strokeWidth={0.6} />
      <text x={220} y={65} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Context</text>
      {traits.map((t, i) => {
        const x = 30 + i * 80;
        return (
          <g key={t}>
            <line x1={220} y1={70} x2={x + 34} y2={82} stroke="var(--border)" strokeWidth={0.4} />
            <rect x={x} y={82} width={68} height={24} rx={4} fill="var(--card)" />
            <rect x={x} y={82} width={68} height={24} rx={4} fill={`${C2}10`} stroke={C2} strokeWidth={0.6} />
            <text x={x + 34} y={98} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>{t}</text>
          </g>
        );
      })}
    </motion.g>
  );
}

export function SpawnerStep() {
  return (
    <motion.g {...F}>
      <rect x={150} y={10} width={140} height={28} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
      <text x={220} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>ctx_root</text>
      <line x1={160} y1={38} x2={100} y2={52} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={280} y1={38} x2={340} y2={52} stroke="var(--border)" strokeWidth={0.5} />
      <rect x={50} y={52} width={100} height={24} rx={4} fill={`${C2}10`} stroke={C2} strokeWidth={0.6} />
      <text x={100} y={68} textAnchor="middle" fontSize={10} fill={C2}>spawn() → Task A</text>
      <rect x={290} y={52} width={100} height={24} rx={4} fill={`${C3}10`} stroke={C3} strokeWidth={0.6} />
      <text x={340} y={68} textAnchor="middle" fontSize={10} fill={C3}>clone() → ctx_b</text>
      <line x1={100} y1={76} x2={100} y2={88} stroke="var(--border)" strokeWidth={0.5} />
      <rect x={50} y={88} width={100} height={20} rx={3} fill="#ef444410" stroke="#ef4444" strokeWidth={0.5} />
      <text x={100} y={101} textAnchor="middle" fontSize={10} fill="#ef4444">parent abort → child abort</text>
    </motion.g>
  );
}
