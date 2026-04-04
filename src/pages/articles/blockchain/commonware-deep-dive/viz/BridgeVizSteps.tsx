import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const F = { initial: { opacity: 0 }, animate: { opacity: 1 } };

export function RuntimeInitStep() {
  return (
    <motion.g {...F}>
      <rect x={100} y={12} width={240} height={32} rx={5} fill="var(--card)" />
      <rect x={100} y={12} width={240} height={32} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={1} />
      <text x={220} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">tokio::Config::new()</text>
      <text x={220} y={38} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">.with_storage_directory(path)</text>
      <line x1={220} y1={44} x2={220} y2={56} stroke="var(--border)" strokeWidth={0.5} markerEnd="url(#arr)" />
      <rect x={120} y={56} width={200} height={28} rx={5} fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
      <text x={220} y={74} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">tokio::Runner::new(cfg)</text>
      <text x={220} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">worker_threads: 2 | max_blocking: 512 | buffer_pool: 2MB</text>
    </motion.g>
  );
}

export function ContextStep() {
  const traits = ['Clock', 'Network', 'Storage', 'Spawner', 'Metrics'];
  return (
    <motion.g {...F}>
      <rect x={120} y={8} width={200} height={26} rx={4} fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
      <text x={220} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">executor.start(|context| async {'{ }'})</text>
      <line x1={220} y1={34} x2={220} y2={46} stroke="var(--border)" strokeWidth={0.5} />
      {traits.map((t, i) => {
        const x = 22 + i * 82;
        return (
          <g key={t}>
            <line x1={220} y1={46} x2={x + 36} y2={56} stroke="var(--border)" strokeWidth={0.3} />
            <rect x={x} y={56} width={72} height={22} rx={3} fill="var(--card)" />
            <rect x={x} y={56} width={72} height={22} rx={3} fill={`${C2}08`} stroke={C2} strokeWidth={0.5} />
            <text x={x + 36} y={71} textAnchor="middle" fontSize={10} fill={C2}>{t}</text>
          </g>
        );
      })}
      <text x={220} y={98} textAnchor="middle" fontSize={7.5} fill={C3}>context 하나 = 전체 런타임 기능 접근</text>
    </motion.g>
  );
}

export function P2PChannelStep() {
  const chs = [
    { id: 0, name: 'vote', c: C1 },
    { id: 1, name: 'certificate', c: '#8b5cf6' },
    { id: 2, name: 'resolver', c: C2 },
  ];
  return (
    <motion.g {...F}>
      <rect x={120} y={8} width={200} height={24} rx={4} fill={`${C1}08`} stroke={C1} strokeWidth={0.6} />
      <text x={220} y={24} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>authenticated::Network</text>
      {chs.map((ch, i) => (
        <g key={ch.id}>
          <line x1={220} y1={32} x2={50 + i * 150} y2={46} stroke="var(--border)" strokeWidth={0.4} />
          <rect x={10 + i * 150} y={46} width={80} height={36} rx={4} fill="var(--card)" />
          <rect x={10 + i * 150} y={46} width={80} height={36} rx={4} fill={`${ch.c}10`} stroke={ch.c} strokeWidth={0.6} />
          <text x={50 + i * 150} y={61} textAnchor="middle" fontSize={10} fontWeight={500} fill={ch.c}>ch:{ch.id}</text>
          <text x={50 + i * 150} y={74} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{ch.name}</text>
        </g>
      ))}
      <text x={220} y={100} textAnchor="middle" fontSize={10} fill={C3}>채널별 Quota::per_second(10) + 256 in-flight</text>
    </motion.g>
  );
}
