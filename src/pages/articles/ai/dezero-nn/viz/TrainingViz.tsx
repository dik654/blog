import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './TrainingVizData';
import { MSEStep, SoftmaxCEStep } from './TrainingVizSteps';
import { LogSumExpStep, TrainLoopStep } from './TrainingVizSteps2';

const RENDERERS = [MSEStep, SoftmaxCEStep, LogSumExpStep, TrainLoopStep];

export default function TrainingViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <Renderer />
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
