import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LSTM_C, GRU_C, PEEK_C } from './VariantsVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function GateBox({ x, y, w, label, sub, color, delay }: {
  x: number; y: number; w: number; label: string; sub: string; color: string; delay: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={34} rx={6}
        fill={color + '15'} stroke={color} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize={10} fill={color} fontWeight={600}>
        {label}
      </text>
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fontSize={10} fill={color} opacity={0.7}>
        {sub}
      </text>
    </motion.g>
  );
}

export default function VariantsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fill={PEEK_C} fontWeight={600}>
                Peephole Connection
              </text>
              <GateBox x={30} y={40} w={140} label="Forget" sub="f = σ(W·[C,h,x]+b)" color={PEEK_C} delay={0} />
              <GateBox x={185} y={40} w={140} label="Input" sub="i = σ(W·[C,h,x]+b)" color={PEEK_C} delay={0.15} />
              <GateBox x={340} y={40} w={140} label="Output" sub="o = σ(W·[C,h,x]+b)" color={PEEK_C} delay={0.3} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={40} y1={95} x2={460} y2={95} stroke={PEEK_C} strokeWidth={2} strokeOpacity={0.3} />
                <text x={250} y={90} textAnchor="middle" fontSize={11} fill={PEEK_C}>
                  ↑ Cₜ₋₁ 참조 (엿보기)
                </text>
                {[100, 250, 400].map((x, i) => (
                  <line key={i} x1={x} y1={95} x2={x} y2={74} stroke={PEEK_C} strokeWidth={1}
                    strokeDasharray="3 2" />
                ))}
              </motion.g>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fill={GRU_C} fontWeight={600}>
                GRU: 단순화된 구조
              </text>
              <GateBox x={60} y={40} w={160} label="Update Gate (z)" sub="z = σ(W_z·[h,x])" color={GRU_C} delay={0} />
              <GateBox x={280} y={40} w={160} label="Reset Gate (r)" sub="r = σ(W_r·[h,x])" color={GRU_C} delay={0.15} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={120} y={100} width={260} height={30} rx={6}
                  fill={GRU_C + '10'} stroke={GRU_C} strokeWidth={1} />
                <text x={250} y={120} textAnchor="middle" fontSize={11} fill={GRU_C}>
                  hₜ = (1-z)·hₜ₋₁ + z·h̃ₜ — 단일 상태로 통합
                </text>
              </motion.g>
              <motion.text x={250} y={155} textAnchor="middle" fontSize={11} fill="#999"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                셀 상태 별도 없음 → 파라미터 25% 감소
              </motion.text>
            </g>
          )}
          {step === 2 && (
            <g>
              {/* LSTM column */}
              <rect x={30} y={15} width={200} height={150} rx={8}
                fill={LSTM_C + '08'} stroke={LSTM_C} strokeWidth={1} />
              <text x={130} y={35} textAnchor="middle" fontSize={11} fill={LSTM_C} fontWeight={600}>LSTM</text>
              {['게이트: 3개', '상태: C + h (2개)', '파라미터: 4(n²+nm+n)', '장점: 긴 시퀀스'].map((t, i) => (
                <text key={i} x={130} y={58 + i * 22} textAnchor="middle" fontSize={11} fill={LSTM_C}>{t}</text>
              ))}
              {/* GRU column */}
              <rect x={270} y={15} width={200} height={150} rx={8}
                fill={GRU_C + '08'} stroke={GRU_C} strokeWidth={1} />
              <text x={370} y={35} textAnchor="middle" fontSize={11} fill={GRU_C} fontWeight={600}>GRU</text>
              {['게이트: 2개', '상태: h만 (1개)', '파라미터: 3(n²+nm+n)', '장점: 학습 20% 빠름'].map((t, i) => (
                <text key={i} x={370} y={58 + i * 22} textAnchor="middle" fontSize={11} fill={GRU_C}>{t}</text>
              ))}
              <text x={250} y={145} textAnchor="middle" fontSize={10} fill="#999">
                vs
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
