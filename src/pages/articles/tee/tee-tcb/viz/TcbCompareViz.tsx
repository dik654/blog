import StepViz from '@/components/ui/step-viz';
import { STEPS } from './TcbCompareVizData';
import { StepSGX, StepTDX, StepSEV, StepTZ } from './TcbCompareVizParts';

export default function TcbCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StepSGX />}
          {step === 1 && <StepTDX />}
          {step === 2 && <StepSEV />}
          {step === 3 && <StepTZ />}
        </svg>
      )}
    </StepViz>
  );
}
