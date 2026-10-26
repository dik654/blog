import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Mode = "classic" | "sequence" | "on-policy" | "self";
type Shape =
  "teacher" | "distribution" | "bridge" | "document" | "loop" | "gauge";
type Scene = { code: string; title: string; detail: string; shape: Shape };

const FLOWS: Record<Mode, { caption: string; scenes: Scene[] }> = {
  classic: {
    caption:
      "같은 입력을 본 teacher 신호를 logit 또는 feature 경로로 바꾼 뒤 student만 갱신하고, 마지막에는 teacher 없이 student를 평가합니다.",
    scenes: [
      {
        code: "T",
        title: "Teacher 고정",
        detail: "같은 입력에서 logit과 선택한 feature를 관측",
        shape: "teacher",
      },
      {
        code: "IF",
        title: "신호 경로 선택",
        detail: "공유 class는 soft target, hidden은 feature bridge로 전달",
        shape: "bridge",
      },
      {
        code: "LOSS",
        title: "Student 갱신",
        detail: "Hard label과 선택한 teacher 신호를 합쳐 student만 backprop",
        shape: "loop",
      },
      {
        code: "TEST",
        title: "Student 단독 평가",
        detail: "Teacher를 떼고 독립 test quality와 runtime을 확인",
        shape: "gauge",
      },
    ],
  },
  sequence: {
    caption:
      "공유 vocabulary가 없으면 teacher text를 provenance가 있는 student dataset으로 바꿉니다.",
    scenes: [
      {
        code: "PROMPT",
        title: "입력 묶음",
        detail: "Domain·language·difficulty 목표",
        shape: "document",
      },
      {
        code: "GEN",
        title: "Teacher 생성",
        detail: "Version·prompt·sampling 고정",
        shape: "teacher",
      },
      {
        code: "FILTER",
        title: "품질 기록",
        detail: "Quality·rights·dedup·reject reason",
        shape: "gauge",
      },
      {
        code: "TOK",
        title: "Student 문자열",
        detail: "재토큰화와 response-only loss",
        shape: "document",
      },
    ],
  },
  "on-policy": {
    caption:
      "Student가 실제 방문한 prefix를 teacher가 다시 채점해 inference 상태에서 배웁니다.",
    scenes: [
      {
        code: "ROLL",
        title: "Student 생성",
        detail: "현재 policy가 prefix를 생성",
        shape: "loop",
      },
      {
        code: "VISIT",
        title: "방문 상태",
        detail: "실수까지 포함한 실제 prefix",
        shape: "document",
      },
      {
        code: "SCORE",
        title: "Teacher 채점",
        detail: "같은 prefix의 token 분포",
        shape: "distribution",
      },
      {
        code: "UPDATE",
        title: "Policy 갱신",
        detail: "Divergence와 domain gate 검증",
        shape: "gauge",
      },
    ],
  },
  self: {
    caption:
      "직전 세대의 prediction을 다음 세대가 배우되 agreement와 정답 quality를 분리합니다.",
    scenes: [
      {
        code: "G0",
        title: "Teacher 고정",
        detail: "세대와 artifact를 고정",
        shape: "teacher",
      },
      {
        code: "G1",
        title: "다음 student",
        detail: "같은 task에서 soft signal 학습",
        shape: "loop",
      },
      {
        code: "AUDIT",
        title: "상속 점검",
        detail: "Agreement와 accuracy 변화 분리",
        shape: "distribution",
      },
      {
        code: "STOP",
        title: "중단 판단",
        detail: "Worst slice 악화 전 중단",
        shape: "gauge",
      },
    ],
  },
};

function Glyph({ shape, active }: { shape: Shape; active: boolean }) {
  const tone = active
    ? "border-primary bg-primary/10 text-primary"
    : "border-border bg-background text-muted-foreground";
  if (shape === "teacher")
    return (
      <div className={`relative h-16 w-16 shrink-0 rounded-xl border xl:h-20 xl:w-24 ${tone}`}>
        <span className="absolute left-5 right-5 top-5 h-8 rounded-full border border-current" />
        <span className="absolute bottom-4 left-7 right-7 h-px bg-current" />
      </div>
    );
  if (shape === "distribution")
    return (
      <div
        className={`flex h-16 w-16 shrink-0 items-end justify-center gap-2 rounded-xl border p-2 xl:h-20 xl:w-24 xl:p-4 ${tone}`}
      >
        <span className="h-5 w-2 bg-current" />
        <span className="h-10 w-2 bg-current" />
        <span className="h-7 w-2 bg-current" />
        <span className="h-3 w-2 bg-current" />
      </div>
    );
  if (shape === "bridge")
    return (
      <div className={`relative h-16 w-16 shrink-0 rounded-xl border xl:h-20 xl:w-24 ${tone}`}>
        <span className="absolute left-3 top-5 h-10 w-5 border border-current" />
        <span className="absolute right-3 top-4 h-12 w-7 border border-current" />
        <span className="absolute left-8 right-9 top-1/2 h-px bg-current" />
      </div>
    );
  if (shape === "document")
    return (
      <div className={`relative h-16 w-12 shrink-0 rounded-md border xl:h-20 xl:w-16 ${tone}`}>
        <span className="absolute left-3 right-3 top-5 h-px bg-current" />
        <span className="absolute left-3 right-3 top-9 h-px bg-current" />
        <span className="absolute left-3 right-5 top-12 h-px bg-current" />
      </div>
    );
  if (shape === "loop")
    return (
      <div className={`relative h-16 w-16 shrink-0 rounded-full border xl:h-20 xl:w-20 ${tone}`}>
        <span className="absolute inset-4 rounded-full border border-current border-l-transparent" />
        <span className="absolute right-3 top-5 h-2 w-2 rotate-45 border-r border-t border-current" />
      </div>
    );
  return (
    <div className={`relative h-16 w-16 shrink-0 rounded-xl border xl:h-20 xl:w-24 ${tone}`}>
      <span className="absolute bottom-4 left-4 right-4 h-px bg-current" />
      <span className="absolute bottom-4 left-1/2 h-10 w-px origin-bottom rotate-45 bg-current" />
      <span className="absolute bottom-3 left-[calc(50%-3px)] h-2 w-2 rounded-full bg-current" />
    </div>
  );
}

function ClassicMechanism({ active }: { active: number }) {
  const tone = (index: number) =>
    index === active
      ? "border-primary bg-primary/5"
      : index < active
        ? "border-primary/55"
        : "border-border text-muted-foreground";
  const connector = (index: number) =>
    index < active ? "text-primary" : "text-muted-foreground/60";

  return (
    <div
      className="mt-3 grid grid-cols-2 gap-2 xl:mt-5 xl:grid-cols-[1fr_auto_1.35fr_auto_1.2fr_auto_1fr] xl:items-stretch"
      aria-label="고전 지식 증류에서 teacher 신호가 갈라졌다가 student objective에서 합쳐지는 경로"
    >
      <section className={`border-l-2 p-3 ${tone(0)}`} aria-current={active === 0 ? "step" : undefined}>
        <p className="text-[10px] font-black text-primary">01 · T</p>
        <h4 className="mt-1 break-keep text-sm font-bold">고정 teacher</h4>
        <p className="mt-2 break-keep text-xs leading-5">Logit·feature 관측</p>
      </section>

      <div className={`hidden items-center text-xl xl:flex ${connector(0)}`} aria-hidden="true">→</div>
      <section className={`border-l-2 p-3 ${tone(1)}`} aria-current={active === 1 ? "step" : undefined}>
        <p className="text-[10px] font-black text-primary">02 · IF</p>
        <h4 className="mt-1 break-keep text-sm font-bold">신호 경로</h4>
        <div className="mt-2 grid gap-px bg-border">
          <div className="flex items-center justify-between gap-2 bg-background px-2 py-2">
            <strong className="text-[11px]">공유 class</strong>
            <span className="text-right text-[11px] leading-5 text-muted-foreground">Soft target</span>
          </div>
          <div className="flex items-center justify-between gap-2 bg-background px-2 py-2">
            <strong className="text-[11px]">대응 hidden</strong>
            <span className="text-right text-[11px] leading-5 text-muted-foreground">Feature bridge</span>
          </div>
        </div>
      </section>

      <div className={`hidden items-center text-xl xl:flex ${connector(1)}`} aria-hidden="true">→</div>
      <section className={`border-l-2 p-3 ${tone(2)}`} aria-current={active === 2 ? "step" : undefined}>
        <p className="text-[10px] font-black text-primary">03 · LOSS</p>
        <h4 className="mt-1 break-keep text-sm font-bold">Student objective</h4>
        <p className="mt-2 break-keep text-xs leading-5">Hard label + teacher loss</p>
        <p className="mt-2 border-t border-border pt-2 text-[11px] font-bold text-primary">Student만 갱신</p>
      </section>

      <div className={`hidden items-center text-xl xl:flex ${connector(2)}`} aria-hidden="true">→</div>
      <section className={`border-l-2 p-3 ${tone(3)}`} aria-current={active === 3 ? "step" : undefined}>
        <p className="text-[10px] font-black text-primary">04 · TEST</p>
        <h4 className="mt-1 break-keep text-sm font-bold">Student 단독 평가</h4>
        <p className="mt-2 break-keep text-xs leading-5">독립 test와 runtime 확인</p>
      </section>
    </div>
  );
}

export default function DistillationLearningFlowViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const labels = flow.scenes.map(
    (scene) => `${scene.title}: ${scene.detail}`,
  );
  const notes = flow.scenes.map((scene) => scene.detail);
  const controlLabels = flow.scenes.map((scene) => scene.title);
  const controls = useAnimatedScenes(flow.scenes.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion
    ? flow.scenes.length - 1
    : controls.active;

  return (
    <VizFrame
      eyebrow="한 신호 추적"
      title="Teacher 신호가 student 학습 단위로 바뀌는 네 단계"
      description={flow.caption}
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id={`distillation-learning-flow-${mode}`}
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 border-y border-border/70 bg-background px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary xl:px-6 xl:py-6"
      >
        <div data-viz-live-only>
          <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 min-h-16 text-lg font-bold leading-7 sm:min-h-[2.5rem]">
            {labels[active]}
          </h3>
          {mode === "classic" ? (
            <ClassicMechanism active={active} />
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 xl:mt-5 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-center">
              {flow.scenes.map((scene, index) => (
                <div className="contents" key={scene.code}>
                  <div
                    aria-current={index === active ? "step" : undefined}
                    className={`flex min-h-24 min-w-0 flex-row items-center gap-2 border-t-2 px-2 py-2 text-left xl:min-h-0 xl:flex-col xl:gap-3 xl:px-3 xl:py-3 xl:text-center ${
                      index === active
                        ? "border-primary bg-primary/5"
                        : index < active
                          ? "border-primary/55"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    <Glyph shape={scene.shape} active={index <= active} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black text-primary sm:text-[10px]">
                        0{index + 1} · {scene.code}
                      </span>
                      <span className="mt-1 block break-keep text-xs font-bold leading-5 sm:text-sm">
                        {scene.title}
                      </span>
                      <span className="mt-1 hidden break-keep text-xs leading-5 text-muted-foreground xl:block">
                        {scene.detail}
                      </span>
                    </span>
                  </div>
                  {index < flow.scenes.length - 1 ? (
                    <div className="hidden items-center xl:flex" aria-hidden="true">
                      <span className={`h-px w-7 ${index < active ? "bg-primary" : "bg-border"}`} />
                      <span className="-ml-1 h-2 w-2 rotate-45 border-r border-t border-current text-muted-foreground" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 min-h-14 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:mt-5 sm:min-h-[3.5rem]">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          {...controls}
          active={active}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden xl:!pt-3 xl:[&_[data-viz-desktop-controls]]:flex xl:[&_[data-viz-mobile-controls]]:hidden xl:[&>p]:block"
          labels={labels}
          controlLabels={controlLabels}
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
