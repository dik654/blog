import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PARAMS, EFF_LR, COLORS } from './AdamVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const BAR_W = 50, GAP = 70, BASE_Y = 160, MAX_H = 110;
const LEFT = 80;

export default function AdamViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Y-axis */}
          <line x1={LEFT - 15} y1={BASE_Y} x2={LEFT - 15} y2={30}
            stroke={COLORS.axis} strokeWidth={0.6} />
          <text x={LEFT - 25} y={95} fontSize={9} fill="var(--muted-foreground)"
            transform={`rotate(-90 ${LEFT - 25} 95)`}>
            {step <= 1 ? '그래디언트 크기' : '효과적 학습률'}
          </text>

          {PARAMS.map((p, i) => {
            const x = LEFT + i * (BAR_W + GAP);
            const value = step <= 1 ? p.grad / 8.0 : EFF_LR[step][i];
            const h = value * MAX_H;

            return (
              <g key={i}>
                <motion.rect x={x} width={BAR_W} rx={4}
                  animate={{ y: BASE_Y - h, height: h, fill: p.color + '40' }}
                  stroke={p.color} strokeWidth={1.2} transition={sp} />
                <text x={x + BAR_W / 2} y={BASE_Y + 14} textAnchor="middle"
                  fontSize={9} fontWeight={500} fill={p.color}>{p.label}</text>
                <motion.text x={x + BAR_W / 2} y={BASE_Y - h - 6} textAnchor="middle"
                  fontSize={9} fill={p.color} fontWeight={500}
                  animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                  {step <= 1 ? `g=${p.grad}` : `η×${value.toFixed(2)}`}
                </motion.text>
              </g>
            );
          })}

          {/* X-axis */}
          <line x1={LEFT - 15} y1={BASE_Y} x2={LEFT + 3 * (BAR_W + GAP) - GAP + 15} y2={BASE_Y}
            stroke={COLORS.axis} strokeWidth={0.6} />

          {/* 안내 텍스트 */}
          <text x={LEFT} y={22} fontSize={9} fill="var(--muted-foreground)">
            {step <= 1 ? '막대 높이 = 그래디언트 크기 (파라미터별 다름)'
              : '막대 높이 = 유효 학습률 (큰 g → 작은 η로 자동 조절)'}
          </text>
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <text x={330} y={55} fontSize={9} fill={COLORS.bar}>핵심: 큰 g → 작은 η</text>
              <text x={330} y={68} fontSize={9} fill="var(--muted-foreground)">과도한 업데이트 방지</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
