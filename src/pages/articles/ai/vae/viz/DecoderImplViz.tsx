import StepViz from '@/components/ui/step-viz';
import DecoderImplSteps from './DecoderImplSteps';
import { STEPS } from './DecoderImplVizData';

export default function DecoderImplViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <DecoderImplSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
