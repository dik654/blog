import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ColdArchive({ onCodeRef: _ }: Props) {
  return (
    <section id="cold-archive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cold State 아카이브</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Finalized된 에폭의 상태는 Hot 캐시에서 제거되고 Cold 영역으로 이동한다.<br />
          Cold 상태는 매 <strong>K 슬롯</strong>마다 DB에 저장된다 (기본 K = 2048).
        </p>

        {/* ── Cold state 저장 정책 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Cold State 저장 정책 — K-slot interval</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cold state 저장 규칙
const DEFAULT_SLOTS_PER_COLD_STATE = 2048  // ~6.8시간

// 저장 조건:
// 1. slot % K == 0 (K-slot 간격)
// 2. epoch boundary (64 slot마다)
// 3. finalized checkpoint slot

// 저장 흐름:
func saveColdState(state *BeaconState, root [32]byte) error {
    slot := state.Slot()

    // K-interval 체크
    if slot % DEFAULT_SLOTS_PER_COLD_STATE != 0 {
        // 저장 안 함, StateSummary만 기록
        return saveStateSummary(slot, root)
    }

    // Full state 저장
    encoded, err := state.MarshalSSZ()
    // ~250 MB SSZ-serialized bytes
    return beaconDB.SaveState(root, encoded)
}

// 저장 결과:
// Cold state 수: total_slots / K = 약 5000개 (1년치)
// 각 state ~250 MB → 총 ~1.2 TB (archive 모드)

// Non-archive 모드:
// K=8192 (~1일)
// ~365개 state → ~90 GB

// Prune 모드:
// Finalized 이전 수 주만 유지
// ~100개 state → ~25 GB`}
        </pre>
        <p className="leading-7">
          Cold state는 <strong>K-slot 간격으로만 저장</strong>.<br />
          2048 slot(~6.8시간) = 기본값 → 디스크 사용량과 조회 속도 균형.<br />
          모드에 따라 K 조정 가능 (archive, default, prune).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Hot → Cold 전환</h3>
        <ul>
          <li><strong>트리거</strong> — Finalized 체크포인트 갱신 시</li>
          <li><strong>대상</strong> — 이전 Finalized 에폭까지의 Hot 상태</li>
          <li><strong>저장</strong> — K 슬롯 간격으로 선택적 저장</li>
          <li><strong>정리</strong> — 나머지 상태는 Hot 캐시에서 삭제</li>
        </ul>

        {/* ── Archive 모드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">저장 모드 3가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 state 저장 모드 설정

// 1. Default 모드 (대부분의 validator)
// - K = 2048 (6.8시간)
// - Finalized 이전 ~1달 유지
// - 디스크: ~100 GB
// - Replay max distance: K-1 = 2047 slots (~6.8h)
// - Replay 비용: ~수 초

// 2. Archive 모드 (RPC 제공자, 블록 익스플로러)
// --state-gen-cache-size=1000
// --archive
// - 모든 slot의 state 저장 (K=1 효과)
// - 디스크: ~5 TB (매년 ~2 TB 증가)
// - Replay max distance: 0
// - Replay 비용: 0 (항상 hit)
// - 단점: 디스크 비용 큼

// 3. Minimal 모드 (light validator)
// --minimal
// - K = 8192 (~27시간)
// - Finalized 이전 ~1주만 유지
// - 디스크: ~30 GB
// - Replay max distance: 8191 slots (~27h)
// - Replay 비용: 최대 수 분 (드물게)

// 선택 기준:
// - Solo validator: default/minimal (비용 최소화)
// - Staking pool: default (validator 의무 안정성)
// - RPC provider: archive (빠른 과거 조회)
// - Explorer: archive (과거 state 정밀 조회)

// 모드 전환:
// 데이터 폐기 없이 모드 변경 가능 (추후 보강)
// default → archive: missing slot state 복원 필요 (시간 소요)
// archive → default: 추가 삭제만 수행 (즉시)`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>3가지 저장 모드</strong> 지원.<br />
          Default(100GB) → Archive(5TB) → Minimal(30GB).<br />
          노드 용도에 따라 디스크 vs 조회 속도 trade-off.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 K값과 재생 비용</strong> — K=2048이면 최대 2047슬롯(~6.8시간)을 재생해야 함.<br />
          자주 조회되는 인프라는 K값을 줄이거나 아카이벌 모드를 사용.<br />
          K값이 작을수록 디스크 사용량은 늘지만 조회 속도는 향상.
        </p>
      </div>
    </section>
  );
}
