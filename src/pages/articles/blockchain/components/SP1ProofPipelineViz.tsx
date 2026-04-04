import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Core Proof', sub: 'RISC-V → STARK', color: '#10b981', out: 'CoreProof' },
  { label: 'Compress', sub: '샤드 재귀 압축', color: '#6366f1', out: 'ReduceProof' },
  { label: 'Shrink', sub: 'BabyBear→BN254', color: '#f59e0b', out: 'BN254 STARK' },
  { label: 'Groth16', sub: '온체인 SNARK', color: '#8b5cf6', out: '256 bytes' },
];

const BW = 96, BH = 48, GAP = 16, Y = 30;
const bx = (i: number) => 12 + i * (BW + GAP);

const STEPS = [
  { label: 'Core: RISC-V 실행 → BabyBear STARK', body: 'ExecutorMode::Trace로 샤드별 병렬 증명. AIR 칩별 FRI 증명 생성.' },
  { label: 'Compress: 샤드 이진 트리 재귀 압축', body: 'First Layer → batch_size=1, Intermediate → REDUCE_BATCH_SIZE=2로 이진 트리 압축.' },
  { label: 'Shrink: BabyBear → BN254 체 변환', body: 'BabyBear STARK를 BN254 STARK로 재증명. Groth16 검증 준비 단계.' },
  { label: 'Groth16/PLONK: 이더리움 온체인 검증', body: 'BN254 커브, ~256 bytes. 이더리움 ~250k gas로 검증 가능.' },
];

export default function SP1ProofPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sp-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {NODES.map((n, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: i <= step ? 1 : 0.2, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}>
              <rect x={bx(i)} y={Y} width={BW} height={BH} rx={8}
                fill={n.color + '18'} stroke={n.color}
                strokeWidth={i === step ? 2.5 : 1} />
              <text x={bx(i) + BW / 2} y={Y + 18} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={bx(i) + BW / 2} y={Y + 32} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
              {/* output label */}
              <text x={bx(i) + BW / 2} y={Y + BH + 16} textAnchor="middle"
                fontSize={6.5} fill={n.color} opacity={i <= step ? 0.8 : 0.3}>{n.out}</text>
            </motion.g>
          ))}
          {/* Arrows between stages */}
          {[0, 1, 2].map(i => step > i && (
            <motion.line key={`e${i}`}
              x1={bx(i) + BW} y1={Y + BH / 2} x2={bx(i + 1)} y2={Y + BH / 2}
              stroke="var(--muted-foreground)" strokeWidth={1.2}
              markerEnd="url(#sp-a)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
          ))}
          {/* Size shrink indicator */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={bx(3) + 10} y={Y + BH + 24} width={BW - 20} height={16} rx={8}
                fill={NODES[3].color + '25'} stroke={NODES[3].color} strokeWidth={1} />
              <text x={bx(3) + BW / 2} y={Y + BH + 35} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={NODES[3].color}>~250k gas</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
