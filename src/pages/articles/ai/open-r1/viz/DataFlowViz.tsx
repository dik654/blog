import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { pipelineSteps } from '../pipelineData';

const NODES = [
  { label: '입력 데이터셋', color: '#94a3b8', x: 0 },
  { label: 'vLLM 서버', color: '#6366f1', x: 80 },
  { label: 'Distilabel', color: '#10b981', x: 160 },
  { label: '추론 트레이스', color: '#f59e0b', x: 240 },
  { label: 'HF Hub', color: '#8b5cf6', x: 315 },
];
const BW = 68, BH = 36, CY = 36;

export default function DataFlowViz() {
  return (
    <StepViz steps={pipelineSteps}>
      {(step) => {
        const idx = Math.min(step, NODES.length - 1);
        return (
          <svg viewBox="0 0 395 75" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {NODES.map((n, i) => {
              const active = step === i;
              const done = step > i;
              const op = active ? 1 : done ? 0.55 : 0.2;
              return (
                <g key={i}>
                  <motion.rect x={n.x} y={CY - BH / 2} width={BW} height={BH} rx={5}
                    animate={{ fill: `${n.color}${active ? '20' : '08'}`, stroke: n.color,
                      strokeWidth: active ? 2 : 1, opacity: op }}
                    transition={{ duration: 0.3 }} />
                  <text x={n.x + BW / 2} y={CY + 2} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={active ? n.color : 'var(--foreground)'} opacity={op}>
                    {n.label}
                  </text>
                  {i < NODES.length - 1 && (
                    <line x1={n.x + BW + 1} y1={CY} x2={NODES[i + 1].x - 1} y2={CY}
                      stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.15} />
                  )}
                </g>
              );
            })}
            <motion.circle r={4}
              animate={{ cx: NODES[idx].x + BW / 2, cy: CY - BH / 2 - 8 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              fill={NODES[idx].color}
              style={{ filter: `drop-shadow(0 0 3px ${NODES[idx].color}88)` }} />
          </svg>
        );
      }}
    </StepViz>
  );
}
