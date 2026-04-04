import StepViz from '@/components/ui/step-viz';
import { STEPS } from './SyncLoopVizData';
import { Step0, Step1 } from './SyncLoopVizSteps';
import { Step2, Step3 } from './SyncLoopVizSteps2';

export default function SyncLoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </svg>
      )}
    </StepViz>
  );
}
