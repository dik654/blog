import { CitationBlock } from '@/components/ui/citation';

export default function LeaderRotation() {
  return (
    <section id="leader-rotation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리더 교체의 안전성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §4 Safety" citeKey={2} type="paper">
          <p className="italic">
            "The key insight is that HotStuff's view change protocol has the same communication complexity as normal operation — O(n)."
          </p>
        </CitationBlock>

        {/* ── Linear View Change ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Linear View Change 메커니즘</h3>
        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">HotStuff View Change 4단계 — O(n)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1. Trigger</strong> — 각 replica가 timeout 감지 → 새 view <code className="text-xs">v+1</code>로 이동</p>
              <p><strong>2. NewView</strong> — each → new leader: <code className="text-xs">NewView(v+1, highQC)</code> — 자신이 본 가장 높은 QC 1개만 전송 (O(1) per msg)</p>
              <p><strong>3. 수집</strong> — new leader가 2f+1 NewView 수신, <code className="text-xs">max(highQC)</code> 선택 → <code className="text-xs">justifyQC</code></p>
              <p><strong>4. 새 proposal</strong> — leader → all: <code className="text-xs">Propose(B, justifyQC)</code>, <code className="text-xs">B.parent = justifyQC.block</code></p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">PBFT View Change — O(n³)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>VIEW-CHANGE: each → all = <code className="text-xs">O(n²)</code></li>
              <li>메시지 크기: <code className="text-xs">O(n)</code> per msg</li>
              <li>총: <code className="text-xs">O(n³)</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">HotStuff View Change — O(n)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>NewView: each → leader = <code className="text-xs">O(n)</code></li>
              <li>메시지 크기: <code className="text-xs">O(1)</code> per msg (QC만)</li>
              <li>총: <code className="text-xs">O(n)</code></li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Safety 유지 핵심</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>O(1) per message 가능: threshold signature로 QC = O(1) size (2f+1 sig → 1 sig)</p>
              <p>new leader가 <code className="text-xs">max(highQC)</code> 기반 proposal — 이미 committed block의 QC 포함 보장</p>
              <p>2f+1 중 f+1은 정직 → <code className="text-xs">max(highQC)</code> 반드시 포함</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          HotStuff view change = <strong>O(n) NewView → leader → O(n) Proposal</strong>.<br />
          각 replica는 highQC (O(1))만 전송.<br />
          PBFT의 O(n³) → HotStuff O(n), 1000x+ 효율.
        </p>

        {/* ── Safety 증명 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff Safety 증명</h3>
        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Claim: B committed → conflicting B* commit 불가</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>가정</strong> — view v에서 B commit (3-chain 완성). view v&apos; &gt; v에서 B* commit 가정 (B* != B). 목표: 모순 도출</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Locking Invariant</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>정직 replica가 B&apos;&apos;&apos; QC 받으면 lock on B&apos;&apos; (<code className="text-xs">lockedQC = QC(B&apos;&apos;)</code>)</p>
              <p>이후 <code className="text-xs">lockedQC.view</code> 이상의 QC만 vote</p>
              <p>B&apos;&apos; commit 시 2f+1 replica가 lock on B&apos;&apos;</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Quorum Intersection</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>B&apos;&apos;의 QC (2f+1) &cap; B*의 QC (2f+1) &ge; f+1</p>
              <p>f+1에 정직 replica 1명 이상 존재</p>
              <p>정직 replica j: B&apos;&apos;에 locked → B* vote하려면 <code className="text-xs">justifyQC.view &ge; B&apos;&apos;.view</code></p>
              <p>B* != B이면서 같은 chain 포함 불가 → j가 B* vote 안 함 → <strong>모순</strong></p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">결론</div>
            <div className="text-sm text-muted-foreground">
              B committed → conflicting block commit 불가. Safety 증명 완료. (엄밀한 증명: PODC 2019 paper &sect;4)
            </div>
          </div>
        </div>
        <p className="leading-7">
          HotStuff Safety = <strong>locking + quorum intersection</strong>.<br />
          2-chain QC로 lock, 3-chain QC로 commit.<br />
          lockedQC.view 이상 QC만 vote — 이전 lock 존중.
        </p>

        {/* ── Pacemaker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pacemaker: view synchronization</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Pacemaker 역할</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>view synchronization — 모든 정직 replica를 같은 view로</li>
              <li>timeout 관리 + view change 트리거</li>
              <li>leader rotation</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">기본 알고리즘</div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>각 replica가 <code className="text-xs">current_view</code> 유지</li>
              <li>timeout 시 NewView 전송</li>
              <li>2f+1 NewView 받으면 view 증가</li>
              <li>new leader가 propose 시작</li>
            </ol>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Exponential Backoff</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="text-xs">timeout(v) = base * 2^k</code></p>
              <p>k = v - last_successful_view</p>
              <p>view change 많으면 timeout 증가, GST 후 수렴</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Jolteon Pacemaker</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>2-chain commit</p>
              <p>fast path (2δ) + slow path (3δ)</p>
              <p>view synchronization 간소화</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">HotStuff-2 Pacemaker</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>2-phase protocol</p>
              <p>lockedQC 불필요 (view-based locking)</p>
              <p>더 간단한 pacemaker</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Pacemaker = <strong>view synchronization + timeout 관리</strong>.<br />
          HotStuff paper는 pacemaker를 프로토콜 밖으로 분리.<br />
          실무 구현의 유연성 + safety 분석 간소화.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff vs PBFT 리더 교체</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">PBFT View Change</p>
            <p className="text-sm">
              각 노드가 prepared 증거를 전체 브로드캐스트.<br />
              O(n) 증거 x O(n²) 브로드캐스트 = O(n³).<br />
              새 Primary가 모든 증거 검증 후 NEW-VIEW 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">HotStuff View Change</p>
            <p className="text-sm">
              각 노드가 highQC(가장 높은 QC)만 새 리더에게 전송.<br />
              새 리더가 가장 높은 QC 선택 → 제안 시작.<br />
              O(n) 메시지 — 정상 경로와 동일 비용
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계가 필요한 이유</h3>
        <p className="leading-7">
          2단계만으로는 View Change 시 O(n) 유지 불가.<br />
          3단계(Prepare → Pre-Commit → Commit)는<br />
          "투표의 QC"를 한 단계 더 쌓아 리더 교체 안전성 확보.<br />
          HotStuff-2가 이 한계를 돌파하여 2단계를 달성.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 HotStuff가 3단계 필요한가</strong> — non-blocking view change.<br />
          PBFT는 view change 시 모든 prepared 증거 전달 (blocking, O(n³)).<br />
          HotStuff는 highQC만 전달 (non-blocking, O(n)).<br />
          3-chain이 이 단순화의 수학적 기반 — 2-chain으론 safety 증명 불가.
        </p>
      </div>
    </section>
  );
}
