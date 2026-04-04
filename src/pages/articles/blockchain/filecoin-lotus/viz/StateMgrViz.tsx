import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { FIELDS, STEPS, STEP_REFS } from './StateMgrVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export default function StateMgrViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 400 200" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <text x={200} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
              fill="var(--foreground)">StateManager struct</text>
            <rect x={10} y={24} width={380} height={166} rx={8}
              fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
            {FIELDS.map((f, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const x = 24 + col * 124;
              const y = 36 + row * 80;
              const active = i === step;
              return (
                <motion.g key={f.label}
                  animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                  <rect x={x} y={y} width={116} height={60} rx={6}
                    fill={active ? `${f.color}12` : 'var(--card)'}
                    stroke={f.color} strokeWidth={active ? 1.5 : 0.5} />
                  <text x={x + 58} y={y + 24} textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={f.color}>{f.label}</text>
                  <line x1={x + 8} y1={y + 34} x2={x + 108} y2={y + 34}
                    stroke={f.color} strokeWidth={0.3} opacity={0.4} />
                  <text x={x + 58} y={y + 48} textAnchor="middle" fontSize={10}
                    fill={f.color} opacity={0.7}>{f.sub}</text>
                </motion.g>
              );
            })}
          </svg>
          {onOpenCode && STEP_REFS[step] !== undefined && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">stmgr.go</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
