import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "Copy", "값 분리", "Dirty", "Chunk", "Field Root", "State Root", "Fork"] as const;

const NOTES = [
  "하나의 parent BeaconState에서 후보 view B를 만들고 validator 5의 balance만 바꿉니다. 값의 소유권, dirty 좌표와 Merkle cache가 같은 state ID를 따라가야 원본 A와 새 root B를 분리할 수 있습니다.",
  "Copy는 balances 전체를 곧바로 복제하지 않습니다. A와 B에 서로 다른 state ID를 주고 같은 multi-value container의 값을 읽도록 등록합니다. 각 view의 dirty map과 FieldTrie view는 따로 준비합니다.",
  "B에서 UpdateBalancesAtIndex(5, 31 ETH)를 호출하면 multi-value slice는 index 5에 B 전용 값을 만듭니다. A는 계속 32 ETH를 읽습니다. 이 단계가 branch 간 값 격리입니다.",
  "Setter는 Balances field와 element index 5를 B의 dirty receipt에 기록합니다. Setter를 우회해 backing data를 직접 바꾸면 값은 달라져도 root cache는 그대로 남을 수 있습니다.",
  "Balance는 uint64라서 32-byte SSZ chunk 하나에 네 값이 들어갑니다. FieldTrie는 element index 5를 floor(5/4)=1인 chunk index로 바꿉니다. Index 4·5·6·7은 같은 chunk를 공유합니다.",
  "공유 중인 Balances FieldTrie는 B용 overlay로 갈라집니다. Chunk 1과 그 조상 path만 다시 계산해 새 Balances field root를 만들고 A의 trie와 field root는 그대로 둡니다.",
  "새 Balances field root를 BeaconState container의 해당 leaf에 넣고 top-level 조상 path를 다시 계산합니다. B의 state root만 바뀌며, 같은 B에서 다시 HashTreeRoot를 부르면 dirty 목록이 비어 있어 같은 root를 반환해야 합니다.",
  "Fork activation은 cache 표시만 바꾸는 일이 아닙니다. 새 BeaconState schema를 만들고 공통 field를 옮긴 뒤 participation과 sync committee처럼 새 값을 규칙대로 계산합니다. Schema가 바뀌면 root의 해석도 함께 바뀝니다.",
] as const;

const RECEIPTS = [
  "A root = R₀ · B root는 아직 R₀",
  "A.id ≠ B.id · balances container와 읽는 값은 공유",
  "A.balance[5] = 32 ETH · B.balance[5] = 31 ETH",
  "B.dirtyFields = {Balances} · B.dirtyIndices = {5}",
  "element 5 ÷ 4 → chunk 1",
  "B Balances root = 새 값 · A Balances root = 기존 값",
  "A state root = R₀ · B state root = R₁ · R₀ ≠ R₁",
  "old schema → upgrade function → new schema와 새 root",
] as const;

function Box({ active, eyebrow, title, detail }: { active: boolean; eyebrow: string; title: string; detail: string }) {
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="block break-keep text-[8px] font-bold leading-3 text-muted-foreground sm:text-[10px]">{eyebrow}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-sm sm:leading-5">{title}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</span>
    </div>
  );
}

export default function PrysmBeaconStateFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · balance 하나"
      title="복사본 한 칸의 변경이 새 State Root로 올라갑니다"
      description="Parent state A를 B로 복사하고 validator index 5의 balance만 바꾸면서 값 소유권·dirty 좌표·Merkle path를 함께 추적합니다."
      note="32 ETH와 31 ETH는 흐름을 설명하기 위한 값입니다. Root parity와 자료구조 동작은 Prysm v7.3.1 source·test로 확인했으며 처리량과 메모리 절감량은 측정하지 않았습니다."
      canvasClassName="px-2 py-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-beacon-state-scene={active}
        tabIndex={0}
        role="group"
        aria-label="BeaconState 복사본의 balance 하나가 분리되고 새 state root로 반영되는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-8 gap-px bg-border p-px" aria-label="BeaconState의 여덟 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px sm:mt-3" aria-label="원본과 복사본 state view">
          <Box active={active === 1 || active === 2 || active === 6} eyebrow="STATE A · parent" title="balance[5] = 32 ETH" detail="state ID A · root R₀ 유지" />
          <Box active={active >= 1 && active <= 6} eyebrow="STATE B · copy" title={active >= 2 ? "balance[5] = 31 ETH" : "balance[5] = 32 ETH"} detail={active >= 6 ? "state ID B · root R₁" : "state ID B · 후보 view"} />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="복사본에서 root로 이어지는 내부 상태">
          <Box active={active === 1 || active === 2} eyebrow="MULTI-VALUE" title={active >= 2 ? "index 5 · B 전용 값" : "A·B가 같은 원본 값 읽기"} detail="state ID가 값의 소유자를 구분" />
          <Box active={active === 3} eyebrow="DIRTY RECEIPT" title={active >= 3 ? "Balances · element 5" : "변경 없음"} detail="field와 element 좌표를 함께 기록" />
          <Box active={active === 4} eyebrow="SSZ PACKING" title={active >= 4 ? "chunk = floor(5/4) = 1" : "uint64 × 4 / chunk"} detail="element 좌표를 chunk 좌표로 변환" />
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-stretch gap-px bg-border p-px sm:mt-3" aria-label="FieldTrie와 top-level state tree">
          <Box active={active === 5} eyebrow="BALANCES FIELDTRIE" title={active >= 5 ? "B overlay · chunk 1 path" : "A·B가 field root 공유"} detail="dirty chunk와 조상만 다시 hash" />
          <div className="flex min-w-8 items-center justify-center bg-background px-1 text-sm text-muted-foreground" aria-hidden>→</div>
          <Box active={active === 6} eyebrow="BEACONSTATE TREE" title={active >= 6 ? "Balances leaf → root R₁" : "container root R₀"} detail="top-level field path를 다시 hash" />
        </div>

        <div className={`mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3 ${active === 7 ? "ring-2 ring-primary" : ""}`} aria-label="Fork upgrade에서 state schema가 바뀌는 경계">
          <Box active={active === 7} eyebrow="OLD SCHEMA" title="Phase0 state" detail="공통 field와 기존 root 규칙" />
          <Box active={active === 7} eyebrow="UPGRADE FUNCTION" title="Translate + derive" detail="participation과 committee 계산" />
          <Box active={active === 7} eyebrow="NEW SCHEMA" title="Altair state" detail="새 field set과 새 root 해석" />
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
          controlLabels={["전체", "Copy", "값 분리", "Dirty", "Chunk", "Field Root", "State Root", "Fork"]}
          playLabel="재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
