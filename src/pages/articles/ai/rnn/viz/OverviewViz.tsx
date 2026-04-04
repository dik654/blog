import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FC_C, RNN_C } from './OverviewVizData';
import { Step2, Step3 } from './OverviewVizParts';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              {['입력₁', '입력₂', '입력₃', '???'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', bounce: 0.15, delay: i * 0.1 }}>
                  <rect x={40 + i * 100} y={50} width={80} height={30} rx={6}
                    fill={i === 3 ? FC_C + '20' : '#88888812'}
                    stroke={i === 3 ? FC_C : '#888'} strokeWidth={1} />
                  <text x={80 + i * 100} y={70} textAnchor="middle" fontSize={10}
                    fill={i === 3 ? FC_C : '#888'}>{t}</text>
                </motion.g>
              ))}
              <motion.text x={240} y={110} textAnchor="middle" fontSize={10} fill={FC_C}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                FC: 입력 크기 고정 → 가변 길이 처리 불가
              </motion.text>
            </g>
          )}
          {step === 1 && (
            <g>
              {['개가', '사람을', '물었다'].map((w, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}>
                  <rect x={50 + i * 130} y={40} width={100} height={30} rx={6}
                    fill={RNN_C + '15'} stroke={RNN_C} strokeWidth={1} />
                  <text x={100 + i * 130} y={60} textAnchor="middle" fontSize={11}
                    fill={RNN_C} fontWeight={600}>{w}</text>
                  {i < 2 && (
                    <motion.line x1={150 + i * 130} y1={55}
                      x2={180 + i * 130} y2={55}
                      stroke={RNN_C} strokeWidth={1} markerEnd="url(#rnnA)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: i * 0.15 + 0.2 }} />
                  )}
                </motion.g>
              ))}
              <motion.text x={240} y={100} textAnchor="middle" fontSize={9}
                fill="#999" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                vs "사람이 개를 물었다" — 순서 바뀌면 의미 전혀 다름
              </motion.text>
              <defs>
                <marker id="rnnA" markerWidth={6} markerHeight={4}
                  refX={6} refY={2} orient="auto">
                  <path d="M0,0 L6,2 L0,4" fill={RNN_C} />
                </marker>
              </defs>
            </g>
          )}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </svg>
      )}
    </StepViz>
  );
}
