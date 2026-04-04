import { motion } from 'framer-motion';

const PLAN_STEPS = [
  { label: '① Lighthouse', y: 55 },
  { label: '② 병목 식별', y: 90 },
  { label: '③ 최적화', y: 125 },
  { label: '④ 재측정', y: 160 },
];

export function PlanView({ step }: { step: number }) {
  return (
    <g>
      <rect x={40} y={20} width={100} height={34} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
      <text x={90} y={42} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#6366f1">Planner</text>

      {PLAN_STEPS.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: step === 1 ? 1 : 0.5, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={200} y={s.y} width={120} height={28} rx={5}
            fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <text x={260} y={s.y + 18} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="#10b981">{s.label}</text>
          {i < PLAN_STEPS.length - 1 && (
            <line x1={260} y1={s.y + 28} x2={260} y2={s.y + 35}
              stroke="#10b981" strokeWidth={0.8} opacity={0.4} />
          )}
        </motion.g>
      ))}

      <line x1={140} y1={37} x2={200} y2={69}
        stroke="#6366f1" strokeWidth={1} opacity={0.5} />

      <motion.g animate={{ opacity: step === 1 ? 1 : 0.3 }}>
        <rect x={370} y={85} width={70} height={34} rx={6}
          fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={405} y={107} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="#f59e0b">실행</text>
      </motion.g>
    </g>
  );
}

export function ReflectionView({ step }: { step: number }) {
  const isReplan = step === 3;
  return (
    <g>
      <text x={230} y={25} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">
        {isReplan ? 'Replan — 계획 수정' : 'Reflection — 자기 평가'}
      </text>

      <rect x={50} y={60} width={90} height={36} rx={6}
        fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={95} y={83} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="#f59e0b">Execute</text>

      <rect x={185} y={60} width={90} height={36} rx={6}
        fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
      <text x={230} y={83} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="#10b981">Result</text>

      <rect x={320} y={60} width={90} height={36} rx={6}
        fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} />
      <text x={365} y={83} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="#6366f1">Evaluate</text>

      <line x1={140} y1={78} x2={185} y2={78}
        stroke="#f59e0b" strokeWidth={1} opacity={0.5} />
      <line x1={275} y1={78} x2={320} y2={78}
        stroke="#10b981" strokeWidth={1} opacity={0.5} />

      {isReplan ? (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={160} y={130} width={140} height={34} rx={6}
            fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} />
          <text x={230} y={152} textAnchor="middle" fontSize={10}
            fontWeight={600} fill="#6366f1">Replan</text>
          <path d="M 365 96 Q 365 130 300 147"
            fill="none" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 3" />
          <path d="M 160 147 Q 95 147 95 96"
            fill="none" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 3" />
        </motion.g>
      ) : (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
          <path d="M 365 96 Q 365 140 230 140 Q 95 140 95 96"
            fill="none" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 3" />
          <text x={230} y={155} textAnchor="middle" fontSize={9}
            fill="#6366f1">No → 재실행</text>
        </motion.g>
      )}
    </g>
  );
}
