import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STAGES = [
  { label: 'Add Piece', sub: '32GB 섹터', color: '#6366f1', x: 20, y: 40 },
  { label: 'PC1', sub: 'SHA-256 DRG', color: '#8b5cf6', x: 85, y: 40 },
  { label: 'PC2', sub: 'Poseidon GPU', color: '#10b981', x: 150, y: 40 },
  { label: 'Wait', sub: '150 에포크', color: '#94a3b8', x: 215, y: 40 },
  { label: 'C1', sub: '포함 증명', color: '#f59e0b', x: 280, y: 40 },
  { label: 'C2', sub: 'Groth16', color: '#ec4899', x: 345, y: 40 },
];

const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]];

const STEP_ACTIVE = [
  [0, 1, 2, 3, 4, 5],
  [0, 1],
  [1, 2],
  [4, 5],
];

const STEPS = [
  { label: 'Sealing 파이프라인', body: 'Filecoin 봉인 6단계: Add Piece -> PC1 -> PC2 -> Wait -> C1 -> C2.' },
  { label: 'PC1 병목', body: 'SHA-256 기반 DRG 그래프 생성이 전체 병목입니다. SupraSeal이 여기를 집중 최적화합니다.' },
  { label: 'PC2 GPU 가속', body: 'Poseidon 해시를 GPU로 가속하여 머클 트리를 병렬 생성합니다.' },
  { label: 'C1/C2 증명', body: 'C1 포함 증명과 C2 Groth16 zkSNARK 생성을 GPU로 가속합니다.' },
];

export default function SealingPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const activeSet = new Set(STEP_ACTIVE[step]);
        return (
          <svg viewBox="0 0 520 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([a, b], ei) => {
              const sa = STAGES[a], sb = STAGES[b];
              const vis = activeSet.has(a) && activeSet.has(b);
              return (
                <motion.line key={ei}
                  x1={sa.x + 22} y1={sa.y} x2={sb.x - 22} y2={sb.y}
                  stroke="var(--border)" strokeWidth={0.7}
                  animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp} />
              );
            })}
            {STAGES.map((s, i) => {
              const active = activeSet.has(i);
              return (
                <g key={s.label}>
                  <motion.rect x={s.x - 22} y={s.y - 14} width={44} height={28} rx={4}
                    animate={{
                      fill: active ? `${s.color}18` : `${s.color}04`,
                      stroke: s.color, strokeWidth: active ? 1.4 : 0.5,
                      opacity: active ? 1 : 0.2,
                    }} transition={sp} />
                  <motion.text x={s.x} y={s.y - 2} textAnchor="middle" fontSize={10} fontWeight={600}
                    animate={{ fill: s.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                    {s.label}
                  </motion.text>
                  <motion.text x={s.x} y={s.y + 8} textAnchor="middle" fontSize={9}
                    animate={{ fill: s.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                    {s.sub}
                  </motion.text>
                </g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
