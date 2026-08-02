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
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: visual.titleColor }}>
        <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: visual.pointColor }} aria-hidden="true" />
        {visual.title}
      </div>
      <dl className="divide-y divide-border border-y border-border/70">
        {visual.points.map((point, index) => (
          <motion.div key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="grid min-w-0 gap-1 py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm font-semibold" style={{ color: visual.pointColor }}>{point.label}</dt>
            <dd className="min-w-0 break-words text-sm leading-relaxed text-muted-foreground">{point.desc}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
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
        <AutoStep visual={visuals[step]} />
      )}
    </StepViz>
  );
}
