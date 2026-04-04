import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { LAYERS, STEPS, STEP_REFS } from './ArchOverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const W = 140, H = 28, LX = 15;

export default function ArchOverviewViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 400 265" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <defs>
              <marker id="ao-arr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
                <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" />
              </marker>
            </defs>
            {LAYERS.map((l, i) => {
              const active = step === i;
              return (
                <g key={l.label}>
                  {i < LAYERS.length - 1 && (
                    <line x1={LX + W / 2} y1={l.y + H + 2}
                      x2={LX + W / 2} y2={LAYERS[i + 1].y - 2}
                      stroke="var(--muted-foreground)" strokeWidth={0.8}
                      opacity={i < step ? 0.4 : 0.12} markerEnd="url(#ao-arr)" />
                  )}
                  <motion.g animate={{ opacity: active ? 1 : i < step ? 0.5 : 0.2 }} transition={sp}>
                    <rect x={LX} y={l.y} width={W} height={H} rx={5}
                      fill={active ? `${l.color}18` : 'var(--card)'}
                      stroke={l.color} strokeWidth={active ? 2 : 0.7} />
                    <text x={LX + 8} y={l.y + 12} fontSize={10} fontWeight={700}
                      fill={l.color}>{l.label}</text>
                    <text x={LX + 8} y={l.y + 23} fontSize={10}
                      fill={l.color} opacity={0.6}>{l.sub}</text>
                  </motion.g>
                  {/* 활성 step 표시 마커 */}
                  {active && (
                    <motion.circle cx={LX - 6} cy={l.y + H / 2} r={3}
                      fill={l.color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={sp} />
                  )}
                </g>
              );
            })}
          </svg>
          {onOpenCode && STEP_REFS[step] && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
