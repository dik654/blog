import StepViz from '@/components/ui/step-viz';
import { STEPS } from '../LogicGateVizData';
import { GateStep } from './LogicGateVizParts';

export default function LogicGateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 530 320" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <GateStep step={step} />
        </svg>
      )}
    </StepViz>
  );
}
// hmr-force
