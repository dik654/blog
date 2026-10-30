import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "입력", "State Root", "Header", "Slot 31", "Epoch", "Slot 32", "Block 준비", "Cache"] as const;

const NOTES = [
  "Slot 30의 state에서 시작해 block 33을 적용하기 직전까지 갑니다. Slot 31과 32에는 block이 없지만 per-slot transition은 생략하지 않습니다.",
  "ProcessSlots는 current 30이 target 33보다 작은지 먼저 확인합니다. 같은 slot이나 과거 target은 이 strict API에서 오류입니다.",
  "Slot 30 state의 hash-tree-root를 계산해 state_roots[30]에 기록합니다. Mainnet preset에서는 historical window가 8,192이므로 index는 30 mod 8,192입니다.",
  "latest_block_header.state_root가 zero일 때만 방금 계산한 state root를 채웁니다. 그다음 완성된 header root를 block_roots[30]에 기록합니다.",
  "State slot을 31로 올린 뒤 같은 per-slot 작업을 반복합니다. 새 block은 없으므로 latest block header는 유지되지만 state root는 history write 때문에 달라질 수 있습니다.",
  "현재 slot 31의 다음 칸이 epoch 1의 시작인 slot 32입니다. ProcessEpoch는 slot을 올리기 전에 지난 epoch의 fork별 처리를 실행합니다.",
  "Epoch 처리가 끝나면 slot을 32로 올리고, slot 32에서 활성화되는 fork가 있으면 UpgradeState가 schema를 바꿉니다. 이어 slot 32의 roots를 기록합니다.",
  "마지막으로 state.slot을 33으로 올립니다. 이제 block 33의 operations를 적용할 수 있지만, 아직 그 block의 validity·head·finality가 확정된 것은 아닙니다.",
  "SkipSlotCache는 같은 시작 slot과 latest header root에서 계산한 중간 state를 프로세스 메모리에서 재사용합니다. 순서를 생략하거나 재시작 뒤 남는 durable receipt가 아닙니다.",
] as const;

const RECEIPTS = [
  "state.slot 30 → 31 → 32 → 33",
  "current 30 < target 33",
  "state_roots[30] = root(state@30)",
  "header.state_root: zero → root(state@30) · block_roots[30] 기록",
  "state.slot = 31 · state_roots[31] 기록",
  "다음 slot 32가 epoch 시작 · ProcessEpoch 실행",
  "state.slot = 32 · 필요하면 fork upgrade · slot 32 roots 기록",
  "state.slot = 33 · block 33 처리 전",
  "cache key = hash(start slot || latest header root) · in-memory LRU",
] as const;

function Cell({ label, value, active, done = false }: { label: string; value: string; active: boolean; done?: boolean }) {
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
      <span className="block break-keep font-mono text-[8px] font-black leading-3 sm:text-[9px]">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-xs sm:leading-5">{value}</strong>
    </div>
  );
}

export default function PrysmSlotProcessingFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · slot 30에서 33"
      title="빈 Slot도 Root·Epoch·Fork 순서를 따라 State를 전진시킵니다"
      description="Block 33을 받기 전에 slot 30 state가 어떤 순서로 slot 31·32를 지나 block-ready state가 되는지 추적합니다."
      note="30·33과 root 표기는 순서를 설명하기 위한 사례입니다. 실행 순서는 consensus-specs v1.7.0-beta.4와 Prysm v7.3.1 source·test로 확인했으며 처리 시간은 측정하지 않았습니다."
      canvasClassName="px-2 py-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-slot-processing-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Slot 30 state가 빈 slot 31과 32를 지나 block 33 직전으로 전진하는 아홉 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-9 gap-px bg-border p-px" aria-label="슬롯 처리의 아홉 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-px bg-border p-px sm:mt-3" aria-label="State slot이 30에서 33으로 전진하는 경로">
          <Cell label="CURRENT" value="slot 30" active={active >= 1 && active <= 3} done={active > 3} />
          <div className="flex items-center justify-center bg-background px-1 text-muted-foreground" aria-hidden>→</div>
          <Cell label="EMPTY" value="slot 31" active={active === 4 || active === 5} done={active > 5} />
          <div className="flex items-center justify-center bg-background px-1 text-muted-foreground" aria-hidden>→</div>
          <Cell label="EMPTY" value="slot 32" active={active === 6} done={active > 6} />
          <div className="flex items-center justify-center bg-background px-1 text-muted-foreground" aria-hidden>→</div>
          <Cell label="TARGET" value="block 33 전" active={active === 7} done={active > 7} />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="각 slot에서 기록되는 historical roots">
          <Cell label="RING INDEX 30" value={active >= 3 ? "state root + block root" : active >= 2 ? "state root 기록" : "기록 전"} active={active === 2 || active === 3} done={active > 3} />
          <Cell label="RING INDEX 31" value={active >= 4 ? "state root + 같은 latest block root" : "기록 전"} active={active === 4} done={active > 4} />
          <Cell label="RING INDEX 32" value={active >= 6 ? "epoch 이후 state root + block root" : "기록 전"} active={active === 6} done={active > 6} />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="Epoch와 fork 경계 및 skip slot cache">
          <Cell label="EPOCH GUARD" value={active >= 5 ? "(31 + 1) mod 32 = 0" : "다음 slot 검사"} active={active === 5} done={active > 5} />
          <Cell label="FORK UPGRADE" value={active >= 6 ? "SetSlot(32) 뒤 schema 확인" : "slot 증가 뒤 실행"} active={active === 6} done={active > 6} />
          <Cell label="SKIP-SLOT CACHE" value={active === 8 ? "동일 시작점의 중간 state 재사용" : "protocol 밖의 메모리 최적화"} active={active === 8} />
        </div>

        <div className="mt-2 grid grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 영수증</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-1 min-h-[5.75rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-24 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "입력", "State Root", "Header", "Slot 31", "Epoch", "Slot 32", "Block 준비", "Cache"]}
          playLabel="재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
