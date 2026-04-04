import StepViz from '@/components/ui/step-viz';
import { STEPS } from './PrefixSetDetailVizData';
import { Step0, Step1, Step2 } from './PrefixSetDetailSteps';
import { Step3, Step4 } from './PrefixSetDetailSteps2';

const R = [Step0, Step1, Step2, Step3, Step4];

export default function PrefixSetDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
