import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const COL_POLY = '#0ea5e9';
const COL_SRS = '#10b981';
const COL_MSM = '#f59e0b';
const COL_OUT = '#8b5cf6';

const STEPS = [
  { label: '입력 1: 다항식 계수 [a_0, a_1, ..., a_d] — d+1개의 Fr 스칼라' },
  { label: '입력 2: SRS 점 [G, sG, s²G, ..., s^d G] — d+1개의 G1 점' },
  { label: 'MSM 매핑: scalars × points → C = Σ a_i · [s^i]G' },
  { label: 'GPU 호출: gpu_msm(coefficients, srs.g1_points, {window_bits: 16})' },
  { label: '출력: C — G1 점 1개 (KZG 커밋먼트)' },
];

export default function CommitMsmViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Polynomial coefficients (top row) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 0 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}
          >
            <text x={20} y={14} fontSize={9} fontWeight={700} fill={COL_POLY}>
              스칼라: 다항식 계수
            </text>
            {['a₀', 'a₁', 'a₂', '…', 'aₐ'].map((s, i) => (
              <motion.g key={s}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: step >= 0 ? 1 : 0.2, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <DataBox x={20 + i * 60} y={20} w={50} h={28} label={s} color={COL_POLY} />
              </motion.g>
            ))}
          </motion.g>

          {/* SRS (middle row) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}
          >
            <text x={20} y={66} fontSize={9} fontWeight={700} fill={COL_SRS}>
              점: SRS (Trusted Setup 산출)
            </text>
            {['G', 'sG', 's²G', '…', 'sᵈG'].map((s, i) => (
              <motion.g key={s}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: step >= 1 ? 1 : 0.2, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <DataBox x={20 + i * 60} y={72} w={50} h={28} label={s} color={COL_SRS} />
              </motion.g>
            ))}
          </motion.g>

          {/* Pairwise multiplication arrows */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <text key={i} x={45 + i * 60} y={117} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill={COL_MSM}>·</text>
              ))}
              <text x={20} y={133} fontSize={9} fontWeight={600} fill={COL_MSM}>곱한 뒤 모두 더함 (MSM)</text>
            </motion.g>
          )}

          {/* MSM kernel */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 3 ? 1 : step >= 2 ? 0.5 : 0.2 }}
            transition={{ duration: 0.3 }}
          >
            <ActionBox x={120} y={138} w={240} h={42}
              label="GPU MSM 커널" sub="window_bits=16, Pippenger" color={COL_MSM} />
          </motion.g>

          {/* Arrow & Output */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}>
              <line x1={240} y1={184} x2={240} y2={196}
                stroke={COL_OUT} strokeWidth={1.5} markerEnd="url(#commit-arr)" />
              <DataBox x={170} y={194} w={140} h={22} label="C  (G1 점 1개)" color={COL_OUT} outlined />
            </motion.g>
          )}

          <defs>
            <marker id="commit-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={COL_OUT} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
