import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { ProposeStep, NotarizeStep, NotarizationStep, CertifyStep, FinalizeStep } from './VotingFlowSteps';

const STEPS = [
  { label: 'try_propose() — 리더가 블록 제안', body: 'find_parent(view) → should_propose() → automaton.propose() → Proposal 구성' },
  { label: 'construct_notarize() — 서명 투표 생성', body: 'round.construct_notarize() → Notarize::sign(scheme, proposal) → Vote::Notarize 브로드캐스트' },
  { label: 'broadcast_notarization() — 2f+1 인증서', body: '쿼럼 도달 → scheme.assemble::<N3f1>() → Notarization 조립 → 전체 브로드캐스트' },
  { label: 'certified() + construct_finalize()', body: 'automaton.certify() 성공 → enter_view(next) → Finalize::sign → Vote::Finalize 브로드캐스트' },
  { label: 'add_finalization() — 확정 + 즉시 다음 뷰', body: 'last_finalized 갱신 → 이하 뷰 정리 → enter_view(next) → set_leader → 새 리더 즉시 propose' },
];

const STEP_REFS: Record<number, string> = {
  0: 'try-propose', 1: 'construct-notarize', 2: 'broadcast-notarization',
  3: 'certified', 4: 'add-finalization',
};
const STEP_LABELS: Record<number, string> = {
  0: 'state.rs — try_propose()', 1: 'state.rs — construct_notarize()',
  2: 'actor.rs — try_broadcast_notarization()', 3: 'state.rs — certified()',
  4: 'state.rs — add_finalization()',
};

const RENDERERS = [ProposeStep, NotarizeStep, NotarizationStep, CertifyStep, FinalizeStep];

export default function VotingFlowViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
