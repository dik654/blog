import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { SUPCON_BATCH_FIXTURE } from "./calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 7200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 [&>figcaption>p:last-child]:hidden sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7 sm:[&>figcaption>p:last-child]:mt-2 sm:[&>figcaption>p:last-child]:block sm:[&>figcaption>p:last-child]:text-sm sm:[&>figcaption>p:last-child]:leading-6"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[22rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">
            {labels[active]}
          </h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          labels={labels}
          active={active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li
              key={label}
              className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

const SOURCE_GROUPS = [
  { source: "A", label: "신발", views: ["A₁", "A₂"] },
  { source: "B", label: "신발", views: ["B₁", "B₂"] },
  { source: "C", label: "가방", views: ["C₁", "C₂"] },
] as const;

export function SupConBatchViz() {
  const labels = [
    "원본 세 개에 class label이 붙어 있습니다",
    "각 원본에서 view를 두 개씩 만듭니다",
    "원본 label을 두 view에 그대로 복사합니다",
    "A₁은 같은 label view 세 개를 찾습니다",
  ] as const;
  const notes = [
    "설명용 batch에는 신발 사진 A·B와 가방 사진 C가 있습니다. 원본 수 N은 3입니다.",
    "독립 augmentation을 두 번 적용하므로 encoder 입력은 A₁·A₂·B₁·B₂·C₁·C₂, 모두 6개입니다.",
    "A와 B에서 나온 네 view는 신발 label을, C에서 나온 두 view는 가방 label을 가집니다.",
    "Anchor A₁을 빼면 같은 원본 A₂와 같은 class의 다른 원본 B₁·B₂가 positive가 됩니다.",
  ] as const;

  return (
    <Scene
      id="supcon-batch"
      eyebrow="Multiview batch"
      title="원본 3개가 label을 유지한 view 6개로 펼쳐집니다"
      description="원본·view·label을 한 줄씩 따라가면 여러 positive가 생기는 위치가 보입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]} className="grid gap-px bg-border p-px sm:grid-cols-3">
          {SOURCE_GROUPS.map((group) => (
            <div key={group.source} className="min-w-0 bg-background px-3 py-4 sm:px-4">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <strong className="font-mono text-base">원본 {group.source}</strong>
                <span className={`text-[10px] font-bold ${active >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                  {active >= 2 ? group.label : "label 대기"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {group.views.map((view) => {
                  const positive = active >= 3 && ["A₂", "B₁", "B₂"].includes(view);
                  const anchor = active >= 3 && view === "A₁";
                  return (
                    <div
                      key={view}
                      className={`min-w-0 border-y px-2 py-3 text-center transition-colors ${
                        active >= 1 ? "border-border" : "border-transparent text-muted-foreground/40"
                      } ${positive || anchor ? "border-primary/70 bg-primary/10 text-foreground" : ""}`}
                    >
                      <strong className="font-mono text-sm">{active >= 1 ? view : "—"}</strong>
                      <span className="mt-1 block break-keep text-[9px] font-bold text-muted-foreground">
                        {anchor ? "ANCHOR" : positive ? "POSITIVE" : active >= 2 ? group.label : "VIEW"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Scene>
  );
}

export function PositiveMaskViz() {
  const labels = [
    "A₁과 여섯 view의 label을 나란히 놓습니다",
    "자기 자신 A₁은 후보에서 지웁니다",
    "남은 칸에서 신발 label 세 개를 표시합니다",
    "다른 label 두 개는 denominator의 negative가 됩니다",
  ] as const;
  const notes = [
    "Anchor A₁의 label은 신발입니다. 아직 관계를 결정하지 않고 label만 비교합니다.",
    "논문의 A(i)=I\\{i} 규칙에 따라 diagonal인 A₁ 칸은 분모와 positive set 양쪽에서 빠집니다.",
    "A₂·B₁·B₂가 P(A₁)입니다. 같은 원본의 다른 view와 다른 원본의 same-label view가 함께 들어갑니다.",
    "C₁·C₂는 P(A₁)에는 없지만 공통 분모에는 남습니다. 따라서 후보 5개는 positive 3개와 negative 2개입니다.",
  ] as const;

  return (
    <Scene
      id="supcon-positive-mask"
      eyebrow="Positive mask"
      title="Self를 지운 뒤 same-label 칸만 P(A₁)에 넣습니다"
      description="하나의 anchor 행에서 self·positive·negative mask가 만들어지는 순서입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-6 gap-px bg-border p-px text-center">
            {SUPCON_BATCH_FIXTURE.views.map((view) => {
              const self = view.id === SUPCON_BATCH_FIXTURE.anchor;
              const positive = !self && view.label === SUPCON_BATCH_FIXTURE.anchorLabel;
              const negative = !self && !positive;
              const highlighted =
                (active >= 1 && self) ||
                (active >= 2 && positive) ||
                (active >= 3 && negative);
              const state = active >= 1 && self
                ? "SELF 제외"
                : active >= 2 && positive
                  ? "POSITIVE"
                  : active >= 3 && negative
                    ? "NEGATIVE"
                    : view.label;
              return (
                <div
                  key={view.id}
                  className={`min-w-0 bg-background px-1 py-3 transition-colors sm:px-2 ${
                    highlighted ? "bg-primary/10 text-foreground" : "text-muted-foreground"
                  } ${active >= 1 && self ? "line-through opacity-50" : ""}`}
                >
                  <strong className="block font-mono text-xs sm:text-sm">{view.id}</strong>
                  <span className="mt-1 block break-keep text-[8px] font-bold leading-4 sm:text-[10px]">
                    {state}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] sm:text-xs">
            <div className="bg-background px-2 py-3"><span className="block text-muted-foreground">분모 후보</span><strong className="mt-1 block">5</strong></div>
            <div className="bg-background px-2 py-3"><span className="block text-muted-foreground">P(A₁)</span><strong className="mt-1 block">{active >= 2 ? "3" : "—"}</strong></div>
            <div className="bg-background px-2 py-3"><span className="block text-muted-foreground">negative</span><strong className="mt-1 block">{active >= 3 ? "2" : "—"}</strong></div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function MultiPositiveLossViz() {
  const labels = [
    "다섯 지수 점수를 더해 Z=16을 만듭니다",
    "각 점수를 Z로 나눠 후보 확률을 만듭니다",
    "Positive 세 개에 negative log를 적용합니다",
    "세 loss를 더하고 3으로 나눕니다",
  ] as const;
  const notes = [
    "지수 점수 8·4·2·1·1은 설명용 가정입니다. Positive와 negative를 모두 포함한 공통 분모가 16입니다.",
    "후보 확률은 0.5·0.25·0.125·0.0625·0.0625이며 모두 더하면 1입니다.",
    "P(A₁)의 세 확률만 채점합니다. 각각의 negative log는 약 0.693·1.386·2.079입니다.",
    "Positive별 loss 합 4.158을 positive 수 3으로 나누면 anchor loss는 약 1.386입니다.",
  ] as const;
  const lossById: Record<string, string> = {
    "A₂": "0.693",
    "B₁": "1.386",
    "B₂": "2.079",
  };

  return (
    <Scene
      id="supcon-multi-positive-loss"
      eyebrow="Equation 2"
      title="공통 분모 하나에서 positive loss 세 개를 따로 계산합니다"
      description="지수 점수→확률→negative log→positive 평균을 같은 다섯 후보로 계산합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="divide-y divide-border border-y border-border">
            {SUPCON_BATCH_FIXTURE.candidates.map((candidate) => {
              const positive = candidate.label === SUPCON_BATCH_FIXTURE.anchorLabel;
              const probability = candidate.exponentialScore / SUPCON_BATCH_FIXTURE.partition;
              return (
                <div key={candidate.id} className={`grid grid-cols-[2.5rem_minmax(0,1fr)_4rem] items-center gap-2 px-2 py-2.5 text-xs sm:grid-cols-[3rem_minmax(0,1fr)_7rem] sm:px-3 ${positive ? "bg-primary/[0.04]" : ""}`}>
                  <strong className="font-mono">{candidate.id}</strong>
                  <div className="min-w-0">
                    <div className="h-2 bg-muted/40">
                      <div className="h-full bg-primary/70" style={{ width: `${candidate.exponentialScore * 12.5}%` }} />
                    </div>
                    <span className="mt-1 block text-[9px] text-muted-foreground sm:text-[10px]">
                      exp score {candidate.exponentialScore}{active >= 1 ? ` ÷ 16 = ${probability}` : ""}
                    </span>
                  </div>
                  <span className={`text-right font-mono text-[9px] sm:text-xs ${positive && active >= 2 ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {positive && active >= 2 ? `−log = ${lossById[candidate.id]}` : positive ? "positive" : "분모만"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 border-y px-3 py-3 text-center text-xs transition-colors ${active === 3 ? "border-primary/70 bg-primary/10" : "border-border"}`}>
            {active === 0 && <strong>Z = 8 + 4 + 2 + 1 + 1 = 16</strong>}
            {active === 1 && <strong>확률 합 = 0.5 + 0.25 + 0.125 + 0.0625 + 0.0625 = 1</strong>}
            {active === 2 && <strong>Positive loss 합 = 0.693 + 1.386 + 2.079 = 4.158</strong>}
            {active === 3 && <strong>L(A₁) = 4.158 ÷ 3 = {SUPCON_BATCH_FIXTURE.outsideLogLoss}</strong>}
          </div>
        </div>
      )}
    </Scene>
  );
}

function WeightRow({
  label,
  values,
  active,
}: {
  label: string;
  values: readonly number[];
  active: boolean;
}) {
  return (
    <div className={`border-y px-3 py-3 transition-colors ${active ? "border-primary/70 bg-primary/10" : "border-border"}`}>
      <strong className="block break-keep text-xs">{label}</strong>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center font-mono text-xs">
        {values.map((value, index) => (
          <span key={`${label}-${index}`} className="border-b border-border pb-1">
            {value}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-3 gap-2 text-center text-[9px] text-muted-foreground">
        <span>A₂</span><span>B₁</span><span>B₂</span>
      </div>
    </div>
  );
}

export function LogPlacementViz() {
  const labels = [
    "두 식에 같은 세 positive 확률을 넣습니다",
    "Log 밖 평균은 세 positive를 같은 비중으로 봅니다",
    "Log 안 합은 가까운 positive에 더 큰 비중을 둡니다",
    "Loss 숫자가 작다는 이유만으로 식을 고르지 않습니다",
  ] as const;
  const notes = [
    "두 식 모두 P(A₁)={A₂,B₁,B₂}와 같은 denominator를 씁니다. 차이는 positive 합과 log의 순서입니다.",
    "논문 식 (2)의 gradient target은 각 positive에 1/3입니다. 현재 similarity와 관계없이 세 positive가 같은 target mass를 받습니다.",
    "논문 식 (3)의 target은 positive 지수 점수 비율인 8/14·4/14·2/14입니다. 이미 가까운 A₂가 가장 큰 몫을 받습니다.",
    "이 사례의 loss는 1.386과 1.232로 다르지만 서로 다른 objective의 절대값만 비교할 수는 없습니다. 논문은 gradient 분석과 고정된 실험 조건의 결과로 식 (2)를 선택했습니다.",
  ] as const;

  return (
    <Scene
      id="supcon-log-placement"
      eyebrow="Equation 2 vs 3"
      title="Positive 합을 log 밖에 둘지 안에 둘지가 gradient를 바꿉니다"
      description="괄호 하나를 옮기면 hard positive가 받는 target weight가 달라집니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]} className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 border-l border-border pl-3 sm:pl-4">
            <span className="text-[10px] font-bold text-primary">식 (2) · LOG 밖</span>
            <code className="mt-2 block break-words text-[11px] leading-5">−⅓[log .5 + log .25 + log .125]</code>
            <WeightRow label="Positive target weight" values={SUPCON_BATCH_FIXTURE.outsideTargetWeights} active={active >= 1} />
            <strong className="mt-3 block text-sm">loss ≈ {SUPCON_BATCH_FIXTURE.outsideLogLoss}</strong>
          </div>
          <div className="min-w-0 border-l border-border pl-3 sm:pl-4">
            <span className="text-[10px] font-bold text-primary">식 (3) · LOG 안</span>
            <code className="mt-2 block break-words text-[11px] leading-5">−log[(.5 + .25 + .125) ÷ 3]</code>
            <WeightRow label="Positive target weight" values={SUPCON_BATCH_FIXTURE.insideTargetWeights} active={active >= 2} />
            <strong className="mt-3 block text-sm">loss ≈ {SUPCON_BATCH_FIXTURE.insideLogLoss}</strong>
          </div>
        </div>
      )}
    </Scene>
  );
}
