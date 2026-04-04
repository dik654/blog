import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, BELT_Y, BELT_H, SEGMENTS } from './CellStateVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const CELL_C = '#f59e0b';
const FORGET_C = '#ef4444';
const INPUT_C = '#10b981';
const OUTPUT_C = '#6366f1';

const initVals = [0.8, 0.3, 0.9, 0.1, 0.7, 0.5, 0.6, 0.4];
const forgetG = [0.2, 0.9, 0.1, 0.8, 0.3, 0.95, 0.7, 0.6];
const inputG = [0.0, 0.1, 0.0, 0.6, 0.0, 0.0, 0.2, 0.3];

export default function CellStateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const vals = initVals.map((v, i) => {
          if (step <= 0) return v;
          let r = v * forgetG[i];
          if (step >= 2) r += inputG[i];
          return Math.min(r, 1);
        });
        return (
          <svg viewBox="0 0 480 165" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Conveyor belt */}
            <text x={10} y={BELT_Y - 8} fontSize={11} fill={CELL_C} fontWeight={600}>Cell State</text>
            <line x1={20} y1={BELT_Y + BELT_H + 4} x2={440} y2={BELT_Y + BELT_H + 4}
              stroke={CELL_C} strokeWidth={2} strokeOpacity={0.3} />
            <text x={8} y={BELT_Y + 16} fontSize={11} fill="#999">C_{'{t-1}'}</text>
            <text x={444} y={BELT_Y + 16} fontSize={11} fill="#999">C_t</text>
            {/* Segments */}
            {vals.map((v, i) => {
              const x = 30 + i * 50;
              const h = v * BELT_H;
              const dimmed = step === 1 && forgetG[i] < 0.5;
              const added = step >= 2 && inputG[i] > 0;
              return (
                <motion.g key={i}>
                  <rect x={x} y={BELT_Y} width={40} height={BELT_H} rx={3}
                    fill="#80808008" stroke="#55555540" strokeWidth={0.5} />
                  <motion.rect x={x} y={BELT_Y + BELT_H - h} width={40} height={h} rx={3}
                    animate={{
                      fill: dimmed ? FORGET_C + '40' : added ? INPUT_C + '40' : CELL_C + '35',
                      height: h,
                      y: BELT_Y + BELT_H - h,
                    }}
                    transition={sp} />
                  <motion.text x={x + 20} y={BELT_Y + 16} textAnchor="middle" fontSize={10}
                    fill={dimmed ? FORGET_C : added ? INPUT_C : '#666'}
                    animate={{ opacity: 1 }}>{v.toFixed(2)}</motion.text>
                  {/* Forget gate value below each bar */}
                  {step === 1 && (
                    <motion.text x={x + 20} y={BELT_Y + BELT_H + 18}
                      textAnchor="middle" fontSize={8}
                      fill={forgetG[i] < 0.5 ? FORGET_C : '#999'}
                      fontWeight={forgetG[i] < 0.5 ? 600 : 400}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}>
                      f={forgetG[i].toFixed(1)}
                    </motion.text>
                  )}
                  {/* Input gate value below each bar */}
                  {step === 2 && inputG[i] > 0 && (
                    <motion.text x={x + 20} y={BELT_Y + BELT_H + 18}
                      textAnchor="middle" fontSize={8} fill={INPUT_C} fontWeight={600}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}>
                      +{inputG[i].toFixed(1)}
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
            {/* Gate labels */}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={90} y={100} width={280} height={36} rx={5}
                  fill={FORGET_C + '08'} stroke={FORGET_C} strokeWidth={1} />
                <text x={230} y={114} textAnchor="middle" fontSize={10} fill={FORGET_C} fontWeight={600}>
                  f_t * C_{'{t-1}'} — 빨간색 = 삭제 대상
                </text>
                <text x={230} y={130} textAnchor="middle" fontSize={9} fill={FORGET_C}>
                  f=0.2 → 80% 삭제 | f=0.95 → 거의 보존
                </text>
              </motion.g>
            )}
            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={90} y={100} width={280} height={36} rx={5}
                  fill={INPUT_C + '08'} stroke={INPUT_C} strokeWidth={1} />
                <text x={230} y={114} textAnchor="middle" fontSize={10} fill={INPUT_C} fontWeight={600}>
                  + i_t * C̃_t — 초록색 = 새 정보 추가
                </text>
                <text x={230} y={130} textAnchor="middle" fontSize={9} fill={INPUT_C}>
                  0.6 추가된 슬롯: 새 주어 "나는" 저장
                </text>
              </motion.g>
            )}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <line x1={240} y1={BELT_Y + BELT_H + 8} x2={240} y2={120}
                  stroke={OUTPUT_C} strokeWidth={1.5} />
                <rect x={120} y={122} width={240} height={36} rx={5}
                  fill={OUTPUT_C + '08'} stroke={OUTPUT_C} strokeWidth={1} />
                <text x={240} y={136} textAnchor="middle" fontSize={10} fill={OUTPUT_C} fontWeight={600}>
                  h_t = o_t * tanh(C_t)
                </text>
                <text x={240} y={152} textAnchor="middle" fontSize={9} fill={OUTPUT_C}>
                  C_t = 장기 기억(보존) | h_t = 단기 출력(선별)
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
