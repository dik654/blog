import StepViz from '@/components/ui/step-viz';
import { STEPS } from './AdvancedTagsData';
import { StepThinking, StepRulesConstraints } from './AdvancedSteps';
import { StepNested, StepInjection } from './AdvancedSteps2';

const W = 460, H = 220;

export default function AdvancedTagsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StepThinking />}
          {step === 1 && <StepRulesConstraints />}
          {step === 2 && <StepNested />}
          {step === 3 && <StepInjection />}
        </svg>
      )}
    </StepViz>
  );
}
