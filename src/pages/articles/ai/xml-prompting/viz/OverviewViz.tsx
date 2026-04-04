import StepViz from '@/components/ui/step-viz';
import { STEPS } from './OverviewData';
import { StepUnstructured, StepStructured } from './OverviewSteps';
import { StepComparison, StepLLMRecognition } from './OverviewSteps2';

const W = 460, H = 220;
const CX = W / 2;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StepUnstructured />}
          {step === 1 && <StepStructured cx={CX} />}
          {step === 2 && <StepComparison />}
          {step === 3 && <StepLLMRecognition cx={CX} />}
        </svg>
      )}
    </StepViz>
  );
}
