import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, StatusBox } from '@/components/viz/boxes';

const COL_PRE = '#0ea5e9';
const COL_LIN = '#10b981';
const COL_DIV = '#f59e0b';
const COL_MSM = '#8b5cf6';
const COL_CPU = '#94a3b8';

interface Stage {
  label: string;
  sub: string;
  device: 'GPU' | 'CPU';
  color: string;
  cost: string;
  weight: number; // 시간 비중 (0~1)
}

const STAGES: Stage[] = [
  { label: 'Step 1: γ 거듭제곱', sub: '[1, γ, γ², …, γ^(k-1)]', device: 'GPU', color: COL_PRE, cost: 'O(k)', weight: 0.02 },
  { label: 'Step 2: 다항식 선형 결합', sub: 'h_coeffs[i] = Σⱼ γʲ·pⱼ[i]', device: 'GPU', color: COL_LIN, cost: 'O(k·n) — 메모리 바운드', weight: 0.10 },
  { label: 'Step 3: 평가값 결합', sub: 'w = Σ γʲ·vⱼ', device: 'CPU', color: COL_CPU, cost: 'O(k)', weight: 0.01 },
  { label: 'Step 4: 상수항 뺄셈', sub: 'h_coeffs[0] -= w', device: 'GPU', color: COL_LIN, cost: 'O(1)', weight: 0.01 },
  { label: 'Step 5: (x-z)로 나눗셈', sub: 'synthetic_div(h, z)', device: 'GPU', color: COL_DIV, cost: 'O(n)', weight: 0.06 },
  { label: 'Step 6: 증명 MSM', sub: 'π = gpu_msm(q, srs)', device: 'GPU', color: COL_MSM, cost: 'O(n/log n) — 80%+', weight: 0.80 },
];

const STEPS = [
  { label: 'Step 1: γ의 거듭제곱 [1, γ, γ², ...] 사전 계산 (GPU O(k))' },
  { label: 'Step 2: k개 다항식 선형 결합 — GPU 메모리 대역폭에 바운드 (10%)' },
  { label: 'Step 3·4: 평가값 결합 (CPU)과 상수항 뺄셈 (GPU O(1))' },
  { label: 'Step 5: (x - z)로 synthetic division — 순차이지만 n번 Fp 곱셈 (~6%)' },
  { label: 'Step 6: 최종 MSM — 전체 시간의 80% 이상 차지 (GPU 가속의 핵심)' },
];

export default function GpuPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Stage list */}
          {STAGES.map((s, i) => {
            const y = 14 + i * 36;
            const stepActive =
              (i <= 0 && step === 0) ||
              (i === 1 && step === 1) ||
              ((i === 2 || i === 3) && step === 2) ||
              (i === 4 && step === 3) ||
              (i === 5 && step === 4);
            const opacity = stepActive ? 1 : 0.3;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ActionBox x={16} y={y} w={210} h={30}
                  label={s.label} color={s.color} />
                <text x={232} y={y + 14} fontSize={8.5} fontWeight={600} fill={s.color}>
                  {s.sub}
                </text>
                <text x={232} y={y + 25} fontSize={8} fill="var(--muted-foreground)">
                  [{s.device}] {s.cost}
                </text>
              </motion.g>
            );
          })}

          {/* Time breakdown bar */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <text x={20} y={246} fontSize={10} fontWeight={700} fill="var(--foreground)">
              시간 분포 (Step 6 MSM = 80%)
            </text>
            <g transform="translate(20, 252)">
              {(() => {
                let xc = 0;
                const TOT = 440;
                return STAGES.map((s, i) => {
                  const w = TOT * s.weight;
                  const r = (
                    <rect key={i} x={xc} y={0} width={Math.max(w, 1)} height={16} fill={s.color}
                      opacity={step === 4 && i === 5 ? 1 : 0.55} />
                  );
                  xc += w;
                  return r;
                });
              })()}
              <rect x={0} y={0} width={440} height={16} rx={3}
                fill="none" stroke="var(--border)" strokeWidth={0.5} />
            </g>
          </motion.g>

          {/* Hidden helper to keep StatusBox import (not used visually) */}
          {step < 0 && <StatusBox x={0} y={0} label="" sub="" color="#000" progress={0} />}
        </svg>
      )}
    </StepViz>
  );
}
