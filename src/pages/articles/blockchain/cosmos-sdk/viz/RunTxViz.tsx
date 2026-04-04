import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS, PIPE } from './RunTxVizData';

const SW = 62, SH = 40;

export default function RunTxViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 380 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="rtx-arr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <polygon points="0 0, 5 2, 0 4" fill="var(--muted-foreground)" />
              </marker>
            </defs>
            {PIPE.map((s, i) => {
              const active = step === 0 || step === i + 1;
              return (
                <motion.g key={s.label}
                  animate={{ opacity: active ? 1 : 0.18 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: onOpenCode ? 'pointer' : 'default' }}
                  onClick={() => onOpenCode?.(STEP_REFS[i + 1] ?? STEP_REFS[0])}>
                  <rect x={s.x} y={24} width={SW} height={SH} rx={5}
                    fill={`${s.color}12`} stroke={s.color}
                    strokeWidth={active ? 1.5 : 0.8} />
                  <text x={s.x + SW / 2} y={40} textAnchor="middle"
                    fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={s.x + SW / 2} y={54} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">{s.sub}</text>
                  {i < PIPE.length - 1 && (
                    <line x1={s.x + SW + 2} y1={44} x2={s.x + SW + 18} y2={44}
                      stroke={s.color} strokeWidth={1} opacity={0.5} markerEnd="url(#rtx-arr)" />
                  )}
                </motion.g>
              );
            })}
            {/* Cache branch indicator */}
            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                <rect x={82} y={70} width={228} height={18} rx={3}
                  fill="none" stroke="var(--border)" strokeDasharray="4 2" strokeWidth={1} />
                <text x={196} y={82} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">CacheMultiStore 분기 — 실패 시 전체 롤백</text>
              </motion.g>
            )}
            {/* Packet flow */}
            {step >= 1 && step <= 4 && (
              <motion.rect width={8} height={8} rx={2} y={40}
                fill={PIPE[step - 1].color}
                animate={{ x: [PIPE[step - 1].x + 4, PIPE[Math.min(step, 4)].x + SW - 12] }}
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
