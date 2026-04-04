import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS, LAYERS } from './MsgRouterVizData';

const W = 180, H = 34, LX = 80;

export default function MsgRouterViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 360 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="mr-arr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
              </marker>
            </defs>
            {LAYERS.map((l, i) => {
              const active = step === 0 || step === i + 1;
              return (
                <motion.g key={l.label}
                  animate={{ opacity: active ? 1 : 0.18 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: onOpenCode ? 'pointer' : 'default' }}
                  onClick={() => onOpenCode?.(l.codeKey)}>
                  <rect x={LX} y={l.y} width={W} height={H} rx={5}
                    fill={`${l.color}12`} stroke={l.color}
                    strokeWidth={active ? 1.5 : 0.8} />
                  <text x={LX + W / 2} y={l.y + 14} textAnchor="middle"
                    fontSize={10} fontWeight={700} fill={l.color}>{l.label}</text>
                  <text x={LX + W / 2} y={l.y + 27} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">{l.sub}</text>
                  {i < LAYERS.length - 1 && (
                    <line x1={LX + W / 2} y1={l.y + H} x2={LX + W / 2} y2={l.y + H + 11}
                      stroke={l.color} strokeWidth={1} opacity={0.4} markerEnd="url(#mr-arr)" />
                  )}
                </motion.g>
              );
            })}
            {/* Msg type badge */}
            {step === 1 && (
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <rect x={LX + W + 10} y={12} width={90} height={28} rx={4}
                  fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
                <text x={LX + W + 55} y={24} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill="#6366f1">typeURL 조회</text>
                <text x={LX + W + 55} y={35} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">/cosmos.bank...MsgSend</text>
              </motion.g>
            )}
            {/* Flow packet */}
            {step >= 1 && step <= 3 && (
              <motion.circle r={4} fill={LAYERS[step - 1].color}
                animate={{
                  cx: [LX + W / 2, LX + W / 2],
                  cy: [LAYERS[step - 1].y + H, LAYERS[Math.min(step, 3)].y],
                }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }} />
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-2 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
