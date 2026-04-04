import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const C = { main: '#6366f1', add: '#10b981', proof: '#f59e0b', batch: '#8b5cf6' };
const leafY = 88, midY = 62, peakY = 12;
const lx = [20, 52, 84, 116, 160, 192, 232];

function Nd({ x, y, fill, stroke, r = 7 }: { x: number; y: number; fill: string; stroke: string; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} />;
}
function Ed({ x1, y1, x2, y2, c }: { x1: number; y1: number; x2: number; y2: number; c: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={1} opacity={0.5} />;
}

export function TreeBase({ step }: { step: number }) {
  const hi = step === 3;
  return (
    <g>
      <Ed x1={36} y1={midY} x2={68} y2={peakY} c={hi ? C.proof : C.main} />
      <Ed x1={100} y1={midY} x2={68} y2={peakY} c={C.main} />
      <Ed x1={lx[0]} y1={leafY} x2={36} y2={midY} c={hi ? C.proof : C.main} />
      <Ed x1={lx[1]} y1={leafY} x2={36} y2={midY} c={hi ? C.proof : C.main} />
      <Ed x1={lx[2]} y1={leafY} x2={100} y2={midY} c={C.main} />
      <Ed x1={lx[3]} y1={leafY} x2={100} y2={midY} c={C.main} />
      <Ed x1={lx[4]} y1={leafY} x2={176} y2={midY} c={C.main} />
      <Ed x1={lx[5]} y1={leafY} x2={176} y2={midY} c={C.main} />
      {lx.map((x, i) => (
        <g key={i}>
          <Nd x={x} y={leafY} fill={hi && i === 0 ? `${C.proof}22` : `${C.main}11`} stroke={hi && i === 0 ? C.proof : C.main} />
          <text x={x} y={leafY + 15} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">L{i}</text>
        </g>
      ))}
      <Nd x={36} y={midY} fill={hi ? `${C.proof}22` : `${C.main}11`} stroke={hi ? C.proof : C.main} />
      <Nd x={100} y={midY} fill={`${C.main}11`} stroke={C.main} />
      <Nd x={176} y={midY} fill={hi ? `${C.proof}22` : `${C.main}11`} stroke={hi ? C.proof : C.main} />
      <Nd x={68} y={peakY} fill={`${C.main}22`} stroke={hi ? C.proof : C.main} r={9} />
      <text x={68} y={peakY - 12} textAnchor="middle" fontSize={10} fill={C.main} fontWeight={600}>Peak0</text>
      <Nd x={176} y={peakY} fill={`${C.main}22`} stroke={C.main} r={9} />
      <text x={176} y={peakY - 12} textAnchor="middle" fontSize={10} fill={C.main} fontWeight={600}>Peak1</text>
      <Nd x={lx[6]} y={leafY} fill={`${C.main}22`} stroke={C.main} r={9} />
      <text x={lx[6]} y={leafY - 12} textAnchor="middle" fontSize={10} fill={C.main} fontWeight={600}>Peak2</text>
    </g>
  );
}

export function BatchFlow() {
  const items = ['new_batch', 'add()', 'merkleize', 'finalize', 'apply'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {items.map((t, i) => (
        <g key={i}>
          <rect x={270} y={10 + i * 18} width={75} height={15} rx={3} fill={`${C.batch}15`} stroke={C.batch} strokeWidth={0.8} />
          <text x={307} y={20 + i * 18} textAnchor="middle" fontSize={10} fill={C.batch} fontWeight={600}>{t}</text>
          {i < 4 && <text x={350} y={21 + i * 18} fontSize={10} fill="var(--muted-foreground)">↓</text>}
        </g>
      ))}
    </motion.g>
  );
}

export function AppendAnim() {
  return (
    <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
      <rect x={254} y={leafY - 10} width={50} height={20} rx={4} fill={`${C.add}15`} stroke={C.add} strokeWidth={1.2} />
      <text x={279} y={leafY + 3} textAnchor="middle" fontSize={10} fill={C.add} fontWeight={600}>+L7</text>
      <line x1={244} y1={leafY} x2={256} y2={leafY} stroke={C.add} strokeWidth={1.2} markerEnd="url(#mmr-arw)" strokeDasharray="3 2" />
      <text x={310} y={leafY + 3} fontSize={10} fill="var(--muted-foreground)">O(1) 순차 쓰기</text>
      <text x={310} y={leafY + 15} fontSize={10} fill="var(--muted-foreground)">peak 높이 일치 → 병합</text>
    </motion.g>
  );
}

export function ProofPath() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <circle cx={lx[1]} cy={leafY} r={9} fill="none" stroke={C.proof} strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={280} y={20} fontSize={10} fill={C.proof} fontWeight={600}>L0 포함 증명</text>
      <text x={280} y={34} fontSize={10} fill="var(--muted-foreground)">fold_prefix: (없음)</text>
      <text x={280} y={48} fontSize={10} fill="var(--muted-foreground)">path: L1 → H(0,1) → Peak0</text>
      <text x={280} y={62} fontSize={10} fill="var(--muted-foreground)">others: Peak1, Peak2</text>
      <text x={280} y={76} fontSize={10} fill="var(--muted-foreground)">root = Hash(leaves || fold(peaks))</text>
    </motion.g>
  );
}
