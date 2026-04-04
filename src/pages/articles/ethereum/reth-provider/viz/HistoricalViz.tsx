import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './HistoricalVizData';
import { StepChangeSetIntro } from './HistoricalVizSteps';
import { StepReverseTrace } from './HistoricalVizSteps2';
import { StepTableStructure } from './HistoricalVizSteps3';

const VIEWS: [React.FC, string][] = [
  [StepChangeSetIntro, '0 0 480 170'],
  [StepReverseTrace, '0 0 480 145'],
  [StepTableStructure, '0 0 480 170'],
];

export default function HistoricalViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const [S, vb] = VIEWS[step];
        return (
          <div className="w-full">
            <svg viewBox={vb} className="w-full max-w-2xl"
              style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_REFS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">
                  {STEPS[step].label}
                </span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
