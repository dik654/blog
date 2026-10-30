import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "두 Block", "준비", "Block commit", "조회", "별도 commit", "Cache", "Prune"] as const;

const NOTES = [
  "BeaconDB는 하나의 거대한 commit으로 모든 consensus 상태를 바꾸지 않습니다. Block 저장, state 저장, finalized checkpoint 저장은 각각 다른 함수와 bbolt transaction을 가집니다. 먼저 block 한 건의 원본과 인덱스가 어디까지 함께 움직이는지 봅니다.",
  "설명용 slot 64에 root 0x8a…31과 0x2f…b9인 경쟁 block 두 개가 있습니다. Root는 원본 bytes의 주소이고, slot은 후보를 묶어 찾는 조회 축입니다. 같은 slot이라고 둘 중 하나를 덮어쓰지 않습니다.",
  "prepareBlockBatch는 write transaction을 열기 전에 root, slot·parent index 값, 저장할 block 표현과 encoded bytes를 계산합니다. 비싼 변환·encode가 single-writer transaction을 오래 점유하지 않게 합니다.",
  "SaveROBlocks의 한 db.Update 안에서 root→encoded block을 blocks bucket에 쓰고 같은 root를 slot·parent index에 추가합니다. 둘 중 하나가 오류를 반환하면 transaction 전체가 commit되지 않습니다. State와 checkpoint는 이 transaction에 포함되지 않습니다.",
  "Root 조회는 primary record를 바로 찾고, slot 조회는 한 db.View 안에서 slot index의 root 목록을 읽습니다. Slot 64는 두 경쟁 root를 반환할 수 있습니다. 이 목록은 canonical head 한 개를 고르는 fork-choice 결과가 아닙니다.",
  "SaveStates는 state bytes와 state slot index를 자체 db.Update에서 저장합니다. SaveFinalizedCheckpoint도 state/summary 존재를 확인한 뒤 checkpoint와 finalized-root index를 자체 db.Update에서 저장합니다. 호출 순서와 실패 복구는 상위 service가 다뤄야 합니다.",
  "Block cache 갱신은 db.Update 호출이 돌아온 뒤 실행됩니다. 다만 현재 v7.3.1 함수는 err가 있어도 cache loop에 들어갈 수 있으므로 ‘commit 성공 뒤에만 cache를 갱신한다’고 소스보다 강하게 단정하지 않습니다. updated 표시는 callback 안에서 Put과 index 갱신 뒤 설정됩니다.",
  "DeleteHistoricalDataBeforeSlot은 먼저 지울 slot/root를 읽고, 한 write transaction에서 block·state·summary·관련 index를 지웁니다. Gloas execution payload envelope는 beacon block root가 아닌 payload block hash를 key로 쓰므로 이 loop에서 지울 수 없고 별도 pruning이 필요하다는 TODO가 남아 있습니다.",
] as const;

const RECEIPTS = [
  "block transaction ≠ state transaction ≠ checkpoint transaction",
  "slot 64 → {0x8a…31, 0x2f…b9}",
  "root · indices · encoded bytes를 transaction 밖에서 계산",
  "blocks bucket + slot index + parent index만 한 write transaction",
  "root는 원본 조회 · slot은 후보 root 목록 조회",
  "state와 finalized checkpoint는 각자 별도 db.Update",
  "DB callback의 updated 표식과 cache publication 경계를 분리",
  "선택한 historical record는 함께 삭제 · payload envelope는 별도 과제",
] as const;

function Cell({
  label,
  value,
  detail,
  active,
  muted,
}: {
  label: string;
  value: string;
  detail: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div className={`min-w-0 bg-background p-1.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""} ${muted ? "opacity-45" : ""}`}>
      <span className="block break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className={`mt-0.5 block break-keep text-[8px] leading-3 sm:mt-1 sm:text-xs sm:leading-4 ${active ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 hidden break-keep text-[9px] leading-4 text-muted-foreground sm:block">{detail}</span>
    </div>
  );
}

function BeaconDBMap({ active }: { active: number }) {
  const txActive = active === 3;
  const separateActive = active === 5;
  const pruneActive = active === 7;
  return (
    <div aria-label="두 경쟁 block의 준비·저장·조회·별도 상태 저장·pruning 경로">
      <div className="grid grid-cols-4 gap-px bg-border p-px">
        <Cell label="Block A" value="root 0x8a…31" detail="slot 64 · encoded bytes A" active={active === 1} />
        <Cell label="Block B" value="root 0x2f…b9" detail="slot 64 · encoded bytes B" active={active === 1} />
        <Cell label="prepareBlockBatch" value="transaction 밖" detail="root · index · encode 계산" active={active === 2} />
        <Cell label="SaveROBlocks" value="db.Update" detail="block 원본과 두 index" active={txActive} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="Primary" value={pruneActive ? "두 root 삭제 후보" : "root → block bytes"} detail="blocksBucket" active={txActive || active === 4 || pruneActive} />
        <Cell label="Slot index" value={pruneActive ? "slot key 삭제" : "64 → {A, B}"} detail="한 slot에 여러 root" active={txActive || active === 4 || pruneActive} />
        <Cell label="Parent index" value={pruneActive ? "matching root 정리" : "parent → child roots"} detail="branch 조회 축" active={txActive || pruneActive} />
      </div>

      <div className="mt-px grid grid-cols-4 gap-px bg-border p-px">
        <Cell label="Root read" value="Block(root)" detail="primary를 직접 조회" active={active === 4} />
        <Cell label="Slot 조회" value="Slot 64로 A·B 조회" detail="BlockRootsBySlot · root 목록" active={active === 4} />
        <Cell label="State 저장" value="별도 commit" detail="SaveStates · state와 slot index" active={separateActive} muted={txActive} />
        <Cell label="Checkpoint 저장" value="별도 commit" detail="SaveFinalizedCheckpoint · finalized root" active={separateActive} muted={txActive} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="Block cache" value={active === 6 ? "updated entry Set" : "process-local read cache"} detail="db.Update 반환 뒤 loop" active={active === 6} />
        <Cell label="Historical prune" value={pruneActive ? "block·state·index 삭제" : "cutoff slot 이전 선택"} detail="별도 write transaction" active={pruneActive} />
        <Cell label="남은 경계" value={pruneActive ? "payload envelope 별도" : "전역 commit 없음"} detail={pruneActive ? "Gloas TODO" : "상위 service가 호출 순서 소유"} active={pruneActive || active === 0} />
      </div>
    </div>
  );
}

export default function PrysmBeaconDBFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 14000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Prysm v7.3.1"
      title="Block·index는 같이, state·checkpoint는 따로 commit합니다"
      description="같은 slot의 두 block이 저장·조회·prune되는 경로로 transaction 경계를 봅니다."
      note="Slot 64와 축약 root는 설명용 값입니다. 함수·bucket·transaction 경계는 Prysm v7.3.1 commit 96d418cd에서 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-beacon-db-scene={active}
        tabIndex={0}
        role="group"
        aria-label="경쟁 block 저장에서 historical pruning까지 이어지는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="BeaconDB의 여덟 장면">
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

          <div className="mt-2 sm:mt-3"><BeaconDBMap active={active} /></div>

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
