import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PHASES, EXAMPLES } from './ReActData';

const W = 460, H = 260;
const CX = W / 2;

export default function ReActViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Title */}
          <text x={CX} y={18} textAnchor="middle" fontSize={10}
            fontWeight={600} fill="var(--foreground)">ReAct Loop</text>

          {/* Three phase boxes */}
          {PHASES.map((p, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            const op = active ? 1 : done ? 0.7 : step === 0 ? 0.8 : 0.3;
            return (
              <motion.g key={p.label} animate={{ opacity: op }}>
                <rect x={p.x - 50} y={40} width={100} height={50} rx={8}
                  fill={active ? `${p.color}20` : `${p.color}0a`}
                  stroke={p.color} strokeWidth={active ? 2 : 1} />
                <text x={p.x} y={62} textAnchor="middle" fontSize={12}
                  fontWeight={700} fill={p.color}>{p.label}</text>
                <text x={p.x} y={80} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  {['추론 생성', '도구 호출', '결과 관찰'][i]}
                </text>
              </motion.g>
            );
          })}

          {/* Arrows between phases */}
          <motion.g animate={{ opacity: step >= 1 ? 0.6 : 0.3 }}>
            <line x1={130} y1={65} x2={180} y2={65} stroke="#6366f1" strokeWidth={1.2} />
            <polygon points="180,62 186,65 180,68" fill="#6366f1" />
            <line x1={280} y1={65} x2={330} y2={65} stroke="#f59e0b" strokeWidth={1.2} />
            <polygon points="330,62 336,65 330,68" fill="#f59e0b" />
          </motion.g>
          {/* Concrete example panel (steps 1-3) */}
          {step >= 1 && step <= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={100} width={400} height={52} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
              <rect x={30} y={100} width={4} height={52} rx={2}
                fill={PHASES[step - 1].color} />
              {EXAMPLES[step]?.think && (
                <text x={46} y={120} fontSize={9} fill="#6366f1" fontWeight={600}>
                  Think: {EXAMPLES[step].think}
                </text>
              )}
              {EXAMPLES[step]?.act && (
                <text x={46} y={120} fontSize={9} fill="#f59e0b" fontWeight={600}>
                  Act: {EXAMPLES[step].act}
                </text>
              )}
              {EXAMPLES[step]?.observe && (
                <text x={46} y={120} fontSize={9} fill="#10b981" fontWeight={600}>
                  Observe: {EXAMPLES[step].observe}
                </text>
              )}
              <text x={46} y={140} fontSize={9} fill="var(--muted-foreground)">
                {step === 1 && '사용자: "서울 날씨 알려줘" → LLM이 검색이 필요하다고 판단'}
                {step === 2 && 'tool_call: {"name":"search","args":{"query":"서울 현재 날씨"}}'}
                {step === 3 && '→ 결과를 컨텍스트에 추가하고 "서울은 18°C, 맑음" 답변 생성'}
              </text>
            </motion.g>
          )}

          {/* Loop-back arrow */}
          <motion.g animate={{ opacity: step >= 3 ? 0.6 : 0.15 }}>
            <path d="M 380 90 Q 380 166 230 166 Q 80 166 80 90"
              fill="none" stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 3" />
            <polygon points="78,94 80,86 84,94" fill="#10b981" />
            <text x={CX} y={180} textAnchor="middle" fontSize={9} fill="#10b981">목표 미달성 시 반복</text>
          </motion.g>
          {/* Limitation (step 4) */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={100} width={400} height={52} rx={6}
                fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
              <rect x={30} y={100} width={4} height={52} rx={2}
                fill="#ef4444" />
              <text x={46} y={120} fontSize={9}
                fontWeight={600} fill="#ef4444">단일 경로 탐색 + 긴 태스크 드리프트</text>
              <text x={46} y={138} fontSize={9}
                fill="var(--muted-foreground)">
                10턴 이상 시 목표 이탈률 23% (ReAct 논문) — Plan-Execute로 해결
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
