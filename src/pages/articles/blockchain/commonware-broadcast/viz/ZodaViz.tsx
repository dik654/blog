import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './ZodaVizData';
import { SchemeStep, EncodeStep } from './ZodaVizParts';
import { CheckStep, ShardStep } from './ZodaVizParts2';

interface Props { onOpenCode?: (key: string) => void }

export default function ZodaViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {step === 0 && <SchemeStep />}
            {step === 1 && <EncodeStep />}
            {step === 2 && <CheckStep />}
            {step === 3 && <ShardStep />}
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
