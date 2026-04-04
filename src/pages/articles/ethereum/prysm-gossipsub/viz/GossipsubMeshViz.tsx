import StepViz from '@/components/ui/step-viz';
import { STEPS } from './GossipsubMeshVizData';
import { Step0, Step1, Step2, Step3 } from './GossipsubMeshSteps';
import { Step4, Step5 } from './GossipsubMeshSteps2';

const R = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function GossipsubMeshViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 115" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
