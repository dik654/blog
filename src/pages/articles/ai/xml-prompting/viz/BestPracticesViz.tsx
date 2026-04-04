import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BestPracticesData';
import { StepNaming, StepClosingTag } from './BestPracticesSteps';
import { StepDepth, StepTemplate } from './BestPracticesSteps2';

const W = 460, H = 230;

export default function BestPracticesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StepNaming />}
          {step === 1 && <StepClosingTag />}
          {step === 2 && <StepDepth />}
          {step === 3 && <StepTemplate />}
        </svg>
      )}
    </StepViz>
  );
}
