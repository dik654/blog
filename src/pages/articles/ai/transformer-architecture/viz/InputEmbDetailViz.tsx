import StepViz from '@/components/ui/step-viz';
import { STEPS } from './InputEmbDetailVizData';
import InputEmbDetailSteps from './InputEmbDetailSteps';

export default function InputEmbDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <InputEmbDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
