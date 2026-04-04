import StepViz from '@/components/ui/step-viz';
import { STATE_STEPS, STATE_REFS, STATE_LABELS } from './CoreTypesVizData';
import { StateStep, RoundStep, EnterViewStep } from './StateRoundVizSteps';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [StateStep, RoundStep, EnterViewStep];

export default function StateRoundViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STATE_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <Renderer />
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STATE_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STATE_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
