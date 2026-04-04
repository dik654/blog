import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { Step0, Step1, Step2, Step3, Step4 } from './ContextVizSteps';

const R = [Step0, Step1, Step2, Step3, Step4];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
