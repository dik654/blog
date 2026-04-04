import StepViz from '@/components/ui/step-viz';
import { Step0, Step1, Step2, Step3 } from './SendersDetailSteps';
import { STEPS } from './SendersDetailVizData';

const R = [Step0, Step1, Step2, Step3];

export default function SendersDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
