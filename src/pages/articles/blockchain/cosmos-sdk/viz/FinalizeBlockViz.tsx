import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS, BOXES } from './FinalizeBlockVizData';

const W = 100, H = 36;

const isActive = (step: number, idx: number) => {
  if (step === 0) return idx <= 1;
  if (step === 1) return idx >= 1 && idx <= 3;
  if (step === 2) return idx === 4;
  if (step === 3) return idx === 5;
  if (step === 4) return idx === 6;
  return false;
};

export default function FinalizeBlockViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 340 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="fb-arrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
              </marker>
            </defs>
            {/* Arrow: finalize → internal */}
            <line x1={60} y1={46} x2={60} y2={56} stroke="var(--border)" strokeWidth={1} markerEnd="url(#fb-arrow)" />
            {/* Arrow: internal → pre/begin/txs */}
            <line x1={60} y1={94} x2={60} y2={104} stroke="var(--border)" strokeWidth={1} markerEnd="url(#fb-arrow)" />
            <line x1={165} y1={94} x2={165} y2={104} stroke="var(--border)" strokeWidth={1} markerEnd="url(#fb-arrow)" />
            <line x1={270} y1={94} x2={270} y2={104} stroke="var(--border)" strokeWidth={1} markerEnd="url(#fb-arrow)" />
            {/* Arrow: txs → end, end → hash */}
            <line x1={60} y1={142} x2={60} y2={152} stroke="var(--border)" strokeWidth={1} markerEnd="url(#fb-arrow)" />
            <line x1={200} y1={172} x2={218} y2={172} stroke="var(--border)" strokeWidth={1} markerEnd="url(#fb-arrow)" />

            {BOXES.map((b, i) => {
              const active = isActive(step, i);
              return (
                <motion.g key={b.id}
                  animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: onOpenCode ? 'pointer' : 'default' }}
                  onClick={() => onOpenCode?.(STEP_REFS[Math.min(step, 4)])}>
                  <rect x={b.x} y={b.y} width={W} height={H} rx={5}
                    fill={`${b.color}12`} stroke={b.color} strokeWidth={active ? 1.5 : 0.8} />
                  <text x={b.x + W / 2} y={b.y + 14} textAnchor="middle"
                    fontSize={10} fontWeight={700} fill={b.color}>{b.label}</text>
                  <text x={b.x + W / 2} y={b.y + 27} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">{b.sub}</text>
                </motion.g>
              );
            })}
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
