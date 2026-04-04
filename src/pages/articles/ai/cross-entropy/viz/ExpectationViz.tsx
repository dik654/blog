import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '선수별 기량(객관적 수치)', body: '선수 A: 90점 / 선수 B: 85점 — 단순 수치로는 A가 우세' },
  { label: '컨디션 확률 적용', body: 'A: 좋음 0.8·나쁨 0.2 / B: 좋음 0.95·나쁨 0.05' },
  { label: '기대값 계산 결과', body: 'A: 90×0.8+45×0.2=81 / B: 85×0.95+42.5×0.05=82.9 → B 승' },
];

const A_C = '#6366f1', B_C = '#f59e0b';

export default function ExpectationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Player A */}
          <rect x={30} y={15} width={90} height={32} rx={6}
            fill={A_C + '15'} stroke={A_C} strokeWidth={1.5} />
          <text x={75} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={A_C}>선수 A</text>
          <text x={75} y={42} textAnchor="middle" fontSize={9} fill={A_C}>기량 90</text>

          {/* Player B */}
          <rect x={30} y={65} width={90} height={32} rx={6}
            fill={B_C + '15'} stroke={B_C} strokeWidth={1.5} />
          <text x={75} y={80} textAnchor="middle" fontSize={9} fontWeight={700} fill={B_C}>선수 B</text>
          <text x={75} y={92} textAnchor="middle" fontSize={9} fill={B_C}>기량 85</text>

          {/* Step 2: probabilities */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <text x={165} y={22} fontSize={9} fill="currentColor" fillOpacity={0.5}>좋음</text>
              <text x={205} y={22} fontSize={9} fill="currentColor" fillOpacity={0.5}>나쁨</text>
              {/* A probs */}
              <rect x={150} y={26} width={40} height={18} rx={4}
                fill={A_C + '12'} stroke={A_C} strokeWidth={1} />
              <text x={170} y={38} textAnchor="middle" fontSize={9} fill={A_C}>0.80</text>
              <rect x={195} y={26} width={40} height={18} rx={4}
                fill={A_C + '08'} stroke={A_C} strokeWidth={1} strokeOpacity={0.4} />
              <text x={215} y={38} textAnchor="middle" fontSize={9} fill={A_C} fillOpacity={0.5}>0.20</text>
              {/* B probs */}
              <rect x={150} y={68} width={40} height={18} rx={4}
                fill={B_C + '12'} stroke={B_C} strokeWidth={1} />
              <text x={170} y={80} textAnchor="middle" fontSize={9} fill={B_C}>0.95</text>
              <rect x={195} y={68} width={40} height={18} rx={4}
                fill={B_C + '08'} stroke={B_C} strokeWidth={1} strokeOpacity={0.4} />
              <text x={215} y={80} textAnchor="middle" fontSize={9} fill={B_C} fillOpacity={0.5}>0.05</text>

              <line x1={240} y1={35} x2={270} y2={35}
                stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
              <line x1={240} y1={77} x2={270} y2={77}
                stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
            </motion.g>
          )}

          {/* Step 3: expectation results */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              {/* A calculation */}
              <text x={280} y={32} fontSize={9} fill={A_C} fillOpacity={0.7}>
                90×0.8 + 45×0.2
              </text>
              <rect x={380} y={22} width={70} height={22} rx={5}
                fill={A_C + '15'} stroke={A_C} strokeWidth={1.5} />
              <text x={415} y={37} textAnchor="middle" fontSize={10} fontWeight={700} fill={A_C}>
                E = 81.0
              </text>

              {/* B calculation */}
              <text x={280} y={74} fontSize={9} fill={B_C} fillOpacity={0.7}>
                85×0.95 + 42.5×0.05
              </text>
              <rect x={380} y={64} width={70} height={22} rx={5}
                fill={B_C + '15'} stroke={B_C} strokeWidth={1.5} />
              <text x={415} y={79} textAnchor="middle" fontSize={10} fontWeight={700} fill={B_C}>
                E = 82.9
              </text>

              {/* winner indicator */}
              <text x={460} y={79} fontSize={9} fill={B_C}>←</text>
            </motion.g>
          )}

          {/* formula */}
          <motion.text x={250} y={140} textAnchor="middle" fontSize={10} fontWeight={700}
            fill="#10b981" initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0.3 }}>
            E[X] = Σ x · P(x)
          </motion.text>
          <text x={250} y={160} textAnchor="middle" fontSize={9}
            fill="currentColor" fillOpacity={0.4}>
            기량이 높아도 확률 분포에 따라 기대값 역전 가능
          </text>
        </svg>
      )}
    </StepViz>
  );
}
