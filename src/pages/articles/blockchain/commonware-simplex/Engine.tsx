import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import EngineLoopViz from './viz/EngineLoopViz';

export default function Engine({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="engine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine 실행 루프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Engine 구조체 — 3개 actor(Voter, Batcher, Resolver)를 조립하고 <code>run()</code>으로 실행
          <br />
          Voter: 합의 로직(state + automaton). Batcher: 투표 수집·배치 서명 검증. Resolver: 인증서 fetch·동기화
        </p>
        <p className="leading-7">
          Voter의 <code>select_loop!</code> — CometBFT의 <code>receiveRoutine()</code>에 대응
          <br />
          <strong>on_start:</strong> pending 정리 → try_propose → try_verify → certify_candidates
          <br />
          <strong>5종 이벤트:</strong> timeout | propose_wait | verify_wait | certify_wait | mailbox
          <br />
          <strong>on_end:</strong> notify(투표/인증서 브로드캐스트) → prune_views → batcher.update
        </p>
        <p className="leading-7">
          <strong>구현 인사이트:</strong> on_start/on_end 분리로 "매 반복 시작 시 상태 정리 + 끝에서 일괄 전송" 패턴
          <br />
          CometBFT는 메시지 수신 즉시 처리하지만, Simplex는 이벤트 처리 후 on_end에서 모아 보냄
          <br />
          → 하나의 이벤트가 여러 상태 변경을 유발해도 notify() 한 번으로 해결
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('engine-struct')} />
        <span className="text-[10px] text-muted-foreground self-center">Engine 3-actor 조립</span>
        <CodeViewButton onClick={() => open('engine-run')} />
        <span className="text-[10px] text-muted-foreground self-center">select_loop! 메인 루프</span>
      </div>
      <div className="not-prose mb-8">
        <EngineLoopViz onOpenCode={open} />
      </div>
    </section>
  );
}
