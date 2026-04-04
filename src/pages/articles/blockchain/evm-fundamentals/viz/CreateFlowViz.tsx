import StepViz from '@/components/ui/step-viz';
import { CREATE_STEPS } from './CreateFlowVizData';
import { AddressGenStep, InitCodeStep, CodeLimitStep, CreateErrorStep } from './CreateFlowVizSteps';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [AddressGenStep, InitCodeStep, CodeLimitStep, CreateErrorStep];
const STEP_REFS = ['evm-create', 'evm-create', 'evm-create', 'evm-create'];
const STEP_LABELS = ['evm.go — Create() 주소 생성', 'evm.go — Create() init code', 'evm.go — Create() 크기 제한', 'evm.go — Create() 에러'];

export default function CreateFlowViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={CREATE_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <Renderer />
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
