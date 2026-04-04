import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { INPUT, MEAN, VARIANCE, NORMED, OUTPUT, COLORS, STEPS } from './LayerNormVizData';

const CW = 46, CH = 16, X0 = 10;

function VecRow({ data, x, y, color, label, show }: {
  data: number[]; x: number; y: number; color: string; label: string; show: boolean;
}) {
  return (
    <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
      <text x={x} y={y - 3} fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {data.map((v, i) => (
        <g key={i}>
          <motion.rect x={x + i * CW} y={y} width={CW - 2} height={CH} rx={2}
            animate={{ fill: `${color}12`, stroke: color, strokeWidth: show ? 1 : 0.4 }} />
          <text x={x + i * CW + CW / 2 - 1} y={y + CH / 2 + 2} textAnchor="middle"
            fontSize={7.5} fill={show ? color : 'var(--muted-foreground)'}>{v.toFixed(2)}</text>
        </g>
      ))}
    </motion.g>
  );
}

export default function LayerNormViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <VecRow data={INPUT} x={X0} y={16} color={COLORS.input}
            label="입력 x (4차원)" show={step === 0} />

          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={X0} y={44} width={226} height={36} rx={4}
                fill={`${COLORS.stat}08`} stroke={COLORS.stat} strokeWidth={0.8} />
              <text x={X0 + 6} y={58} fontSize={9} fontWeight={600} fill={COLORS.stat}>
                평균 = (2.0 + (-1.0) + 0.5 + 1.5) / 4 = {MEAN.toFixed(2)}
              </text>
              <text x={X0 + 6} y={72} fontSize={9} fill={COLORS.stat}>
                분산 = ((2.0-0.75)^2 + ... ) / 4 = {VARIANCE.toFixed(4)}
              </text>
            </motion.g>
          )}

          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VecRow data={NORMED} x={X0} y={96} color={COLORS.norm}
                label="정규화 (x - mean) / sqrt(var + eps)" show={step === 2} />
              <text x={X0 + 4 * CW + 8} y={106} fontSize={9} fill="var(--muted-foreground)">
                평균 = 0, 분산 = 1
              </text>
              <text x={X0} y={126} fontSize={9} fill="var(--muted-foreground)">
                x[0]: (2.00 - 0.75) / sqrt(1.19) = {NORMED[0].toFixed(2)}
              </text>
              <text x={X0} y={138} fontSize={9} fill="var(--muted-foreground)">
                x[1]: (-1.00 - 0.75) / sqrt(1.19) = {NORMED[1].toFixed(2)}
              </text>
            </motion.g>
          )}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VecRow data={OUTPUT} x={X0} y={148} color={COLORS.out}
                label="출력 = gamma * norm + beta" show />
              <rect x={X0 + 4 * CW + 8} y={144} width={168} height={24} rx={3}
                fill={`${COLORS.out}08`} stroke={COLORS.out} strokeWidth={0.6} />
              <text x={X0 + 4 * CW + 14} y={158} fontSize={9} fill={COLORS.out}>
                gamma=1, beta=0 (초기값)
              </text>
              <text x={X0 + 4 * CW + 14} y={168} fontSize={9} fill="var(--muted-foreground)">
                학습으로 표현력 복원
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
