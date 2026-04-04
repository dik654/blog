import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './G1OpsVizData';
import { DoubleStep, AddStep } from './G1OpsVizSteps';
import { ScalarMulStep, ToAffineStep } from './G1OpsVizSteps2';

const RENDERERS = [DoubleStep, AddStep, ScalarMulStep, ToAffineStep];

export default function G1OpsViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const R = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 440 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <R />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
