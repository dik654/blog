import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 PPO 시스템', body: '4개 모델(Actor, Critic, Reference, Reward)이 협력하여 정책 최적화\nActor와 Critic만 학습, Reference와 Reward는 동결' },
  { label: 'Actor가 응답 생성', body: 'Actor(π_θ)가 프롬프트에 대해 토큰 단위로 응답 y 생성\n이 응답이 Reward와 Reference에 전달' },
  { label: 'Reward 평가 & KL 계산', body: 'Reward 모델이 (x,y) 품질 점수 R(x,y) 산출\nReference 모델로 KL(π_θ ∥ π_ref) 계산 → 정책 이탈 방지' },
  { label: 'Advantage 산출', body: 'A = R(x,y) - V(s) - β·KL\nCritic의 baseline V(s) 차감으로 분산 감소\nβ·KL로 참조 정책 근처에서 탐색' },
  { label: 'PPO 업데이트', body: 'Clipped surrogate objective로 Actor/Critic 동시 업데이트\nmin(r(θ)·A, clip(r(θ),1±ε)·A) — 급격한 정책 변화 방지' },
];
const M = [
  { label: 'Actor', sub: 'π_θ', x: 30, y: 10, c: '#3b82f6' },
  { label: 'Critic', sub: 'V(s)', x: 210, y: 10, c: '#10b981' },
  { label: 'Reference', sub: 'KL 동결', x: 30, y: 80, c: '#f59e0b' },
  { label: 'Reward', sub: 'r(x,y)', x: 210, y: 80, c: '#8b5cf6' },
];
const MW = 100, MH = 44, ACT = [[0,1,2,3],[0],[2,3],[1,3],[0,1]];

export default function RLHFArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {M.map((m, i) => {
            const on = ACT[step].includes(i);
            return (
              <g key={m.label}>
                <motion.rect x={m.x} y={m.y} width={MW} height={MH} rx={6}
                  animate={{ fill: `${m.c}${on ? '18' : '08'}`, stroke: m.c,
                    strokeWidth: on ? 2.5 : 0.8, opacity: on ? 1 : 0.25 }} />
                <text x={m.x + MW / 2} y={m.y + 20} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={m.c} opacity={on ? 1 : 0.3}>{m.label}</text>
                <text x={m.x + MW / 2} y={m.y + 34} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)" opacity={on ? 0.7 : 0.2}>{m.sub}</text>
              </g>
            );
          })}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <motion.rect x={148} y={20} width={48} height={20} rx={3} fill="#94a3b815" stroke="#94a3b8" strokeWidth={1} />
              <text x={172} y={34} textAnchor="middle" fontSize={9} fill="#94a3b8">응답 y</text>
              <line x1={130} y1={30} x2={148} y2={30} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#ra)" />
            </motion.g>
          )}
          <motion.line x1={260} y1={54} x2={260} y2={80} stroke="#8b5cf6" strokeDasharray="3 2"
            animate={{ opacity: step >= 2 ? 0.6 : 0.08 }} strokeWidth={1} />
          <motion.line x1={80} y1={54} x2={80} y2={80} stroke="#f59e0b" strokeDasharray="3 2"
            animate={{ opacity: step >= 2 ? 0.6 : 0.08 }} strokeWidth={1} />
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <text x={270} y={70} fontSize={9} fill="#8b5cf6">평가</text>
              <text x={90} y={70} fontSize={9} fill="#f59e0b">KL</text>
            </motion.g>
          )}
          <motion.rect x={120} y={88} width={90} height={24} rx={4}
            animate={{ fill: `#ef4444${step >= 3 ? '18' : '06'}`, stroke: '#ef4444',
              strokeWidth: step >= 3 ? 2 : 0.6, opacity: step >= 3 ? 1 : 0.2 }} />
          <text x={165} y={104} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="#ef4444" opacity={step >= 3 ? 1 : 0.2}>Advantage</text>
          <motion.line x1={210} y1={101} x2={200} y2={101} stroke="#8b5cf6" strokeWidth={0.8}
            animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} />
          <motion.line x1={130} y1={101} x2={140} y2={101} stroke="#f59e0b" strokeWidth={0.8}
            animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} />
          <motion.line x1={260} y1={44} x2={200} y2={95} stroke="#10b981" strokeDasharray="3 2"
            strokeWidth={0.8} animate={{ opacity: step >= 3 ? 0.4 : 0.05 }} />
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={80} y={118} width={250} height={22} rx={4}
                fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
              <text x={205} y={133} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">
                A = R(x,y) − V(s) − β·KL
              </text>
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <motion.path d="M 170 90 C 170 68, 100 58, 80 54" fill="none" stroke="#ef4444"
                strokeWidth={1.5} markerEnd="url(#ra)" />
              <motion.path d="M 170 90 C 170 68, 240 58, 260 54" fill="none" stroke="#ef4444"
                strokeWidth={1.5} markerEnd="url(#ra)" />
              <text x={345} y={68} fontSize={9} fill="#ef4444">PPO update</text>
            </motion.g>
          )}
          <defs><marker id="ra" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#ef4444" /></marker></defs>
          {/* body moved to StepViz steps.body */}
        </svg>
      )}
    </StepViz>
  );
}
