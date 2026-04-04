import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'ShardProofs', sub: 'N개 Core 증명', color: '#6366f1' },
  { label: 'First Layer', sub: '개별 재귀 검증', color: '#10b981' },
  { label: '이진 트리', sub: 'REDUCE_BATCH=2', color: '#f59e0b' },
  { label: 'Compressed', sub: '1개 BabyBear STARK', color: '#8b5cf6' },
  { label: 'Shrink', sub: 'BN254 STARK', color: '#ec4899' },
  { label: 'Wrap', sub: 'Groth16 입력', color: '#ef4444' },
];

const NW = 78, GAP = 82, SY = 40;
const nx = (i: number) => 4 + i * GAP;
const EDGES = ['verify', 'reduce(pair)', '1개 수렴', '필드 전환', '래핑'];

const STEPS = [
  { label: 'Core 증명들', body: 'N개 ShardProof가 Core Proving에서 생성됩니다.' },
  { label: 'First Layer', body: '각 ShardProof를 Plonky3 재귀 프로그램으로 검증합니다.' },
  { label: '이진 트리 축소', body: '2개씩 묶어 reduce()로 합치며, log(N) 라운드에 1개로 수렴.' },
  { label: 'Compressed', body: '하나의 BabyBear STARK 증명으로 압축 완료.' },
  { label: 'Shrink', body: 'BabyBear(2^31-2^27+1) → BN254 스칼라체로 재증명.' },
  { label: 'Wrap', body: 'BN254 STARK를 Groth16/PLONK 회로 입력으로 래핑.' },
];

export default function RecursionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rc-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 19} x2={nx(i + 1)} y2={SY + 19}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#rc-ah)" />
              <rect x={(nx(i) + NW + nx(i + 1)) / 2 - 20} y={SY + 6} width={40} height={11} rx={2} fill="var(--card)" />
              <text x={(nx(i) + NW + nx(i + 1)) / 2} y={SY + 13}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
            </motion.g>
          ))}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}>
              <rect x={nx(i)} y={SY} width={NW} height={38} rx={7}
                fill={n.color + '18'} stroke={n.color} strokeWidth={step === i ? 2 : 1} />
              <text x={nx(i) + NW / 2} y={SY + 15} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={nx(i) + NW / 2} y={SY + 28} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Tree reduction hint at step 2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <text x={nx(2) + NW / 2} y={SY + 52} textAnchor="middle"
                fontSize={9} fill="#f59e0b">log(N) 라운드</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
