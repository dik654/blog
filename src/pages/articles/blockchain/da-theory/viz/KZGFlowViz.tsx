import StepViz from '@/components/ui/step-viz';
import { STEPS } from './KZGFlowVizData';
import { KZGStep0, KZGStep1 } from './KZGFlowVizParts';
import { KZGStep2, KZGStep3 } from './KZGFlowVizParts2';

export default function KZGFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <KZGStep0 />}
          {step === 1 && <KZGStep1 />}
          {step === 2 && <KZGStep2 />}
          {step === 3 && <KZGStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
