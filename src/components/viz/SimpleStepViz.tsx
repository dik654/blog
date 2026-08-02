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
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: item.color }}>
        <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
        {item.title}
      </div>
      <dl className="divide-y divide-border border-y border-border/70">
        {item.rows.map((row, index) => (
          <motion.div key={index} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="grid min-w-0 gap-1 py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm font-semibold" style={{ color: item.color }}>{row.label}</dt>
            <dd className="min-w-0 break-words text-sm leading-relaxed text-muted-foreground">{row.value}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}

export default function SimpleStepViz({ steps, visuals }: {
  steps: StepDef[];
  visuals: SimpleStepItem[];
}) {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <SimpleStep item={visuals[step]} />
      )}
    </StepViz>
  );
}
