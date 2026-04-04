import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ParsingData';
import { StepSingleExtract, StepMultiField } from './ParsingSteps';
import { StepListParse, StepErrorRetry } from './ParsingSteps2';

const W = 460, H = 220;

export default function ParsingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StepSingleExtract />}
          {step === 1 && <StepMultiField />}
          {step === 2 && <StepListParse />}
          {step === 3 && <StepErrorRetry />}
        </svg>
      )}
    </StepViz>
  );
}
