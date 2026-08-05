import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const COL_SETUP = '#0ea5e9';   // sky
const COL_COMMIT = '#10b981';  // emerald
const COL_OPEN = '#f59e0b';    // amber
const COL_VERIFY = '#8b5cf6';  // violet

const STEPS = [
  { label: 'Setup: SRS = [G, sG, s^2 G, ..., s^(n-1) G]를 Trusted Setup에서 산출' },
  { label: 'Commit: C = sum(a_i * [s^i]G) — 정의가 곧 MSM' },
  { label: 'Open: 몫 다항식 q(x) = (p(x)-p(z))/(x-z)에 다시 Commit' },
  { label: 'Verify: e(C - v*G, H) == e(pi, [s]H - z*H) — pairing 한 번' },
  { label: 'GPU 활용: Commit/Open이 모두 MSM이므로 GPU MSM 커널이 그대로 쓰인다' },
];

export default function KzgSchemeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Stage 1: Setup */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 0 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}
          >
            <ModuleBox x={16} y={20} w={120} h={40} label="Trusted Setup" sub="SRS 생성" color={COL_SETUP} />
            <DataBox x={150} y={24} w={50} h={28} label="G" color={COL_SETUP} />
            <DataBox x={205} y={24} w={50} h={28} label="sG" color={COL_SETUP} />
            <DataBox x={260} y={24} w={60} h={28} label="s²G" color={COL_SETUP} />
            <text x={328} y={43} fontSize={11} fill="var(--muted-foreground)">…</text>
            <DataBox x={345} y={24} w={70} h={28} label="s^(n-1)G" color={COL_SETUP} />
          </motion.g>

          {/* Stage 2: Commit */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0.18 }}
            transition={{ duration: 0.3, delay: step >= 1 ? 0.1 : 0 }}
          >
            <DataBox x={16} y={78} w={130} h={28} label="p(x) = Σ a_i x^i" color={COL_COMMIT} />
            <ActionBox x={170} y={74} w={120} h={36} label="MSM" sub="scalars × points" color={COL_COMMIT} />
            <DataBox x={310} y={78} w={120} h={28} label="C  (G1 점 1개)" color={COL_COMMIT} outlined />
            {step >= 1 && (
              <motion.line
                x1={146} y1={92} x2={170} y2={92}
                stroke={COL_COMMIT} strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
              />
            )}
            {step >= 1 && (
              <motion.line
                x1={290} y1={92} x2={310} y2={92}
                stroke={COL_COMMIT} strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.15 }}
              />
            )}
          </motion.g>

          {/* Stage 3: Open */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}
          >
            <DataBox x={16} y={130} w={170} h={30} label="q(x) = (p(x)-p(z))/(x-z)" color={COL_OPEN} />
            <ActionBox x={205} y={126} w={90} h={38} label="Commit(q)" sub="MSM 재호출" color={COL_OPEN} />
            <DataBox x={310} y={131} w={120} h={30} label="π  (증명 G1)" color={COL_OPEN} outlined />
          </motion.g>

          {/* Stage 4: Verify */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 3 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}
          >
            <ActionBox x={16} y={180} w={200} h={32} label="e(C - v·G, H) == e(π, [s]H - z·H)" color={COL_VERIFY} />
            <DataBox x={235} y={183} w={195} h={28} label="pairing 2회 — 매우 짧다" color={COL_VERIFY} />
          </motion.g>

          {/* Stage 5: highlight GPU MSM reuse */}
          {step >= 4 && (
            <motion.g
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            >
              <rect x={170} y={70} width={120} height={102} rx={8}
                fill="none" stroke={COL_COMMIT} strokeWidth={1.2} strokeDasharray="4 3" />
              <text x={230} y={196} textAnchor="middle"
                fontSize={9} fontWeight={700} fill={COL_COMMIT}>
                GPU MSM 커널 = KZG 커밋 = KZG 오프닝
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
