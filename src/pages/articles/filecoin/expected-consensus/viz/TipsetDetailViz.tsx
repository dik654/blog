import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './TipsetVizData';
import { StepTipsetIntro, StepValidity } from './TipsetSteps';
import { StepHeaviest, StepECvsF3 } from './TipsetSteps2';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../codeRefs';

const R = [StepTipsetIntro, StepValidity, StepHeaviest, StepECvsF3];
const LABELS = ['Tipset 구조', 'Tipset 유효성', 'weight.go', 'EC vs F3'];

interface Props {
  onOpenCode?: (key: string, ref: CodeRef) => void;
}

export default function TipsetDetailViz({ onOpenCode }: Props) {
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
                <span className="text-[10px] text-muted-foreground">{LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
