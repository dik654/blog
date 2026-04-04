import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepDuties, StepKeySecurity, StepDoubleSign, StepSeparation, StepSlashDB } from './ContextVizSteps';

const R = [StepDuties, StepKeySecurity, StepDoubleSign, StepSeparation, StepSlashDB];

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
