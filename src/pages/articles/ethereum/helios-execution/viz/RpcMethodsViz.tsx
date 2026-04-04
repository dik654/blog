import StepViz from '@/components/ui/step-viz';
import { STEPS } from './RpcMethodsVizData';
import { Step0, Step1, Step2 } from './RpcMethodsVizSteps';

const R = [Step0, Step1, Step2];

export default function RpcMethodsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
