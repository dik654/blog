import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Question', color: '#6366f1', x: 10 },
  { label: 'Thought', color: '#3b82f6', x: 80 },
  { label: 'Action', color: '#10b981', x: 150 },
  { label: 'Observation', color: '#f59e0b', x: 220 },
  { label: 'Answer', color: '#ec4899', x: 300 },
];
const BW = 62, BH = 34, CY = 45;

const STEPS = [
  { label: '질문 입력' },
  { label: 'Thought (추론)' },
  { label: 'Action (도구 실행)' },
  { label: 'Observation (결과 관찰)' },
  { label: 'Answer (최종 응답)' },
];
const BODY = [
  '복합 질문/작업 전달',
  'LLM이 도구 선택 추론',
  '검색·계산·API 도구 실행',
  '실행 결과 컨텍스트 추가',
  '충분하면 최종 답변 생성',
];

export default function AgentReActViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 495 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step === i;
            const done = step > i;
            const op = active ? 1 : done ? 0.5 : 0.2;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={CY - BH / 2} width={BW} height={BH} rx={5}
                  animate={{ fill: `${n.color}${active ? '22' : '0c'}`, stroke: n.color,
                    strokeWidth: active ? 2 : 1, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + BW / 2} y={CY + 4} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={active ? n.color : 'var(--foreground)'} opacity={op}>
                  {n.label}
                </text>
                {i < NODES.length - 1 && (
                  <line x1={n.x + BW + 2} y1={CY} x2={NODES[i + 1].x - 2} y2={CY}
                    stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.15} />
                )}
              </g>
            );
          })}
          {/* data packet */}
          {step <= 4 && (
            <motion.circle r={5}
              animate={{ cx: NODES[step].x + BW / 2, cy: CY - BH / 2 - 9 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              fill={NODES[step].color}
              style={{ filter: `drop-shadow(0 0 4px ${NODES[step].color}88)` }} />
          )}
          {/* loop-back arc from Observation to Thought */}
          {step >= 3 && step < 4 && (
            <motion.path
              d={`M ${NODES[3].x + BW / 2} ${CY + BH / 2 + 5} Q 185 ${CY + BH / 2 + 26} ${NODES[1].x + BW / 2} ${CY + BH / 2 + 5}`}
              fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }} />
          )}
          {step >= 3 && step < 4 && (
            <motion.text x={185} y={CY + BH / 2 + 30} textAnchor="middle" fontSize={9}
              fill="#f59e0b" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              정보 부족 시 재추론
            </motion.text>
          )}
          {/* final answer glow */}
          {step === 4 && (
            <motion.rect x={NODES[4].x - 2} y={CY - BH / 2 - 2} width={BW + 4} height={BH + 4} rx={7}
              fill="none" stroke="#ec4899" strokeWidth={1}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }} />
          )}
          <motion.text x={390} y={55} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
