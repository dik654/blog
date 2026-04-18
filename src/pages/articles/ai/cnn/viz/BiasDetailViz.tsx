import StepViz from '@/components/ui/step-viz';
import { STEPS } from './BiasDetailVizData';
import { ReceptiveField, DilatedAndDepthwise } from './BiasDetailSteps';

export default function BiasDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && <ReceptiveField />}
          {step === 1 && <DilatedAndDepthwise />}
        </svg>
      )}
    </StepViz>
  );
}
