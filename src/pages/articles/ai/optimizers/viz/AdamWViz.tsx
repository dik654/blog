import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, WEIGHTS, L2_DECAY, ADAMW_DECAY, COLORS } from './AdamWVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const LEFT = 60, BASE_Y = 165, MAX_H = 120, BAR_W = 18, GROUP_GAP = 80;

export default function AdamWViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showL2 = step === 0 || step === 2;
        const showAW = step >= 1;
        const t = step === 2 ? 3 : step === 0 ? 1 : 2; // decay 시점

        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Y axis */}
            <line x1={LEFT - 10} y1={BASE_Y} x2={LEFT - 10} y2={25}
              stroke={COLORS.axis} strokeWidth={0.6} />
            <text x={LEFT - 22} y={95} fontSize={9} fill="var(--muted-foreground)"
              transform={`rotate(-90 ${LEFT - 22} 95)`}>weight 크기</text>

            {WEIGHTS.map((w, i) => {
              const gx = LEFT + i * GROUP_GAP;

              return (
                <g key={i}>
                  {/* L2+Adam bar */}
                  {showL2 && (
                    <motion.rect x={gx} width={BAR_W} rx={3}
                      animate={{ y: BASE_Y - (L2_DECAY[t][i] / 5.5) * MAX_H,
                        height: (L2_DECAY[t][i] / 5.5) * MAX_H }}
                      fill={COLORS.l2 + '30'} stroke={COLORS.l2} strokeWidth={1}
                      transition={sp} />
                  )}
                  {/* AdamW bar */}
                  {showAW && (
                    <motion.rect x={gx + BAR_W + 4} width={BAR_W} rx={3}
                      animate={{ y: BASE_Y - (ADAMW_DECAY[t][i] / 5.5) * MAX_H,
                        height: (ADAMW_DECAY[t][i] / 5.5) * MAX_H }}
                      fill={COLORS.adamw + '30'} stroke={COLORS.adamw} strokeWidth={1}
                      transition={sp} />
                  )}
                  {/* label */}
                  <text x={gx + (showAW ? BAR_W + 2 : BAR_W / 2)} y={BASE_Y + 14}
                    textAnchor="middle" fontSize={9} fontWeight={500}
                    fill="var(--muted-foreground)">{w.label}</text>
                </g>
              );
            })}

            {/* X axis */}
            <line x1={LEFT - 10} y1={BASE_Y} x2={LEFT + 4 * GROUP_GAP} y2={BASE_Y}
              stroke={COLORS.axis} strokeWidth={0.6} />

            {/* 안내 + 범례 */}
            <text x={LEFT} y={22} fontSize={9} fill="var(--muted-foreground)">
              막대 높이 = weight 크기 (학습 진행에 따른 감소 비교)
            </text>
            <g transform="translate(330, 38)">
              {showL2 && (
                <g>
                  <rect x={0} y={0} width={10} height={10} rx={2}
                    fill={COLORS.l2 + '30'} stroke={COLORS.l2} strokeWidth={0.8} />
                  <text x={14} y={9} fontSize={9} fill={COLORS.l2}>L2+Adam (불균등 감소)</text>
                </g>
              )}
              {showAW && (
                <g transform="translate(0, 18)">
                  <rect x={0} y={0} width={10} height={10} rx={2}
                    fill={COLORS.adamw + '30'} stroke={COLORS.adamw} strokeWidth={0.8} />
                  <text x={14} y={9} fontSize={9} fill={COLORS.adamw}>AdamW (균등 비율 감소)</text>
                </g>
              )}
            </g>
          </svg>
        );
      }}
    </StepViz>
  );
}
