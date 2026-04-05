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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff View Change (O(n)):
//
// 1. View-change trigger:
//    - 각 replica가 timeout 감지
//    - 새 view (v+1) 로 이동
//
// 2. NEW-VIEW 메시지 (each → new leader):
//    NewView(v+1, highQC)
//    - highQC: 자신이 본 가장 높은 QC
//    - 단 1개 QC만 전송!
//    - size: O(1) per message
//
// 3. New leader 수집:
//    - 2f+1 NewView 수신 대기
//    - max highQC 선택 → justifyQC
//
// 4. 새 proposal:
//    leader → all: Propose(B, justifyQC)
//    - B.parent = justifyQC.block
//    - 정상 HotStuff round 시작

// 통신 복잡도:
// - NewView 메시지: n → 1 = O(n)
// - New Proposal: 1 → n = O(n)
// - 총: O(n) per view change

// PBFT 대비:
// PBFT:
// - VIEW-CHANGE: each → all, O(n²)
// - VIEW-CHANGE 크기: O(n) per msg
// - 총: O(n³)
//
// HotStuff:
// - NewView: each → leader, O(n)
// - NewView 크기: O(1) per msg (QC만)
// - 총: O(n)

// 왜 O(1) per message 가능?
// - threshold signature: QC는 O(1) size
// - aggregated signature
// - 2f+1 sig → 1 sig

// Safety 유지 (핵심):
// new leader가 max highQC 기반 proposal:
// - 이미 committed block의 QC 존재
// - 모든 정직 replica가 그 QC 이상 가짐
// - leader가 어느 replica에서 받아도 OK
// - 2f+1 중 f+1은 정직 → max(highQC) 포함`}
        </pre>
        <p className="leading-7">
          HotStuff view change = <strong>O(n) NewView → leader → O(n) Proposal</strong>.<br />
          각 replica는 highQC (O(1))만 전송.<br />
          PBFT의 O(n³) → HotStuff O(n), 1000x+ 효율.
        </p>

        {/* ── Safety 증명 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff Safety 증명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Claim: B committed → 이후 어떤 view에서도
//        conflicting B' commit 불가

// 가정:
// view v에서 B commit (3-chain 완성)
// - ∃ B'' such that QC(B''), QC(B'''), QC(B'''')
// - B'' ← B''' ← B'''' (parent chain)
// - B.view, B'''.view, B''''.view consecutive
//
// view v' > v에서 B* commit 가정 (B* ≠ B)
// 목표: 모순 도출

// Locking invariant:
// - 정직 replica가 B''' QC 받으면 lock on B''
//   (lockedQC = QC(B''))
// - 이후 replica는 "lockedQC.view 이상의 QC"만 vote

// replica가 B'' commit 했을 때:
// - 2f+1 replica가 B''' QC 형성
// - → 2f+1 replica가 B''' vote
// - → 2f+1 replica가 lock on B''
// - → lockedQC.view = B''.view

// view v' > v에서 B* vote하려면:
// replica가 B*의 QC를 기반으로 accept 해야 함
// - justifyQC.view >= lockedQC.view = B''.view
// - B*의 parent chain이 B'' 포함 or B''.view 이상 QC 필요

// Quorum intersection:
// - B''의 QC (2f+1 signers)
// - B*의 QC (2f+1 signers)
// - intersection >= f+1
// - f+1에 정직 1명 이상

// 정직 replica j는:
// - B''에 vote함 (locked on B'')
// - B*에 vote하려면 justifyQC.view >= B''.view
// - B* parent chain이 B'' 포함해야

// B* ≠ B 이면서 같은 chain 포함 불가
// → j가 B*에 vote 안 함
// → B* QC 형성 불가
// → 모순

// 결론: B committed → conflicting block commit 불가
// Safety 증명 완료

// 엄밀한 증명: PODC 2019 paper §4`}
        </pre>
        <p className="leading-7">
          HotStuff Safety = <strong>locking + quorum intersection</strong>.<br />
          2-chain QC로 lock, 3-chain QC로 commit.<br />
          lockedQC.view 이상 QC만 vote — 이전 lock 존중.
        </p>

        {/* ── Pacemaker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pacemaker: view synchronization</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Pacemaker의 역할:
// - view synchronization
// - timeout 관리
// - view change 트리거
// - leader rotation

// HotStuff paper는 pacemaker 분리:
// "Pacemaker is responsible for bringing all honest
//  replicas into the same view in a timely manner."

// 기본 Pacemaker 알고리즘:
//
// 1. 각 replica는 자신의 current_view 유지
// 2. timeout 시 vote 보냄 → NewView
// 3. 2f+1 NewView 받으면 view 증가
// 4. new leader가 propose 시작

// Exponential backoff:
// timeout(v) = base * 2^k
// where k = v - last_successful_view
// - view change 많으면 timeout 증가
// - GST 후 반드시 수렴

// Practical pacemaker (DiemBFT):
// - round-robin leader
// - timeout = f(network delay estimate)
// - view 별 leader = round_robin(validators)

// Optimistic pacemaker (optimization):
// - 정상 case: timeout 대기 없이 다음 view
// - 실패 case: timeout으로 복구
// - latency 감소

// 다른 프로토콜:
// Jolteon pacemaker:
// - 2-chain commit (HotStuff 3-chain 대비)
// - fast path (2δ) + slow path (3δ)
// - view synchronization 간소화

// HotStuff-2 pacemaker:
// - 2-phase protocol
// - lockedQC 불필요 (view-based locking)
// - 더 간단한 pacemaker`}
        </pre>
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
