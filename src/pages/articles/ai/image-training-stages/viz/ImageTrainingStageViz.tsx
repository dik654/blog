import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "160px 기준 학습",
  "320px 단계로 전환",
  "임시 label 통과",
  "강한 변형에서 학습",
] as const;

const NOTES = [
  "run img-cls-07은 label이 있는 이미지로 시작하며, 한 update가 256장을 봅니다.",
  "해상도와 device별 batch가 바뀌므로 새 stage입니다. 누적 횟수를 바꿔 update당 256장은 유지합니다.",
  "label이 없는 u-042의 weak view에서 신발 확률 .96이 기준 .95를 넘어 임시 label이 됩니다.",
  "같은 u-042의 strong view가 신발 .72를 내면 −ln(.72)=.3285만큼 loss가 생깁니다.",
] as const;

function ScenePlayer({
  children,
}: {
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(LABELS.length, 5200, {
    loop: false,
    autoPlay: false,
  });

  return (
    <VizFrame
      eyebrow="한 run 추적"
      title="한 번에 한 축만 바꾸면 어떤 단계가 결과를 바꿨는지 알 수 있습니다"
      description="재생하면 같은 학습 run이 해상도를 넘겨받고, label이 없는 이미지 하나를 임시 정답으로 골라 loss를 만드는 과정을 보여줍니다."
      className="my-8"
    >
      <div
        id={controls.playbackId}
        data-viz-id="image-training-stage-viz"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-primary [&_[data-viz-controls]>p]:hidden"
      >
        <div data-viz-live-only>
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
            학습 단계 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-base font-bold leading-6">
            {LABELS[controls.active]}
          </h3>
          <div className="mt-3 min-w-0 overflow-hidden">
            {children(controls.active)}
          </div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground">
            {NOTES[controls.active]}
          </p>
        </div>
        <AnimatedSceneControls labels={[...LABELS]} {...controls} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {LABELS.map((label, index) => (
            <li key={label}>
              <strong>
                {index + 1}. {label}
              </strong>
              <span className="mt-1 block text-muted-foreground">
                {NOTES[index]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function StageRail({ active }: { active: number }) {
  const stages = [
    { step: "S0", label: "기준 학습", state: "160px · labeled" },
    { step: "S1", label: "해상도 전환", state: "320px · checkpoint" },
    { step: "S2", label: "임시 label", state: "weak → strong" },
  ] as const;

  return (
    <div className="space-y-px bg-border p-px">
      {stages.map((stage, index) => {
        const reached = active >= index;
        const current =
          (active === 0 && index === 0) ||
          (active === 1 && index === 1) ||
          (active >= 2 && index === 2);
        return (
          <motion.div
            key={stage.step}
            initial={false}
            animate={{ opacity: reached ? 1 : 0.3 }}
            className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 bg-background px-3 py-3 ${
              current
                ? "border-l-2 border-primary"
                : "border-l-2 border-transparent"
            }`}
          >
            <strong className="font-mono text-xs text-primary">
              {stage.step}
            </strong>
            <div className="min-w-0">
              <strong className="block break-keep text-xs">
                {stage.label}
              </strong>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">
                {stage.state}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function StateCell({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 border-t border-border py-2 first:border-t-0">
      <span className="block text-[9px] font-bold uppercase tracking-[.1em] text-muted-foreground">
        {label}
      </span>
      <strong
        className={`mt-1 block break-words font-mono text-xs ${
          emphasis ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function CurrentState({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div className="grid grid-cols-2 gap-x-4">
        <StateCell label="입력" value="160 × 160px" emphasis />
        <StateCell label="출발 상태" value="checkpoint c0" />
        <StateCell label="한 GPU" value="64 images" />
        <StateCell label="GPU" value="4 devices" />
        <StateCell label="누적" value="1 micro-step" />
        <StateCell label="한 update" value="64 × 4 × 1 = 256" emphasis />
      </div>
    );
  }

  if (active === 1) {
    return (
      <div className="grid grid-cols-2 gap-x-4">
        <StateCell label="입력" value="320 × 320px" emphasis />
        <StateCell label="넘겨받음" value="checkpoint c0" />
        <StateCell label="한 GPU" value="16 images" />
        <StateCell label="GPU" value="4 devices" />
        <StateCell label="누적" value="4 micro-steps" />
        <StateCell label="한 update" value="16 × 4 × 4 = 256" emphasis />
      </div>
    );
  }

  if (active === 2) {
    return (
      <div className="space-y-3">
        <div className="border-y border-border py-3">
          <p className="text-[9px] font-bold uppercase tracking-[.1em] text-muted-foreground">
            label 없는 이미지
          </p>
          <strong className="mt-1 block font-mono text-sm">u-042</strong>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">weak view</p>
            <strong className="font-mono text-sm">q(신발)=.96</strong>
          </div>
          <strong className="font-mono text-sm text-primary">.96 ≥ .95</strong>
        </div>
        <div className="border-l-2 border-primary pl-3">
          <p className="text-[10px] text-muted-foreground">임시 label</p>
          <strong className="text-sm">ŷ = 신발 · 통과</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 border-y border-border py-3">
        <div>
          <p className="text-[10px] text-muted-foreground">임시 label</p>
          <strong className="text-sm">ŷ = 신발</strong>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">strong view</p>
          <strong className="font-mono text-sm">p(신발)=.72</strong>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3">
        <p className="text-[10px] text-muted-foreground">unlabeled loss</p>
        <strong className="mt-1 block font-mono text-sm text-primary">
          −ln(.72) = .3285
        </strong>
      </div>
      <p className="break-keep text-[10px] leading-4 text-muted-foreground">
        .96은 정답 보장이 아니라 loss에 넣을지 정하는 현재 모델의 자신감입니다.
      </p>
    </div>
  );
}

function MobileTrace({ active }: { active: number }) {
  const rows = [
    {
      label: "기준 학습",
      value: "160px · 64×4×1=256",
      visible: active >= 0,
    },
    {
      label: "해상도 전환",
      value: "320px · 16×4×4=256",
      visible: active >= 1,
    },
    {
      label: "weak view",
      value: "u-042 · .96 ≥ .95 → 신발",
      visible: active >= 2,
    },
    {
      label: "strong view",
      value: "p=.72 · −ln(.72)=.3285",
      visible: active >= 3,
    },
  ] as const;

  return (
    <div className="space-y-px bg-border p-px sm:hidden">
      {rows.map((row, index) => (
        <motion.div
          key={row.label}
          initial={false}
          animate={{ opacity: row.visible ? 1 : 0.28 }}
          className={`grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 bg-background px-3 py-3 ${
            active === index
              ? "border-l-2 border-primary"
              : "border-l-2 border-transparent"
          }`}
        >
          <strong className="break-keep text-[10px]">{row.label}</strong>
          <span className="break-words font-mono text-[10px] text-muted-foreground">
            {row.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function ImageTrainingStageViz() {
  return (
    <ScenePlayer>
      {(active) => (
        <div role="img" aria-label={LABELS[active]} className="min-w-0">
          <MobileTrace active={active} />
          <div className="hidden gap-5 sm:grid sm:grid-cols-[12rem_minmax(0,1fr)]">
            <section>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[.14em] text-muted-foreground">
                run img-cls-07
              </p>
              <StageRail active={active} />
            </section>
            <section className="min-w-0 border-y border-border py-2">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[.14em] text-primary">
                현재 장면의 상태
              </p>
              <CurrentState active={active} />
            </section>
          </div>
        </div>
      )}
    </ScenePlayer>
  );
}

export function StageFailureBoundaryViz() {
  return (
    <VizFrame
      eyebrow="해석 경계"
      title="두 축을 동시에 바꾸면 좋아진 이유도 나빠진 이유도 분리할 수 없습니다"
      description="같은 출발 checkpoint에서 해상도와 pseudo-label을 각각 따로 바꾼 가지를 먼저 비교합니다."
      className="my-8"
    >
      <div
        role="img"
        aria-label="같은 기준 학습에서 해상도만 바꾼 가지와 pseudo-label만 추가한 가지를 분리하고, 두 변화를 동시에 넣은 결과는 원인을 구분할 수 없다고 표시한 그림"
        className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch"
      >
        <section className="border-y border-border py-4">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-primary">
            가지 A
          </p>
          <strong className="mt-2 block break-keep text-sm">
            해상도만 변경
          </strong>
          <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
            같은 labeled data · 같은 update당 256장
          </p>
        </section>
        <div className="hidden w-px bg-border sm:block" aria-hidden="true" />
        <section className="border-y border-border py-4">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-primary">
            가지 B
          </p>
          <strong className="mt-2 block break-keep text-sm">
            임시 label만 추가
          </strong>
          <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
            같은 160px · unlabeled loss만 추가
          </p>
        </section>
      </div>
      <p className="mt-4 border-l-2 border-primary pl-3 text-xs leading-5 text-muted-foreground">
        해상도와 pseudo-label을 동시에 바꾼 한 결과만으로는 어느 변화가 결과를
        만들었는지 알 수 없습니다.
      </p>
    </VizFrame>
  );
}
