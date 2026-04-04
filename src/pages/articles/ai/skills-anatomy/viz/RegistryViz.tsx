import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, REGISTRY_STATS } from './RegistryData';
import { VersionTimeline, ContributionPipeline } from './RegistryParts';
import { SkillChaining } from './RegistryParts2';

const W = 460;
const CX = W / 2;

export default function RegistryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} 230`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Registry box */}
          <rect x={CX - 110} y={20} width={220} height={40} rx={6}
            fill="#6366f110" stroke="#6366f1" strokeWidth={1.5} />
          <text x={CX} y={44} textAnchor="middle" fontSize={10}
            fontWeight={700} fill="#6366f1">Skill Registry</text>

          {/* Step 0: stats */}
          {step === 0 && REGISTRY_STATS.map((s, i) => (
            <motion.g key={s.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              <rect x={40 + i * 140} y={80} width={120} height={44} rx={5}
                fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
              <text x={100 + i * 140} y={100} textAnchor="middle"
                fontSize={14} fontWeight={700} fill={s.color}>{s.value}</text>
              <text x={100 + i * 140} y={116} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{s.label}</text>
            </motion.g>
          ))}

          {step === 1 && <VersionTimeline />}
          {step === 2 && <ContributionPipeline />}
          {step === 3 && <SkillChaining />}
        </svg>
      )}
    </StepViz>
  );
}
