import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'User', color: '#6366f1', x: 15 },
  { label: 'LLM', color: '#3b82f6', x: 85 },
  { label: 'Tool Call', color: '#10b981', x: 155 },
  { label: 'Tool Result', color: '#f59e0b', x: 225 },
  { label: 'Response', color: '#ec4899', x: 295 },
];
const BW = 60, BH = 36, CY = 50;

const STEPS = [
  { label: '사용자 메시지 입력' },
  { label: 'LLM 추론' },
  { label: '도구 호출 결정' },
  { label: '도구 실행 결과' },
  { label: '루프 반복 or 응답' },
];
const BODY = [
  '터미널에서 자연어로 지시',
  '~200K 토큰 컨텍스트 → Claude API',
  '텍스트 응답 vs tool_use 판별',
  '권한 승인 후 도구 실행·결과 수집',
  '평균 21.2회 반복 후 최종 응답',
];

export default function AgentLoopSequenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step === i || (step === 4 && i >= 1);
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
          {step <= 3 && (
            <motion.circle r={5}
              animate={{ cx: NODES[step].x + BW / 2, cy: CY - BH / 2 - 9 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              fill={NODES[step].color}
              style={{ filter: `drop-shadow(0 0 4px ${NODES[step].color}88)` }} />
          )}
          {/* loop-back arrow */}
          {step === 4 && (
            <>
              <motion.path
                d={`M ${NODES[3].x + BW / 2} ${CY + BH / 2 + 6} Q 185 ${CY + BH / 2 + 22} ${NODES[1].x + BW / 2} ${CY + BH / 2 + 6}`}
                fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }} />
              <motion.text x={185} y={CY + BH / 2 + 28} textAnchor="middle" fontSize={9}
                fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                루프 반복 (avg 21.2)
              </motion.text>
            </>
          )}
          <motion.text x={380} y={55} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
