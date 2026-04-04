import StepViz from '@/components/ui/step-viz';
import { STEPS } from './TanhData';
import { CurveCompare, StraightPath } from './TanhVizParts';

export default function TanhViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 150" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <CurveCompare />}
          {step === 1 && <StraightPath />}
        </svg>
      )}
    </StepViz>
  );
}
