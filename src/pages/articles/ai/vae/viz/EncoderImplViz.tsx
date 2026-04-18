import StepViz from '@/components/ui/step-viz';
import EncoderImplSteps from './EncoderImplSteps';
import { STEPS } from './EncoderImplVizData';

export default function EncoderImplViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <EncoderImplSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
