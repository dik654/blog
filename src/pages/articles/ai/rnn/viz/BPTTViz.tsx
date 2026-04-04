import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FWD_C, BWD_C } from './BPTTVizData';
import { Step2 } from './BPTTVizParts';
import { Step3 } from './BPTTVizStep3';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function TimeStep({ x, y, t, color, delay }: {
  x: number; y: number; t: number; color: string; delay: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={54} height={30} rx={6}
        fill={color + '15'} stroke={color} strokeWidth={1.2} />
      <text x={x + 27} y={y + 19} textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>
        h_{t}
      </text>
    </motion.g>
  );
}

export default function BPTTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={250} y={18} textAnchor="middle" fontSize={10} fill="#999">
                순환 구조 → 시간축으로 펼침 (Unroll)
              </text>
              {[0, 1, 2, 3, 4].map(t => (
                <g key={t}>
                  <TimeStep x={30 + t * 95} y={40} t={t} color={FWD_C} delay={t * 0.1} />
                  <text x={57 + t * 95} y={84} textAnchor="middle" fontSize={8} fill="#999">
                    x_{t}↑
                  </text>
                  {t < 4 && (
                    <motion.line x1={84 + t * 95} y1={55} x2={125 + t * 95} y2={55}
                      stroke={FWD_C} strokeWidth={1.2} markerEnd="url(#bpttArw)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: t * 0.1 + 0.2 }} />
                  )}
                </g>
              ))}
              <motion.text x={250} y={120} textAnchor="middle" fontSize={10} fill={FWD_C}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                모든 시간 단계에서 동일한 W, U, V 공유
              </motion.text>
              <defs>
                <marker id="bpttArw" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
                  <path d="M0,0 L6,2 L0,4" fill={FWD_C} />
                </marker>
              </defs>
            </g>
          )}
          {step === 1 && (
            <g>
              {[0, 1, 2, 3, 4].map(t => (
                <g key={t}>
                  <TimeStep x={30 + t * 95} y={40} t={t}
                    color={t < 4 ? '#88888880' : BWD_C} delay={0} />
                  {t < 4 && (
                    <motion.line x1={125 + (3 - t) * 95} y1={55}
                      x2={84 + (3 - t) * 95} y2={55}
                      stroke={BWD_C} strokeWidth={1.2} markerEnd="url(#bpttBwd)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: t * 0.15 + 0.2 }} />
                  )}
                </g>
              ))}
              <motion.text x={250} y={100} textAnchor="middle" fontSize={9} fill={BWD_C}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                ∂L/∂W — 시간 역방향으로 의존성 추적
              </motion.text>
              <defs>
                <marker id="bpttBwd" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
                  <path d="M0,0 L6,2 L0,4" fill={BWD_C} />
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
