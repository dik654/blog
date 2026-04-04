import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const TS = ['t=1', 't=2', 't=3', 't=4', 't=5', 't=6', 't=7', 't=8'];
const STEPS = [
  { label: 'RNN: 기울기 소실 문제' },
  { label: 'LSTM: 셀 상태로 기울기 안정화' },
];
const BODY = [
  '기울기 기하급수 감소 → 장기 의존성 학습 불가',
  '셀 상태 덧셈 연결로 기울기 안정 유지',
];
const RNN_C = '#ef4444', LSTM_C = '#10b981';
const BASE_Y = 140, BAR_W = 36;

export default function GradientProblemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const isLstm = step === 1;
        const c = isLstm ? LSTM_C : RNN_C;
        return (
          <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* axis */}
            <line x1={20} y1={BASE_Y} x2={380} y2={BASE_Y} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
            <text x={200} y={162} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.3}>
              역전파 시간 단계
            </text>
            {/* bars */}
            {TS.map((label, i) => {
              const rnnH = Math.max(4, 110 * Math.pow(0.55, i));
              const lstmH = 85 + (i % 3 === 0 ? 6 : i % 3 === 1 ? -4 : 2);
              const h = isLstm ? lstmH : rnnH;
              const x = 30 + i * 44;
              return (
                <g key={label}>
                  <motion.rect
                    x={x} y={BASE_Y - h} width={BAR_W} height={h} rx={4}
                    fill={c} fillOpacity={0.6}
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    style={{ transformOrigin: `${x + BAR_W / 2}px ${BASE_Y}px` }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  />
                  <text x={x + BAR_W / 2} y={BASE_Y + 12} textAnchor="middle"
                    fontSize={9} fill="currentColor" fillOpacity={0.35}>{label}</text>
                  {/* gradient magnitude label */}
                  <motion.text x={x + BAR_W / 2} y={BASE_Y - h - 4} textAnchor="middle"
                    fontSize={9} fill={c} fillOpacity={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                    {(h / 110).toFixed(2)}
                  </motion.text>
                </g>
              );
            })}
            {/* indicator line for LSTM */}
            {isLstm && (
              <motion.line x1={30} y1={BASE_Y - 85} x2={378} y2={BASE_Y - 85}
                stroke={LSTM_C} strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}
            {/* label */}
            <motion.text key={step} x={200} y={18} textAnchor="middle" fontSize={11}
              fontWeight={600} fill={c}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {isLstm ? 'LSTM' : 'Vanilla RNN'}
            </motion.text>
            <motion.text x={410} y={85} fontSize={9}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
