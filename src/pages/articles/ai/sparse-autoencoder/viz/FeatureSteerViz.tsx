import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './FeatureSteerVizData';
import { OutputPanel } from './FeatureSteerVizParts';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function FeatureSteerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 135" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Feature list */}
          {['의문', '확신', '유머'].map((f, i) => {
            const active = i === 0 && step >= 1;
            const color = active
              ? (step === 2 ? C.crash : C.mild) : C.feat;
            return (
              <g key={f}>
                <rect x={20} y={20 + i * 30} width={55} height={22} rx={4}
                  fill={`${color}18`}
                  stroke={color} strokeWidth={active ? 2 : 1} />
                <text x={47} y={35 + i * 30} textAnchor="middle"
                  fontSize={9} fontWeight={active ? 700 : 400}
                  fill={color}>{f}</text>
              </g>
            );
          })}

          {/* Slider */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <text x={120} y={18} fontSize={9} fill={C.muted}>강도 조절</text>
              <line x1={100} y1={35} x2={230} y2={35}
                stroke={step === 2 ? C.crash : C.mild}
                strokeWidth={2} strokeLinecap="round" />
              <motion.circle cy={35} r={5}
                fill={step === 2 ? C.crash : C.mild}
                animate={{ cx: step === 2 ? 225 : 170 }}
                initial={{ cx: 100 }} transition={{ duration: 0.6 }} />
              <motion.text y={50} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={step === 2 ? C.crash : C.mild}
                animate={{ x: step === 2 ? 225 : 170 }}
                initial={{ x: 100 }} transition={{ duration: 0.6 }}>
                {step === 2 ? '500' : '100'}
              </motion.text>
            </motion.g>
          )}

          <OutputPanel step={step} C={C} />

          {/* Step 0: feature labels */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={sp}>
              <text x={120} y={40} fontSize={9} fill={C.muted}>
                GemmaScope: 400+ SAE 적용
              </text>
              <text x={120} y={55} fontSize={9} fill={C.muted}>
                해석 가능한 특징 추출 완료
              </text>
              <text x={120} y={70} fontSize={9} fill={C.feat}>
                Anthropic 1300만개 / OpenAI 600만개
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
