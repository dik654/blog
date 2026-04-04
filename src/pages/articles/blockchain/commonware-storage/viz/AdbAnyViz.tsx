import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, STEP_REFS, STEP_LABELS } from './AdbAnyVizData';
import { LogBar, SnapshotBox, GetFlow, PutFlow, ProofFlow, PruneFlow } from './AdbAnyVizParts';

interface Props { onOpenCode?: (key: string) => void }

export default function AdbAnyViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 460 130" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <LogBar step={step} />
            <SnapshotBox step={step} />
            {step === 1 && <GetFlow />}
            {step === 2 && <PutFlow />}
            {step === 3 && <ProofFlow />}
            {step === 4 && <PruneFlow />}
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
