import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "확실히 걸리는 사례가 있습니다",
  "확실히 벗어나는 사례도 있습니다",
  "그 사이에서 해석이 시작됩니다",
  "근거를 넓혀 가며 답을 찾습니다",
] as const;

const NOTES = [
  "공원에 차량 출입을 금지했다면 승용차와 화물차는 문장만으로도 적용 대상이라고 판단하기 쉽습니다.",
  "보행자와 반려견은 차량이 아닙니다. 모든 사례가 회색인 것이 아니라 양쪽 끝에는 비교적 확실한 구간이 있습니다.",
  "자전거·전동 휠체어·응급차·전시용 전차는 말 하나만으로 답하기 어렵습니다. 이 중간 구간에서 해석이 필요합니다.",
  "먼저 문언과 조문이 놓인 체계를 확인하고, 필요하면 목적·연혁·입법 자료까지 함께 봅니다. 다만 도구의 우선순위와 무게는 법체계와 사건에 따라 다릅니다.",
] as const;

const ZONES = [
  {
    title: "확실히 걸림",
    items: "승용차 · 화물차 · 오토바이",
    style: "border-rose-500/40 bg-rose-500/[0.07] text-rose-700 dark:text-rose-300",
  },
  {
    title: "해석이 필요한 사이",
    items: "자전거 · 전동 휠체어 · 응급차 · 전시용 전차",
    style: "border-amber-500/50 bg-amber-500/[0.08] text-amber-800 dark:text-amber-300",
  },
  {
    title: "확실히 벗어남",
    items: "유모차 · 보행자 · 반려견",
    style: "border-emerald-500/40 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300",
  },
] as const;

const TOOLS = [
  ["1", "문언", "쓰인 말의 통상적 의미"],
  ["2", "체계", "같은 법과 다른 법의 관계"],
  ["3", "목적·연혁", "왜 만들었고 어떻게 바뀌었는지"],
  ["4", "입법 자료", "만들 때 남은 기록"],
] as const;

export default function InterpretationCoreViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;

  return (
    <VizFrame
      documentFlow
      eyebrow="문장에서 사건으로"
      title="해석은 모든 곳이 아니라 두 끝 사이에서 시작됩니다"
      description="같은 조문의 적용 대상도 확실한 안쪽, 다투는 중간, 확실한 바깥으로 나뉩니다."
      note="'공원에 차량 출입 금지'는 법철학에서 오래 쓰인 사고실험입니다. 실제 단어의 범위는 법령 정의와 사회의 통상적 용법에 따라 달라집니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="공원 차량 금지 조문의 확실한 적용 구간과 해석이 필요한 구간"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[52rem] py-1 sm:min-h-[30rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 text-base font-bold text-foreground">{SCENES[step]}</h4>

          <p className="mt-4 rounded-xl border border-border bg-muted/35 px-4 py-3 text-sm font-bold text-foreground">
            조문 · 공원에 차량 출입 금지
          </p>

          <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 md:grid-cols-3">
            {ZONES.map((zone, index) => {
              const active =
                (step === 0 && index === 0) ||
                (step === 1 && index === 2) ||
                (step >= 2 && index === 1);
              return (
                <div
                  key={zone.title}
                  className={`min-w-0 rounded-xl border p-3 transition-opacity ${zone.style} ${active ? "opacity-100 ring-2 ring-primary/25" : "opacity-55"}`}
                >
                  <p className="text-sm font-black">{zone.title}</p>
                  <p className="mt-2 text-xs leading-5">{zone.items}</p>
                </div>
              );
            })}
          </div>

          {step === 3 ? (
            <ol className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
              {TOOLS.map(([number, label, detail]) => (
                <li key={number} className="flex min-w-0 gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                    {number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm leading-6 text-muted-foreground">
              {step < 2
                ? "양쪽 끝에서는 조문과 사실을 맞대는 것만으로 답이 비교적 선명합니다."
                : "중간에 들어온 사례만 다음 장면의 해석 근거를 더 확인해야 합니다."}
            </div>
          )}

          <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
