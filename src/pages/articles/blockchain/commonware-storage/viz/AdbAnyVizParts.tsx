import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const C = { log: '#6366f1', snap: '#10b981', proof: '#f59e0b', prune: '#ef4444' };

export function LogBar({ step }: { step: number }) {
  const ops = ['put(a,1)', 'put(b,2)', 'put(a,3)', 'del(b)', 'commit'];
  return (
    <g>
      <text x={10} y={18} fontSize={10} fill={C.log} fontWeight={600}>Operations Log (MMR)</text>
      {ops.map((op, i) => {
        const x = 10 + i * 88;
        const pruned = step === 4 && i < 2;
        return (
          <g key={i}>
            <rect x={x} y={24} width={82} height={24} rx={4}
              fill={pruned ? `${C.prune}08` : `${C.log}12`}
              stroke={pruned ? C.prune : C.log}
              strokeWidth={pruned ? 0.6 : 1}
              strokeDasharray={pruned ? '3 2' : 'none'} />
            <text x={x + 41} y={39} textAnchor="middle" fontSize={10}
              fill={pruned ? C.prune : C.log}
              opacity={pruned ? 0.5 : 1}>{op}</text>
            <text x={x + 41} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">loc={i}</text>
          </g>
        );
      })}
    </g>
  );
}

export function SnapshotBox({ step }: { step: number }) {
  return (
    <g>
      <rect x={10} y={75} width={200} height={45} rx={6} fill={`${C.snap}10`} stroke={C.snap} strokeWidth={1} />
      <text x={20} y={90} fontSize={10} fill={C.snap} fontWeight={600}>snapshot (HashMap)</text>
      <text x={20} y={105} fontSize={10} fill="var(--muted-foreground)">
        {step >= 4 ? 'a → loc=2' : 'a → loc=2, b → (deleted)'}
      </text>
    </g>
  );
}

export function GetFlow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <line x1={210} y1={97} x2={280} y2={97} stroke={C.snap} strokeWidth={1} markerEnd="url(#any-arw)" />
      <rect x={280} y={80} width={160} height={40} rx={6} fill={`${C.snap}10`} stroke={C.snap} strokeWidth={1} />
      <text x={360} y={96} textAnchor="middle" fontSize={10} fill={C.snap} fontWeight={600}>1. snapshot.get(key)</text>
      <text x={360} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">2. log.read(loc) → 값 반환</text>
      <defs><marker id="any-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill={C.snap} /></marker></defs>
    </motion.g>
  );
}

export function PutFlow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={280} y={75} width={160} height={45} rx={6} fill={`${C.log}10`} stroke={C.log} strokeWidth={1} />
      <text x={360} y={92} textAnchor="middle" fontSize={10} fill={C.log} fontWeight={600}>1. log.append(op)</text>
      <text x={360} y={107} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">2. snapshot[key] = new_loc</text>
    </motion.g>
  );
}

export function ProofFlow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={280} y={75} width={165} height={45} rx={6} fill={`${C.proof}10`} stroke={C.proof} strokeWidth={1} />
      <text x={362} y={92} textAnchor="middle" fontSize={10} fill={C.proof} fontWeight={600}>historical_proof(loc, max)</text>
      <text x={362} y={107} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">MMR range_proof + Vec&lt;Op&gt;</text>
    </motion.g>
  );
}

export function PruneFlow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={280} y={75} width={165} height={45} rx={6} fill={`${C.prune}10`} stroke={C.prune} strokeWidth={1} />
      <text x={362} y={92} textAnchor="middle" fontSize={10} fill={C.prune} fontWeight={600}>prune(floor_loc=2)</text>
      <text x={362} y={107} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">floor 이전 비활성 연산 삭제</text>
    </motion.g>
  );
}
