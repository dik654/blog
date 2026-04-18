import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

interface KeyPoint {
  label: string;
  desc: string;
}

interface StepVisual {
  title: string;
  titleColor: string;
  points: KeyPoint[];
  pointColor: string;
}

function AutoStep({ visual }: { visual: StepVisual }) {
  const n = visual.points.length;
  const spacing = Math.min(28, 120 / n);
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={visual.titleColor}>{visual.title}</text>
      {visual.points.map((p, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={25} y={20 + i * spacing} width={430} height={spacing - 4} rx={4}
            fill={visual.pointColor + '08'} stroke={visual.pointColor} strokeWidth={0.4} />
          <text x={35} y={20 + i * spacing + spacing / 2 + 1} fontSize={8.5} fontWeight={600}
            fill={visual.pointColor}>{p.label}</text>
          <text x={180} y={20 + i * spacing + spacing / 2 + 1} fontSize={8}
            fill="var(--muted-foreground)">{p.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

export interface AutoDetailProps {
  steps: StepDef[];
  visuals: StepVisual[];
}

export default function AutoDetailViz({ steps, visuals }: AutoDetailProps) {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <AutoStep visual={visuals[step]} />
        </svg>
      )}
    </StepViz>
  );
}
