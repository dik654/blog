import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const C = { any: '#6366f1', bm: '#10b981', graft: '#f59e0b', root: '#8b5cf6' };

export function StructureStep() {
  const boxes = [
    { label: 'Any DB', desc: '이력 증명', x: 20, w: 120, c: C.any },
    { label: 'Bitmap', desc: '활성/비활성', x: 160, w: 120, c: C.bm },
    { label: 'Grafted MMR', desc: '결합 인증', x: 300, w: 130, c: C.graft },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={30} width={b.w} height={50} rx={6} fill={`${b.c}15`} stroke={b.c} strokeWidth={1.2} />
          <text x={b.x + b.w / 2} y={50} textAnchor="middle" fontSize={10} fill={b.c} fontWeight={600}>{b.label}</text>
          <text x={b.x + b.w / 2} y={67} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{b.desc}</text>
          {i < 2 && <text x={b.x + b.w + 10} y={55} fontSize={10} fill="var(--muted-foreground)">+</text>}
        </g>
      ))}
      <text x={230} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Current DB = Any + Bitmap + Grafted MMR</text>
    </motion.g>
  );
}

export function GraftingStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={20} y={15} width={130} height={70} rx={6} fill={`${C.any}08`} stroke={C.any} strokeWidth={0.8} />
      <text x={85} y={30} textAnchor="middle" fontSize={10} fill={C.any} fontWeight={600}>ops subtree root</text>
      <circle cx={55} cy={55} r={5} fill={`${C.any}22`} stroke={C.any} strokeWidth={1} />
      <circle cx={85} cy={70} r={5} fill={`${C.any}22`} stroke={C.any} strokeWidth={1} />
      <circle cx={115} cy={55} r={5} fill={`${C.any}22`} stroke={C.any} strokeWidth={1} />
      <line x1={85} y1={42} x2={55} y2={50} stroke={C.any} strokeWidth={0.7} opacity={0.5} />
      <line x1={85} y1={42} x2={115} y2={50} stroke={C.any} strokeWidth={0.7} opacity={0.5} />
      <rect x={170} y={25} width={90} height={50} rx={6} fill={`${C.bm}15`} stroke={C.bm} strokeWidth={1} />
      <text x={215} y={42} textAnchor="middle" fontSize={10} fill={C.bm} fontWeight={600}>bitmap chunk</text>
      <text x={215} y={57} textAnchor="middle" fontSize={10} fill={C.bm}>1 1 0 1</text>
      <line x1={152} y1={50} x2={280} y2={50} stroke={C.graft} strokeWidth={1} markerEnd="url(#graft-arw)" />
      <rect x={290} y={25} width={150} height={50} rx={6} fill={`${C.graft}15`} stroke={C.graft} strokeWidth={1.2} />
      <text x={365} y={42} textAnchor="middle" fontSize={10} fill={C.graft} fontWeight={600}>grafted leaf</text>
      <text x={365} y={57} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">hash(chunk || subtree_root)</text>
      <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">grafting height = log2(chunk_size_bits)</text>
      <text x={230} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">증명 크기 ~50% 절감</text>
      <defs><marker id="graft-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill={C.graft} /></marker></defs>
    </motion.g>
  );
}

export function ProofStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={20} y={20} width={200} height={55} rx={6} fill={`${C.bm}10`} stroke={C.bm} strokeWidth={1} />
      <text x={120} y={38} textAnchor="middle" fontSize={10} fill={C.bm} fontWeight={600}>1. get_bit_from_chunk(loc)</text>
      <text x={120} y={54} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">비트 = 1이면 활성, 0이면 실패</text>
      <line x1={222} y1={47} x2={250} y2={47} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#prf-arw)" />
      <rect x={252} y={20} width={190} height={55} rx={6} fill={`${C.graft}10`} stroke={C.graft} strokeWidth={1} />
      <text x={347} y={38} textAnchor="middle" fontSize={10} fill={C.graft} fontWeight={600}>2. range_proof.verify()</text>
      <text x={347} y={54} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">grafted MMR 루트 재구성 → 정규 루트 비교</text>
      <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">OperationProof = loc + chunk + RangeProof</text>
      <defs><marker id="prf-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" /></marker></defs>
    </motion.g>
  );
}

export function RootStep() {
  const parts = [
    { label: 'ops_root', c: C.any, x: 30 },
    { label: 'grafted_root', c: C.graft, x: 170 },
    { label: 'partial?', c: C.bm, x: 310 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {parts.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={25} width={120} height={35} rx={5} fill={`${p.c}15`} stroke={p.c} strokeWidth={1} />
          <text x={p.x + 60} y={47} textAnchor="middle" fontSize={10} fill={p.c} fontWeight={600}>{p.label}</text>
          {i < 2 && <text x={p.x + 130} y={47} fontSize={10} fill="var(--muted-foreground)">||</text>}
        </g>
      ))}
      <line x1={230} y1={62} x2={230} y2={82} stroke={C.root} strokeWidth={1} markerEnd="url(#root-arw)" />
      <rect x={150} y={84} width={160} height={30} rx={6} fill={`${C.root}15`} stroke={C.root} strokeWidth={1.2} />
      <text x={230} y={103} textAnchor="middle" fontSize={10} fill={C.root} fontWeight={600}>canonical root</text>
      <defs><marker id="root-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill={C.root} /></marker></defs>
    </motion.g>
  );
}
