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

      {/* Engine Actor Model structured cards */}
      <div className="not-prose mt-6">
        <h3 className="text-xl font-semibold mb-3">Engine 액터 모델</h3>

        {/* Engine struct overview */}
        <div className="rounded-lg border border-border bg-card p-5 mb-4">
          <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Engine&lt;D, A, R, P&gt;</code> — 3-Actor 구조</h4>
          <p className="text-xs text-muted-foreground">
            <code className="text-xs">voter: Voter&lt;D, A&gt;</code> (합의 로직) · <code className="text-xs">batcher: Batcher</code> (투표 집계) · <code className="text-xs">resolver: Resolver&lt;P&gt;</code> (동기화·인증서 fetch).
            세 actor가 동시 실행 — 각자 async task · 채널(mailbox)로 통신 · 독립 종료 가능.
          </p>
        </div>

        {/* Three actors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Voter</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>메인 합의 로직, 현재 State 보유</li>
              <li>view·타임아웃 처리, 투표·인증서 생성</li>
              <li>상태 변경은 여기서만 발생</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>내부 루프</strong> (<code className="text-xs">select_loop!</code>): timer → timeout 처리 · propose_wait → 리더 제안 · verify_wait → 앱 검증 완료 · certify_wait → 인증서 집계 완료 · mailbox → 외부 명령
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Batcher</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>개별 투표 수집</li>
              <li>서명 배치 검증 (비용 분산)</li>
              <li>집계 인증서 생성</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>최적화:</strong> 검증자 10명 투표 → 개별 검증 10회 vs 배치 검증 1-2회(amortized). 서명 검증 CPU 절약.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Resolver</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>동기화 처리 (다운타임 후 복구)</li>
              <li>피어에서 누락 인증서 fetch</li>
              <li>인증서 체인 검증</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>사용 사례:</strong> 오프라인 후 재합류 → 현재 view까지 복구 필요 → 누락된 모든 view의 cert(v) fetch.
            </p>
          </div>
        </div>

        {/* Engine.run() */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Engine::run()</code> 패턴</h4>
          <p className="text-xs text-muted-foreground">
            <code className="text-xs">spawn(voter.run())</code> · <code className="text-xs">spawn(batcher.run())</code> · <code className="text-xs">spawn(resolver.run())</code> → <code className="text-xs">join!</code>으로 세 핸들 대기 → 하나라도 에러 시 전체 종료
          </p>
        </div>

        {/* on_start / on_end */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">on_start()</code> — 매 반복 시작</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>pending 작업 정리</li>
              <li>리더 제안 시도 (<code className="text-xs">try_propose</code>)</li>
              <li>페이로드 검증 트리거 (<code className="text-xs">try_verify</code>)</li>
              <li>충분한 투표를 가진 후보 인증 (<code className="text-xs">certify_candidates</code>)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">on_end()</code> — 매 반복 종료</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>새 투표/인증서 브로드캐스트 (<code className="text-xs">notify</code>)</li>
              <li>오래된 view 정리 (메모리 관리)</li>
              <li>Batcher에 새 상태 업데이트</li>
              <li>Resolver에 새 팁 업데이트</li>
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">설계의 이점</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="text-xs text-muted-foreground"><strong>관심사 분리:</strong> Voter는 로직에 집중, 네트워크/서명 무관</div>
            <div className="text-xs text-muted-foreground"><strong>병렬성:</strong> 배치 검증이 합의와 병렬 실행</div>
            <div className="text-xs text-muted-foreground"><strong>백프레셔:</strong> mailbox가 큐 크기 제한</div>
            <div className="text-xs text-muted-foreground"><strong>장애 격리:</strong> Batcher 크래시가 Voter를 죽이지 않음</div>
          </div>
        </div>

        {/* CometBFT comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">CometBFT receiveRoutine</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>단일 actor가 모든 메시지 타입 처리</li>
              <li>수신 즉시 서명 검증 (eager)</li>
              <li>배치 처리 없음</li>
              <li>단순하지만 확장성 낮음</li>
            </ul>
          </div>
          <div className="rounded-lg border border-blue-400/40 bg-blue-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">Commonware Simplex</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>Voter + Batcher + Resolver 분리</li>
              <li>지연 서명 검증 (쿼럼 시점)</li>
              <li>높은 CPU 활용도</li>
              <li>더 복잡하지만 더 빠름</li>
            </ul>
          </div>
        </div>

        {/* Testing */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-sm mb-2">테스트</h4>
          <p className="text-xs text-muted-foreground">
            결정적 테스트 런타임 · 클록·네트워크 지연 제어 · 시나리오 리플레이 디버깅 · actor 상호작용 퍼즈 테스트
          </p>
        </div>
      </div>
    </section>
  );
}
