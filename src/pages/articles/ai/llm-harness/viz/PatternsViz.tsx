import StepViz from '@/components/ui/step-viz';
import { STEPS, ROUTE_TARGETS } from './PatternsData';
import { RoutingStep, GuardrailStep } from './PatternsSteps';
import { FallbackStep, HumanLoopStep } from './PatternsSteps2';

const W = 460, H = 210;

export default function PatternsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <RoutingStep targets={ROUTE_TARGETS} />}
          {step === 1 && <GuardrailStep />}
          {step === 2 && <FallbackStep />}
          {step === 3 && <HumanLoopStep />}
          <defs>
            <marker id="ptArrow" markerWidth="6" markerHeight="6"
              refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none"
                stroke="var(--muted-foreground)" strokeWidth={1} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
