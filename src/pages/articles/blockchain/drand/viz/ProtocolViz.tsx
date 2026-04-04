import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ProtocolVizData';
import { StepDKG, StepAggregate, StepOutput } from './ProtocolVizSteps';

const R = [StepDKG, StepAggregate, StepOutput];

export default function ProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
