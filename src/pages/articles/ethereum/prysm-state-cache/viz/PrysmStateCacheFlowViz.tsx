import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "조회", "Copy", "Summary", "Ancestor", "순서", "Replay", "신뢰 경계"] as const;

const NOTES = [
  "요청 identity는 state root가 아니라 block root입니다. 이 root에 대응하는 post-state를 hot LRU, epoch-boundary FIFO, DB에서 찾고, 없으면 같은 branch의 이전 state부터 다시 계산합니다.",
  "요청 root 0x105…는 두 cache와 DB full-state에서 모두 miss입니다. Cache miss는 state가 존재하지 않는다는 판정이 아니라 replay 경로로 넘어가라는 신호입니다.",
  "일반 StateByRoot는 hot cache와 epoch cache에서 꺼낸 state를 Copy해 caller에게 줍니다. NoCopy 경로는 shared object를 ReadOnlyBeaconState로 노출하며, 초기 동기화의 mutable 경로는 별도 예외입니다.",
  "StateSummary는 목표의 slot 105와 block root 0x105…만 담습니다. 시작 state나 block 배열을 저장하지 않습니다. 목표 slot을 확인한 뒤 ancestor 탐색을 따로 실행합니다.",
  "latestAncestor는 block 105의 parent 102를 확인하고, state가 없으면 block 102의 parent 100으로 이동합니다. Root 0x100…의 full state를 DB에서 찾으면 그 state가 replay 시작점입니다.",
  "Ancestry query는 descendant 105에서 parent 102로 거슬러 block을 모은 뒤 배열을 뒤집습니다. Replay 호출자가 받는 순서는 block 102, block 105입니다. replay.go의 ‘descending’ 주석과 실제 반환 순서가 다릅니다.",
  "State 100에서 slot 102까지 per-slot transition을 실행한 뒤 block 102를 적용합니다. 다시 slot 105까지 전진한 뒤 block 105를 적용합니다. 이 예의 slot step은 5회, block transition은 2회입니다.",
  "State generation은 이미 검증되어 DB에 저장된 block을 전제로 합니다. ProcessBlockForStateRoot는 signature와 post-state root 비교를 반복하지 않습니다. 따라서 이 replay 함수를 새로 받은 미검증 block의 validator로 사용하면 안 됩니다.",
] as const;

const RECEIPTS = [
  "block root → cached state | DB state | replayed state",
  "hot miss → epoch miss → DB miss → replay",
  "일반 get은 Copy · NoCopy는 read-only shared object",
  "summary = {slot 105, block root} · anchor/path 아님",
  "105 → parent 102 → parent 100의 저장 state",
  "역방향 수집 뒤 reverse → [block 102, block 105]",
  "5 slot steps + 2 stored-block transitions",
  "stored·verified block 전제 · signature/root 재검증 생략",
] as const;

function Cell({ label, value, detail, active, muted }: { label: string; value: string; detail: string; active?: boolean; muted?: boolean }) {
  return (
    <div className={`min-w-0 bg-background p-1.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""} ${muted ? "opacity-40" : ""}`}>
      <span className="block break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className={`mt-0.5 block break-keep text-[9px] leading-[0.85rem] sm:mt-1 sm:text-xs sm:leading-4 ${active ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 hidden break-keep text-[9px] leading-4 text-muted-foreground sm:block">{detail}</span>
    </div>
  );
}

function StatePath({ active }: { active: number }) {
  return (
    <div aria-label="요청 block root에서 cache·DB 조회와 ancestor replay를 거쳐 post-state를 만드는 과정">
      <div className="grid grid-cols-4 gap-px bg-border p-px">
        <Cell label="REQUEST" value="root 0x105…" detail="slot 105 block의 post-state" active={active === 0 || active === 1} />
        <Cell label="HOT LRU · 32" value={active === 1 ? "MISS" : "root → copied state"} detail="일반 get은 Copy" active={active === 1 || active === 2} />
        <Cell label="EPOCH FIFO · 8" value={active === 1 ? "MISS" : "epoch-start state"} detail="put과 get 모두 Copy" active={active === 1 || active === 2} />
        <Cell label="BEACON DB" value={active === 1 ? "FULL STATE MISS" : "root → full state"} detail="직접 저장 state" active={active === 1} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="STATE SUMMARY" value="slot 105 · root 0x105…" detail="목표 metadata 두 field" active={active === 3} muted={active === 4} />
        <Cell label="LATEST ANCESTOR" value="105 → 102 → 100" detail="parent root를 따라 state 탐색" active={active === 4} />
        <Cell label="START STATE" value="post-state at slot 100" detail="root 0x100…로 DB hit" active={active === 4 || active === 6} />
      </div>

      <div className="mt-px grid grid-cols-5 gap-px bg-border p-px">
        <Cell label="S100" value="state 100" detail="stored anchor" active={active === 4 || active === 6} />
        <Cell label="SLOTS" value="100 → 102" detail="per-slot 2회" active={active === 6} />
        <Cell label="BLOCK" value="apply 102" detail="첫 stored block" active={active === 5 || active === 6} />
        <Cell label="SLOTS" value="102 → 105" detail="per-slot 3회" active={active === 6} />
        <Cell label="BLOCK" value="apply 105" detail="target block" active={active === 5 || active === 6} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="ANCESTRY RESULT" value="[block 102, block 105]" detail="reverse 뒤 과거→현재" active={active === 5} />
        <Cell label="RESULT" value="post-state at 105" detail="caller-owned DB/replay 결과" active={active === 0 || active === 6} />
        <Cell label="TRUST BOUNDARY" value="검증된 stored block 전제" detail="signature·state-root 재검증 없음" active={active === 7} />
      </div>
    </div>
  );
}

export default function PrysmStateCacheFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 14000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Prysm v7.3.1"
      title="Cache miss는 같은 branch의 state replay로 이어집니다"
      description="Slot 105의 block root를 요청해 slot 100 state에서 다시 만드는 한 경로를 따라갑니다."
      note="Slot과 축약 root는 설명용 값입니다. 조회 순서·cache 크기·copy·replay 경계는 Prysm v7.3.1 commit 96d418cd에서 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-state-cache-scene={active}
        tabIndex={0}
        role="group"
        aria-label="StateByRoot 조회에서 ancestor replay까지 이어지는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="상태 재구성의 여덟 장면">
            <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
              {SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-3"><StatePath active={active} /></div>

          <div className="mt-2 grid min-h-[4.75rem] grid-cols-[0.5fr_1.5fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[6.5rem] sm:grid-cols-[0.62fr_1.38fr]">
            <div className="min-w-0 bg-background p-2 sm:p-3">
              <span className="text-[9px] font-bold text-muted-foreground">현재 장면</span>
              <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
            </div>
            <div className="min-w-0 bg-background p-2 sm:p-3">
              <span className="text-[9px] font-bold text-muted-foreground">확인한 경계</span>
              <strong className="mt-1 block break-keep text-[9px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
            </div>
          </div>

          <p data-scene-note className="mt-2 min-h-[5.5rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[6rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
