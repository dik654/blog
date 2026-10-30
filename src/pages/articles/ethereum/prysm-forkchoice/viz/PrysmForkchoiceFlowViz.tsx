import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "입력", "Vote", "Delta", "Boost", "Weight", "Head", "Tick"] as const;

const NOTES = [
  "두 block이 모두 state transition과 실행 검증을 통과해도 현재 따라갈 head는 하나여야 합니다. Prysm은 block tree, validator별 latest vote, checkpoint와 현재 slot의 임시 proposer boost를 같은 fork-choice store에서 계산합니다.",
  "설명용 Fulu slot 353에서 justified root J320 아래 A353과 B353이 모두 유효합니다. Latest vote만 세면 A subtree는 96, B subtree는 80 weight unit입니다. Total active balance 3,200과 32 slots는 proposer boost 계산을 보여 주기 위한 정규화 값입니다.",
  "ProcessAttestation은 validator마다 current vote를 바로 덮지 않고 first vote 또는 더 새로운 target epoch의 nextRoot·nextSlot을 기록합니다. 서명 검증과 target-state 검증은 이 함수에 오기 전에 끝난 입력입니다.",
  "Head가 시작되면 updateBalances가 current와 next를 비교합니다. 이전 root의 직접 balance를 빼고 새 root에 justified balance를 더한 뒤 next를 current로 회전합니다. 자식 weight는 다음 단계에서 다시 합산합니다.",
  "B353이 현재 slot의 첫 timely block이고 dependent root가 기존 head와 같다고 가정합니다. Active balance 3,200÷32=100, PROPOSER_SCORE_BOOST 40%이므로 B353의 직접 balance에 임시 40을 더합니다.",
  "Prysm은 leaf에서 root 방향으로 node.weight = node.balance + childrenWeight를 다시 계산합니다. A subtree는 96, B subtree는 80+40=120이 됩니다. Boost는 validator vote가 아니라 별도 임시 score입니다.",
  "Viable branch만 비교해 각 node의 bestDescendant를 갱신합니다. B의 120이 A의 96보다 크므로 justified root J320의 bestDescendant는 B353이고 store.head가 이 root를 반환합니다.",
  "Slot 354가 시작되면 NewSlot이 proposerBoostRoot를 비웁니다. 다음 Head는 이전 40을 제거해 A=96, B=80을 복원하므로 head가 A353으로 바뀝니다. 이는 retained tree 안의 head reorg이며 finality나 prune이 아닙니다.",
] as const;

const RECEIPTS = [
  "validated blocks + latest votes + checkpoint + time → one current head",
  "J320 → A353(96) | B353(80) · active 3,200 · 32 slots",
  "validator latest message → vote.nextRoot · vote.nextSlot",
  "old direct balance −b · new direct balance +b · current ← next",
  "committee 100 × 40% → B353 +40",
  "A subtree 96 · B subtree 120",
  "bestDescendant(J320) = B353 → head B353",
  "boost root reset · previous 40 removed → A96 > B80 → head A353",
] as const;

type BranchProps = {
  label: "A" | "B";
  base: number;
  boost: number;
  selected: boolean;
  active: number;
};

function Branch({ label, base, boost, selected, active }: BranchProps) {
  const total = base + boost;
  return (
    <div className={`min-w-0 bg-background p-3 ${selected ? "ring-2 ring-inset ring-primary" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[9px] font-black text-primary">{label} subtree</span>
          <strong className="mt-1 block text-xs">{label}352 → {label}353</strong>
        </div>
        <span className="font-mono text-sm font-black">{total}</span>
      </div>
      <div className="mt-3 h-2 bg-muted">
        <div className="h-full bg-foreground/65" style={{ width: `${Math.min(100, base)}%` }} />
      </div>
      <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
        latest {base}{boost > 0 ? ` + boost ${boost}` : ""}
      </p>
      {active === 3 && <p className="mt-1 text-[9px] leading-4 text-primary">current↔next delta 반영</p>}
    </div>
  );
}

function TreeScene({ active }: { active: number }) {
  const boost = active >= 4 && active <= 6 ? 40 : 0;
  const selected = active >= 6 && active <= 6 ? "B" : active === 7 ? "A" : undefined;
  return (
    <div className="grid gap-px bg-border p-px" aria-label="J320 아래 A와 B fork의 weight 변화">
      <div className="bg-background p-3 text-center">
        <span className="font-mono text-[9px] font-black text-primary">justified root</span>
        <strong className="mt-1 block text-sm">J320</strong>
        <p className="mt-1 text-[9px] leading-4 text-muted-foreground">viable child만 비교</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <Branch label="A" base={96} boost={0} selected={selected === "A"} active={active} />
        <Branch label="B" base={80} boost={boost} selected={selected === "B"} active={active} />
      </div>
    </div>
  );
}

export default function PrysmForkchoiceFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Fulu fork choice"
      title="Vote를 balance로 옮기고, 잠시 boost한 뒤, 현재 head 하나를 읽습니다"
      description="Prysm v7.3.1의 current·next vote, proposer boost, subtree weight와 best-descendant가 실제로 바뀌는 순서를 추적합니다."
      note="Root 이름과 weight는 설명용입니다. 함수 순서와 40% proposer-score 상수는 고정한 source에서 확인했으며 처리 지연은 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-forkchoice-scene={active}
        tabIndex={0}
        role="group"
        aria-label="두 유효한 가지의 vote와 proposer boost가 head를 바꾸는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="overflow-x-auto" aria-label="Fork choice의 여덟 장면">
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

        <div className="mt-2 sm:mt-3">
          <TreeScene active={active} />
          <div className="mt-px grid grid-cols-3 gap-px bg-border p-px text-center">
            {[
              ["Vote owner", active >= 2 ? "current · next" : "latest message"],
              ["Score", active >= 4 && active <= 6 ? "B +40" : "vote only"],
              ["Head", active === 6 ? "B353" : active === 7 ? "A353" : "계산 중"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 bg-background p-2.5">
                <span className="text-[8px] font-bold text-muted-foreground">{label}</span>
                <strong className="mt-1 block break-keep text-[10px] leading-4">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 grid min-h-[6.75rem] grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[7.5rem]">
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 변화</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-1 min-h-[8.25rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-[7.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
