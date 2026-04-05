import { CitationBlock } from '@/components/ui/citation';

export default function AnchorSelection() {
  return (
    <section id="anchor-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">앵커 선택 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Spiegelman et al. — Bullshark §4.2" citeKey={2} type="paper">
          <p className="italic">
            "The anchor for wave w is the vertex of the designated leader at round 2w."
          </p>
        </CitationBlock>

        {/* ── Anchor Selection Details ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Anchor Selection 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Anchor Selection 수학적 정의:
//
// anchor_author(w) = schedule[w mod n]
//
// where schedule = validators sorted by id
// (or stake-weighted round-robin)
//
// anchor(w) = vertex at round 2w by anchor_author(w)
// (if exists in DAG, else None)

// 선택의 결정론성:
// - schedule: pre-determined (setup phase)
// - w: 현재 wave number (모든 validator 동일)
// - mod n: deterministic index
// - → 모든 validator가 같은 anchor 식별

// No communication needed:
// - 각 validator가 독립 계산
// - network exchange 불필요
// - 모두 같은 결론

// Weighted round-robin:
// - stake-weighted schedule
// - higher stake validator 더 자주 anchor
// - 예:
//   V1 (40% stake): wave 0, 2, 5
//   V2 (30%): wave 1, 4
//   V3 (20%): wave 3, 7
//   V4 (10%): wave 6
//   반복

// Reputation-based (Bullshark variant):
// - 과거 anchor 성능에 기반
// - commit rate 높은 validator 선호
// - slow validator 자동 제외

// Randomized (async mode):
// - VRF (Verifiable Random Function)
// - common coin flip
// - 예측 불가능
// - async fallback에서 사용

// Byzantine anchor handling:
// - Byzantine anchor가 vertex 안 만듦
// - → anchor(w) = None
// - wave skipped
// - next wave anchor가 이전 wave 포함 commit`}
        </pre>
        <p className="leading-7">
          Anchor selection: <strong>schedule[w mod n]</strong>.<br />
          deterministic → no communication.<br />
          stake-weighted, reputation-based, VRF 변형 가능.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">앵커 선택 메커니즘</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">결정론적 선택</p>
            <p className="text-sm">
              anchor(w) = validator[(2w) mod n]<br />
              모든 노드가 동일한 앵커를 독립적으로 계산.<br />
              리더 통신 없이 합의 가능
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">앵커 부재 처리</p>
            <p className="text-sm">
              앵커 검증자가 해당 라운드에 정점을 생성하지 않으면<br />
              해당 웨이브는 스킵.<br />
              다음 웨이브의 앵커가 이전 미커밋 앵커를 포함
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">커밋 투표</p>
            <p className="text-sm">
              다음 웨이브의 홀수 라운드 정점이 앵커를 참조하면 "투표".<br />
              f+1 이상 참조 = 앵커 커밋.<br />
              DAG 구조 자체가 투표 역할
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">체인 커밋</p>
            <p className="text-sm">
              앵커 A가 커밋되면 A의 인과적 히스토리 전체 확정.<br />
              이전 웨이브의 미커밋 앵커도 순서대로 커밋.<br />
              한 번에 여러 웨이브 분량 확정 가능
            </p>
          </div>
        </div>

        {/* ── Skipped Wave Handling ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Skipped Wave 처리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Skipped Wave 시나리오:
//
// Case 1: Byzantine anchor
// - anchor_author가 offline / malicious
// - round 2w에 vertex 안 만듦
// - anchor(w) = None
// - wave w skipped
//
// Case 2: Insufficient votes
// - anchor(w) exists
// - but < f+1 votes in round 2w+1
// - 원인: network partition, slow propagation
// - → wave w undecided (yet)

// Skipped wave handling:
//
// 1. Wave w skipped, continue to wave w+1
// 2. anchor(w+1) exists + has enough votes → commit
// 3. anchor(w+1) causal history includes:
//    - itself
//    - its parents (round 2(w+1)-1)
//    - recursively down to genesis
//    - → includes anchor(w) if exists
// 4. anchor(w)와 causal history all committed together

// 구체적 순서:
// - commit anchor(w+1) trigger
// - DFS from anchor(w+1) to all ancestors
// - sort by (round, author)
// - emit committed order
// - includes anchor(w) if it existed

// 예시:
// wave 0 anchor: V0 (offline) → skipped
// wave 1 anchor: V1 → committed
// wave 1 causal history includes:
// - round 0 vertices (V1, V2, V3) — V0 제외
// - round 1 vertices
// - round 2 vertices (up to anchor)
//
// committed order:
// [V1_r0, V2_r0, V3_r0, V0_r1?, ..., anchor_r2]

// Recovery property:
// - eventually anchor committed
// - honest anchor 순서는 4 waves 내 (expected)
// - Byzantine 33%면 3 in 3 순서
// - 시스템 liveness 보장

// async fallback:
// - 연속 skipped wave detection
// - switch to async mode (4-round)
// - randomized anchor selection
// - guaranteed commit (probability 1)`}
        </pre>
        <p className="leading-7">
          Skipped wave: <strong>next anchor's causal history에 포함</strong>.<br />
          skipped wave의 vertices도 eventually committed.<br />
          연속 실패 시 async fallback (4-round mode).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 deterministic anchor가 효율적인가</strong> — no leader election overhead.<br />
          전통 BFT: view change마다 leader election (communication + timeout).<br />
          Bullshark: schedule 고정 → 즉시 결정.<br />
          skipped wave도 structural handling — 오버헤드 최소.
        </p>
      </div>
    </section>
  );
}
