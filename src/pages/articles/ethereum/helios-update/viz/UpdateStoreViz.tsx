import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "전체 전이",
  "검증 결과",
  "후보 저장",
  "Optimistic",
  "Finality",
  "Committee",
  "Store T1",
] as const;

const NOTES = [
  "Consensus 글에서 검증을 마친 u-8193만 입력으로 받습니다. 이 글의 관심사는 서명이 아니라 Store T0의 어느 필드가 어떤 조건으로 바뀌는지입니다.",
  "입력 receipt는 attested·finalized slot 8,192, signature slot 8,193, 참여 342/512, next committee K2입니다. 이 장면에서는 검증 결과를 소비할 뿐 다시 계산하지 않습니다.",
  "best_valid_update가 비어 있으므로 u-8193을 저장합니다. 참여 최댓값은 max(400,342)=400으로 유지됩니다. Full apply가 안 되더라도 이 후보는 force-update 판단에 남을 수 있습니다.",
  "Safety threshold는 max(previous 380,current 400)/2=200입니다. 342>200이고 attested 8,192>optimistic 8,191이므로 optimistic header만 먼저 전진할 수 있습니다.",
  "342×3=1,026≥512×2=1,024이고 finalized 8,192>8,191입니다. 따라서 full apply 조건이 참입니다. 이 2/3 판정은 optimistic 조건과 별개입니다.",
  "Finalized period가 0에서 1로 넘어갑니다. 기존 next K1을 current로, update가 증명한 K2를 next로 옮깁니다. previous max는 400이 되고 current max는 0으로 초기화됩니다.",
  "Finalized·optimistic header는 8,192, current·next committee는 K1·K2가 됩니다. 8,192는 epoch 경계라 checkpoint root를 반환하고 best_valid_update를 비웁니다. 이 결과는 메모리 Store 변경입니다.",
] as const;

type StageState = "idle" | "active" | "done";

function state(active: number, scene: number): StageState {
  if (active < scene) return "idle";
  if (active === scene) return "active";
  return "done";
}

function Cell({
  label,
  title,
  before,
  after,
  status,
}: {
  label: string;
  title: string;
  before: string;
  after: string;
  status: StageState;
}) {
  return (
    <div
      className={`min-w-0 border-l-2 px-3 py-3 ${
        status === "active"
          ? "border-primary bg-primary/[0.055]"
          : status === "done"
            ? "border-foreground/35 bg-background"
            : "border-border bg-background"
      }`}
    >
      <p className="font-mono text-[9px] font-black tracking-wide text-muted-foreground">
        {label}
      </p>
      <strong className="mt-1.5 block break-keep text-sm leading-5">
        {title}
      </strong>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 font-mono text-[9px] leading-4">
        <span className="min-w-0 break-words text-muted-foreground">{before}</span>
        <span aria-hidden className={status === "idle" ? "text-muted-foreground/50" : "text-primary"}>
          →
        </span>
        <span className={`min-w-0 break-words text-right font-bold ${status === "idle" ? "text-muted-foreground" : "text-primary"}`}>
          {status === "idle" ? "대기" : after}
        </span>
      </div>
    </div>
  );
}

function Decision({
  active,
  label,
  expression,
  result,
}: {
  active: boolean;
  label: string;
  expression: string;
  result: string;
}) {
  return (
    <div className={`border px-3 py-3 ${active ? "border-primary bg-primary/[0.045]" : "border-border bg-background"}`}>
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-mono text-[10px] leading-4">{expression}</p>
      <p className={`mt-2 text-xs font-black ${active ? "text-primary" : "text-muted-foreground"}`}>
        {active ? result : "판정 대기"}
      </p>
    </div>
  );
}

function CompactLine({
  label,
  before,
  after,
  emphasized = false,
}: {
  label: string;
  before: string;
  after: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 border-l-2 px-2 py-2 ${
        emphasized
          ? "border-primary bg-primary/[0.055]"
          : "border-border bg-background"
      }`}
    >
      <strong className="break-keep text-[9px] leading-4 text-muted-foreground">
        {label}
      </strong>
      <span className="min-w-0 break-words text-right font-mono text-[9px] leading-4">
        {before}
      </span>
      <span aria-hidden className={emphasized ? "text-primary" : "text-muted-foreground"}>
        →
      </span>
      <span
        className={`min-w-0 break-words font-mono text-[9px] font-bold leading-4 ${
          emphasized ? "text-primary" : "text-foreground"
        }`}
      >
        {after}
      </span>
    </div>
  );
}

function CompactScene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div className="grid gap-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2">
          <div className="border-l-2 border-foreground/40 px-3 py-3">
            <p className="font-mono text-[9px] font-black text-muted-foreground">STORE T0</p>
            <p className="mt-1 text-xs font-bold">slot 8,191</p>
            <p className="mt-1 font-mono text-[9px] text-muted-foreground">K0/K1 · 380/400</p>
          </div>
          <span aria-hidden className="self-center text-primary">→</span>
          <div className="border-l-2 border-primary bg-primary/[0.055] px-3 py-3">
            <p className="font-mono text-[9px] font-black text-muted-foreground">STORE T1</p>
            <p className="mt-1 text-xs font-bold">slot 8,192</p>
            <p className="mt-1 font-mono text-[9px] text-primary">K1/K2 · checkpoint</p>
          </div>
        </div>
        <p className="border-t border-border px-2 pt-2 text-[10px] leading-4 text-muted-foreground">
          후보 보존 → 빠른 값 → 확정 값 → 위원회 교대 순서로 같은 Store가 바뀝니다.
        </p>
      </div>
    );
  }

  if (active === 1) {
    return (
      <div className="grid gap-2">
        <div className="border-l-2 border-foreground/40 px-3 py-3">
          <p className="font-mono text-[9px] font-black text-muted-foreground">STORE T0</p>
          <p className="mt-1 break-keep text-xs font-bold">finalized 8,191 · K0/K1 · max 380/400</p>
        </div>
        <div className="border-l-2 border-primary bg-primary/[0.055] px-3 py-3">
          <p className="font-mono text-[9px] font-black text-muted-foreground">VERIFIED UPDATE</p>
          <p className="mt-1 break-keep text-xs font-bold">u-8193 · attested 8,192 · 342/512 · K2</p>
        </div>
      </div>
    );
  }

  if (active === 2) {
    return (
      <div className="grid gap-1.5">
        <CompactLine label="후보" before="None" after="u-8193" emphasized />
        <CompactLine label="현재 최대" before="400" after="max(400,342)=400" emphasized />
        <p className="px-2 pt-1 text-[10px] leading-4 text-muted-foreground">
          지금 적용하지 못해도 다음 force-update 판단에 쓸 후보를 남깁니다.
        </p>
      </div>
    );
  }

  if (active === 3) {
    return (
      <div className="grid gap-2">
        <div className="border border-primary bg-primary/[0.045] px-3 py-3">
          <p className="text-[10px] font-bold text-muted-foreground">Optimistic 조건</p>
          <p className="mt-1 font-mono text-[10px] font-bold">342 &gt; max(380,400)/2 = 200</p>
        </div>
        <CompactLine label="빠른 값" before="slot 8,191" after="slot 8,192" emphasized />
      </div>
    );
  }

  if (active === 4) {
    return (
      <div className="grid gap-2">
        <div className="border border-primary bg-primary/[0.045] px-3 py-3">
          <p className="text-[10px] font-bold text-muted-foreground">Full apply 조건</p>
          <p className="mt-1 font-mono text-[10px] font-bold">342×3 = 1,026 ≥ 512×2 = 1,024</p>
        </div>
        <CompactLine label="확정 값" before="slot 8,191" after="slot 8,192" emphasized />
      </div>
    );
  }

  if (active === 5) {
    return (
      <div className="grid gap-1.5">
        <p className="border-l-2 border-primary bg-primary/[0.055] px-3 py-2 font-mono text-[10px] font-bold">
          period(finalized)=1 = period(store)+1
        </p>
        <CompactLine label="현재 위원회" before="K0" after="K1" emphasized />
        <CompactLine label="다음 위원회" before="K1" after="K2" emphasized />
        <CompactLine label="참여 최대" before="current 400" after="previous 400 · current 0" />
      </div>
    );
  }

  return (
    <div className="grid gap-1.5">
      <CompactLine label="헤더" before="8,191" after="8,192" emphasized />
      <CompactLine label="위원회" before="K0/K1" after="K1/K2" emphasized />
      <CompactLine label="후보" before="u-8193" after="None · applied" />
      <CompactLine label="출력" before="없음" after="checkpoint root" emphasized />
    </div>
  );
}

export default function UpdateStoreViz() {
  const scenes = useAnimatedScenes(LABELS.length, 8800, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Store transition · T0 → T1"
      title="검증된 u-8193이 Store의 필드를 서로 다른 조건으로 바꿉니다"
      description="부모 글의 검증 완료 지점에서 시작합니다. 후보 보존, optimistic 전진, full apply, committee handoff와 checkpoint 반환을 같은 메모리 Store에서 추적합니다."
      note="Slot·committee ID와 참여 최댓값은 상태 전이를 설명하기 위한 고정 사례입니다. 대상 네트워크에서 측정한 값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-update-store-scene={active}
        tabIndex={0}
        role="group"
        aria-label="검증된 u-8193이 Store T0을 T1으로 바꾸는 일곱 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">
            {String(active + 1).padStart(2, "0")} · {LABELS[active]}
          </strong>
          <span className="font-mono text-[10px] text-muted-foreground">
            u-8193 · {active + 1}/7
          </span>
        </div>

        <div className="mt-3 hidden gap-3 xl:grid xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="grid gap-3">
            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <div className={active === 1 ? "bg-primary/[0.055] px-3 py-3" : "bg-background px-3 py-3"}>
                <p className="font-mono text-[9px] font-black text-muted-foreground">STORE T0</p>
                <p className="mt-1 break-keep text-xs font-bold">8191 · K0/K1 · max 380/400</p>
              </div>
              <div className={active === 1 ? "bg-primary/[0.055] px-3 py-3" : "bg-background px-3 py-3"}>
                <p className="font-mono text-[9px] font-black text-muted-foreground">VERIFIED UPDATE</p>
                <p className="mt-1 break-keep text-xs font-bold">u-8193 · 342 bits · K2</p>
              </div>
            </div>
            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <Cell
                label="CANDIDATE"
                title="best_valid_update"
                before="None"
                after={active >= 6 ? "None · applied" : "u-8193"}
                status={state(active, 2)}
              />
              <Cell
                label="PARTICIPATION"
                title="current max"
                before="400"
                after={active >= 5 ? "0 · previous=400" : "max(400,342)=400"}
                status={state(active, 2)}
              />
              <Cell label="FAST HEAD" title="optimistic header" before="slot 8,191" after="slot 8,192" status={state(active, 3)} />
              <Cell label="STRONG HEAD" title="finalized header" before="slot 8,191" after="slot 8,192" status={state(active, 4)} />
              <Cell label="SIGNER SET" title="current committee" before="K0" after="K1" status={state(active, 5)} />
              <Cell label="NEXT SET" title="next committee" before="K1" after="K2" status={state(active, 5)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Decision
              active={active >= 3}
              label="Optimistic 조건"
              expression="342 > max(380,400)/2 = 200"
              result="ATTESTED 8,192 적용"
            />
            <Decision
              active={active >= 4}
              label="Full apply 조건"
              expression="342×3 = 1,026 ≥ 1,024 · finalized가 더 새로움"
              result="FINALITY 적용"
            />
            <Decision
              active={active >= 5}
              label="Committee 조건"
              expression="period(finalized)=1 = period(store)+1"
              result="K1 → current · K2 → next"
            />
          </div>
        </div>

        <div className="mt-3 xl:hidden">
          <CompactScene active={active} />
        </div>

        <div className="mt-3 border-y border-border px-2 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-xs">현재 결과</strong>
            <span className="font-mono text-[9px] font-bold text-primary">
              {active < 6 ? "T0 TRANSITIONING" : "T1 + CHECKPOINT"}
            </span>
          </div>
          <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
            {NOTES[active]}
          </p>
        </div>

        <AnimatedSceneControls
          labels={LABELS}
          controlLabels={["지도", "입력", "후보", "빠른값", "확정값", "교대", "결과"]}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="재생"
          className="sm:[&_button]:!min-w-0"
        />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </VizFrame>
  );
}
