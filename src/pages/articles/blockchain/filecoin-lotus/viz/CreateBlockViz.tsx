import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STAGES, STEPS, STEP_REFS } from './CreateBlockVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const BW = 100, BH = 44, GAP = 14, LX = 8;

export default function CreateBlockViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 440 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <defs>
              <marker id="cb-arr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" />
              </marker>
            </defs>
            {STAGES.map((s, i) => {
              const x = LX + i * (BW + GAP);
              const active = i === step;
              const done = i < step;
              return (
                <g key={s.label}>
                  {i < STAGES.length - 1 && (
                    <line x1={x + BW + 2} y1={18 + BH / 2}
                      x2={x + BW + GAP - 2} y2={18 + BH / 2}
                      stroke="var(--muted-foreground)" strokeWidth={0.8}
                      opacity={done ? 0.4 : 0.1} markerEnd="url(#cb-arr)" />
                  )}
                  <motion.g animate={{ opacity: active ? 1 : done ? 0.5 : 0.15 }} transition={sp}>
                    <rect x={x} y={18} width={BW} height={BH} rx={6}
                      fill={active ? `${s.color}18` : 'var(--card)'}
                      stroke={s.color} strokeWidth={active ? 2 : 0.7} />
                    <text x={x + BW / 2} y={36} textAnchor="middle" fontSize={10}
                      fontWeight={700} fill={s.color}>{s.label}</text>
                    <text x={x + BW / 2} y={50} textAnchor="middle" fontSize={10}
                      fill={s.color} opacity={0.6}>{s.sub}</text>
                    {done && (
                      <text x={x + BW - 10} y={30} fontSize={12} fill="#10b981">&#x2713;</text>
                    )}
                  </motion.g>
                </g>
              );
            })}
          </svg>
          {onOpenCode && STEP_REFS[step] !== undefined && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">mine.go — CreateBlock</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
