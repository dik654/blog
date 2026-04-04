import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BasicTagsData';
import { WithoutTag, WithTag } from './BasicTagsSteps';

const W = 460, H = 230;

export default function BasicTagsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <WithoutTag step={step} />
          <text x={W / 2} y={70} textAnchor="middle" fontSize={14}
            fill="var(--muted-foreground)">→</text>
          <WithTag step={step} />
        </svg>
      )}
    </StepViz>
  );
}
