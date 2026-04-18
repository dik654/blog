import StepViz from '@/components/ui/step-viz';
import { STEPS } from './QKVRoleDetailVizData';
import QKVRoleDetailSteps from './QKVRoleDetailSteps';

export default function QKVRoleDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <QKVRoleDetailSteps step={step} />
        </svg>
      )}
    </StepViz>
  );
}
