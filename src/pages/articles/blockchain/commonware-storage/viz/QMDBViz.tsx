import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './QMDBVizData';
import { StructureStep, BatchStep, FlatKVStep, CompareStep } from './QMDBVizParts';

interface Props { onOpenCode?: (key: string) => void }

export default function QMDBViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 460 130" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {step === 0 && <StructureStep />}
            {step === 1 && <BatchStep />}
            {step === 2 && <FlatKVStep />}
            {step === 3 && <CompareStep />}
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
