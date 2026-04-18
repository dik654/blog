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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">수학적 정의</p>
            <p className="text-sm">
              <code>anchor_author(w) = schedule[w mod n]</code> — schedule = validators sorted by id (or stake-weighted round-robin)<br />
              <code>anchor(w)</code> = vertex at round 2w by <code>anchor_author(w)</code> (DAG에 존재하면, 아니면 <code>None</code>)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              결정론성: schedule은 pre-determined, w는 모든 validator 동일, <code>mod n</code>으로 deterministic index → 모든 validator가 같은 anchor 식별, no communication 필요
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Anchor 선택 변형</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Weighted round-robin</p>
                <p className="text-muted-foreground">stake-weighted schedule. 예: V1(40%) wave 0,2,5 / V2(30%) wave 1,4 / V3(20%) wave 3,7 / V4(10%) wave 6</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Reputation-based</p>
                <p className="text-muted-foreground">과거 anchor 성능 기반. commit rate 높은 validator 선호, slow validator 자동 제외</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Randomized (async mode)</p>
                <p className="text-muted-foreground">VRF (Verifiable Random Function) / common coin flip. 예측 불가능, async fallback에서 사용</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Byzantine anchor handling</p>
                <p className="text-muted-foreground">Byzantine anchor가 vertex 안 만듦 → <code>anchor(w) = None</code> → wave skipped → next anchor가 이전 wave 포함 commit</p>
              </div>
            </div>
          </div>
        </div>
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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Skipped Wave 시나리오</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Case 1: Byzantine anchor</p>
                <p className="text-muted-foreground"><code>anchor_author</code>가 offline/malicious → round 2w에 vertex 안 만듦 → <code>anchor(w) = None</code> → wave w skipped</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Case 2: Insufficient votes</p>
                <p className="text-muted-foreground"><code>anchor(w)</code> exists but <code>&lt; f+1</code> votes in round 2w+1. 원인: network partition, slow propagation</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Skipped wave handling</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>Wave w skipped → continue to wave w+1</li>
              <li><code>anchor(w+1)</code> exists + enough votes → commit</li>
              <li><code>anchor(w+1)</code> causal history: itself → parents → genesis까지 재귀 → <code>anchor(w)</code> 포함</li>
              <li><code>anchor(w)</code>와 causal history 전체가 함께 committed</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-2">
              DFS from <code>anchor(w+1)</code> → sort by <code>(round, author)</code> → emit committed order
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">예시</p>
            <p className="text-sm text-muted-foreground">
              wave 0 anchor: V0 (offline) → skipped. wave 1 anchor: V1 → committed.<br />
              wave 1 causal history: round 0의 V1,V2,V3 (V0 제외) + round 1 vertices + round 2 vertices.<br />
              committed order: <code>[V1_r0, V2_r0, V3_r0, ..., anchor_r2]</code>
            </p>
          </div>
          <div className="p-4">
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Recovery property</p>
                <p className="text-muted-foreground">eventually anchor committed. honest anchor 순서 4 waves 내 expected. Byzantine 33%면 3 in 3 순서. liveness 보장</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Async fallback</p>
                <p className="text-muted-foreground">연속 skipped wave detection → async mode (4-round) + randomized anchor selection → guaranteed commit (probability 1)</p>
              </div>
            </div>
          </div>
        </div>
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
