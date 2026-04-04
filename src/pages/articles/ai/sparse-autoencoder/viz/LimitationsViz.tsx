import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './LimitationsVizData';
import { LayerRow, LayerLinks } from './LimitationsVizParts';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function LimitationsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 120" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Step 0: dark matter */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <circle cx={130} cy={60} r={40} fill={`${C.dark}10`}
                stroke={C.dark} strokeWidth={1.5} />
              <motion.path d="M130,60 L130,20 A40,40 0 0,1 143,22 Z"
                fill={`${C.dark}40`} stroke={C.dark} strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }} />
              <text x={155} y={22} fontSize={10} fontWeight={600}
                fill={C.dark}>~1%</text>
              <text x={130} y={64} textAnchor="middle" fontSize={10}
                fill={C.muted}>암흑 물질</text>
              <text x={260} y={40} fontSize={10} fill={C.muted}>
                모델 내부 표현 중
              </text>
              <text x={260} y={55} fontSize={10} fill={C.muted}>
                추출된 특징은 극히 일부
              </text>
              <text x={260} y={72} fontSize={10} fontWeight={600} fill={C.dark}>
                — Chris Olah
              </text>
            </motion.g>
          )}

          {/* Step 1: single layer */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <rect x={40 + i * 60} y={35} width={50} height={30}
                    rx={5} fill={i === 2 ? `${C.limit}18` : `${C.dark}08`}
                    stroke={i === 2 ? C.limit : `${C.dark}30`}
                    strokeWidth={i === 2 ? 2 : 1} />
                  <text x={65 + i * 60} y={54} textAnchor="middle"
                    fontSize={9} fill={i === 2 ? C.limit : C.muted}>
                    L{i + 1}
                  </text>
                </g>
              ))}
              <text x={185} y={82} textAnchor="middle" fontSize={9}
                fill={C.limit}>SAE: 이 레이어만 분석</text>
              <text x={185} y={95} textAnchor="middle" fontSize={9}
                fill={C.muted}>레이어 간 회로(circuit) 파악 불가</text>
            </motion.g>
          )}

          {/* Step 2: crosscoder */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <LayerRow ids={[0, 1, 2, 3, 4]}
                color={`${C.future}15`} border={C.future} C={C} />
              <LayerLinks count={4} color={C.future} />
              <text x={185} y={82} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.future}>Sparse Crosscoder</text>
              <text x={185} y={95} textAnchor="middle" fontSize={9}
                fill={C.muted}>레이어 간 관계 파악 → 회로 분석 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
