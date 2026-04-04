import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, FORMULA_PARTS, STEP_REFS } from './WeightVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export default function WeightViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {/* Formula bar */}
            <text x={210} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--muted-foreground)">
              체인 가중치 공식
            </text>
            {FORMULA_PARTS.map((p, i) => {
              const x = 20 + i * 105;
              const active = i === step || (i === 0 && step >= 0);
              return (
                <motion.g key={p.text}
                  animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                  <rect x={x} y={28} width={98} height={50} rx={6}
                    fill={active ? `${p.color}12` : 'var(--card)'}
                    stroke={p.color} strokeWidth={active ? 1.5 : 0.5} />
                  <text x={x + 49} y={48} textAnchor="middle" fontSize={11}
                    fontWeight={700} fill={p.color}>{p.text}</text>
                  <line x1={x + 8} y1={56} x2={x + 90} y2={56}
                    stroke={p.color} strokeWidth={0.3} opacity={0.4} />
                  <text x={x + 49} y={70} textAnchor="middle" fontSize={10}
                    fill={p.color} opacity={0.7}>{p.desc}</text>
                </motion.g>
              );
            })}
            {/* Plus signs */}
            {[0, 1, 2].map(i => (
              <text key={`plus-${i}`} x={118 + i * 105} y={58} fontSize={14}
                fill="var(--muted-foreground)" opacity={0.4}>+</text>
            ))}
          </svg>
          {onOpenCode && STEP_REFS[step] !== undefined && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">weight.go</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
