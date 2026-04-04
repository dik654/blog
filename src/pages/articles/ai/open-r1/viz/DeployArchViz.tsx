import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { deploySteps } from '../deployData';

const NODES = [
  { label: 'SGLang 서버', sub: '2x8 GPU (TP=16)', color: '#6366f1', x: 5 },
  { label: '라우터', sub: '부하 분산', color: '#f59e0b', x: 95 },
  { label: '헬스 체크', sub: '5분 주기', color: '#10b981', x: 185 },
  { label: '훈련 클러스터', sub: 'SFT / GRPO', color: '#8b5cf6', x: 275 },
];
const BW = 76, BH = 46, CY = 45;

export default function DeployArchViz() {
  return (
    <StepViz steps={deploySteps}>
      {(step) => (
        <svg viewBox="0 0 365 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step === i;
            const done = step > i;
            const op = active ? 1 : done ? 0.55 : 0.2;
            return (
              <g key={i}>
                <motion.rect x={n.x} y={CY - BH / 2} width={BW} height={BH} rx={6}
                  animate={{ fill: `${n.color}${active ? '20' : '08'}`, stroke: n.color,
                    strokeWidth: active ? 2 : 1, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + BW / 2} y={CY - 4} textAnchor="middle" fontSize={7.5}
                  fontWeight={600} fill={active ? n.color : 'var(--foreground)'} opacity={op}>
                  {n.label}
                </text>
                <text x={n.x + BW / 2} y={CY + 9} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)" opacity={op * 0.7}>{n.sub}</text>
                {i < NODES.length - 1 && (
                  <line x1={n.x + BW + 2} y1={CY} x2={NODES[i + 1].x - 2} y2={CY}
                    stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.15} />
                )}
              </g>
            );
          })}
          <motion.circle r={5}
            animate={{ cx: NODES[step].x + BW / 2, cy: CY - BH / 2 - 10 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            fill={NODES[step].color}
            style={{ filter: `drop-shadow(0 0 4px ${NODES[step].color}88)` }} />
        </svg>
      )}
    </StepViz>
  );
}
