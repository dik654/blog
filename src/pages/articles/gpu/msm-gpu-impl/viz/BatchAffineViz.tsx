import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const COL_FWD = '#0ea5e9';
const COL_INV = '#dc2626';
const COL_BWD = '#10b981';
const COL_OUT = '#8b5cf6';

const STEPS = [
  { label: '입력: a₀, a₁, …, aₙ₋₁ — n개의 Fp 원소' },
  { label: '전진 패스: prefix[i] = a₀·a₁·…·aᵢ (n-1번 곱셈)' },
  { label: '단 1회의 역원 계산: inv = 1 / prefix[n-1] — 비싼 inversion 1번만!' },
  { label: '후진 패스: 1/aᵢ = inv · prefix[i-1], 이어서 inv = inv · aᵢ (2(n-1)번 곱셈)' },
  { label: '결과: n inversions → 1 inversion + 3(n-1) multiplications (수십~수백배 빠름)' },
];

const N = 5;

export default function BatchAffineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Inputs */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">입력 a_i (n=5 예시)</text>
            {Array.from({ length: N }).map((_, i) => (
              <DataBox key={i} x={20 + i * 90} y={20} w={80} h={28} label={`a_${i}`} color="#64748b" />
            ))}
          </motion.g>

          {/* Forward pass */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={66} fontSize={10} fontWeight={700} fill={COL_FWD}>전진: prefix[i] = a₀·a₁·…·aᵢ</text>
            {Array.from({ length: N }).map((_, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: step >= 1 ? 1 : 0.22, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <DataBox x={20 + i * 90} y={72} w={80} h={26}
                  label={`p${i}`} color={COL_FWD} />
                {i > 0 && step >= 1 && (
                  <line x1={20 + i * 90 - 6} y1={85} x2={20 + i * 90} y2={85}
                    stroke={COL_FWD} strokeWidth={1.2} markerEnd="url(#bai-arr)" />
                )}
              </motion.g>
            ))}
            <text x={20} y={108} fontSize={9} fill="var(--muted-foreground)">→ {N - 1} multiplications</text>
          </motion.g>

          {/* 1 inversion */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <ActionBox x={20} y={120} w={200} h={36}
              label="inv = 1 / prefix[4]" sub="유일한 inversion (비싼 연산)" color={COL_INV} />
            <text x={232} y={142} fontSize={9} fontWeight={600} fill={COL_INV}>
              ⚠ inversion은 multiplication 대비 100배+ 비용
            </text>
          </motion.g>

          {/* Backward pass */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={172} fontSize={10} fontWeight={700} fill={COL_BWD}>
              후진: 1/aᵢ = inv · prefix[i-1], inv ← inv · aᵢ
            </text>
            {Array.from({ length: N }).map((_, i) => {
              const idx = N - 1 - i;
              return (
                <motion.g key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: step >= 3 ? 1 : 0.22 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <DataBox x={20 + idx * 90} y={178} w={80} h={28}
                    label={`1/a_${idx}`} color={COL_BWD} outlined />
                </motion.g>
              );
            })}
          </motion.g>

          {/* Bottom comparison */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <ModuleBox x={20} y={216} w={210} h={20}
                label="나이브: n inversions" color="#dc2626" />
              <ModuleBox x={250} y={216} w={210} h={20}
                label="배치: 1 inv + 3(n-1) mul" color={COL_OUT} />
            </motion.g>
          )}

          <defs>
            <marker id="bai-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={COL_FWD} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
