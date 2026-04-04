import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FULL_COST, SPARSE_COST, TOTAL_PAIRING, SAVING }
  from './InMillerVizData';
import { PRIMARY, ACCENT, WARN, MUTED, sp } from './constants';

const BX = 30;
const BW = 340;
const BH = 28;

function CostBar({ y, value, max, color, label, show }: {
  y: number; value: number; max: number;
  color: string; label: string; show: boolean;
}) {
  const w = (value / max) * BW;
  return (
    <motion.g animate={{ opacity: show ? 1 : 0.12 }} transition={sp}>
      <text x={BX} y={y - 6} fontSize={11} fontWeight={600}
        fill={color}>{label}</text>
      <motion.rect x={BX} y={y} rx={4}
        animate={{ width: show ? w : 0, height: BH,
          fill: `${color}18`, stroke: color }}
        strokeWidth={0.8} transition={sp} />
      {show && (
        <motion.text x={BX + w + 8} y={y + BH / 2 + 4}
          fontSize={11} fontWeight={600} fill={color}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.15 }}>
          {value.toLocaleString()} Fp곱
        </motion.text>
      )}
    </motion.g>
  );
}

export default function InMillerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Step 0: Loop count */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.1 }}
            transition={sp}>
            <text x={BX} y={28} fontSize={14} fontWeight={700}
              fill="hsl(var(--foreground))">254 iterations</text>
            <text x={BX} y={46} fontSize={11}
              fill="hsl(var(--muted-foreground))">
              f = f² * l(P) 를 매번 반복
            </text>
          </motion.g>
          {/* Step 1+: Bars */}
          <CostBar y={68} value={FULL_COST} max={TOTAL_PAIRING}
            color={MUTED} label="Full (254 x 54)"
            show={step >= 1} />
          <CostBar y={116} value={SPARSE_COST} max={TOTAL_PAIRING}
            color={ACCENT} label="Sparse (254 x 18)"
            show={step >= 1} />

          {/* Step 2: Total pairing context */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }} transition={sp}>
              <CostBar y={170} value={TOTAL_PAIRING}
                max={TOTAL_PAIRING} color={PRIMARY}
                label="전체 페어링" show />
              {/* Saving callout */}
              <rect x={BX + 20} y={222} width={280} height={40} rx={6}
                fill={`${WARN}12`} stroke={WARN} strokeWidth={0.8} />
              <text x={BX + 160} y={240} textAnchor="middle"
                fontSize={11} fill={WARN}>
                절감: {SAVING.toLocaleString()} Fp곱
              </text>
              <text x={BX + 160} y={256} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={WARN}>
                전체 페어링의 ~45% 절약
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
