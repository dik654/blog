import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: 'Step 1: 원본 데이터 블록 (리프)', body: '트랜잭션 등 원본 데이터가 머클 트리의 리프(leaf)에 위치합니다.' },
  { label: 'Step 2: 리프 해시 계산', body: '각 데이터 블록에 해시 함수(SHA-256 등)를 적용하여 리프 해시를 생성합니다. H(A), H(B), H(C), H(D).' },
  { label: 'Step 3: 내부 노드 계산 (쌍별 해싱)', body: '인접한 두 해시를 연결(concatenate)한 후 다시 해시하여 부모 노드를 생성합니다. H(AB) = H(H(A) || H(B)).' },
  { label: 'Step 4: 머클 루트 완성 + 증명 경로', body: '최상위 노드가 머클 루트(Merkle Root)입니다. 주황색 경로는 데이터 B의 머클 증명(Merkle Proof)을 나타냅니다.' },
];

/* Tree layout positions */
const LEAF_Y = 210;
const HASH_Y = 160;
const MID_Y = 100;
const ROOT_Y = 40;

const leaves = [
  { x: 60,  label: 'Tx A' },
  { x: 150, label: 'Tx B' },
  { x: 240, label: 'Tx C' },
  { x: 330, label: 'Tx D' },
];

const leafHashes = [
  { x: 60,  label: 'H(A)' },
  { x: 150, label: 'H(B)' },
  { x: 240, label: 'H(C)' },
  { x: 330, label: 'H(D)' },
];

const midNodes = [
  { x: 105, label: 'H(AB)' },
  { x: 285, label: 'H(CD)' },
];

const root = { x: 195, label: 'Root' };

/* Proof path for Tx B: need H(A) as sibling, and H(CD) as sibling */
const PROOF_HIGHLIGHT = {
  leafIdx: 1,        // H(B)
  siblingLeaf: 0,    // H(A) — sibling
  midIdx: 0,         // H(AB) — parent
  siblingMid: 1,     // H(CD) — sibling at mid level
};

function Box({ x, y, label, color, show, width = 50 }: {
  x: number; y: number; label: string; color: string; show: boolean; width?: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.35 }}
    >
      <rect x={x - width / 2} y={y - 14} width={width} height={28} rx={6}
        fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight="600" fill={color}>
        {label}
      </text>
    </motion.g>
  );
}

function Edge({ x1, y1, x2, y2, color, show, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5}
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 0.6 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
    />
  );
}

export default function MerkleTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const proofActive = step >= 3;

        return (
          <svg viewBox="0 0 390 250" className="w-full max-w-[440px]" style={{ height: 'auto' }}>
            {/* Step 0+: raw data blocks */}
            {leaves.map((l, i) => (
              <Box key={`leaf-${i}`} x={l.x} y={LEAF_Y} label={l.label}
                color={proofActive && i === PROOF_HIGHLIGHT.leafIdx ? C.orange : C.blue}
                show={step >= 0} width={54} />
            ))}

            {/* Step 1+: leaf hashes */}
            {leafHashes.map((h, i) => (
              <Box key={`hash-${i}`} x={h.x} y={HASH_Y} label={h.label}
                color={
                  proofActive && i === PROOF_HIGHLIGHT.leafIdx ? C.orange
                  : proofActive && i === PROOF_HIGHLIGHT.siblingLeaf ? C.purple
                  : C.green
                }
                show={step >= 1} width={50} />
            ))}

            {/* Edges: leaves → leaf hashes */}
            {leaves.map((l, i) => (
              <Edge key={`e-lh-${i}`} x1={l.x} y1={LEAF_Y - 14} x2={leafHashes[i].x} y2={HASH_Y + 14}
                color={proofActive && i === PROOF_HIGHLIGHT.leafIdx ? C.orange : C.green}
                show={step >= 1} delay={i * 0.05} />
            ))}

            {/* Step 2+: mid-level nodes */}
            {midNodes.map((m, i) => (
              <Box key={`mid-${i}`} x={m.x} y={MID_Y} label={m.label}
                color={
                  proofActive && i === PROOF_HIGHLIGHT.midIdx ? C.orange
                  : proofActive && i === PROOF_HIGHLIGHT.siblingMid ? C.purple
                  : C.green
                }
                show={step >= 2} width={56} />
            ))}

            {/* Edges: leaf hashes → mid nodes */}
            <Edge x1={leafHashes[0].x} y1={HASH_Y - 14} x2={midNodes[0].x} y2={MID_Y + 14}
              color={proofActive ? C.purple : C.green} show={step >= 2} delay={0} />
            <Edge x1={leafHashes[1].x} y1={HASH_Y - 14} x2={midNodes[0].x} y2={MID_Y + 14}
              color={proofActive ? C.orange : C.green} show={step >= 2} delay={0.05} />
            <Edge x1={leafHashes[2].x} y1={HASH_Y - 14} x2={midNodes[1].x} y2={MID_Y + 14}
              color={proofActive ? C.purple : C.green} show={step >= 2} delay={0.1} />
            <Edge x1={leafHashes[3].x} y1={HASH_Y - 14} x2={midNodes[1].x} y2={MID_Y + 14}
              color={C.green} show={step >= 2} delay={0.15} />

            {/* Step 3+: root */}
            <Box x={root.x} y={ROOT_Y} label={root.label}
              color={proofActive ? C.orange : C.green}
              show={step >= 2} width={54} />

            {/* Edges: mid → root */}
            <Edge x1={midNodes[0].x} y1={MID_Y - 14} x2={root.x} y2={ROOT_Y + 14}
              color={proofActive ? C.orange : C.green} show={step >= 2} delay={0.2} />
            <Edge x1={midNodes[1].x} y1={MID_Y - 14} x2={root.x} y2={ROOT_Y + 14}
              color={proofActive ? C.purple : C.green} show={step >= 2} delay={0.25} />

            {/* Proof path legend */}
            {proofActive && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={0} y={0} width={100} height={18} rx={4} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={1} />
                <text x={50} y={13} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.purple}>
                  Proof 시블링
                </text>
                <rect x={290} y={0} width={100} height={18} rx={4} fill={`${C.orange}22`} stroke={C.orange} strokeWidth={1} />
                <text x={340} y={13} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.orange}>
                  검증 경로
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
