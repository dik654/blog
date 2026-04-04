import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { ActorsStep, OnStartStep, EventsStep, OnEndStep } from './EngineLoopSteps';

const STEPS = [
  { label: 'Engine 3-Actor 아키텍처', body: 'Voter(합의 로직) + Batcher(투표 수집·배치 검증) + Resolver(인증서 fetch). 각 actor가 독립 task로 실행.' },
  { label: 'select_loop! on_start', body: 'pending 정리 → try_propose() → try_verify() → certify_candidates() 처리. 매 반복 시작마다 실행.' },
  { label: '5종 이벤트 대기', body: 'timeout(sleep_until) | propose_wait | verify_wait | certify_wait | mailbox(Message). 하나라도 도착하면 처리.' },
  { label: 'on_end: notify + prune', body: 'notify()로 투표/인증서 브로드캐스트 → prune_views() → batcher.update(new_view, leader).' },
];

const STEP_REFS: Record<number, string> = {
  0: 'engine-struct', 1: 'engine-run', 2: 'engine-run', 3: 'engine-run',
};
const STEP_LABELS: Record<number, string> = {
  0: 'engine.rs — Engine 구조체', 1: 'actor.rs — on_start',
  2: 'actor.rs — select_loop! 이벤트', 3: 'actor.rs — on_end',
};

const RENDERERS = [ActorsStep, OnStartStep, EventsStep, OnEndStep];

export default function EngineLoopViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Renderer = RENDERERS[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
