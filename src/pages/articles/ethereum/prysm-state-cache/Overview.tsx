import ContextViz from './viz/ContextViz';
import StateCacheViz from './viz/StateCacheViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 캐시 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 Hot/Cold 캐시 구조와 Replay 메커니즘의 상태 조회 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── 상태 접근 문제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconState 관리 문제 — 250MB × 수천 슬롯</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">CL 노드가 관리해야 하는 state (~250 MB 각)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div><span className="font-medium text-foreground">tip</span> — 실시간 업데이트</div>
              <div><span className="font-medium text-foreground">recent</span> — fork choice용</div>
              <div><span className="font-medium text-foreground">historical</span> — RPC 조회용</div>
              <div><span className="font-medium text-foreground">finalized</span> — 확정 체크포인트</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">naive: 모든 slot state 유지 → 수 TB (불가능)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4 border-green-500/30">
              <h4 className="font-semibold text-sm mb-2">Hot State (메모리)</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>최근 2 epoch (~64 slot, 12.8분)</li>
                <li>모든 slot 유지 + FieldTrie 캐시</li>
                <li>접근: 수 us</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4 border-blue-500/30">
              <h4 className="font-semibold text-sm mb-2">Cold State (DB)</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>finalized 이전</li>
                <li>K slot마다만 저장 (기본 K=2048, ~6.8시간)</li>
                <li>접근: ~50ms (DB read)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4 border-amber-500/30">
              <h4 className="font-semibold text-sm mb-2">StateSummary (DB)</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>모든 slot의 (slot, block_root) 매핑만</li>
                <li>state 자체는 저장 안 함</li>
                <li>state 복원 시 기점 탐색에 사용</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">사용 패턴별 성능</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div>Fork choice: <span className="text-green-500">hot (us)</span></div>
              <div>Attestation verify: <span className="text-green-500">hot (us)</span></div>
              <div>RPC states: <span className="text-blue-500">혼합</span></div>
              <div>Archive 쿼리: <span className="text-amber-500">cold + replay (수백 ms ~ 수 초)</span></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          CL 노드의 핵심 문제: <strong>수 TB state를 어떻게 관리하나</strong>.<br />
          Hot(메모리) + Cold(DB, sparse) + Replay 3단계 전략.<br />
          대부분 조회가 최근 state → 90%+ cache hit로 성능 확보.
        </p>

        {/* ── StateService 아키텍처 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">stategen Service — 상태 제공 파이프라인</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>stategen.Service</code> 필드</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span><code>beaconDB</code> — <code>db.ReadOnlyDatabase</code></span>
              <span><code>hotStateCache</code> — <code>*hotStateCache</code> (메모리 캐시)</span>
              <span><code>finalizedInfo</code> — finalized root/slot</span>
              <span><code>epochBoundaryStateCache</code> — epoch 경계 state</span>
              <span><code>saveHotStateDB</code> — finalized 근처 임시 저장</span>
              <span><code>backfillStatus</code> — <code>*backfill.Status</code></span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">주 API</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>StateByRoot(root)</code> → <code>*BeaconState</code> — Hot 캐시 우선, 없으면 DB + Replay</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><code>StateBySlot(slot)</code> → <code>*BeaconState</code> — slot의 block_root 탐색 → StateByRoot 위임</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><code>ReplayBlocks(startState, targetSlot)</code> → <code>endState</code> — startState부터 targetSlot까지 재적용</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">호출 흐름 예시: "slot 500000의 balance 조회"</h4>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1">StateBySlot(500000)</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">DB에서 block_root 조회</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">StateByRoot(root)</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">Hot 캐시 미스</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">Cold state 로드 (slot 499712)</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">ReplayBlocks(288 slot 재생)</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>stategen.Service</code>가 상태 조회의 <strong>중앙 허브</strong>.<br />
          Hot cache → Cold DB → Replay 3단계 fallback.<br />
          호출자는 단일 API만 알면 됨 — 내부 복잡도 은닉.
        </p>
      </div>
      <div className="not-prose mt-6"><StateCacheViz /></div>
    </section>
  );
}
