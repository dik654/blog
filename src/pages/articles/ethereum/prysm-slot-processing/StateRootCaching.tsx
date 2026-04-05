import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateRootCaching({ onCodeRef: _ }: Props) {
  return (
    <section id="state-root-caching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 루트 캐싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Ring Buffer ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Ring Buffer 8192 — 최근 state/block roots</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BeaconState의 두 필드:
struct BeaconState {
    // ...
    block_roots: Vector[Bytes32, SLOTS_PER_HISTORICAL_ROOT],  // 8192
    state_roots: Vector[Bytes32, SLOTS_PER_HISTORICAL_ROOT],  // 8192
    historical_roots: List[Bytes32, HISTORICAL_ROOTS_LIMIT],  // 확장
    // ...
}

// SLOTS_PER_HISTORICAL_ROOT = 8192 = 2^13
// 8192 slot × 12초/slot = 약 27.3시간

// Ring buffer 동작:
// slot 0 → block_roots[0], state_roots[0]
// slot 1 → block_roots[1], state_roots[1]
// ...
// slot 8191 → block_roots[8191], state_roots[8191]
// slot 8192 → block_roots[0] 덮어씀
// slot 8193 → block_roots[1] 덮어씀
// ...

// 인덱스 계산:
idx := slot % SLOTS_PER_HISTORICAL_ROOT

// 용도:
// 1. RANDAO 계산: block_roots[previous_epoch % 8192]
// 2. Attestation의 beacon_block_root 검증
// 3. Fork choice tip 추적
// 4. Light client의 근거리 증명

// 왜 27시간?
// - Attestation inclusion window: 1 epoch (6.4분)
// - Finality: 2 epoch (~12.8분)
// - Safety margin: ~수 시간
// - 8192 slot (27시간)이 충분 + 메모리 효율`}
        </pre>
        <p className="leading-7">
          block_roots/state_roots는 <strong>8192 slot ring buffer</strong>.<br />
          slot % 8192로 순환 인덱싱 → 최근 ~27시간 roots 유지.<br />
          Attestation 검증, RANDAO, fork choice에 직접 활용.
        </p>

        {/* ── HistoricalBatch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HistoricalBatch — 장기 저장 압축</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 8192 slot 지나면 ring buffer 덮어씀 → 과거 데이터 영구 손실 방지
// → HistoricalBatch를 historical_roots에 추가

// Epoch 경계 (매 32 slot)에서:
// ring buffer가 한 바퀴 돌았는지 확인
// slot % SLOTS_PER_HISTORICAL_ROOT == 0 시점에 실행

struct HistoricalBatch {
    block_roots: Vector[Bytes32, 8192],  // 현재 ring buffer 전체
    state_roots: Vector[Bytes32, 8192],
}

// HistoricalBatch의 merkle root 계산
batch := HistoricalBatch{
    block_roots: state.block_roots,
    state_roots: state.state_roots,
}
root := batch.HashTreeRoot()  // 단일 32 bytes

// historical_roots에 추가
state.historical_roots = append(state.historical_roots, root)

// 크기 비교:
// - 원본 8192 × 2 × 32B = 512 KB
// - HashTreeRoot: 32 bytes
// - 압축률: 16,000배

// Historical summary (Capella+):
// HistoricalBatch 대신 HistoricalSummary 사용
struct HistoricalSummary {
    block_summary_root: Bytes32,  // block_roots의 HashTreeRoot
    state_summary_root: Bytes32,  // state_roots의 HashTreeRoot
}
// 2개 필드로 분리 → 각각 독립 증명 가능

// 장기 증명:
// "slot X의 block이 특정 hash였음" 증명:
// 1. X가 속한 HistoricalBatch index 계산
// 2. historical_roots[index] 가져오기
// 3. HistoricalBatch 복원 (아카이브 노드에서)
// 4. merkle proof 생성`}
        </pre>
        <p className="leading-7">
          HistoricalBatch가 <strong>16,000배 압축</strong>.<br />
          512KB ring buffer → 32 bytes HashTreeRoot.<br />
          과거 상태 증명 가능 + state 크기 제어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 링 버퍼 8192</strong> — stateRoots와 blockRoots는 고정 크기 8192 배열.<br />
          slot % 8192로 인덱싱하여 오래된 값을 자연스럽게 덮어씀.<br />
          약 27시간 분량 — 이보다 오래된 루트는 historicalRoots로 이동.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 HistoricalBatch 압축</strong> — 에폭 경계에서 링 버퍼가 한 바퀴 돌면 stateRoots + blockRoots의 Merkle Root를 historicalRoots에 추가.<br />
          장기 상태 증명에 필요한 최소한의 데이터만 보관.
        </p>
      </div>
    </section>
  );
}
