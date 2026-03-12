import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: 'Network/RPC: ECDSA 서명 검증, 사전 유효성 검사', body: 'devp2p eth/68 또는 eth_sendRawTransaction으로 트랜잭션이 도착합니다. ECDSA secp256k1 서명 복구로 발신자를 특정하고, nonce ≥ current, balance ≥ max_fee × gas_limit을 검증합니다. EIP-4844 blob tx는 KZG commitment 검증이 추가됩니다.' },
  { label: 'TxPool: Pending / Queued / Basefee / Blob 서브풀로 분류', body: '단일 풀에서 관리하면 nonce 갭이 있는 tx와 즉시 실행 가능한 tx가 뒤섞입니다. reth는 4개 서브풀로 분리합니다. balance·nonce·basefee 변화 시 서브풀 간 자동 이동됩니다.' },
  { label: 'PayloadBuilder: effective_gas_price 내림차순 greedy 선택', body: 'Pending 서브풀에서 effective_gas_price = min(max_fee_per_gas, basefee + priority_fee) 내림차순으로 정렬하고 gas_limit까지 greedy하게 선택합니다. 같은 발신자는 nonce 순서를 유지합니다.' },
  { label: 'REVM: CallFrame 생성, warm/cold storage, 1024 depth', body: '트랜잭션마다 CallFrame이 생성됩니다. EIP-2929 warm/cold storage 구분(첫 접근 2100 gas, 이후 100 gas). CALL/DELEGATECALL 시 새 Frame이 스택에 추가되고 최대 1024 깊이까지 중첩됩니다.' },
  { label: '가스 계산 & Receipt: basefee 소각, priority_fee → 검증자', body: 'used_gas = intrinsic_gas + opcode_costs + memory_expansion_cost. priority_fee × used_gas는 검증자 수취, basefee × used_gas는 소각(EIP-1559). TransactionReceipt = {status, cumulative_gas_used, logs, bloom_filter}.' },
  { label: 'SparseStateTrie: 변경된 슬롯만 병렬 Keccak-256 해싱', body: '변경된 계정과 스토리지 슬롯만 업데이트합니다. SparseStateTrie는 변경되지 않은 서브트리를 건드리지 않고, rayon 워커 풀이 변경된 서브트리를 병렬 Keccak-256 해싱합니다.' },
  { label: 'MDBX: finalized 이후 블록만 영구 기록, 미확정은 메모리', body: 'finalized checkpoint 이전 블록만 비동기 PersistenceService가 MDBX에 씁니다. 미확정 블록은 CanonicalInMemoryState(최근 ~64블록)에서 서비스합니다. 히스토리는 불변 StaticFiles로 분리합니다.' },
];

const P = [
  { label: 'Network / RPC',   sub: 'ECDSA · nonce · balance',   color: '#6366f1', y: 35 },
  { label: 'TxPool',          sub: '4 서브풀 분류',              color: '#0ea5e9', y: 90 },
  { label: 'PayloadBuilder',  sub: 'fee 정렬 → greedy 선택',     color: '#f59e0b', y: 145 },
  { label: 'REVM',            sub: 'CallFrame · warm/cold',      color: '#10b981', y: 200 },
  { label: 'Gas & Receipt',   sub: 'basefee 소각 · logs',        color: '#8b5cf6', y: 255 },
  { label: 'SparseStateTrie', sub: '병렬 Keccak-256',            color: '#ec4899', y: 310 },
  { label: 'MDBX',            sub: 'finalized 영구 저장',        color: '#64748b', y: 365 },
];

export default function TransactionEVMViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 275 390" className="w-full max-w-[275px]" style={{ height: 'auto' }}>
          <defs>
            <filter id="pkt-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Pipeline axis */}
          <line x1={22} y1={28} x2={22} y2={382} stroke="hsl(var(--border))" strokeWidth={2} />

          {/* Stage boxes */}
          {P.map((s, i) => (
            <g key={s.label} opacity={i > step ? 0.22 : 1}>
              <circle cx={22} cy={s.y} r={4} fill={i <= step ? s.color : 'hsl(var(--border))'} />
              <line x1={26} y1={s.y} x2={46} y2={s.y} stroke={i <= step ? s.color : 'hsl(var(--border))'} strokeWidth={1.5} />
              <rect x={46} y={s.y-18} width={225} height={36} rx={6}
                fill={i === step ? `${s.color}18` : 'transparent'}
                stroke={i === step ? s.color : 'hsl(var(--border))'}
                strokeWidth={i === step ? 2 : 1} />
              <text x={58} y={s.y-4} fontSize={11} fontWeight="700"
                fill={i === step ? s.color : 'hsl(var(--foreground))'}>
                {s.label}
              </text>
              <text x={58} y={s.y+10} fontSize={8} fill="hsl(var(--muted-foreground))">{s.sub}</text>
            </g>
          ))}

          {/* TX packet — physically moves down the pipeline */}
          <motion.g
            animate={{ y: P[step].y - P[0].y }}
            transition={{ duration: 0.55, type: 'spring', bounce: 0.2 }}>
            <circle cx={22} cy={P[0].y} r={12} fill={P[step].color} filter="url(#pkt-glow)" />
            <text x={22} y={P[0].y + 4} textAnchor="middle" fontSize={8} fontWeight="800" fill="white">TX</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
