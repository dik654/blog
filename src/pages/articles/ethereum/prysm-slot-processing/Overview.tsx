import ContextViz from "./viz/ContextViz";
import SlotProcessingViz from "./viz/SlotProcessingViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Slot processing은 빈 slot까지 state transition에 반영한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 ProcessSlots가 상태 루트를 캐싱하고 에폭 전환을
          트리거하는 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── state transition 3단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          State Transition — 3계층 구조
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="font-semibold text-sm text-indigo-400 mb-2">
                Layer 1: state_transition
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <code className="text-indigo-300">
                    state_transition(state, signed_block)
                  </code>
                </div>
                <div>블록이 있는 슬롯의 전체 전환</div>
                <div>입력: pre_state + signed_block → 출력: post_state</div>
              </div>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">
                Layer 2: process_slots
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <code className="text-sky-300">
                    process_slots(state, slot)
                  </code>
                </div>
                <div>current_slot → target slot까지 empty slot 처리</div>
                <div>
                  각 slot마다 <code>process_slot</code> + epoch 경계면{" "}
                  <code>process_epoch</code>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">
                Layer 3: process_slot
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <code className="text-emerald-300">process_slot(state)</code>
                </div>
                <div>단일 slot 진전 — state.slot + 1</div>
                <div>
                  block_roots, state_roots 업데이트 + header.state_root 백필
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              호출 그래프
            </p>
            <div className="text-xs text-foreground/70 font-mono space-y-1">
              <div>
                <code>state_transition</code>
              </div>
              <div className="pl-4">
                └─ <code>process_slots(block.slot - 1)</code> — empty slots 먼저
              </div>
              <div className="pl-8">└─ for each slot:</div>
              <div className="pl-12">
                ├─ <code>process_slot</code>
              </div>
              <div className="pl-12">
                └─ (if epoch boundary) <code>process_epoch</code>
              </div>
              <div className="pl-4">
                └─ <code>process_block(block)</code> — 실제 블록 적용
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              왜 3계층인가?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-foreground/70">
              <div>
                <strong>process_slot</strong> — 매 slot 불변 연산 (cheap)
              </div>
              <div>
                <strong>process_epoch</strong> — epoch 경계 특수 처리
                (expensive)
              </div>
              <div>
                <strong>process_block</strong> — 블록별 처리 (variable)
              </div>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              각 레이어가 독립 최적화 가능. Prysm: <code>transition.go</code> +{" "}
              <code>slot_processing.go</code>
            </p>
          </div>
        </div>
        <p className="leading-7">
          Beacon state transition은 <strong>세 단계</strong>로 나누어 읽으면
          이해하기 쉽다.
          process_slot(매 slot) → process_epoch(epoch 경계) →
          process_block(block이 있을 때)의 관계이며, Prysm도 consensus spec의
          이 경계를 코드에 반영한다.
        </p>

        {/* ── ProcessSlots 루프 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ProcessSlots — 다중 슬롯 처리 루프
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-2">
              <code>ProcessSlots(ctx, state, slot)</code> — 루프 구조
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div>
                <strong>Guard:</strong> <code>state.Slot() &gt;= slot</code> →{" "}
                <code>ErrSlotAlreadyPassed</code>
              </div>
              <div className="rounded border border-border p-2">
                <p className="font-semibold text-foreground/80 mb-1">
                  for state.Slot() &lt; slot:
                </p>
                <div className="pl-3 space-y-1">
                  <div>
                    <span className="text-indigo-400 font-bold">1.</span>{" "}
                    <code>ProcessSlot(state)</code> — 단일 slot 전환
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold">2.</span>{" "}
                    <code>(slot + 1) % SLOTS_PER_EPOCH == 0</code> →{" "}
                    <code>ProcessEpoch(state)</code>
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold">3.</span>{" "}
                    <code>state.SetSlot(nextSlot)</code> — slot 증가
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                사용처
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <strong>block processing:</strong> state.slot &lt;
                  block.slot이면 empty slots 적용 (validator skip)
                </div>
                <div>
                  <strong>validator duty 계산:</strong> current state에서 target
                  epoch까지 simulate
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Replay 비용을 결정하는 요소
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <code>ProcessSlot</code>: 건너뛴 slot 수와 state-root cache
                </div>
                <div>
                  <code>ProcessEpoch</code>: 통과한 epoch 경계와
                  validator/pending state
                </div>
                <div className="font-semibold text-foreground/80">
                  총 시간: fork·캐시·하드웨어에서 측정
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ProcessSlots</code>는 target slot까지 ProcessSlot을 반복하고 epoch
          경계에서 ProcessEpoch을 호출하는 <strong>state replay의 핵심</strong>이다.
          따라서 block이 없는 empty slot도 시간을 건너뛰는 것이 아니라 slot
          transition을 적용해 상태를 앞으로 이동시킨다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <SlotProcessingViz />
      </div>
    </section>
  );
}
