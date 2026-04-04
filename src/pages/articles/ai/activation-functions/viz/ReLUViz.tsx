import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ReLUData';
import { ReLUGraph, GradientCompare, DyingReLU } from './ReLUVizParts';

export default function ReLUViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 155" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ReLUGraph />}
          {step === 1 && <GradientCompare />}
          {step === 2 && <DyingReLU />}
        </svg>
      )}
    </StepViz>
  );
}
