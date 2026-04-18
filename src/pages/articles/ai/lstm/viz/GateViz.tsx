import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FORGET_C, INPUT_C, OUTPUT_C, CELL_C } from './GateVizData';
import { GateNumericStep } from './GateVizParts';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function GateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 3 ? '0 0 480 195' : '0 0 480 190'}
          className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 2 && (
            <g>
              {/* Cell state highway */}
              <line x1={30} y1={40} x2={450} y2={40} stroke={CELL_C} strokeWidth={2.5} strokeOpacity={0.4} />
              <text x={240} y={30} textAnchor="middle" fontSize={11} fill={CELL_C} fontWeight={600}>
                Cell State (Cₜ)
              </text>
              {/* Forget gate */}
              <motion.g animate={{ opacity: step >= 0 ? 1 : 0.15 }} transition={sp}>
                <rect x={60} y={60} width={80} height={40} rx={8}
                  fill={step === 0 ? FORGET_C + '20' : FORGET_C + '08'}
                  stroke={FORGET_C} strokeWidth={step === 0 ? 2 : 1} />
                <text x={100} y={78} textAnchor="middle" fontSize={11} fill={FORGET_C} fontWeight={600}>Forget</text>
                <text x={100} y={92} textAnchor="middle" fontSize={11} fill={FORGET_C}>fₜ = σ(...)</text>
                <line x1={100} y1={60} x2={100} y2={44} stroke={FORGET_C} strokeWidth={1.5} />
                <circle cx={100} cy={40} r={5} fill={FORGET_C + '30'} stroke={FORGET_C} strokeWidth={1} />
                <text x={100} y={43} textAnchor="middle" fontSize={11} fill={FORGET_C}>x</text>
                {step === 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={100} y={115} textAnchor="middle" fontSize={11} fill={FORGET_C}>
                      Cₜ₋₁ 중 불필요한 정보 삭제
                    </text>
                    <text x={100} y={132} textAnchor="middle" fontSize={9} fill={FORGET_C} opacity={0.7}>
                      f=0.8 → 80% 유지 | f=0.1 → 90% 삭제
                    </text>
                  </motion.g>
                )}
              </motion.g>
              {/* Input gate */}
              <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
                <rect x={190} y={60} width={80} height={40} rx={8}
                  fill={step === 1 ? INPUT_C + '20' : INPUT_C + '08'}
                  stroke={INPUT_C} strokeWidth={step === 1 ? 2 : 1} />
                <text x={230} y={78} textAnchor="middle" fontSize={11} fill={INPUT_C} fontWeight={600}>Input</text>
                <text x={230} y={92} textAnchor="middle" fontSize={11} fill={INPUT_C}>iₜ · C̃ₜ</text>
                <line x1={230} y1={60} x2={230} y2={44} stroke={INPUT_C} strokeWidth={1.5} />
                <circle cx={230} cy={40} r={5} fill={INPUT_C + '30'} stroke={INPUT_C} strokeWidth={1} />
                <text x={230} y={43} textAnchor="middle" fontSize={11} fill={INPUT_C}>+</text>
                {step === 1 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={230} y={115} textAnchor="middle" fontSize={11} fill={INPUT_C}>
                      새 정보를 셀 상태에 추가
                    </text>
                    <text x={230} y={132} textAnchor="middle" fontSize={9} fill={INPUT_C} opacity={0.7}>
                      i=0.9 → 새 정보 90% 반영
                    </text>
                  </motion.g>
                )}
              </motion.g>
              {/* Output gate */}
              <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
                <rect x={340} y={60} width={80} height={40} rx={8}
                  fill={step === 2 ? OUTPUT_C + '20' : OUTPUT_C + '08'}
                  stroke={OUTPUT_C} strokeWidth={step === 2 ? 2 : 1} />
                <text x={380} y={78} textAnchor="middle" fontSize={11} fill={OUTPUT_C} fontWeight={600}>Output</text>
                <text x={380} y={92} textAnchor="middle" fontSize={11} fill={OUTPUT_C}>oₜ · tanh(Cₜ)</text>
                <line x1={380} y1={60} x2={380} y2={44} stroke={OUTPUT_C} strokeWidth={1.5} />
                <circle cx={380} cy={40} r={5} fill={OUTPUT_C + '30'} stroke={OUTPUT_C} strokeWidth={1} />
                <text x={380} y={43} textAnchor="middle" fontSize={11} fill={OUTPUT_C}>x</text>
                <line x1={380} y1={100} x2={380} y2={120} stroke={OUTPUT_C} strokeWidth={1.5} />
                <text x={380} y={132} textAnchor="middle" fontSize={11} fill={OUTPUT_C} fontWeight={600}>hₜ</text>
                {step === 2 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={380} y={148} textAnchor="middle" fontSize={11} fill={OUTPUT_C}>
                      셀 상태 → 은닉 상태로 출력
                    </text>
                    <text x={380} y={164} textAnchor="middle" fontSize={9} fill={OUTPUT_C} opacity={0.7}>
                      o=0.7 → tanh(Cₜ)의 70% 출력
                    </text>
                  </motion.g>
                )}
              </motion.g>
              {/* Input arrows from bottom */}
              <text x={30} y={170} fontSize={11} fill="#999">hₜ₋₁, xₜ 입력 →</text>
              {[100, 230, 380].map((x, i) => (
                <motion.line key={i} x1={x} y1={155} x2={x} y2={100}
                  stroke="#999" strokeWidth={0.8} strokeDasharray="3 2"
                  animate={{ opacity: step >= i ? 0.5 : 0.15 }} transition={sp} />
              ))}
            </g>
          )}
          {step === 3 && <GateNumericStep />}
        </svg>
      )}
    </StepViz>
  );
}
