import StepViz from '@/components/ui/step-viz';
import { STEPS } from './CosineVizData';
import {
  CosineStep0, CosineStep1, CosineStep2,
} from './CosineSteps';

export default function CosineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 185" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <CosineStep0 />}
          {step === 1 && <CosineStep1 />}
          {step === 2 && <CosineStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
