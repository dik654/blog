import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './OrderedVizData';
import { TypesStep, EngineStep } from './OrderedVizParts';
import { AckStep, TipStep } from './OrderedVizParts2';

interface Props { onOpenCode?: (key: string) => void }

export default function OrderedViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {step === 0 && <TypesStep />}
            {step === 1 && <EngineStep />}
            {step === 2 && <AckStep />}
            {step === 3 && <TipStep />}
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
