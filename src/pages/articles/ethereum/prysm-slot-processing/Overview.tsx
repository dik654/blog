import ContextViz from './viz/ContextViz';
import SlotProcessingViz from './viz/SlotProcessingViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬롯 처리 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 ProcessSlots가 상태 루트를 캐싱하고 에폭 전환을 트리거하는 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── state transition 3단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State Transition — 3계층 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum 2.0 state transition (spec):
// 3계층으로 구성

// Layer 1: state_transition(state, signed_block, validate_result)
//   - 블록이 있는 슬롯의 전체 전환
//   - 입력: pre_state, signed_block
//   - 출력: post_state

// Layer 2: process_slots(state, slot)
//   - current_slot → target slot까지 empty slot 처리
//   - 각 slot마다:
//     - process_slot(state)
//     - epoch 경계면 process_epoch(state) 수행

// Layer 3: process_slot(state)
//   - 단일 slot 진전
//   - state.slot + 1
//   - block_roots, state_roots 업데이트
//   - latest_block_header.state_root 채움 (이전 슬롯에서 0이었음)

// 호출 그래프:
// state_transition
//   └─ process_slots(block.slot - 1)  // empty slots 먼저
//        └─ for each slot:
//            ├─ process_slot
//            └─ (if epoch boundary) process_epoch
//   └─ process_block(block)            // 실제 블록 적용

// Prysm 구현:
// beacon-chain/core/transition/
// - transition.go: state_transition
// - slot_processing.go: process_slots, process_slot

// 왜 3계층?
// 1. process_slot: 매 slot 불변 연산 (cheap)
// 2. process_epoch: epoch 경계 특수 처리 (expensive)
// 3. process_block: 블록별 처리 (variable)
// → 각 레이어가 독립 최적화 가능`}
        </pre>
        <p className="leading-7">
          Ethereum 2.0 state transition은 <strong>3계층 추상화</strong>.<br />
          process_slot(매 slot) → process_epoch(epoch 경계) → process_block(선택적).<br />
          Prysm이 spec의 이 3계층을 그대로 구현.
        </p>

        {/* ── ProcessSlots 루프 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ProcessSlots — 다중 슬롯 처리 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// process_slots: current → target slot까지 반복 처리
func ProcessSlots(ctx context.Context, state *BeaconState, slot Slot) error {
    if state.Slot() >= slot {
        return ErrSlotAlreadyPassed
    }

    for state.Slot() < slot {
        // 1. 단일 slot 처리
        if err := ProcessSlot(state); err != nil {
            return err
        }

        // 2. epoch 경계 확인
        //    (slot + 1) % SLOTS_PER_EPOCH == 0
        nextSlot := state.Slot() + 1
        if nextSlot % SLOTS_PER_EPOCH == 0 {
            // Epoch 전환 처리 (justification, rewards, etc.)
            if err := ProcessEpoch(state); err != nil {
                return err
            }
        }

        // 3. Slot 증가
        state.SetSlot(nextSlot)
    }

    return nil
}

// 사용처:
// 1. block processing 시작 시:
//    state.slot이 block.slot보다 작으면 empty slots 적용
//    (validator가 특정 slot에 블록 안 만들어서 생긴 skip)
// 2. validator가 미래 duty 계산 시:
//    current state에서 target epoch까지 simulate

// 성능:
// - ProcessSlot: ~5ms per slot (가벼움)
// - ProcessEpoch: ~100ms ~ 1s (무거움)
// - 예: 100 slot replay = ~4 × ProcessEpoch + 100 × ProcessSlot
//       = ~4 × 200ms + 100 × 5ms = ~1.3s`}
        </pre>
        <p className="leading-7">
          <code>ProcessSlots</code>가 <strong>replay의 핵심 엔진</strong>.<br />
          ProcessSlot 반복 + epoch 경계에서 ProcessEpoch.<br />
          empty slots 처리로 validator 미참여 구간 건너뜀.
        </p>
      </div>
      <div className="not-prose mt-6"><SlotProcessingViz /></div>
    </section>
  );
}
