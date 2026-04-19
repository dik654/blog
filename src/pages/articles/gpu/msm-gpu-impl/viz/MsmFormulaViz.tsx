import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const COL_NAIVE = '#dc2626';
const COL_PIP = '#10b981';
const COL_BUCKET = '#0ea5e9';
const COL_FINAL = '#8b5cf6';

const STEPS = [
  { label: 'MSM 정의: Q = s₀·P₀ + s₁·P₁ + … + sₙ₋₁·Pₙ₋₁  (스칼라-점 쌍 n개)' },
  { label: '나이브 방법: 점 1개당 254번의 더블링/덧셈 → O(n·254) 너무 느림' },
  { label: 'Pippenger Step 1: 254-bit 스칼라를 c-bit 윈도우로 분할 (예: c=16, 16 윈도우)' },
  { label: 'Pippenger Step 2: 각 윈도우에서 2^c개 버킷에 점 분류·누적 (병렬)' },
  { label: 'Pippenger Step 3·4: 버킷 삼각 합산 → 윈도우별 결과 → 2^(j·c) 가중 조합' },
];

export default function MsmFormulaViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Definition */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">정의</text>
            <DataBox x={20} y={20} w={440} h={32}
              label="Q = s₀·P₀ + s₁·P₁ + … + sₙ₋₁·Pₙ₋₁  (n개 쌍)"
              color="#64748b" />
          </motion.g>

          {/* Naive */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <AlertBox x={20} y={66} w={440} h={36}
              label="나이브: 점당 254 더블링 → O(n × 254) — 4M 점이면 1B 연산 (분단위)"
              color={COL_NAIVE} />
          </motion.g>

          {/* Pippenger Step 1: window split */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 ? 1 : step >= 3 ? 0.5 : 0.18 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={120} fontSize={10} fontWeight={700} fill={COL_PIP}>
              Pippenger Step 1: 윈도우 분할 (c=16 → 16 윈도우)
            </text>
            <DataBox x={20} y={126} w={70} h={26} label="254-bit s" color={COL_PIP} />
            <text x={96} y={143} fontSize={11} fontWeight={700} fill={COL_PIP}>→</text>
            {[0, 1, 2, 3].map((i) => (
              <DataBox key={i} x={108 + i * 80} y={126} w={70} h={26}
                label={`w${i} (${i * 16}~${i * 16 + 15})`} color={COL_PIP} />
            ))}
            <text x={446} y={143} fontSize={9} fill="var(--muted-foreground)">…</text>
          </motion.g>

          {/* Pippenger Step 2: bucket */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : step >= 4 ? 0.5 : 0.18 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={170} fontSize={10} fontWeight={700} fill={COL_BUCKET}>
              Step 2: 버킷 분류 — 같은 윈도우 값을 가진 점들을 한 버킷에
            </text>
            {[1, 2, 3, 4, 5].map((b, i) => (
              <ModuleBox key={i} x={20 + i * 90} y={178} w={80} h={36}
                label={`bucket[${b}]`} sub={`점 ${4 - i + 2}개`} color={COL_BUCKET} />
            ))}
          </motion.g>

          {/* Pippenger Step 3·4: combine */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 4 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}>
            <ActionBox x={20} y={222} w={440} h={14}
              label="삼각 합산 → 윈도우 결과 wⱼ → Σ wⱼ · 2^(j·c) → Q  (총 O(n/log n))"
              color={COL_FINAL} />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
