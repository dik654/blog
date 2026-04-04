import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CH = '#ef4444';

export function ActorsStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[
        { label: 'Voter', sub: '합의 로직\nstate + automaton', c: CV, x: 60 },
        { label: 'Batcher', sub: '투표 수집\n배치 서명 검증', c: CE, x: 220 },
        { label: 'Resolver', sub: '인증서 fetch\npeer 요청·응답', c: CA, x: 380 },
      ].map((a, i) => (
        <g key={i}>
          <rect x={a.x - 55} y={20} width={110} height={70} rx={6} fill="var(--card)" />
          <rect x={a.x - 55} y={20} width={110} height={70} rx={6}
            fill={`${a.c}10`} stroke={a.c} strokeWidth={1} />
          <text x={a.x} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill={a.c}>{a.label}</text>
          {a.sub.split('\n').map((l, j) => (
            <text key={j} x={a.x} y={58 + j * 13} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">{l}</text>
          ))}
        </g>
      ))}
      <line x1={115} y1={55} x2={165} y2={55} stroke="var(--border)" strokeWidth={0.5} />
      <text x={140} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">mailbox</text>
      <line x1={275} y1={55} x2={325} y2={55} stroke="var(--border)" strokeWidth={0.5} />
      <text x={300} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">mailbox</text>
      <rect x={100} y={110} width={260} height={22} rx={4} fill={`${CV}08`} stroke={CV} strokeWidth={0.5} />
      <text x={230} y={125} textAnchor="middle" fontSize={10} fill={CV}>
        Engine::run() → 3 actor start() + select! shutdown
      </text>
    </motion.g>
  );
}

const Row = ({ items }: { items: { t: string; c: string }[] }) => (
  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {items.map((s, i) => (
      <g key={i}>
        <rect x={60} y={10 + i * 28} width={340} height={22} rx={4}
          fill={`${s.c}08`} stroke={s.c} strokeWidth={0.5} />
        <text x={230} y={25 + i * 28} textAnchor="middle" fontSize={10}
          fontFamily="monospace" fill={s.c}>{s.t}</text>
      </g>
    ))}
  </motion.g>
);

export function OnStartStep() {
  return <Row items={[
    { t: 'pending 뷰 불일치 → 폐기', c: '#94a3b8' },
    { t: 'try_propose() → automaton.propose()', c: CV },
    { t: 'try_verify() → automaton.verify()', c: CE },
    { t: 'certify_candidates() → automaton.certify()', c: CA },
    { t: 'Waiter 준비 + timeout 계산', c: CV },
  ]} />;
}

export function EventsStep() {
  return <Row items={[
    { t: 'sleep_until(timeout) → nullify', c: CH },
    { t: 'propose_wait → Proposal 구성', c: CV },
    { t: 'verify_wait → verified / trigger_timeout', c: CE },
    { t: 'certify_wait → certified(view, ok)', c: CA },
    { t: 'mailbox → Proposal | Certificate | Timeout', c: CV },
  ]} />;
}

export function OnEndStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[
        { t: 'notify() — 투표/인증서 브로드캐스트', c: CV, w: 0.7 },
        { t: '  try_broadcast_notarize()', c: CE, w: 0.3 },
        { t: '  try_broadcast_notarization()', c: CE, w: 0.3 },
        { t: '  try_broadcast_finalize()', c: CA, w: 0.3 },
        { t: '  try_broadcast_finalization()', c: CA, w: 0.3 },
        { t: 'prune_views() + batcher.update()', c: CH, w: 0.7 },
      ].map((s, i) => (
        <g key={i}>
          <rect x={80} y={6 + i * 24} width={300} height={19} rx={3}
            fill={`${s.c}08`} stroke={s.c} strokeWidth={s.w} />
          <text x={230} y={19 + i * 24} textAnchor="middle" fontSize={10}
            fontFamily="monospace" fill={s.c}>{s.t}</text>
        </g>
      ))}
    </motion.g>
  );
}
