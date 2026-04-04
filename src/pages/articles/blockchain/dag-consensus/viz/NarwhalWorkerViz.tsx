import StepViz from '@/components/ui/step-viz';
import { WORKER_STEPS } from './NarwhalDetailData';
import { PrimaryStep, WorkerStep, EthCompareStep } from './NarwhalWorkerSteps';

const RENDERERS = [PrimaryStep, WorkerStep, EthCompareStep];

export default function NarwhalWorkerViz() {
  return (
    <StepViz steps={WORKER_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return <Renderer />;
      }}
    </StepViz>
  );
}
