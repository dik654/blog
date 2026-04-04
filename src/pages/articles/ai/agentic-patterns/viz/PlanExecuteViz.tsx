import StepViz from '@/components/ui/step-viz';
import { STEPS } from './PlanExecuteData';
import { PlanView, ReflectionView } from './PlanExecuteParts';
import TreeView from './PlanExecuteTree';

const W = 460, H = 230;

export default function PlanExecuteViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {(step === 0 || step === 1) && <PlanView step={step} />}
          {(step === 2 || step === 3) && <ReflectionView step={step} />}
          {step === 4 && <TreeView />}
        </svg>
      )}
    </StepViz>
  );
}
