import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "입력", "Fork", "Finality", "보상", "Queue", "Rotation", "출력"] as const;

const NOTES = [
  "Slot 351의 state에서 시작합니다. 다음 slot 352가 epoch 11의 시작이므로, slot을 352로 올리기 전에 epoch 10의 누적 state를 정산합니다.",
  "설명용 state에는 active balance 96, timely-target 참여 64, pending deposit 40·32가 있습니다. 세 validator의 effective balance를 각각 32로 두었습니다.",
  "Prysm의 공통 wrapper는 state.Version()을 읽어 fork별 ProcessEpoch를 하나만 선택합니다. 이 장면은 Fulu state 경로이며 다른 fork의 호출 목록을 섞지 않습니다.",
  "참여 기록을 한 번 집계한 뒤 target balance 64와 active balance 96을 비교합니다. 3×64=2×96이므로 2/3 조건을 만족하지만 finalization은 기존 justification bits와 checkpoint 간격까지 맞아야 합니다.",
  "같은 participation precompute를 보상·패널티 계산에 재사용합니다. 참여한 validator는 해당 flag reward 후보가 되고, target을 놓친 validator는 target penalty와 inactivity penalty 후보가 됩니다.",
  "Registry·slashing 뒤 pending queue를 처리합니다. Churn budget 64에서 amount 40은 적용되지만 다음 amount 32는 남은 24보다 커서 다음 epoch로 남습니다.",
  "Effective balance와 여러 ring을 갱신한 뒤 current participation을 previous로 옮기고 current를 0으로 초기화합니다. Fulu는 마지막에 proposer lookahead의 오래된 epoch를 밀어내고 새 epoch를 채웁니다.",
  "Epoch post-state가 완성되면 호출자가 slot을 352로 올립니다. 이 결과는 block 352 처리 전 state이며, block validity·fork-choice head·finality 완료를 뜻하지 않습니다.",
] as const;

const RECEIPTS = [
  "state@351 → fork별 epoch transition → slot 352 직전 state",
  "A=96 · target=64 · pending=[40, 32] · churn=64",
  "state.Version=Fulu → fulu.ProcessEpoch",
  "3×64 = 2×96 · justification bit 갱신 · finalization은 history 조건 추가",
  "같은 precompute → validator별 reward·penalty delta → balances",
  "40 적용 · 남은 budget 24 · 32는 pending queue에 유지",
  "flags 회전 · committee 조건부 갱신 · proposer lookahead 전진",
  "epoch transition 성공 · 아직 state.slot=351 · 다음 동작은 SetSlot(352)",
] as const;

type StageProps = {
  step: string;
  title: string;
  reads: string;
  writes: string;
  active: boolean;
  done: boolean;
};

function Stage({ step, title, reads, writes, active, done }: StageProps) {
  return (
    <li className={`grid min-w-0 gap-2 border-l-2 bg-background p-3 sm:p-4 lg:gap-1.5 lg:p-2 ${active ? "border-primary ring-1 ring-inset ring-primary" : done ? "border-foreground/45" : "border-border text-muted-foreground"}`}>
      <div className="flex items-start justify-between gap-2">
        <strong className="break-keep text-xs leading-5 sm:text-sm lg:text-[11px] lg:leading-4">{title}</strong>
        <span className="shrink-0 font-mono text-[9px] font-black text-primary">{step}</span>
      </div>
      <div className="grid gap-1 text-[10px] leading-4 sm:text-[11px] sm:leading-5 lg:text-[9px] lg:leading-4">
        <p><span className="font-bold text-muted-foreground">읽음</span> · {reads}</p>
        <p><span className="font-bold text-muted-foreground">바꿈</span> · {writes}</p>
      </div>
    </li>
  );
}

function InputState({ active = false }: { active?: boolean }) {
  return (
    <section className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">INPUT · STATE@351</span>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] leading-4 sm:text-xs sm:leading-5">
        <div><dt className="text-muted-foreground">Fork</dt><dd className="font-bold">Fulu</dd></div>
        <div><dt className="text-muted-foreground">Active / target</dt><dd className="font-bold">96 / 64</dd></div>
        <div><dt className="text-muted-foreground">Validators</dt><dd className="font-bold">V0 32 · V1 32 · V2 32</dd></div>
        <div><dt className="text-muted-foreground">Pending deposits</dt><dd className="font-bold">40 · 32</dd></div>
      </dl>
    </section>
  );
}

function ForkDispatch({ active = false }: { active?: boolean }) {
  return (
    <section className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">FORK DISPATCH</span>
      <strong className="mt-2 block break-keep text-sm">Version → Fulu ProcessEpoch</strong>
      <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
        요청 경로가 아니라 state-transition 함수 선택
      </p>
      <p className="mt-3 border-t border-border pt-3 text-[10px] leading-4 sm:text-xs sm:leading-5">
        Electra pipeline <span aria-hidden>→</span> Fulu proposer lookahead
      </p>
    </section>
  );
}

function OutputState({ active = false }: { active?: boolean }) {
  return (
    <section className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">OUTPUT · EPOCH POST-STATE</span>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] leading-4 sm:text-xs sm:leading-5">
        <div><dt className="text-muted-foreground">Checkpoint</dt><dd className="font-bold">bits·history 반영</dd></div>
        <div><dt className="text-muted-foreground">Balances</dt><dd className="font-bold">validator별 delta 반영</dd></div>
        <div><dt className="text-muted-foreground">Pending queue</dt><dd className="font-bold">32 유지</dd></div>
        <div><dt className="text-muted-foreground">다음 동작</dt><dd className="font-bold">SetSlot(352)</dd></div>
      </dl>
    </section>
  );
}

function BoundarySummary({
  label,
  value,
  detail,
  active = false,
}: {
  label: string;
  value: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <section className={`min-w-0 bg-background p-3 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">{label}</span>
      <strong className="mt-2 block break-keep text-xs leading-5">{value}</strong>
      <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">{detail}</p>
    </section>
  );
}

function PipelineStages({ active }: { active: number }) {
  return (
    <ol className="grid gap-2 lg:grid-cols-5">
      <Stage step="01" title="Participation · Finality" reads="participation flags · checkpoints" writes="justification bits · checkpoints" active={active === 3} done={active > 3} />
      <Stage step="02" title="Rewards · Penalties" reads="같은 precompute · inactivity score" writes="balance reward · penalty" active={active === 4} done={active > 4} />
      <Stage step="03" title="Registry · Pending Queue" reads="registry · slashings · pending" writes="lifecycle · deposit queue" active={active === 5} done={active > 5} />
      <Stage step="04" title="Effective Balance · Ring" reads="바뀐 balances · current epoch" writes="effective balance · reset vectors" active={active === 6} done={active > 6} />
      <Stage step="05" title="Rotation · Lookahead" reads="current participation · seed" writes="previous/current flags · proposer list" active={active === 6} done={active > 6} />
    </ol>
  );
}

function MobileScene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <ol className="grid gap-px bg-border p-px text-xs leading-5 lg:hidden" aria-label="에폭 전이의 전체 흐름">
        <li className="bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">STATE@351</span><strong className="mt-1 block">참여·checkpoint·balance·queue</strong></li>
        <li className="bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">FULU PROCESS EPOCH</span><strong className="mt-1 block">Finality → 보상·패널티 → Queue → Rotation</strong></li>
        <li className="bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">POST-STATE</span><strong className="mt-1 block">전이 성공 뒤 SetSlot(352)</strong></li>
      </ol>
    );
  }
  if (active === 1) return <div className="lg:hidden"><InputState active /></div>;
  if (active === 2) return <div className="lg:hidden"><ForkDispatch active /></div>;
  if (active === 7) return <div className="lg:hidden"><OutputState active /></div>;

  return (
    <div className="bg-border p-px lg:hidden">
      <ol className={`grid gap-px bg-border ${active === 6 ? "grid-cols-2" : ""}`}>
        {active === 3 && <Stage step="01" title="Participation · Finality" reads="participation flags · checkpoints" writes="justification bits · checkpoints" active done={false} />}
        {active === 4 && <Stage step="02" title="Rewards · Penalties" reads="같은 precompute · inactivity score" writes="balance reward · penalty" active done={false} />}
        {active === 5 && <Stage step="03" title="Registry · Pending Queue" reads="registry · slashings · pending" writes="lifecycle · deposit queue" active done={false} />}
        {active === 6 && <Stage step="04" title="Effective Balance · Ring" reads="바뀐 balances · current epoch" writes="effective balance · reset vectors" active done={false} />}
        {active === 6 && <Stage step="05" title="Rotation · Lookahead" reads="current participation · seed" writes="previous/current flags · proposer list" active done={false} />}
      </ol>
    </div>
  );
}

export default function PrysmEpochProcessingFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · slot 351에서 352"
      title="참여 기록을 정산한 뒤 다음 Epoch 상태를 준비합니다"
      description="하나의 Fulu BeaconState가 finality·보상·패널티·validator queue·rotation을 어떤 순서로 통과하는지 추적합니다."
      note="96·64·40·32는 순서와 조건을 세기 위한 설명용 stake 단위입니다. 함수 순서는 consensus-specs v1.7.0-beta.4와 Prysm v7.3.1 source에서 확인했으며 실행 시간은 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-epoch-processing-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Slot 351의 누적 참여 state가 epoch transition을 거쳐 slot 352 직전 state가 되는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-8 gap-px bg-border p-px" aria-label="에폭 처리의 여덟 장면">
          {SCENES.map((scene, index) => (
            <button type="button" key={scene} aria-pressed={index === active} onClick={() => scenes.setActive(index)} className={`min-w-0 bg-background px-0.5 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </button>
          ))}
        </div>

        <div className="mt-2 flex min-h-[12rem] items-center sm:mt-3 sm:min-h-[15rem] lg:block lg:min-h-0 [&>*]:w-full">
          <MobileScene active={active} />
          <div className="hidden gap-px bg-border p-px lg:grid lg:grid-cols-[1fr_0.9fr_1fr]" aria-label="입력 state, fork dispatch, 출력 state">
            <BoundarySummary label="INPUT · STATE@351" value="Fulu · active 96 / target 64" detail="validators V0·V1·V2 · pending [40, 32]" active={active === 1} />
            <BoundarySummary label="FORK DISPATCH" value="Version → Fulu ProcessEpoch" detail="Electra pipeline → proposer lookahead" active={active === 2} />
            <BoundarySummary label="OUTPUT · POST-STATE" value="checkpoint · balances · pending 32" detail="성공 뒤 SetSlot(352)" active={active === 7} />
          </div>
          <div className="mt-2 hidden bg-border p-px lg:block" aria-label="순서가 있는 epoch pipeline">
            <PipelineStages active={active} />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 변화</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-1 min-h-[5.75rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-[7.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={SCENES}
          playLabel="재생"
          className="mt-0 sm:mt-4"
          compact
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
