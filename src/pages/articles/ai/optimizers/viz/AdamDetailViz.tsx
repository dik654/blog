import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AdamDetailVizData';
import { StepFormulas, StepAdaptive, StepComponents, StepVariants } from './AdamDetailSteps';

const RENDERERS = [StepFormulas, StepAdaptive, StepComponents, StepVariants];

export default function AdamDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = RENDERERS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Comp />
          </svg>
        );
      }}
    </StepViz>
  );
}
