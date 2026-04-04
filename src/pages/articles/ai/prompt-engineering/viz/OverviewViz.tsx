import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, TECHNIQUES } from './OverviewData';

const W = 460, H = 220;
const CX = W / 2, LLM_Y = 105;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* LLM box */}
          <motion.rect x={CX - 45} y={LLM_Y - 18} width={90} height={36} rx={6}
            fill={step >= 1 ? '#6366f120' : '#6366f10a'} stroke="#6366f1"
            animate={{ strokeWidth: step >= 1 ? 2 : 1 }}
            transition={{ duration: 0.3 }} />
          <text x={CX} y={LLM_Y + 5} textAnchor="middle" fontSize={11}
            fontWeight={700} fill="#6366f1">LLM</text>

          {/* step 0: two prompts → two results */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={40} y={18} width={140} height={26} rx={5}
                fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={110} y={35} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#f59e0b">"수도 알려줘"</text>
              <rect x={280} y={18} width={140} height={26} rx={5}
                fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={350} y={35} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#10b981">"JSON으로 수도 출력"</text>
              <line x1={110} y1={44} x2={CX} y2={LLM_Y - 18}
                stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3 3" />
              <line x1={350} y1={44} x2={CX} y2={LLM_Y - 18}
                stroke="#10b981" strokeWidth={0.8} strokeDasharray="3 3" />
              <text x={110} y={H - 30} textAnchor="middle" fontSize={9}
                fill="#f59e0b">→ "서울입니다"</text>
              <text x={350} y={H - 30} textAnchor="middle" fontSize={9}
                fill="#10b981">→ {`{"capital":"Seoul"}`}</text>
            </motion.g>
          )}

          {/* step 2: 4 techniques */}
          {step >= 2 && TECHNIQUES.map((t, i) => {
            const tx = 40 + i * 105;
            return (
              <motion.g key={t.label}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}>
                <rect x={tx} y={20} width={80} height={30} rx={5}
                  fill={`${t.color}18`} stroke={t.color} strokeWidth={1} />
                <text x={tx + 40} y={40} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={t.color}>{t.label}</text>
                <line x1={tx + 40} y1={50} x2={CX} y2={LLM_Y - 18}
                  stroke={t.color} strokeWidth={0.8} opacity={0.4} />
              </motion.g>
            );
          })}

          {/* step 3: output arrow */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 70} y={LLM_Y + 30} width={140} height={24} rx={5}
                fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
              <text x={CX} y={LLM_Y + 46} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#10b981">정밀 제어된 출력</text>
            </motion.g>
          )}

          {/* output quality hint */}
          <motion.g animate={{ opacity: step >= 1 ? 0.6 : 0.2 }}>
            <text x={CX} y={H - 10} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">→ 응답 품질</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
