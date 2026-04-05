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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CL 노드가 관리해야 하는 state:
// - tip state (현재): 실시간 업데이트
// - recent states (최근 ~epochs): fork choice용
// - historical states (과거): RPC 조회용
// - finalized state: 확정된 체크포인트

// 각 state ~250 MB
// naive: 모든 slot state 유지 → 수 TB (불가능)

// Prysm의 전략: Hot/Cold 분리 + Replay
//
// Hot state (메모리):
//   - 최근 2 epoch (~64 slot, 12.8분)
//   - 모든 slot 유지 + FieldTrie 캐시
//   - 즉시 조회
//
// Cold state (DB):
//   - finalized 이전
//   - K slot마다만 저장 (기본 K=2048, ~6.8시간)
//   - 중간 slot은 Replay로 재구성
//
// StateSummary (DB):
//   - 모든 slot에 대해 (slot, block_root) 매핑만
//   - state 자체는 저장 안 함
//   - state 복원 시 기점 탐색에 사용

// 사용 패턴 분석:
// - Fork choice: tip 근처 state (hot)
// - Attestation verification: 최근 state (hot)
// - RPC eth/v1/beacon/states/{state_id}: 혼합
// - Archive 쿼리 (과거 slot): cold + replay

// 성능 특성:
// - Hot 접근: 수 μs (메모리)
// - Cold 접근: ~50ms (DB read)
// - Cold + Replay: 수백 ms ~ 수 초 (replay 거리 비례)`}
        </pre>
        <p className="leading-7">
          CL 노드의 핵심 문제: <strong>수 TB state를 어떻게 관리하나</strong>.<br />
          Hot(메모리) + Cold(DB, sparse) + Replay 3단계 전략.<br />
          대부분 조회가 최근 state → 90%+ cache hit로 성능 확보.
        </p>

        {/* ── StateService 아키텍처 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">stategen Service — 상태 제공 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 stategen.Service: 상태 조회 중앙 집중
type Service struct {
    beaconDB           db.ReadOnlyDatabase
    hotStateCache      *hotStateCache         // 메모리 캐시
    finalizedInfo      *finalizedInfo         // finalized root/slot
    epochBoundaryStateCache *epochBoundaryState // epoch 경계 state
    saveHotStateDB     *saveHotStateDB        // finalized 근처 임시 저장
    backfillStatus     *backfill.Status
}

// 주 API:
// 1. StateByRoot(root) → *BeaconState
//    - Hot 캐시 우선
//    - 없으면 DB + Replay

// 2. StateBySlot(slot) → *BeaconState
//    - slot의 block_root 탐색 → StateByRoot 위임

// 3. ReplayBlocks(startState, targetSlot) → endState
//    - startState부터 targetSlot까지 slot/block 재적용

// 호출 흐름 예시:
// RPC: "slot 500000의 balance 조회"
//   ↓
// stategen.StateBySlot(500000)
//   ↓
// BeaconDB에서 block_root 조회
//   ↓
// stategen.StateByRoot(root)
//   ↓
// Hot 캐시 확인 → 미스
//   ↓
// Cold state 로드 (예: slot 499712 = K*244)
//   ↓
// ReplayBlocks(499712 state, 500000)
//   ↓
// 288 slot 재생 → target state 반환`}
        </pre>
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
