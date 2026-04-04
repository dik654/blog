import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: 'Network/RPC: ECDSA 서명 검증, 사전 유효성 검사' },
  { label: 'TxPool: Pending / Queued / Basefee / Blob 서브풀로 분류' },
  { label: 'PayloadBuilder: effective_gas_price 내림차순 greedy 선택' },
  { label: 'REVM: CallFrame 생성, warm/cold storage, 1024 depth' },
  { label: '가스 계산 & Receipt: basefee 소각, priority_fee → 검증자' },
  { label: 'SparseStateTrie: 변경된 슬롯만 병렬 Keccak-256 해싱' },
  { label: 'MDBX: finalized 이후 블록만 영구 기록, 미확정은 메모리' },
];

const ANNOT = [
  'tx 0x4e3f…: nonce=42, from=0xa711…',
  'Pending: nonce 연속 · Queued: nonce gap',
  'base=8.2gwei, priority=2gwei → 10.2gwei',
  'CALL depth=1, SSTORE cold→warm 2100gas',
  'gas_used=46,218 · basefee 소각 0.00038 ETH',
  'storageRoot 0xb72e… → 0xd4a1… 갱신',
  'block #20,123,456 finalized → MDBX flush',
];
const P = [
  { label: 'Network / RPC',   sub: 'ECDSA · nonce=42 · 0.5 ETH',  color: '#6366f1', y: 35 },
  { label: 'TxPool',          sub: 'Pending 4,218 · Queued 892',   color: '#0ea5e9', y: 90 },
  { label: 'PayloadBuilder',  sub: 'base 8.2 + tip 2 = 10.2 gwei', color: '#f59e0b', y: 145 },
  { label: 'REVM',            sub: 'CALL 21k + SSTORE 20k gas',    color: '#10b981', y: 200 },
  { label: 'Gas & Receipt',   sub: '46,218 gas · 2 logs',          color: '#8b5cf6', y: 255 },
  { label: 'SparseStateTrie', sub: '3 슬롯 변경 · Keccak-256',     color: '#ec4899', y: 310 },
  { label: 'MDBX',            sub: 'block #20,123,456 저장',       color: '#64748b', y: 365 },
];

export default function TransactionEVMViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 375 390" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <filter id="pkt-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Pipeline axis */}
          <line x1={22} y1={28} x2={22} y2={382} stroke="var(--border)" strokeWidth={1.5} />

          {/* Stage boxes */}
          {P.map((s, i) => (
            <g key={s.label} opacity={i > step ? 0.22 : 1}>
              <circle cx={22} cy={s.y} r={4} fill={i <= step ? s.color : 'var(--border)'} />
              <line x1={26} y1={s.y} x2={46} y2={s.y} stroke={i <= step ? s.color : 'var(--border)'} strokeWidth={1.5} />
              <rect x={46} y={s.y-18} width={225} height={36} rx={6}
                fill={i === step ? `${s.color}18` : 'transparent'}
                stroke={i === step ? s.color : 'var(--border)'}
                strokeWidth={i === step ? 2 : 1} />
              <text x={58} y={s.y-4} fontSize={11} fontWeight="700"
                fill={i === step ? s.color : 'var(--foreground)'}>
                {s.label}
              </text>
              <text x={58} y={s.y+10} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
            </g>
          ))}

          {/* TX packet — physically moves down the pipeline */}
          <motion.g
            animate={{ y: P[step].y - P[0].y }}
            transition={{ duration: 0.55, type: 'spring', bounce: 0.2 }}>
            <circle cx={22} cy={P[0].y} r={12} fill={P[step].color} filter="url(#pkt-glow)" />
            <text x={22} y={P[0].y + 4} textAnchor="middle" fontSize={9} fontWeight="800" fill="white">TX</text>
          </motion.g>
                  <motion.text x={280} y={195} fontSize={9} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
