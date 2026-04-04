import { motion } from 'framer-motion';

export function ContractStep() {
  return (
    <g>
      <rect x={130} y={10} width={280} height={140} rx={8}
        fill="#6366f108" stroke="#6366f130" strokeWidth={1} />
      <text x={270} y={30} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="#6366f1">SecretBallot.sol</text>
      {[
        { label: 'votes (private)', sub: 'SGX 내 복호화', y: 50, c: '#6366f1' },
        { label: 'vote(bool)', sub: '기밀 투표 실행', y: 80, c: '#10b981' },
        { label: 'randomBytes(32)', sub: '기밀 난수', y: 110, c: '#10b981' },
        { label: 'getTally()', sub: '집계만 공개', y: 140, c: '#f59e0b' },
      ].map((r) => (
        <g key={r.label}>
          <motion.rect x={145} y={r.y - 10} width={250} height={24} rx={4}
            fill={`${r.c}12`} stroke={`${r.c}40`} strokeWidth={0.8}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (r.y - 50) * 0.003 }} />
          <text x={160} y={r.y + 4} fontSize={10} fontWeight={600} fill={r.c}>{r.label}</text>
          <text x={380} y={r.y + 4} textAnchor="end" fontSize={10}
            fill="var(--muted-foreground)">{r.sub}</text>
        </g>
      ))}
    </g>
  );
}

export function KeyDerivStep() {
  return (
    <g>
      {[
        { label: 'KM Root Secret', x: 270, y: 15, w: 140, c: '#6366f1' },
        { label: 'Runtime Key', x: 270, y: 55, w: 120, c: '#6366f1' },
        { label: 'Contract Key', x: 270, y: 95, w: 120, c: '#10b981' },
      ].map((n, i) => (
        <g key={n.label}>
          {i > 0 && <line x1={270} y1={n.y - 16} x2={270} y2={n.y}
            stroke={n.c} strokeWidth={1} />}
          <rect x={n.x - n.w / 2} y={n.y} width={n.w} height={28} rx={5}
            fill={`${n.c}14`} stroke={n.c} strokeWidth={1.2} />
          <text x={n.x} y={n.y + 18} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={n.c}>{n.label}</text>
        </g>
      ))}
      {[
        { label: 'State Enc Key', x: 170, c: '#f59e0b' },
        { label: 'Tx Dec Key', x: 370, c: '#f59e0b' },
      ].map((k) => (
        <g key={k.label}>
          <line x1={270} y1={123} x2={k.x} y2={140} stroke={k.c} strokeWidth={0.8} />
          <rect x={k.x - 55} y={140} width={110} height={24} rx={5}
            fill={`${k.c}12`} stroke={`${k.c}60`} strokeWidth={1} />
          <text x={k.x} y={156} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={k.c}>{k.label}</text>
        </g>
      ))}
    </g>
  );
}

export function EthCompatStep() {
  return (
    <g>
      {[
        { label: 'ethers.js', sub: 'BrowserProvider', x: 90, c: '#6366f1' },
        { label: 'sapphire.wrap()', sub: '자동 암호화', x: 270, c: '#10b981' },
        { label: 'Sapphire RPC', sub: '0x5afe (23294)', x: 450, c: '#f59e0b' },
      ].map((b, i) => (
        <g key={b.label}>
          {i > 0 && (
            <motion.line x1={b.x - 105} y1={55} x2={b.x - 65} y2={55}
              stroke={b.c} strokeWidth={1.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.3 }} />
          )}
          <motion.rect x={b.x - 60} y={30} width={120} height={50} rx={8}
            fill={`${b.c}14`} stroke={b.c} strokeWidth={1.5}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15 }} />
          <text x={b.x} y={52} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={b.c}>{b.label}</text>
          <text x={b.x} y={70} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">{b.sub}</text>
        </g>
      ))}
      <text x={270} y={115} textAnchor="middle" fontSize={10}
        fill="var(--muted-foreground)">모든 트랜잭션이 자동으로 암호화되어 전송</text>
    </g>
  );
}
