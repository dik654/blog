import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ForwardFlowVizData';
import { ForwardStep0, ForwardStep1, ForwardStep2 } from './ForwardFlowSteps';

export default function ForwardFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 300 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ForwardStep0 />}
          {step === 1 && <ForwardStep1 />}
          {step === 2 && <ForwardStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
