import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["점수 읽기", "온도 선택", "확률 결합", "행동 결정"] as const;

const NOTES = [
  "pred-184의 logit은 (4, 2, 0)입니다. 신발 점수가 가장 크지만 아직 보정된 확률이나 업무 행동은 아닙니다.",
  "설명용 보정 집합에서 NLL을 비교해 T=1.5를 고릅니다. pred-184의 class 순서는 유지되고 신발 확률은 .750이 됩니다.",
  "같은 class 순서와 보정 정의를 가진 TTA·model 출력만 결합합니다. 최종 신발 확률은 .694입니다.",
  "신발 자동 분류 기준 .700에 미치지 못하므로 top class는 신발이어도 자동 분류하지 않고 검토 대기로 보냅니다.",
] as const;

const STATIC_STEPS = [
  {
    title: "점수 읽기",
    detail: "pred-184 · z=(4, 2, 0) · top class=신발",
  },
  {
    title: "온도 선택",
    detail: "보정 집합 NLL: T=1.0 → .763, T=1.5 → .753, T=2.0 → .784 · T*=1.5",
  },
  {
    title: "확률 결합",
    detail: "model A=.725, model B=.620 · .7×.725 + .3×.620 = .694",
  },
  {
    title: "행동 결정",
    detail: ".694 < 신발 기준 .700 · 자동 분류 안 함 · 검토 대기",
  },
] as const;

function TracePlayer({ children }: { children: (active: number) => ReactNode }) {
  const controls = useAnimatedScenes(LABELS.length, 5200, {
    loop: false,
    autoPlay: false,
  });

  return (
    <VizFrame
      eyebrow="예측 하나 추적"
      title="점수가 같아도 보정·결합·기준을 거치면 행동은 달라집니다"
      description="pred-184가 raw score에서 검토 대기 상태로 바뀌는 네 결정을 차례로 확인합니다."
      className="my-8 sm:!block sm:!h-auto sm:!max-h-none sm:!overflow-visible"
      canvasClassName="sm:!h-auto sm:!max-h-none sm:!flex-none sm:!overflow-visible"
    >
      <div
        id={controls.playbackId}
        data-viz-id="probability-decision-trace"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:!min-h-0 [&_[data-viz-controls]>p]:hidden"
      >
        <div data-viz-live-only>
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
            pred-184 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-base font-bold leading-6">
            {LABELS[controls.active]}
          </h3>
          <div className="mt-4 min-w-0">{children(controls.active)}</div>
          <p className="mt-4 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground">
            {NOTES[controls.active]}
          </p>
        </div>
        <AnimatedSceneControls labels={LABELS} {...controls} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {STATIC_STEPS.map((step, index) => (
            <li key={step.title} className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <strong>
                {index + 1}. {step.title}
              </strong>
              <span className="break-words font-mono text-xs text-muted-foreground">
                {step.detail}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function StageRail({ active }: { active: number }) {
  return (
    <div className="relative hidden sm:block">
      <div className="absolute left-[12.5%] right-[12.5%] top-[1.15rem] h-px bg-border" />
      <motion.div
        aria-hidden="true"
        className="absolute top-[.78rem] h-3 w-3 -translate-x-1/2 rounded-full bg-primary"
        initial={false}
        animate={{ left: `${12.5 + active * 25}%` }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      />
      <ol className="relative grid grid-cols-4 gap-3">
        {LABELS.map((label, index) => (
          <li key={label} className="min-w-0 pt-8 text-center">
            <strong
              className={`block break-keep text-[11px] leading-5 ${
                index === active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ScoreState() {
  const rows = [
    ["신발", "4", "1"],
    ["가방", "2", "2"],
    ["모자", "0", "3"],
  ] as const;
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] sm:items-center">
      <div className="border-y border-border py-4">
        <p className="text-[10px] font-bold text-muted-foreground">입력</p>
        <strong className="mt-1 block font-mono text-sm">pred-184</strong>
        <span className="mt-2 block text-xs text-muted-foreground">model head 출력</span>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {rows.map(([label, score, rank]) => (
          <div key={label} className="grid grid-cols-[1fr_4rem_3rem] items-center gap-3 py-2 text-xs">
            <span>{label}</span>
            <span className="text-right font-mono">z={score}</span>
            <span className="text-right text-muted-foreground">{rank}위</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemperatureState() {
  const candidates = [
    ["1.0", ".763", false],
    ["1.5", ".753", true],
    ["2.0", ".784", false],
  ] as const;
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
      <div className="border-y border-border py-3">
        <div className="grid grid-cols-[1fr_1fr_3rem] gap-2 border-b border-border pb-2 text-[10px] font-bold text-muted-foreground">
          <span>후보 T</span>
          <span className="text-right">평균 NLL</span>
          <span className="text-right">선택</span>
        </div>
        {candidates.map(([temperature, nll, selected]) => (
          <div
            key={temperature}
            className={`grid grid-cols-[1fr_1fr_3rem] gap-2 py-2 text-xs ${
              selected ? "font-bold text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="font-mono">T={temperature}</span>
            <span className="text-right font-mono">{nll}</span>
            <span className="text-right">{selected ? "최소" : "—"}</span>
          </div>
        ))}
      </div>
      <div className="border-l-2 border-primary pl-4">
        <p className="text-[10px] font-bold text-muted-foreground">pred-184에 적용</p>
        <code className="mt-2 block break-words text-xs leading-6">(4, 2, 0) ÷ 1.5</code>
        <code className="block break-words text-xs leading-6">→ (.750, .198, .052)</code>
        <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
          class 순서는 그대로이고 확률 분포만 덜 뾰족해집니다.
        </p>
      </div>
    </div>
  );
}

function AggregationState() {
  const rows = [
    ["model A · 원본", ".750"],
    ["model A · 좌우 반전", ".700"],
    ["model A · TTA 평균", ".725"],
    ["model B · 보정 출력", ".620"],
  ] as const;
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-end">
      <div className="divide-y divide-border border-y border-border">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_4rem] gap-3 py-2 text-xs">
            <span className="break-keep">{label}</span>
            <span className="text-right font-mono">{value}</span>
          </div>
        ))}
      </div>
      <div className="border-y border-border py-4">
        <p className="text-[10px] font-bold text-muted-foreground">신발 확률 결합</p>
        <code className="mt-2 block break-words text-xs leading-6">
          .7 × .725 + .3 × .620
        </code>
        <strong className="mt-1 block font-mono text-lg text-primary">= .694</strong>
        <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
          두 model은 같은 class 순서와 보정 정의를 사용합니다.
        </p>
      </div>
    </div>
  );
}

function ActionState() {
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] sm:items-center">
      <div className="border-y border-border py-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground">top class</p>
            <strong className="mt-1 block">신발</strong>
          </div>
          <code className="text-sm">p=.694</code>
        </div>
        <div className="mt-4 h-2 overflow-hidden bg-muted">
          <div className="h-full w-[69.4%] bg-primary" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>0</span>
          <span>자동 분류 기준 .700</span>
          <span>1</span>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-4">
        <p className="text-[10px] font-bold text-muted-foreground">업무 행동</p>
        <strong className="mt-2 block break-keep text-base">검토 대기</strong>
        <code className="mt-2 block text-xs">.694 &lt; .700</code>
        <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
          예측 class와 자동 처리 여부는 서로 다른 결과입니다.
        </p>
      </div>
    </div>
  );
}

function CurrentState({ active }: { active: number }) {
  if (active === 0) return <ScoreState />;
  if (active === 1) return <TemperatureState />;
  if (active === 2) return <AggregationState />;
  return <ActionState />;
}

function MobileTrace({ active }: { active: number }) {
  return (
    <ol className="space-y-px bg-border p-px sm:hidden">
      {STATIC_STEPS.map((step, index) => (
        <li
          key={step.title}
          className={`bg-background px-3 py-3 ${
            active === index ? "border-l-2 border-primary" : "border-l-2 border-transparent"
          }`}
        >
          <strong className="block break-keep text-[11px]">{step.title}</strong>
          <span className="mt-1 block break-words font-mono text-[10px] leading-4 text-muted-foreground">
            {step.detail}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ProbabilityDecisionTraceViz() {
  return (
    <TracePlayer>
      {(active) => (
        <div role="img" aria-label={LABELS[active]} className="min-w-0">
          <MobileTrace active={active} />
          <div className="hidden sm:block">
            <StageRail active={active} />
            <div className="mt-5 min-w-0 border-t border-border pt-5">
              <CurrentState active={active} />
            </div>
          </div>
        </div>
      )}
    </TracePlayer>
  );
}

export function DecisionDefinitionViz() {
  const rows = [
    ["model", "weight revision · class 순서 · input transform"],
    ["calibration", "split digest · T=1.5 · NLL 비교"],
    ["aggregation", "TTA 목록 · model revisions · weights(.7, .3)"],
    ["action", "신발 τ=.700 · 미달 시 검토 대기"],
  ] as const;

  return (
    <VizFrame
      eyebrow="판정 정의"
      title="재현하려면 model weight가 아니라 변환 순서 전체가 필요합니다"
      description="어느 필드가 바뀌어도 같은 logit이 다른 행동으로 이어질 수 있으므로 한 판정 버전으로 묶습니다."
      className="my-8"
    >
      <div
        role="img"
        aria-label="model, calibration, aggregation, action 필드를 한 판정 버전으로 묶는 구조"
        className="divide-y divide-border border-y border-border"
      >
        {rows.map(([name, value], index) => (
          <div key={name} className="grid gap-1 py-3 sm:grid-cols-[2rem_8rem_minmax(0,1fr)] sm:items-center">
            <span className="font-mono text-[10px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="text-xs">{name}</strong>
            <code className="break-words text-xs leading-5 text-muted-foreground">{value}</code>
          </div>
        ))}
      </div>
      <p className="mt-4 border-l-2 border-primary pl-3 text-xs leading-5 text-muted-foreground">
        이 글은 판정 정의가 어떻게 계산되는지만 다룹니다. 환경별 배포·감시·rollback은 실무 트랙의 별도 결정입니다.
      </p>
    </VizFrame>
  );
}
