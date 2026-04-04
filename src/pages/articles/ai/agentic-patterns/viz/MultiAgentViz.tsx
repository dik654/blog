import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, AGENTS } from './MultiAgentData';
import { DebateView, RoutingView } from './MultiAgentParts';
import HierarchyView from './MultiAgentHierarchy';

const W = 460, H = 220;
const CX = W / 2;

export default function MultiAgentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SupervisorView />}
          {step === 1 && <DebateView />}
          {step === 2 && <RoutingView />}
          {step === 3 && <HierarchyView />}
        </svg>
      )}
    </StepViz>
  );
}

function SupervisorView() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={AGENTS[0].x - 50} y={AGENTS[0].y} width={100} height={36} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={2} />
      <text x={AGENTS[0].x} y={AGENTS[0].y + 23} textAnchor="middle"
        fontSize={11} fontWeight={700} fill="#6366f1">Supervisor</text>
      {AGENTS.slice(1).map((a, i) => (
        <motion.g key={a.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={a.x - 45} y={a.y} width={90} height={34} rx={6}
            fill={`${a.color}15`} stroke={a.color} strokeWidth={1.5} />
          <text x={a.x} y={a.y + 22} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={a.color}>{a.label} Agent</text>
          <line x1={AGENTS[0].x} y1={56} x2={a.x} y2={a.y}
            stroke={a.color} strokeWidth={1} opacity={0.4} />
        </motion.g>
      ))}
      <text x={CX} y={160} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">위임 → 실행 → 결과 취합</text>
    </motion.g>
  );
}
