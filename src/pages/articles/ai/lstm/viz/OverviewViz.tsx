import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, RNN_C, GRAD_C } from './OverviewVizData';
import { GradBar, Step2 } from './OverviewVizParts';
import { Step3 } from './GradCompareViz';

const VH = 200;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 520 ${VH}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fill={RNN_C} fontWeight={600}>
                기울기 크기 (시간 역방향)
              </text>
              {[1, 0.6, 0.3, 0.12, 0.04, 0.01].map((v, i) => (
                <g key={i}>
                  <GradBar x={60 + i * 70} h={v * 100} color={GRAD_C} delay={i * 0.1} />
                  <motion.text x={69 + i * 70} y={128 - v * 100} textAnchor="middle"
                    fontSize={9} fill={GRAD_C} fontWeight={600}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.15 }}>
                    {v.toFixed(2)}
                  </motion.text>
                  <text x={69 + i * 70} y={145} textAnchor="middle" fontSize={10} fill="#999">
                    t-{i}
                  </text>
                </g>
              ))}
              <motion.text x={260} y={170} textAnchor="middle" fontSize={10} fill={RNN_C}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                → 20~30단계 이전 기울기 ≈ 0
              </motion.text>
            </g>
          )}
          {step === 1 && (
            <g>
              {['나는', '프랑스에서', '태어나서', '...', '...', '프랑스어를'].map((w, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={30 + i * 80} y={50} width={70} height={30} rx={6}
                    fill={i === 1 || i === 5 ? RNN_C + '20' : '#88888810'}
                    stroke={i === 1 || i === 5 ? RNN_C : '#888'} strokeWidth={1} />
                  <text x={65 + i * 80} y={70} textAnchor="middle" fontSize={10}
                    fill={i === 1 || i === 5 ? RNN_C : '#888'}
                    fontWeight={i === 1 || i === 5 ? 600 : 400}>
                    {w}
                  </text>
                </motion.g>
              ))}
              <motion.path d="M 145,82 C 145,120 385,120 385,82"
                stroke={RNN_C} strokeWidth={1.5} fill="none" strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }} />
              <motion.text x={260} y={140} textAnchor="middle" fontSize={10} fill={RNN_C}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                50단어 떨어진 의존성 — RNN 학습 불가
              </motion.text>
            </g>
          )}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </svg>
      )}
    </StepViz>
  );
}
