import StepViz from '@/components/ui/step-viz';
import { KL_DETAIL_STEPS } from './KLDetailVizData';
import {
  StepDefinition,
  StepAsymmetry,
  StepJSD,
  StepMLApps,
  StepPyTorch,
} from './KLDetailSteps';

const STEP_COMPONENTS = [StepDefinition, StepAsymmetry, StepJSD, StepMLApps, StepPyTorch];

export default function KLDetailViz() {
  return (
    <StepViz steps={KL_DETAIL_STEPS}>
      {(step) => {
        const Comp = STEP_COMPONENTS[step];
        return (
          <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Comp />
          </svg>
        );
      }}
    </StepViz>
  );
}
