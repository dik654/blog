import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './PairingVizData';
import { PairingOverviewStep, MillerLoopStep } from './PairingVizSteps';
import { LineFunctionStep, FinalExpStep } from './PairingVizSteps2';
import { BilinearityStep } from './PairingVizSteps3';

const RENDERERS = [PairingOverviewStep, MillerLoopStep, LineFunctionStep, FinalExpStep, BilinearityStep];

export default function PairingViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
