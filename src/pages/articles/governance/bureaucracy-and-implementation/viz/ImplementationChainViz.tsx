import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "도시는 두 목표를 함께 정한다",
  "하지만 쓸 수 있는 시간은 200일이다",
  "집행기관이 선별 규칙을 만든다",
  "마지막 검사관이 예외를 판단한다",
  "평가 숫자가 실제 행동을 다시 바꾼다",
] as const;

const CONTROL_LABELS = [
  "두 목표",
  "200일",
  "선별 규칙",
  "현장 판단",
  "평가",
] as const;

const NOTES = [
  "결정문에는 1,000대 점검과 위험 차량 우선이라는 두 목표가 함께 들어 있습니다.",
  "10명×20일=200 검사관·일입니다. 모두 빠르게 보면 1,000대, 모두 자세히 보면 200대입니다.",
  "집행기관은 위험 신호, 점검 순서와 정밀 점검 전환 조건을 정해 한정된 시간을 나눕니다.",
  "목록 밖 개조 흔적처럼 규칙이 다 쓰지 못한 사정은 마지막 검사관의 기록 가능한 판단이 채웁니다.",
  "완료 건수만 강하게 평가하면 빠른 점검은 늘고 어려운 결함을 추적하는 시간은 줄 수 있습니다.",
] as const;

const STAGES = [
  {
    name: "결정",
    detail: "1,000대 · 위험 우선",
    tone: "border-sky-400/70 bg-sky-500/10",
  },
  {
    name: "용량",
    detail: "200 검사관·일",
    tone: "border-amber-400/70 bg-amber-500/10",
  },
  {
    name: "규칙",
    detail: "누구를 자세히 볼까",
    tone: "border-violet-400/70 bg-violet-500/10",
  },
  {
    name: "현장",
    detail: "목록 밖 예외",
    tone: "border-emerald-400/70 bg-emerald-500/10",
  },
  {
    name: "평가",
    detail: "완료 건수와 안전",
    tone: "border-rose-400/70 bg-rose-500/10",
  },
] as const;

function CapacityLedger() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="border border-border p-3">
        <p className="text-xs text-muted-foreground">빠른 점검만</p>
        <p className="mt-1 text-xl font-black tabular-nums">200×5=1,000대</p>
      </div>
      <div className="border border-border p-3">
        <p className="text-xs text-muted-foreground">정밀 점검만</p>
        <p className="mt-1 text-xl font-black tabular-nums">200×1=200대</p>
      </div>
    </div>
  );
}

export default function ImplementationChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const step = scenes.active;

  return (
    <VizFrame
      className="mobile-viz-stable-height"
      eyebrow="한 결정이 실제 점검이 되는 경로"
      title="결정문 뒤의 네 선택이 실제 정책을 만듭니다"
      description="차량 1,000대와 200 검사관·일을 같은 장면에서 추적합니다."
      note="설명용 가상 사례입니다. 특정 도시의 실제 점검 실적이나 검사 속도가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="배달 차량 점검 결정이 용량, 규칙, 현장 판단과 평가를 지나는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 break-keep text-lg font-bold">{SCENES[step]}</h4>

          <div className="mt-3 grid grid-cols-5 gap-1.5 sm:mt-5 sm:gap-2">
            {STAGES.map((stage, index) => {
              const active = index <= step;
              return (
                <div
                  key={stage.name}
                  className={`min-w-0 border px-1.5 py-2 text-center sm:px-3 sm:py-3 ${
                    active
                      ? stage.tone
                      : "border-border bg-background opacity-45"
                  }`}
                >
                  <p className="text-xs font-black sm:text-sm">{stage.name}</p>
                  <p className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">
                    {stage.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-sky-400/70 bg-sky-500/10 p-3 text-center">
                  <p className="text-xs text-muted-foreground">대수 목표</p>
                  <p className="mt-1 text-xl font-black">1,000대</p>
                </div>
                <div className="border border-sky-400/70 bg-sky-500/10 p-3 text-center">
                  <p className="text-xs text-muted-foreground">안전 목표</p>
                  <p className="mt-1 text-xl font-black">위험 차량 우선</p>
                </div>
              </div>
            )}

            {step === 1 && <CapacityLedger />}

            {step === 2 && (
              <div className="space-y-2">
                {[
                  "위험 신호를 먼저 찾기",
                  "정밀 점검으로 넘길 조건",
                  "차량별 점검 순서",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] border border-border"
                  >
                    <span className="flex items-center justify-center bg-violet-500/10 text-sm font-black">
                      {index + 1}
                    </span>
                    <strong className="px-3 py-2">{item}</strong>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    규칙에 있는 결함
                  </p>
                  <p className="mt-1 font-bold">체크리스트대로 판정</p>
                </div>
                <div className="border border-emerald-400/70 bg-emerald-500/10 p-3">
                  <p className="text-xs text-muted-foreground">새 개조 흔적</p>
                  <p className="mt-1 font-bold">
                    사진·측정값을 남기고 정밀 점검
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                  <div className="border border-emerald-400/70 bg-emerald-500/10 p-3 text-center">
                    <p className="text-xs text-muted-foreground">보이는 숫자</p>
                    <p className="mt-1 font-black">완료 건수 ↑</p>
                  </div>
                  <span aria-hidden="true" className="text-muted-foreground">
                    ↔
                  </span>
                  <div className="border border-rose-400/70 bg-rose-500/10 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      잘 안 보이는 일
                    </p>
                    <p className="mt-1 font-black">정밀 조사 ↓</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  같은 200일을 두 일이 나눠 쓰므로 평가 기준이 시간의 배분을
                  바꿉니다.
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 border-l border-primary/50 pl-3 text-sm leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:leading-7">
            {NOTES[step]}
          </p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={CONTROL_LABELS}
          playLabel="집행 경로 재생"
        />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
