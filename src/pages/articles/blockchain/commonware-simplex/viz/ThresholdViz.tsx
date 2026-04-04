import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { ElectorTraitStep, RoundRobinStep, RandomStep } from './ThresholdSteps';

const STEPS = [
  { label: 'Elector trait — Config::build() → Elector', body: 'Config가 participants로 Elector 생성. elect(round, certificate) → Leader. 모든 정직 참여자가 동일 결과 필수.' },
  { label: 'RoundRobin — view mod n 순환', body: 'modulo(round.view(), n_participants). certificate 무시. 완전 결정적, O(1). seed shuffle 옵션.' },
  { label: 'Random — BLS VRF 리더 선출', body: 'View 1: round-robin fallback (cert 없음). 이후: SHA256(certificate) → modulo. 편향 불가.' },
];

const STEP_REFS: Record<number, string> = { 0: 'elector-trait', 1: 'round-robin', 2: 'random-elector' };
const STEP_LABELS: Record<number, string> = {
  0: 'elector.rs — trait Config + Elector', 1: 'elector.rs — RoundRobinElector',
  2: 'elector.rs — RandomElector',
};

const RENDERERS = [ElectorTraitStep, RoundRobinStep, RandomStep];

export default function ThresholdViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <Renderer />
            </svg>
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
