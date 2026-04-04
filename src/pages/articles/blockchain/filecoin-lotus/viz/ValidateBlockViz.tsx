import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { CHECKS, STEPS, STEP_REFS } from './ValidateBlockVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const BW = 90, BH = 40, GX = 12, GY = 20;

export default function ValidateBlockViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 420 140" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <defs>
              <marker id="vb-arr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" />
              </marker>
            </defs>
            {CHECKS.map((c, i) => {
              const row = i < 3 ? 0 : 1;
              const col = i < 3 ? i : i - 3;
              const x = GX + col * (BW + 36);
              const y = GY + row * (BH + 30);
              const active = i === step;
              const done = i < step;
              return (
                <g key={c.label}>
                  {i < 5 && i !== 2 && (
                    <line x1={x + BW + 2} y1={y + BH / 2}
                      x2={x + BW + 32} y2={y + BH / 2}
                      stroke="var(--muted-foreground)" strokeWidth={0.8}
                      opacity={done ? 0.4 : 0.1} markerEnd="url(#vb-arr)" />
                  )}
                  {i === 2 && (
                    <path d={`M${x + BW / 2},${y + BH + 2} L${x + BW / 2},${y + BH + 14} L${GX + BW / 2},${y + BH + 14} L${GX + BW / 2},${y + BH + 28}`}
                      fill="none" stroke="var(--muted-foreground)" strokeWidth={0.8}
                      opacity={done ? 0.4 : 0.1} markerEnd="url(#vb-arr)" />
                  )}
                  <motion.g animate={{ opacity: active ? 1 : done ? 0.5 : 0.15 }} transition={sp}>
                    <rect x={x} y={y} width={BW} height={BH} rx={6}
                      fill={active ? `${c.color}18` : 'var(--card)'}
                      stroke={c.color} strokeWidth={active ? 2 : 0.7} />
                    <text x={x + BW / 2} y={y + 18} textAnchor="middle" fontSize={11}
                      fontWeight={700} fill={c.color}>{c.label}</text>
                    <text x={x + BW / 2} y={y + 32} textAnchor="middle" fontSize={10}
                      fill={c.color} opacity={0.6}>{c.sub}</text>
                    {done && (
                      <text x={x + BW - 8} y={y + 12} fontSize={12} fill="#10b981">&#x2713;</text>
                    )}
                  </motion.g>
                </g>
              );
            })}
          </svg>
          {onOpenCode && STEP_REFS[step] !== undefined && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">
                {step <= 2 ? 'filecoin.go' : step === 2 ? 'weight.go' : 'filecoin.go'}
              </span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
