import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateSummary({ onCodeRef }: Props) {
  return (
    <section id="state-summary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State Summary & 재생</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          에폭 경계가 아닌 슬롯의 상태는 저장하지 않는다.<br />
          대신 <strong>StateSummary</strong>(슬롯, 블록 루트)만 기록해 공간을 절약한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('replay-blocks', codeRefs['replay-blocks'])} />
          <span className="text-[10px] text-muted-foreground self-center">ReplayBlocks()</span>
          <CodeViewButton onClick={() => onCodeRef('state-by-slot', codeRefs['state-by-slot'])} />
          <span className="text-[10px] text-muted-foreground self-center">StateBySlot()</span>
        </div>

        {/* ── StateSummary 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateSummary — 메타데이터 인덱스</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 모든 slot에 대해 저장하는 메타데이터
type StateSummary struct {
    Slot uint64       // 해당 slot
    Root [32]byte     // block root (state root 유도 가능)
}

// 저장:
// - slot별 1 entry × ~30 bytes = 저렴
// - 1년치: 2_700_000 slots × 30B = ~80 MB
// - 실제 state 저장보다 100배 이상 작음

// 용도:
// 1. slot → block_root 매핑 (빠른 인덱스)
// 2. Replay 기점 탐색
// 3. RPC eth/v1/beacon/headers/{slot} 응답

// DB 테이블:
// "state-summary" bucket in BoltDB
// Key: slot (big-endian uint64)
// Value: block_root (32 bytes)

// 조회:
func GetStateSummary(slot uint64) (*StateSummary, error) {
    key := encode_uint64(slot)
    val, err := db.Get("state-summary", key)
    if err != nil { return nil, err }
    return &StateSummary{Slot: slot, Root: val}, nil
}

// Skipped slots 처리:
// - 빈 slot (블록 없음): StateSummary 없음
// - 하지만 state는 여전히 변경됨 (slot transition)
// - replay 시 ProcessSlots만 수행 (블록 없이 진행)`}
        </pre>
        <p className="leading-7">
          StateSummary는 <strong>모든 slot의 메타데이터 인덱스</strong>.<br />
          slot → block_root 매핑만 저장 → 1년치 ~80MB.<br />
          Replay 기점 탐색 및 RPC 응답에 활용.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">재생 과정</h3>
        <ul>
          <li><strong>기점 탐색</strong> — 타겟 슬롯 이전의 가장 가까운 저장 상태를 찾음</li>
          <li><strong>블록 로딩</strong> — 기점~타겟 사이의 블록을 DB에서 로드</li>
          <li><strong>순차 적용</strong> — ProcessSlots + ExecuteStateTransition을 반복</li>
        </ul>

        {/* ── ReplayBlocks 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ReplayBlocks — 기점→타겟 state 전환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`func ReplayBlocks(
    ctx context.Context,
    startState *BeaconState,
    blocks []*BeaconBlock,
    targetSlot uint64,
) (*BeaconState, error) {
    state := startState.Copy()
    currentSlot := state.Slot()

    // 1. 각 블록을 순차 적용
    for _, block := range blocks {
        // 1a. 블록 슬롯까지 empty slot 전환
        for currentSlot < block.Slot {
            state, err = ProcessSlot(state, currentSlot+1)
            if err != nil { return nil, err }
            currentSlot++
        }

        // 1b. 블록 실행 (state transition)
        state, err = ExecuteStateTransition(state, block)
        if err != nil { return nil, err }
        currentSlot = block.Slot
    }

    // 2. 마지막 블록 이후 targetSlot까지 empty slots
    for currentSlot < targetSlot {
        state, err = ProcessSlot(state, currentSlot+1)
        currentSlot++
    }

    return state, nil
}

// 비용 분석:
// - ProcessSlot: 매우 빠름 (~수 ms, randao update 등만)
// - ExecuteStateTransition: 블록 크기 비례 (~50ms 평균)

// Replay 거리별 시간:
// 1 epoch (32 slot): ~500ms
// 1 day (7200 slot): ~2분
// K=2048 max replay: ~1분 (avg)

// 최적화:
// - 병렬 signature verify
// - FieldTrie 캐시 재사용
// - pre-allocated slice pools`}
        </pre>
        <p className="leading-7">
          <code>ReplayBlocks</code>가 <strong>state transition 순차 재적용</strong>.<br />
          각 block마다 ProcessSlot(빈 slot) + ExecuteStateTransition(블록).<br />
          K=2048 기준 최대 replay ~1분 — 드물지만 발생 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 최대 재생 거리</strong> — 에폭 경계마다 저장하므로 최대 31슬롯(~6.2분) 재생.<br />
          재생 비용은 기점~타겟 거리에 비례.<br />
          빈 슬롯(블록 없음)은 ProcessSlots만 수행해 빠르게 건너뜀.
        </p>
      </div>
    </section>
  );
}
