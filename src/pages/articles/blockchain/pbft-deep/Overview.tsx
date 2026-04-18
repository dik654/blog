import M from '@/components/ui/math';
import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT 3단계 프로토콜 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Castro &amp; Liskov (1999) — <strong>최초의 실용적 BFT 프로토콜</strong>.<br />
          Pre-prepare → Prepare → Commit 3단계로 partial sync에서 합의 달성.<br />
          이후 모든 BFT (Tendermint, HotStuff, Jolteon)의 청사진.
        </p>

        {/* ── PBFT 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT 등장 배경</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">이전 BFT (1980-1998)</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Lamport (1982): 이론만, <M>{'O(n^f)'}</M> 메시지</li>
                <li>PSL (1980): Oral messages protocol</li>
                <li>Dolev-Strong (1983): Synchronous 모델</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">문제: 동기 모델 또는 높은 복잡도 → 실무 배포 불가</p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2">PBFT의 혁신 (1999)</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Partial synchronous 모델에서 동작</li>
                <li>Asymmetric cryptography 활용</li>
                <li><M>{'O(n^2)'}</M> 메시지 (기존 <M>{'O(n^f)'}</M> 대비)</li>
                <li>View change 프로토콜 구체화</li>
                <li>Checkpoint & garbage collection</li>
                <li>BFT file system (BFS) 실제 배포</li>
              </ol>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">PBFT 모델 및 영향</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><M>{'n = 3f+1'}</M> nodes, <M>{'f'}</M> Byzantine 감내</li>
                <li>partial synchrony (GST 후 동기)</li>
                <li>authenticated (서명 사용)</li>
                <li>safety 항상, liveness GST 후</li>
              </ul>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Hyperledger Fabric (2016): PBFT orderer</li>
                <li>Tendermint (2014): PBFT 영감</li>
                <li>HotStuff (2018): PBFT → linear</li>
                <li>Libra/Diem (2019): HotStuff 계승</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          PBFT = <strong>BFT의 Paxos</strong> — 실무 배포의 시작.<br />
          이전 BFT는 이론/동기, PBFT는 partial sync + asymmetric crypto로 실용화.<br />
          26년 후에도 모든 현대 BFT의 기반.
        </p>

        {/* ── PBFT 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT 프로토콜 개요</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm mb-2">Phase 1: PRE-PREPARE</p>
              <p className="text-sm">Primary → all replicas</p>
              <p className="text-xs font-mono mt-1">⟨PRE-PREPARE, <code>v</code>, <code>n</code>, <code>d</code>⟩<sub>σp</sub></p>
              <ul className="text-sm space-y-0.5 mt-2 list-disc list-inside">
                <li><code>v</code>: view number</li>
                <li><code>n</code>: sequence number</li>
                <li><code>d</code>: digest of request</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-1">목적: leader가 순서 제안</p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2">Phase 2: PREPARE</p>
              <p className="text-sm">All replicas ↔ all replicas</p>
              <p className="text-xs font-mono mt-1">⟨PREPARE, <code>v</code>, <code>n</code>, <code>d</code>, <code>i</code>⟩<sub>σi</sub></p>
              <ul className="text-sm space-y-0.5 mt-2 list-disc list-inside">
                <li>정족수: <M>{'2f+1'}</M> (자신 포함)</li>
                <li>→ <code>prepared(m, v, n)</code></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-1">목적: 대다수가 같은 순서 동의</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="font-semibold text-sm mb-2">Phase 3: COMMIT</p>
              <p className="text-sm">All replicas ↔ all replicas</p>
              <p className="text-xs font-mono mt-1">⟨COMMIT, <code>v</code>, <code>n</code>, <code>d</code>, <code>i</code>⟩<sub>σi</sub></p>
              <ul className="text-sm space-y-0.5 mt-2 list-disc list-inside">
                <li>정족수: <M>{'2f+1'}</M> COMMITs</li>
                <li>→ <code>committed-local</code></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-1">목적: view change 후에도 safety</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">실제 처리 과정</p>
            <p className="text-sm">
              client → primary (<code>REQUEST</code>) → all (<code>PRE-PREPARE</code>) → all↔all (<code>PREPARE</code>) → all↔all (<code>COMMIT</code>) → client (<code>REPLY</code>, <M>{'f+1'}</M> matching으로 확정)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              통신 복잡도: PRE-PREPARE <M>{'O(n)'}</M> + PREPARE <M>{'O(n^2)'}</M> + COMMIT <M>{'O(n^2)'}</M> = 총 <M>{'O(n^2)'}</M> per request
            </p>
          </div>
        </div>
        <p className="leading-7">
          3 phase = <strong>Primary 제안 → Quorum 동의 → Commit 확정</strong>.<br />
          왜 3 phase? Safety in view change — 다음 섹션에서 깊이.<br />
          <M>{'O(n^2)'}</M> 메시지 복잡도 — 수백 node 한계의 근원.
        </p>

        {/* ── 핵심 인사이트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 핵심 설계 인사이트</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">왜 3 phase인가 (2 phase 문제)</p>
            <p className="text-sm mb-2">2-phase 가정: Primary → PRE-PREPARE, Replicas → COMMIT (quorum 후 바로 실행)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>replica A: <M>{'2f+1'}</M> COMMIT 받고 execute</li>
              <li>replica B: <M>{'2f'}</M> COMMIT만 받음 (1개 drop)</li>
              <li>view change 발생 → new primary는 A의 execute를 모름</li>
              <li>다른 값 propose → <strong>두 다른 값 execute = safety 위반</strong></li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-2">3-phase 해결</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>PREPARE 단계가 "commit 준비됨" 증명</li>
              <li>view change 시 <M>{'2f+1'}</M> PREPARE로 증거 전달</li>
              <li>new primary가 이전 prepared 값 존중 → safety 유지</li>
              <li>핵심: <code>prepared</code> 상태가 view 간 bridge</li>
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">왜 quorum = <M>{'2f+1'}</M></p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>intersection = <M>{'2(2f+1) - (3f+1) = f+1'}</M></li>
                <li><M>{'f+1'}</M>에 정직 1명 이상 → 모순 불가</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">왜 메시지에 <code>(v, n, d)</code> 모두 포함</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><code>v</code>: view 구분 (혼동 방지)</li>
                <li><code>n</code>: sequence (순서 보장)</li>
                <li><code>d</code>: digest (내용 인증)</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3 phase의 이유: <strong>view change safety</strong>.<br />
          "prepared"가 view 간 다리 — 이전 quorum 증거 보존.<br />
          2 phase로 단축하면 view change 시 safety 깨짐 (HotStuff가 3-chain으로 해결).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 PBFT가 26년 표준인가</strong> — 정확성 증명 완비.<br />
          Castro의 PhD 논문(2001)이 formal proof 제공 — safety, liveness 모두 증명.<br />
          이후 BFT는 PBFT를 최적화(HotStuff는 통신, Tendermint는 단순화)하지만 본질은 동일.
        </p>
      </div>
    </section>
  );
}
