import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SigmoidData';
import { CurvePair, VanishingBars, ZigzagPath } from './SigmoidVizParts';

export default function SigmoidViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 150" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <CurvePair ox={220} />}
          {step === 1 && <VanishingBars />}
          {step === 2 && <ZigzagPath />}
        </svg>
      )}
    </StepViz>
  );
}
