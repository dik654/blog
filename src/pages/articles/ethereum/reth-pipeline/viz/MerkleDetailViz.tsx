import StepViz from '@/components/ui/step-viz';
import { Step0, Step1, Step2 } from './MerkleDetailSteps';
import { Step3, Step4 } from './MerkleDetailSteps2';
import { STEPS } from './MerkleDetailVizData';

const R = [Step0, Step1, Step2, Step3, Step4];

export default function MerkleDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
