import StepViz from '@/components/ui/step-viz';
import { STEPS } from './HamtDetailVizData';
import { Step0, Step1, Step2, Step3 } from './HamtDetailVizSteps';
import { CodeViewButton } from '@/components/code';

const R = [Step0, Step1, Step2, Step3];
const REF_KEYS = ['hamt-find', 'hamt-find', 'hamt-find', 'state-tree'];
const REF_LABELS = ['Node 구조', 'Find() 탐색', 'AMT 접근', 'Flush()'];

export default function HamtDetailViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl"
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
