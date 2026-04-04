import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './AdbCurrentVizData';
import { StructureStep, GraftingStep, ProofStep, RootStep } from './AdbCurrentVizParts';

interface Props { onOpenCode?: (key: string) => void }

export default function AdbCurrentViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 460 140" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {step === 0 && <StructureStep />}
            {step === 1 && <GraftingStep />}
            {step === 2 && <ProofStep />}
            {step === 3 && <RootStep />}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
