import StepViz from '@/components/ui/step-viz';
import { STEPS } from './ContextVizData';
import { StepWhat, StepWindow } from './ContextVizSteps';
import { StepWinning, StepFault } from './ContextVizSteps2';
import { CodeViewButton } from '@/components/code';

const R = [StepWhat, StepWindow, StepWinning, StepFault];
const REF_KEYS = ['post-main', 'post-main', 'post-main', 'post-main'];
const REF_LABELS = ['PoSt 개요', 'WindowPoSt', 'WinningPoSt', 'Fault 처리'];

export default function ContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 115" className="w-full max-w-2xl"
              style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">
                  {REF_LABELS[step]}
                </span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
