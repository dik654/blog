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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Engine 액터 모델</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Simplex Engine Architecture (3-Actor Model)
//
// struct Engine<D, A, R, P> {
//     voter: Voter<D, A>,      // consensus logic
//     batcher: Batcher,         // vote aggregation
//     resolver: Resolver<P>,    // sync and certificate fetch
// }
//
// Three actors run concurrently:
//   Each has own async task
//   Communicate via channels (mailboxes)
//   Can be shut down independently

// Voter actor:
//   Main consensus logic
//   Holds current State
//   Processes views, timeouts
//   Emits votes and certificates
//
//   Inner loop (select_loop!):
//     timer event      → timeout handling
//     propose_wait     → leader proposes
//     verify_wait      → application verify done
//     certify_wait     → cert aggregation done
//     mailbox request  → external commands
//
//   State modifications happen here

// Batcher actor:
//   Collects individual votes
//   Batch-verifies signatures (amortize cost)
//   Emits aggregated certificates
//
//   Optimization:
//     10 validators vote → 10 signatures
//     Naive: verify each = 10 ops
//     Batch: verify all at once = 1-2 ops amortized
//   Saves CPU on signature verification

// Resolver actor:
//   Handles sync (catching up after downtime)
//   Fetches missing certificates from peers
//   Validates certificate chains
//
//   Use case:
//     Node rejoins after being offline
//     Needs to catch up to current view
//     Resolver fetches cert(v) for all missed views

// Engine.run() pattern:
//
//   pub async fn run(mut self) -> Result<(), Error> {
//       let voter_handle = spawn(self.voter.run());
//       let batcher_handle = spawn(self.batcher.run());
//       let resolver_handle = spawn(self.resolver.run());
//
//       let (a, b, c) = join!(voter_handle, batcher_handle, resolver_handle);
//       a?; b?; c?;
//       Ok(())
//   }

// Voter select_loop! pattern:
//
//   loop {
//       self.on_start().await;  // pre-event housekeeping
//
//       select! {
//           Some(_) = self.timeout.tick() => {
//               self.handle_timeout().await;
//           }
//           Some(proposal) = self.propose_wait.recv() => {
//               self.handle_propose(proposal).await;
//           }
//           Some(result) = self.verify_wait.recv() => {
//               self.handle_verify(result).await;
//           }
//           Some(cert) = self.certify_wait.recv() => {
//               self.handle_certificate(cert).await;
//           }
//           Some(req) = self.mailbox.recv() => {
//               self.handle_request(req).await;
//           }
//           else => break,
//       }
//
//       self.on_end().await;  // post-event: notify, prune, update
//   }

// on_start tasks:
//   - Clean up pending operations
//   - Attempt leader proposal (try_propose)
//   - Trigger payload verification (try_verify)
//   - Certify candidates with enough votes

// on_end tasks:
//   - Broadcast new votes/certificates
//   - Prune old views (memory management)
//   - Update batcher with new state
//   - Update resolver with new tips

// Benefits of this design:
//
//   1. Separation of concerns:
//      Voter focuses on logic, not network/signing
//   2. Parallelism:
//      Batch verification runs in parallel with consensus
//   3. Backpressure:
//      Mailboxes bound queue size
//   4. Fault isolation:
//      Batcher crash doesn't kill Voter

// Comparison with CometBFT:
//
//   CometBFT receiveRoutine:
//     Single actor handles all message types
//     Signature verified on receive (eager)
//     No batching
//     Simpler but less scalable
//
//   Commonware Simplex:
//     Split into Voter + Batcher + Resolver
//     Lazy signature verification (on quorum)
//     Better CPU utilization
//     More complex but faster

// Testing:
//   - Deterministic test runtime
//   - Can control clock, network delays
//   - Scenario replay for debugging
//   - Fuzz testing actor interactions`}
        </pre>
      </div>
    </section>
  );
}
