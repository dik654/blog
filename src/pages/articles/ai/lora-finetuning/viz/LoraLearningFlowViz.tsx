import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "LOAD",
    title: "Base와 adapter를 함께 불러옵니다",
    note: "Base 70억 개는 고정하고, 선택한 layer에 A·B 약 2천만 개를 붙입니다. (가정)",
  },
  {
    code: "FORWARD",
    title: "두 계산 경로의 출력을 더합니다",
    note: "입력은 큰 base 경로와 작은 adapter 경로를 모두 지나므로 base 계산은 사라지지 않습니다.",
  },
  {
    code: "UPDATE",
    title: "Gradient는 A·B만 갱신합니다",
    note: "Loss는 전체 출력에서 계산하지만 optimizer가 바꾸는 값은 adapter와 명시한 저장 module뿐입니다.",
  },
  {
    code: "SAVE",
    title: "Base가 아닌 변화량을 저장합니다",
    note: "결과물은 adapter와 설정입니다. 다시 불러올 때는 학습에 쓴 base revision과 target module이 필요합니다.",
  },
] as const;

function FlowNode({
  active,
  done,
  index,
  title,
  detail,
}: {
  active: boolean;
  done: boolean;
  index: number;
  title: string;
  detail: string;
}) {
  return (
    <section
      aria-current={active ? "step" : undefined}
      className={`min-w-0 border-t-2 px-3 py-3 transition-colors duration-200 ${
        active
          ? "border-primary bg-primary/5"
          : done
            ? "border-primary/55"
            : "border-border text-muted-foreground"
      }`}
    >
      <p className="font-mono text-[10px] font-black text-primary">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h4 className="mt-1 break-keep text-sm font-bold leading-5">{title}</h4>
      <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
    </section>
  );
}

export default function LoraLearningFlowViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6000, {
    autoPlay: false,
    loop: false,
  });
  const active = controls.reducedMotion ? scenes.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="한 학습 요청 추적"
      title="같은 출력에서 base는 고정되고 adapter만 바뀝니다"
      description="7B base와 20M adapter를 예로 들어, 입력부터 저장물까지 하나의 학습 step을 따라갑니다. 수치는 설명용 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="lora-learning-flow"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex h-full min-h-0 min-w-0 flex-col border-y border-border/70 bg-background px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-5"
      >
        <div
          data-viz-live-only
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
        >
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 min-h-14 break-keep text-lg font-bold leading-7 sm:min-h-8">
            {scenes[active].title}
          </h3>

          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
            <section className="border-y border-border py-4">
              <div className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-xs font-bold">Base branch</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">W · 70억 parameter (가정)</span>
                </span>
                <strong className={`text-xs ${active >= 2 ? "text-muted-foreground" : "text-primary"}`}>
                  {active >= 2 ? "gradient 없음" : "forward 실행"}
                </strong>
              </div>
              <div className="mt-4 h-2 overflow-hidden bg-muted" aria-hidden="true">
                <div className={`h-full bg-muted-foreground/50 transition-all duration-300 ${active >= 1 ? "w-full" : "w-0"}`} />
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                입력은 매 step 전체 base를 지나지만 optimizer는 W를 바꾸지 않습니다.
              </p>
            </section>

            <section className="border-y border-primary/50 py-4">
              <div className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-xs font-bold">Adapter branch</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">A·B · 약 2천만 parameter (가정)</span>
                </span>
                <strong className="text-xs text-primary">
                  {active >= 2 ? "gradient 적용" : active >= 1 ? "delta 계산" : "학습 대상"}
                </strong>
              </div>
              <div className="mt-4 flex items-center gap-2" aria-label="입력을 작은 폭으로 줄였다가 다시 펼치는 adapter 경로">
                <span className="h-9 flex-1 border border-border bg-background" />
                <span className="text-xs text-muted-foreground">→</span>
                <span className="h-9 w-8 border border-primary/60 bg-primary/10" />
                <span className="text-xs text-muted-foreground">→</span>
                <span className={`h-9 flex-1 border border-primary/60 transition-colors duration-300 ${active >= 1 ? "bg-primary/10" : "bg-background"}`} />
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                작은 중간 폭이 학습할 parameter 수와 update rank 상한을 함께 정합니다.
              </p>
            </section>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {scenes.map((scene, index) => (
              <FlowNode
                key={scene.code}
                active={index === active}
                done={index < active}
                index={index}
                title={scene.code}
                detail={scene.title}
              />
            ))}
          </div>

          <p className="mt-4 min-h-16 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-12">
            {scenes[active].note}
          </p>
        </div>

        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={labels}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
