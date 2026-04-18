import { CitationBlock } from '../../../../components/ui/citation';
import PBFTFlowViz from './viz/PBFTFlowViz';
import PBFTSequenceViz from './viz/PBFTSequenceViz';

export default function PBFT() {
  return (
    <section id="pbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT (Practical Byzantine Fault Tolerance)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PBFT(1999, Castro &amp; Liskov) — <strong>최초의 실용적 BFT 프로토콜</strong>.<br />
          비동기 네트워크에서 safety(잘못된 합의 불가) 보장.<br />
          부분 동기(partial synchrony)에서 liveness(합의 진행 보장) 제공.<br />
          f개 비잔틴 노드 허용에 최소 3f+1개 노드 필요.
        </p>

        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4" citeKey={1} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "The algorithm works correctly in asynchronous systems like the Internet and it incorporates
            important optimizations that allow it to perform well so that it can be used in practice."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 프로토콜</h3>
        <div className="not-prose mb-6"><PBFTSequenceViz /></div>
        <PBFTFlowViz />

        <CitationBlock source="PBFT 논문 Figure 1 — 정상 경로 메시지 패턴" citeKey={2} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "The algorithm requires 3f+1 replicas to tolerate f faults."
          </p>
        </CitationBlock>

        {/* ── PBFT 기여 정리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 기여와 한계</h3>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">기여 1: Partial Synchrony</p>
            <p className="text-sm">이전 BFT는 동기 가정 필요. PBFT는 GST 후 liveness 보장, safety는 항상 보장.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">기여 2: MAC 기반 인증</p>
            <p className="text-sm">Symmetric cryptography + digital signatures. 성능 vs security trade-off로 실무 배포 가능.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">기여 3: View Change 완비</p>
            <p className="text-sm">leader 실패 복구 구체화 + 이전 state 보존 증명 + safety 유지 수학적 증명.</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">측정 성능 (1999 PC)</p>
          <p className="text-sm">Normal case <code className="text-xs">3ms/op</code>, throughput <code className="text-xs">1000 ops/s</code>. BFS(Byzantine FS) 구현으로 NFS와 유사 성능 달성.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-1">한계 1: <code className="text-xs">O(n²)</code> Normal Communication</p>
            <p className="text-sm"><code className="text-xs">n=50</code>: ~2500 messages, <code className="text-xs">n=100</code>: ~10000 messages. bandwidth 폭발.</p>
          </div>
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-1">한계 2: <code className="text-xs">O(n³)</code> View Change</p>
            <p className="text-sm"><code className="text-xs">2f+1</code> VIEW-CHANGE + 각 <code className="text-xs">O(n)</code> proofs + NEW-VIEW broadcast. 실제 delay 수 초.</p>
          </div>
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-1">한계 3: Client-centric Model</p>
            <p className="text-sm">client가 primary 추적 + <code className="text-xs">f+1</code> matching reply 수집. blockchain에 부적합.</p>
          </div>
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-1">한계 4: Static Membership</p>
            <p className="text-sm">replica set 고정 — 동적 합류/탈퇴 어려움. blockchain은 dynamic.</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">후속 프로토콜 (각 한계 해결)</p>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Zyzzyva (2007) — speculation으로 latency 단축</li>
            <li>Aardvark (2009) — fault-injection 저항</li>
            <li>Tendermint (2014) — blockchain 맞춤</li>
            <li>HotStuff (2019) — <code className="text-xs">O(n)</code> complexity</li>
            <li>DiemBFT (2021) — production-grade</li>
          </ul>
        </div>
        <p className="leading-7">
          PBFT = <strong>BFT의 Paxos</strong> — 26년간 모든 BFT의 기반.<br />
          한계: O(n²)/O(n³) communication, client-centric.<br />
          후속 프로토콜이 각 한계 해결.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">View Change (리더 교체)</h3>
        <p className="leading-7">
          <strong>PBFT</strong> — 타임아웃 → ViewChange 브로드캐스트 → 2f+1 수집 → NewView 전송, 통신 복잡도 O(n³)<br />
          <strong>이더리움</strong> — 슬롯 제안자 미스 → LMD-GHOST 포크 선택 규칙으로 자동 진행, View Change 불필요<br />
          <strong>CometBFT</strong> — 타임아웃 → 자동 Round+1 진행, O(n²)로 PBFT보다 단순
        </p>

        <CitationBlock source="PBFT 논문 §4.4 View Changes" citeKey={3} type="paper">
          <p className="italic">
            "A replica suspects the primary is faulty if it hasn't received a valid message within a timeout."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">O(n²) 통신 복잡도</p>
            <p className="text-sm">
              검증자 수가 늘어나면 메시지 수가 기하급수적으로 증가.
              이더리움처럼 수십만 검증자는 불가능.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">O(n³) View Change</p>
            <p className="text-sm">
              리더 장애 시 복구 비용이 매우 높음.
              HotStuff가 이를 O(n)으로 개선.
            </p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 PBFT가 왜 26년간 참조 모델인가</strong> — formal correctness proof.<br />
          Castro PhD 논문 (2001)이 엄밀한 safety/liveness proof 제공.<br />
          이후 BFT들은 PBFT 증명 기법 재활용 — quorum intersection, view change safety.
        </p>
      </div>
    </section>
  );
}
