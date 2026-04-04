import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CostVizData';
import { PRIMARY, ACCENT, WARN, MUTED, sp } from './constants';

const BAR_X = 140;
const BAR_H = 32;
const MAX_W = 280;

function Bar({ y, value, max, color, label, show }: {
  y: number; value: number; max: number;
  color: string; label: string; show: boolean;
}) {
  const w = (value / max) * MAX_W;
  return (
    <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={sp}>
      <text x={BAR_X - 8} y={y + BAR_H / 2 + 4} textAnchor="end"
        fontSize={11} fill="hsl(var(--foreground))">{label}</text>
      <motion.rect x={BAR_X} y={y} rx={4}
        animate={{ width: show ? w : 0, height: BAR_H,
          fill: `${color}20`, stroke: color }}
        strokeWidth={0.8} transition={sp} />
      {show && (
        <motion.text x={BAR_X + w + 8} y={y + BAR_H / 2 + 4}
          fontSize={12} fontWeight={600} fill={color}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.2 }}>
          {value} Fp곱
        </motion.text>
      )}
    </motion.g>
  );
}

export default function CostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Header */}
          <text x={24} y={28} fontSize={14} fontWeight={700}
            fill="hsl(var(--foreground))">
            1회 Fp12 곱셈 비용
          </text>
          {/* Bars */}
          <Bar y={50} value={144} max={144} color={MUTED}
            label="Naive" show={step >= 0} />
          <Bar y={95} value={54} max={144} color={PRIMARY}
            label="Full+Karatsuba" show={step >= 0} />
          <Bar y={140} value={18} max={144} color={ACCENT}
            label="Sparse" show={step >= 1} />

          {/* Savings highlight */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* Savings bracket */}
              <line x1={BAR_X + (54 / 144) * MAX_W + 10} y1={108}
                x2={BAR_X + (54 / 144) * MAX_W + 10} y2={155}
                stroke={WARN} strokeWidth={1.2} />
              <line x1={BAR_X + (18 / 144) * MAX_W + 10} y1={155}
                x2={BAR_X + (54 / 144) * MAX_W + 10} y2={155}
                stroke={WARN} strokeWidth={1.2} />
              <rect x={140} y={196} width={200} height={36} rx={6}
                fill={`${WARN}12`} stroke={WARN} strokeWidth={0.8} />
              <text x={240} y={212} textAnchor="middle"
                fontSize={11} fill={WARN}>
                절감: 54 - 18 = 36 Fp곱
              </text>
              <text x={240} y={226} textAnchor="middle"
                fontSize={12} fontWeight={700} fill={WARN}>
                67% 절감
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
