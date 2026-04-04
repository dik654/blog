import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './DSMRVizData';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

interface Props { onOpenCode?: (key: string) => void }

export default function DSMRViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {step === 0 && <TraditionalStep />}
            {step === 1 && <DecoupledStep />}
            {step === 2 && <CodeMapStep />}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}

function TraditionalStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Traditional SMR</text>
      {['Replicate', 'Sequence', 'Execute'].map((s, i) => (
        <g key={i}>
          <rect x={40 + i * 135} y={30} width={110} height={36} rx={5}
            fill={`${[C1, C2, C3][i]}10`} stroke={[C1, C2, C3][i]} strokeWidth={0.8} />
          <text x={95 + i * 135} y={52} textAnchor="middle" fontSize={10} fontWeight={500}
            fill={[C1, C2, C3][i]}>{s}</text>
          {i < 2 && <line x1={150 + i * 135} y1={48} x2={175 + i * 135} y2={48}
            stroke="var(--border)" strokeWidth={0.6} />}
        </g>
      ))}
      <rect x={100} y={85} width={240} height={24} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} />
      <text x={220} y={101} textAnchor="middle" fontSize={10} fill="#ef4444">병목 = Sequence(합의). 대역폭 제한</text>
    </motion.g>
  );
}

function DecoupledStep() {
  const stages = [
    { label: 'Replicate', sub: 'broadcast', c: C1 },
    { label: 'Sequence', sub: 'simplex', c: C2 },
    { label: 'Execute', sub: 'vm', c: C3 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>Decoupled SMR</text>
      {stages.map((s, i) => (
        <g key={i}>
          <rect x={40 + i * 135} y={30} width={110} height={44} rx={5} fill="var(--card)" />
          <rect x={40 + i * 135} y={30} width={110} height={44} rx={5}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={1} />
          <text x={95 + i * 135} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.c}>{s.label}</text>
          <text x={95 + i * 135} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">({s.sub})</text>
          {i < 2 && <text x={157 + i * 135} y={48} fontSize={10} fill="var(--muted-foreground)">독립</text>}
        </g>
      ))}
      <text x={240} y={100} textAnchor="middle" fontSize={10} fill={C2}>
        합의는 tip 순서만 → 처리량이 합의 대역폭에 제한되지 않음
      </text>
    </motion.g>
  );
}

function CodeMapStep() {
  const maps = [
    { mod: 'broadcast::buffered', role: 'Replicate', c: C1 },
    { mod: 'ordered_broadcast', role: 'Cert Chain', c: C2 },
    { mod: 'consensus::simplex', role: 'Sequence', c: C3 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {maps.map((m, i) => (
        <g key={i}>
          <rect x={30} y={14 + i * 40} width={420} height={30} rx={5} fill="var(--card)" />
          <rect x={30} y={14 + i * 40} width={420} height={30} rx={5}
            fill={`${m.c}08`} stroke={m.c} strokeWidth={0.8} />
          <text x={170} y={33 + i * 40} textAnchor="start" fontSize={10} fontWeight={500} fill={m.c}>{m.mod}</text>
          <text x={410} y={33 + i * 40} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">→ {m.role}</text>
        </g>
      ))}
    </motion.g>
  );
}
