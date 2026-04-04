import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, NODES } from './ArchitectureData';

const W = 460, H = 220;
const BW = 90, BH = 44;

export default function ArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Host */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={NODES[0].x} y={NODES[0].y - BH / 2} width={BW} height={BH} rx={6}
              fill={step === 0 ? '#6366f120' : '#6366f10a'} stroke="#6366f1"
              strokeWidth={step === 0 ? 2 : 1} />
            <text x={NODES[0].x + BW / 2} y={NODES[0].y - 2} textAnchor="middle"
              fontSize={10} fontWeight={700} fill="#6366f1">{NODES[0].label}</text>
            <text x={NODES[0].x + BW / 2} y={NODES[0].y + 12} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)">{NODES[0].sub}</text>
          </motion.g>

          {/* Client */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
            <rect x={NODES[1].x} y={NODES[1].y - BH / 2} width={BW} height={BH} rx={6}
              fill={step === 1 ? '#10b98120' : '#10b9810a'} stroke="#10b981"
              strokeWidth={step === 1 ? 2 : 1} />
            <text x={NODES[1].x + BW / 2} y={NODES[1].y - 2} textAnchor="middle"
              fontSize={10} fontWeight={700} fill="#10b981">{NODES[1].label}</text>
            <text x={NODES[1].x + BW / 2} y={NODES[1].y + 12} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)">{NODES[1].sub}</text>
          </motion.g>

          {/* Host → Client arrow */}
          {step >= 1 && (
            <motion.line x1={NODES[0].x + BW} y1={NODES[0].y}
              x2={NODES[1].x} y2={NODES[1].y}
              stroke="#6366f1" strokeWidth={1.2} markerEnd="url(#arrowG)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
          )}

          {/* Servers */}
          {[2, 3, 4].map((idx, i) => {
            const n = NODES[idx];
            const active = step === 2 && i === 0 || step === 3;
            return (
              <motion.g key={n.id}
                animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
                <rect x={n.x} y={n.y - BH / 2} width={BW} height={BH} rx={6}
                  fill={active ? '#f59e0b20' : '#f59e0b0a'} stroke="#f59e0b"
                  strokeWidth={active ? 2 : 1} />
                <text x={n.x + BW / 2} y={n.y - 2} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill="#f59e0b">{n.label}</text>
                <text x={n.x + BW / 2} y={n.y + 12} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}

          {/* Client → Servers arrows */}
          {step >= 2 && [2, 3, 4].map((idx) => (
            <motion.line key={`a-${idx}`}
              x1={NODES[1].x + BW} y1={NODES[1].y}
              x2={NODES[idx].x} y2={NODES[idx].y}
              stroke="#10b981" strokeWidth={1} markerEnd="url(#arrowA)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} />
          ))}

          {/* 1:N label + real capability negotiation example */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={165} width={340} height={40} rx={5}
                fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
              <rect x={60} y={165} width={4} height={40} rx={2} fill="#10b981" />
              <text x={74} y={179} fontSize={8} fontFamily="monospace"
                fontWeight={600} fill="#10b981">initialize response:</text>
              <text x={74} y={193} fontSize={8} fontFamily="monospace"
                fill="var(--muted-foreground)">
                {"capabilities: {tools:{}, resources:{listChanged:true}}"}
              </text>
            </motion.g>
          )}

          {/* arrow markers */}
          <defs>
            <marker id="arrowG" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#6366f1" />
            </marker>
            <marker id="arrowA" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#10b981" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
