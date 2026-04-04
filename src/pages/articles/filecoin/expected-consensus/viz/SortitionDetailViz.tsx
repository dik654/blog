import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './SortitionVizData';
import { StepBeacon, StepVRF } from './SortitionSteps';
import { StepPoisson, StepVerify } from './SortitionSteps2';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../codeRefs';

const R = [StepBeacon, StepVRF, StepPoisson, StepVerify];

interface Props {
  onOpenCode?: (key: string, ref: CodeRef) => void;
}

export default function SortitionDetailViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step], codeRefs[STEP_REFS[step]])} />
                <span className="text-[10px] text-muted-foreground">filecoin.go — winnerCheck</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
