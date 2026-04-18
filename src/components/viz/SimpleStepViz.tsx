import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

export interface SimpleStepItem {
  /** Rendered as SVG title */
  title: string;
  /** Key-value pairs rendered as labeled rows */
  rows: { label: string; value: string }[];
  /** Primary color hex */
  color: string;
}

function SimpleStep({ item }: { item: SimpleStepItem }) {
  const n = item.rows.length;
  const h = Math.min(22, 140 / n);
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={item.color}>
        {item.title}
      </text>
      {item.rows.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}>
          <rect x={25} y={18 + i * h} width={430} height={h - 3} rx={4}
            fill={item.color + '06'} stroke={item.color + '30'} strokeWidth={0.5} />
          <text x={35} y={18 + i * h + (h - 3) / 2 + 3} fontSize={8.5} fontWeight={600} fill={item.color}>
            {r.label}
          </text>
          <text x={180} y={18 + i * h + (h - 3) / 2 + 3} fontSize={8} fill="var(--muted-foreground)">
            {r.value}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

export default function SimpleStepViz({ steps, visuals }: {
  steps: StepDef[];
  visuals: SimpleStepItem[];
}) {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <SimpleStep item={visuals[step]} />
        </svg>
      )}
    </StepViz>
  );
}
