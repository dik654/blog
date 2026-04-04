import StepViz from '@/components/ui/step-viz';
import { MSG_STEPS, MSG_REFS, MSG_LABELS } from './CoreTypesVizData';
import { ProposalStep, VoteTypesStep, CertificateStep, TraitSeparationStep } from './MessageTypesVizSteps';
import { CodeViewButton } from '@/components/code';

const RENDERERS = [ProposalStep, VoteTypesStep, CertificateStep, TraitSeparationStep];

export default function MessageTypesViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={MSG_STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <Renderer />
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(MSG_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{MSG_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
