import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const F = { initial: { opacity: 0 }, animate: { opacity: 1 } };

export function ClockStep() {
  const rows = [
    { impl: 'deterministic', time: '가상 시간 (시드 기반)', c: C1 },
    { impl: 'tokio', time: 'SystemTime::now()', c: C2 },
  ];
  return (
    <motion.g {...F}>
      <text x={220} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Clock trait 구현체 비교</text>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x={40} y={30 + i * 38} width={120} height={28} rx={4} fill={`${r.c}10`} stroke={r.c} strokeWidth={0.7} />
          <text x={100} y={48 + i * 38} textAnchor="middle" fontSize={10} fontWeight={500} fill={r.c}>{r.impl}</text>
          <text x={200} y={48 + i * 38} fontSize={10} fill="var(--muted-foreground)">{r.time}</text>
        </g>
      ))}
      <rect x={80} y={108} width={280} height={22} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.5} />
      <text x={220} y={122} textAnchor="middle" fontSize={10} fill={C3}>동일 시드 → sleep 순서 동일 → 완전 재현 가능</text>
    </motion.g>
  );
}

export function NetworkStorageStep() {
  const items = [
    { label: 'Network', sub: 'bind() → dial()', c: C1 },
    { label: 'Listener', sub: 'accept() → (Sink, Stream)', c: '#8b5cf6' },
    { label: 'Storage', sub: 'open() → Blob', c: C2 },
    { label: 'Blob', sub: 'read_at / write_at / sync', c: C3 },
  ];
  return (
    <motion.g {...F}>
      {items.map((it, i) => {
        const x = 20 + (i % 2) * 210, y = 10 + Math.floor(i / 2) * 55;
        return (
          <g key={i}>
            <rect x={x} y={y} width={190} height={40} rx={5} fill="var(--card)" />
            <rect x={x} y={y} width={190} height={40} rx={5} fill={`${it.c}10`} stroke={it.c} strokeWidth={0.7} />
            <text x={x + 95} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={600} fill={it.c}>{it.label}</text>
            <text x={x + 95} y={y + 33} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)" fontFamily="monospace">{it.sub}</text>
          </g>
        );
      })}
      {[{ x1: 115, y1: 50, x2: 115, y2: 65 }, { x1: 325, y1: 50, x2: 325, y2: 65 }].map((l, i) => (
        <line key={i} {...l} stroke="var(--border)" strokeWidth={0.5} />
      ))}
    </motion.g>
  );
}

export function MetricsStep() {
  return (
    <motion.g {...F}>
      <text x={220} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">계층적 메트릭 네임스페이스</text>
      <rect x={140} y={24} width={160} height={24} rx={4} fill={`${C1}10`} stroke={C1} strokeWidth={0.7} />
      <text x={220} y={40} textAnchor="middle" fontSize={10} fill={C1} fontFamily="monospace">with_label("engine")</text>
      <line x1={180} y1={48} x2={120} y2={58} stroke="var(--border)" strokeWidth={0.4} />
      <line x1={260} y1={48} x2={320} y2={58} stroke="var(--border)" strokeWidth={0.4} />
      <rect x={40} y={58} width={160} height={22} rx={3} fill={`${C2}10`} stroke={C2} strokeWidth={0.6} />
      <text x={120} y={73} textAnchor="middle" fontSize={7.5} fill={C2} fontFamily="monospace">with_attribute("epoch","5")</text>
      <rect x={240} y={58} width={160} height={22} rx={3} fill={`${C3}10`} stroke={C3} strokeWidth={0.6} />
      <text x={320} y={73} textAnchor="middle" fontSize={7.5} fill={C3} fontFamily="monospace">with_scope()</text>
      <rect x={60} y={90} width={320} height={22} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={220} y={105} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)" fontFamily="monospace">
        engine_votes_total{'{'} epoch="5" {'}'} → 에폭 종료 시 자동 해제
      </text>
    </motion.g>
  );
}
