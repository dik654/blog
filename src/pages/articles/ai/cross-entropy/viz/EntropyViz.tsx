import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '편향 분포 (0.9 / 0.1) → 낮은 엔트로피', body: 'H = -(0.9·log₂0.9 + 0.1·log₂0.1) ≈ 0.47 bit — 결과 예측이 쉬움' },
  { label: '균등 분포 (0.5 / 0.5) → 최대 엔트로피', body: 'H = -(0.5·log₂0.5 + 0.5·log₂0.5) = 1.0 bit — 결과 예측 불가' },
  { label: '극단 분포 (0.99 / 0.01) → 최소 엔트로피', body: 'H ≈ 0.08 bit — 거의 확실한 상태, 불확실성이 거의 없음' },
];

const LO = '#10b981', HI = '#ef4444', MIN = '#6366f1';
const COLORS = [LO, HI, MIN];
const PROBS = [[0.9, 0.1], [0.5, 0.5], [0.99, 0.01]];
const ENTROPIES = [0.47, 1.0, 0.08];

export default function EntropyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const c = COLORS[step];
        const [pA, pB] = PROBS[step];
        const barW = 280;
        const splitX = 80 + pA * barW;

        return (
          <svg viewBox="0 0 500 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* distribution bar */}
            <text x={80} y={25} fontSize={9} fontWeight={600}
              fill="currentColor" fillOpacity={0.5}>확률 분포</text>
            <motion.rect x={80} y={32} rx={5}
              height={28} fill={c} fillOpacity={0.3}
              initial={{ width: 0 }} animate={{ width: pA * barW }}
              transition={{ duration: 0.4 }} key={`a-${step}`} />
            <motion.rect rx={5}
              y={32} height={28} fill={c} fillOpacity={0.12}
              initial={{ x: splitX, width: 0 }}
              animate={{ x: splitX, width: pB * barW }}
              transition={{ duration: 0.4 }} key={`b-${step}`} />
            <rect x={80} y={32} width={barW} height={28} rx={5}
              fill="none" stroke={c} strokeWidth={1.5} />

            {/* prob labels */}
            <motion.text x={80 + (pA * barW) / 2} y={50} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={c}
              key={`la-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              P(A) = {pA}
            </motion.text>
            {pB >= 0.05 && (
              <motion.text x={splitX + (pB * barW) / 2} y={50} textAnchor="middle"
                fontSize={pB < 0.15 ? 7 : 10} fontWeight={700} fill={c} fillOpacity={0.6}
                key={`lb-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                P(B) = {pB}
              </motion.text>
            )}

            {/* entropy gauge */}
            <text x={80} y={95} fontSize={9} fontWeight={600}
              fill="currentColor" fillOpacity={0.5}>엔트로피</text>
            <rect x={80} y={102} width={barW} height={14} rx={4}
              fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.1} />
            <motion.rect x={80} y={102} rx={4} height={14}
              fill={c} fillOpacity={0.4}
              initial={{ width: 0 }}
              animate={{ width: ENTROPIES[step] * barW }}
              transition={{ duration: 0.5 }}
              key={`ent-${step}`} />
            <motion.text x={85 + ENTROPIES[step] * barW} y={113}
              fontSize={9} fontWeight={700} fill={c}
              key={`ev-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}>
              {ENTROPIES[step].toFixed(2)} bit
            </motion.text>

            {/* labels */}
            <text x={80} y={148} fontSize={9} fill="currentColor" fillOpacity={0.3}>
              0 (확실)
            </text>
            <text x={80 + barW - 30} y={148} fontSize={9} fill="currentColor" fillOpacity={0.3}>
              1 (최대 불확실)
            </text>

            {/* formula */}
            <text x={250} y={172} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={c}>
              H(P) = -Σ P(x) · log₂ P(x)
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
