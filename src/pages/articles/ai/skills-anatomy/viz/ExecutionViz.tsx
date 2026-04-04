import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PIPELINE } from './ExecutionData';
import { ParamExtraction, PromptAssembly } from './ExecutionParts';
import { SubAgentPattern, ToolPermissions } from './ExecutionParts2';

const W = 460, H = 230;

export default function ExecutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline steps (top row) */}
          {PIPELINE.map((p, i) => {
            const x = 20 + i * 88;
            const active = step === 0 ? i <= 1
              : step === 1 ? i === 2
              : i <= 4;
            return (
              <motion.g key={p.label}
                animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={20} width={76} height={34} rx={5}
                  fill={active ? `${p.color}18` : `${p.color}08`}
                  stroke={p.color}
                  strokeWidth={active ? 1.5 : 0.5} />
                <text x={x + 38} y={33} textAnchor="middle"
                  fontSize={10} fill={p.color}>{p.icon}</text>
                <text x={x + 38} y={47} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={p.color}>{p.label}</text>
                {i < 4 && (
                  <line x1={x + 76} y1={37} x2={x + 88} y2={37}
                    stroke="var(--border)" strokeWidth={1} />
                )}
              </motion.g>
            );
          })}

          {step === 0 && <ParamExtraction />}
          {step === 1 && <PromptAssembly />}
          {step === 2 && <SubAgentPattern />}
          {step === 3 && <ToolPermissions />}
        </svg>
      )}
    </StepViz>
  );
}
