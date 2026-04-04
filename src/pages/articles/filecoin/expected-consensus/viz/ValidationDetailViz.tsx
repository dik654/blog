import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS } from './ValidationVizData';
import { StepSync, StepAsync } from './ValidationSteps';
import { StepMinerWinner, StepSigBeaconTkt, StepWinPost } from './ValidationSteps2';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../codeRefs';

const R = [StepSync, StepAsync, StepMinerWinner, StepSigBeaconTkt, StepWinPost];
const LABELS = [
  'filecoin.go — ValidateBlock 전처리',
  'filecoin.go — async.Err 병렬 검증',
  'filecoin.go — winnerCheck',
  'filecoin.go — sig/beacon/ticket',
  'filecoin.go — WinningPoSt',
];

interface Props {
  onOpenCode?: (key: string, ref: CodeRef) => void;
}

export default function ValidationDetailViz({ onOpenCode }: Props) {
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
