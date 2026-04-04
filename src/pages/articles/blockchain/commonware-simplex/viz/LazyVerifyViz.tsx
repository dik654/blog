import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { EagerStep, LazyStep, SafetyStep } from './LazyVerifySteps';

const STEPS = [
  { label: '기존 방식: 즉시 검증', body: '메시지 수신 → 즉시 서명 검증 → 유효하면 저장 → 쿼럼 확인. 모든 메시지에 CPU 소모.' },
  { label: 'Batcher: 쿼럼까지 저장만', body: 'vote_network 수신 → VoteTracker에 저장(검증 없이) → 쿼럼 도달 → batch_verify 1회. CPU 절감.' },
  { label: '안전성: is_batchable + fallback', body: 'Scheme::is_batchable() true인 스킴만 적용. 배치 실패 시 개별 검증 폴백. 비잔틴 투표는 쿼럼 미달로 무시.' },
];

const STEP_REFS: Record<number, string> = { 0: 'vote-tracker', 1: 'vote-tracker', 2: 'vote-tracker' };
const STEP_LABELS: Record<number, string> = {
  0: 'types.rs — VoteTracker', 1: 'batcher — batch_verify',
  2: 'scheme — is_batchable()',
};

const RENDERERS = [EagerStep, LazyStep, SafetyStep];

export default function LazyVerifyViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
