import StepViz from '@/components/ui/step-viz';
import { STEPS, METRICS } from './EvaluationData';
import { JudgeStep, RuleStep } from './EvaluationSteps';
import { GoldenStep, MetricsStep } from './EvaluationSteps2';

const W = 440, H = 220;

export default function EvaluationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <JudgeStep />}
          {step === 1 && <RuleStep />}
          {step === 2 && <GoldenStep />}
          {step === 3 && <MetricsStep metrics={METRICS} />}
          <defs>
            <marker id="evArrow" markerWidth="6" markerHeight="6"
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
