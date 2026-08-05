import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const COL_GPU = '#0ea5e9';
const COL_MSM = '#10b981';
const COL_CPU = '#f59e0b';

const STEPS = [
  { label: '입력: 다항식 p(x), 평가점 z, 평가값 v = p(z)' },
  { label: '몫 다항식 q(x) = (p(x) - v) / (x - z) — synthetic division O(n)' },
  { label: 'p(z)=v이면 (x-z)가 (p(x)-v)를 정확히 나눈다 (잉여 0)' },
  { label: '증명 π = Commit(q) = MSM(q.coeffs, srs[0..d-1]) — GPU MSM 1회' },
  { label: '검증: e(C - v·G, H) == e(π, [s]H - z·H) — pairing 2회 (CPU)' },
];

export default function SingleOpenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Inputs row */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">Prover 입력</text>
            <DataBox x={20} y={20} w={130} h={28} label="p(x): 다항식" color={COL_GPU} />
            <DataBox x={160} y={20} w={70} h={28} label="z: 점" color={COL_GPU} />
            <DataBox x={240} y={20} w={120} h={28} label="v = p(z): 평가값" color={COL_GPU} />
          </motion.g>

          {/* Step 2: q(x) division */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <DataBox x={20} y={68} w={150} h={30} label="(p(x) - v)" color={COL_GPU} />
            <ActionBox x={180} y={66} w={120} h={34}
              label="÷ (x - z)" sub="synthetic division" color={COL_GPU} />
            <DataBox x={310} y={68} w={150} h={30} label="q(x): 몫 다항식" color={COL_GPU} outlined />
            {step >= 2 && (
              <motion.text
                x={240} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill={COL_GPU}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                p(z)=v 이므로 잉여 0 — (x-z)가 정확히 나눔
              </motion.text>
            )}
          </motion.g>

          {/* Step 3: MSM commit q */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <DataBox x={20} y={130} w={120} h={32} label="q.coeffs" color={COL_MSM} />
            <DataBox x={150} y={130} w={130} h={32} label="srs[0..d-1]" color={COL_MSM} />
            <ActionBox x={290} y={128} w={80} h={36} label="GPU MSM" color={COL_MSM} />
            <DataBox x={380} y={130} w={90} h={32} label="π (G1 점)" color={COL_MSM} outlined />
          </motion.g>

          {/* Step 4: Verify */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 4 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <ModuleBox x={20} y={186} w={120} h={42} label="Verifier (CPU)" sub="pairing 2회" color={COL_CPU} />
            <ActionBox x={150} y={188} w={310} h={38}
              label="e(C - v·G, H) == e(π, [s]H - z·H)" sub="GPU 미사용 — 매우 빠름" color={COL_CPU} />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
