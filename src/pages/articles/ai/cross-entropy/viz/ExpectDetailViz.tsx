import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ExpectDetailVizData';
import {
  StepDefinition,
  StepSquare,
  StepProperties,
  StepJensen,
  StepML,
} from './ExpectDetailSteps';

const STEP_COMPONENTS = [StepDefinition, StepSquare, StepProperties, StepJensen, StepML];

export default function ExpectDetailViz() {
  return (
    <StepViz steps={STEPS}>
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
