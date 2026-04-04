import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LOOP_NODES } from './IterationData';

const W = 400, H = 220;
const CX = W / 2, CY = 100, R = 70;

export default function IterationViz() {
  const positions = LOOP_NODES.map((_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI * 2) / LOOP_NODES.length;
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  });

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* cycle arrows */}
          {LOOP_NODES.map((_, i) => {
            const from = positions[i];
            const to = positions[(i + 1) % LOOP_NODES.length];
            const active = step === i;
            return (
              <motion.line key={`edge-${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={active ? LOOP_NODES[i].color : 'var(--border)'}
                animate={{ strokeWidth: active ? 2 : 1 }}
                strokeDasharray={active ? 'none' : '4 3'}
                opacity={active ? 1 : 0.4}
                transition={{ duration: 0.3 }} />
            );
          })}

          {/* nodes */}
          {LOOP_NODES.map((node, i) => {
            const pos = positions[i];
            const active = step === i;
            return (
              <motion.g key={node.label}
                animate={{ scale: active ? 1.1 : 1 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                transition={{ duration: 0.3 }}>
                <rect x={pos.x - 36} y={pos.y - 18} width={72} height={36}
                  rx={6} fill={active ? `${node.color}20` : `${node.color}08`}
                  stroke={node.color} strokeWidth={active ? 2 : 1} />
                <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={node.color}>
                  {node.label}
                </text>
              </motion.g>
            );
          })}

          {/* center label */}
          <text x={CX} y={CY + 3} textAnchor="middle"
            fontSize={9} fill="var(--muted-foreground)">반복 루프</text>

          {/* step 3: tradeoff indicators with real numbers */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Before */}
              <rect x={20} y={182} width={155} height={28} rx={4}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
              <text x={28} y={196} fontSize={8} fontWeight={600}
                fill="#f59e0b">Before</text>
              <text x={66} y={196} fontSize={8}
                fill="var(--muted-foreground)">GPT-4o 전용 $0.006/req</text>
              {/* After */}
              <rect x={W - 175} y={182} width={155} height={28} rx={4}
                fill="#10b98110" stroke="#10b981" strokeWidth={1} />
              <text x={W - 167} y={196} fontSize={8} fontWeight={600}
                fill="#10b981">After</text>
              <text x={W - 132} y={196} fontSize={8}
                fill="var(--muted-foreground)">라우팅 분기 $0.003/req</text>
              <text x={CX} y={196} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#10b981">→</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
