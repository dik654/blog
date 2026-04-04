import { motion } from 'framer-motion';

const C = {
  http: '#6b7280', rpsee: '#6366f1', eth: '#10b981',
  engine: '#f59e0b', provider: '#8b5cf6',
};

/* Step 0: 전체 흐름 — 5단계 파이프라인 */
export function StepOverview() {
  const stages = [
    { label: 'HTTP/WS', color: C.http, x: 20 },
    { label: 'jsonrpsee', color: C.rpsee, x: 110 },
    { label: 'EthApi', color: C.eth, x: 200 },
    { label: 'Provider', color: C.provider, x: 290 },
    { label: 'Response', color: C.http, x: 370 },
  ];
  return (<g>
    <defs><marker id="rf-a" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" /></marker></defs>
    {stages.map((s, i) => (
      <motion.g key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={s.x} y={35} width={70} height={36} rx={6}
          fill={`${s.color}12`} stroke={s.color} strokeWidth={1} />
        <text x={s.x + 35} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
          {s.label}</text>
        {i < 4 && <line x1={s.x + 73} y1={53} x2={stages[i + 1].x - 3} y2={53}
          stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#rf-a)" />}
      </motion.g>
    ))}
    {/* 흐르는 점 */}
    <motion.circle r={3} fill={C.rpsee}
      initial={{ cx: 30, cy: 53 }}
      animate={{ cx: 405, cy: 53 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }} />
    <text x={220} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      Geth: 리플렉션 라우팅 / Reth: 컴파일 타임 검증
    </text>
  </g>);
}

/* Step 1: HTTP/WS 수신 — 포트별 분리 */
export function StepHTTP() {
  const ports = [
    { label: 'HTTP :8545', sub: 'eth_* RPC', color: C.http, y: 18 },
    { label: 'WS :8546', sub: '이벤트 구독', color: C.http, y: 55 },
    { label: 'Auth :8551', sub: 'JWT 인증 필수', color: C.engine, y: 92 },
  ];
  return (<g>
    <defs><marker id="rf-h" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill={C.rpsee} /></marker></defs>
    {/* 클라이언트 */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <circle cx={30} cy={58} r={18} fill="var(--card)" stroke={C.http} strokeWidth={0.8} />
      <text x={30} y={55} textAnchor="middle" fontSize={10} fill={C.http}>Client</text>
      <text x={30} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">JSON</text>
    </motion.g>
    {ports.map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + i * 0.15 }}>
        <line x1={50} y1={58} x2={100} y2={p.y + 14}
          stroke={p.color} strokeWidth={0.6} markerEnd="url(#rf-h)" />
        <rect x={105} y={p.y} width={110} height={28} rx={5}
          fill={`${p.color}10`} stroke={p.color} strokeWidth={0.8} />
        <text x={160} y={p.y + 13} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.color}>
          {p.label}</text>
        <text x={160} y={p.y + 23} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          {p.sub}</text>
      </motion.g>
    ))}
    {/* JWT 잠금 아이콘 */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={230} y={95} width={50} height={20} rx={4}
        fill="var(--card)" stroke={C.engine} strokeWidth={0.6} strokeDasharray="3 2" />
      <text x={255} y={109} textAnchor="middle" fontSize={9} fill={C.engine}>JWT</text>
    </motion.g>
  </g>);
}
