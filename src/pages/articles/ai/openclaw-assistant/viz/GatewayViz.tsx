import StepViz from '../../../../../components/ui/step-viz';
import { STEPS } from './GatewayVizData';
import { Step0, Step1 } from './GatewaySteps';
import { Step2, Step3 } from './GatewaySteps2';

export default function GatewayViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </svg>
      )}
    </StepViz>
  );
}
