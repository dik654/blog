import StepViz from '@/components/ui/step-viz';
import { STEPS } from './StateTreeVizData';
import { StepStruct, StepGet, StepFlush, StepSnap } from './StateTreeVizSteps';
import { CodeViewButton } from '@/components/code';

const R = [StepStruct, StepGet, StepFlush, StepSnap];
const REF_KEYS = ['state-tree', 'state-tree', 'state-tree', 'state-tree'];
const REF_LABELS = ['StateTree 구조체', 'GetActor()', 'Flush()', '스냅샷'];

export default function StateTreeViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
