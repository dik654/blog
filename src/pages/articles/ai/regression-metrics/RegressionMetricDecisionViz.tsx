import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import type { ReactNode } from "react";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "기록",
    title: "배송 지연 네 건을 같은 평가 단위로 놓습니다",
    note: "설명용 가정입니다. 같은 조건의 배송 네 건이 각각 0분, 0분, 0분, 100분 늦었습니다. 실제 서비스 측정값이 아닙니다.",
  },
  {
    code: "비용",
    title: "예측값 0분과 25분에 붙는 오차 비용을 비교합니다",
    note: "0분은 MAE가 25로 더 작고, 25분은 RMSE가 약 43.30으로 더 작습니다. 같은 기록이어도 큰 오차를 얼마나 강하게 벌점 주는지에 따라 승자가 바뀝니다.",
  },
  {
    code: "목표",
    title: "MAE는 중앙값 0분을, 제곱 오차는 평균 25분을 고릅니다",
    note: "지표는 보고서의 숫자만 바꾸지 않습니다. 같은 비용을 학습에 쓰면 모델이 가까워지려는 중심값도 함께 달라집니다.",
  },
  {
    code: "구간",
    title: "포함률을 먼저 지키고 그 안에서 더 좁은 구간을 찾습니다",
    note: "폭 30분은 75%, 폭 100분은 100%입니다. 네 건은 90% 보장을 증명하지 못합니다.",
  },
] as const;

const values = [0, 0, 0, 100] as const;

function Panel({
  active,
  index,
  children,
}: {
  active: number;
  index: number;
  children: ReactNode;
}) {
  return (
    <section
      aria-current={active === index ? "step" : undefined}
      className={`${active === index ? "block border-primary" : "hidden border-border lg:block lg:opacity-45"} min-w-0 border-y py-4 transition-opacity`}
    >
      {children}
    </section>
  );
}

export default function RegressionMetricDecisionViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, {
    autoPlay: false,
    loop: false,
  });
  const active = controls.reducedMotion ? scenes.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="한 사례 추적"
      title="같은 배송 기록에서 MAE와 RMSE가 다른 예측을 고릅니다"
      description="배송 지연 네 건을 기록, 비용, 목표 중심값, 예측 구간의 네 장면으로 추적합니다. 모든 수치는 계산을 설명하기 위한 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="regression-metric-decision"
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

          <div className="mt-4 grid min-w-0 gap-5 lg:grid-cols-4">
            <Panel active={active} index={0}>
              <p className="text-[10px] font-black text-muted-foreground">실제 배송 지연</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {values.map((value, index) => (
                  <div key={index} className="border border-border px-2 py-3 text-center">
                    <span className="block font-mono text-[9px] text-muted-foreground">
                      D{index + 1}
                    </span>
                    <strong className="mt-1 block font-mono text-base">{value}</strong>
                    <span className="text-[9px] text-muted-foreground">분</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 break-keep text-xs leading-5 text-muted-foreground">
                평가 단위마다 같은 가중치를 둡니다.
              </p>
            </Panel>

            <Panel active={active} index={1}>
              <p className="text-[10px] font-black text-muted-foreground">후보별 비용</p>
              <div className="mt-3 space-y-3 text-xs">
                <div className="border-l-2 border-primary pl-3">
                  <strong>예측 0분</strong>
                  <p className="mt-1 font-mono leading-5">MAE 25 · RMSE 50</p>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <strong>예측 25분</strong>
                  <p className="mt-1 font-mono leading-5">MAE 37.5 · RMSE 43.30</p>
                </div>
              </div>
              <p className="mt-4 break-keep text-xs font-bold leading-5 text-primary">
                MAE와 RMSE의 선택이 갈립니다.
              </p>
            </Panel>

            <Panel active={active} index={2}>
              <p className="text-[10px] font-black text-muted-foreground">비용이 고른 중심값</p>
              <div className="mt-5 border-y border-border py-4">
                <div className="relative h-9">
                  <div className="absolute left-0 right-0 top-4 h-px bg-border" />
                  <div className="absolute left-0 top-1 h-7 border-l-2 border-primary" />
                  <div className="absolute left-1/4 top-1 h-7 border-l-2 border-primary" />
                  <span className="absolute left-0 top-8 -translate-x-0 font-mono text-[9px]">0</span>
                  <span className="absolute left-1/4 top-8 -translate-x-1/2 font-mono text-[9px]">25</span>
                  <span className="absolute right-0 top-8 font-mono text-[9px]">100</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <p><strong className="block">중앙값 0</strong><span className="text-muted-foreground">MAE 최소</span></p>
                  <p><strong className="block">평균 25</strong><span className="text-muted-foreground">MSE 최소</span></p>
                </div>
              </div>
            </Panel>

            <Panel active={active} index={3}>
              <p className="text-[10px] font-black text-muted-foreground">예측 구간 후보</p>
              <div className="mt-3 space-y-3 text-xs">
                <div className="border border-border px-3 py-3">
                  <strong className="font-mono">[0, 30]</strong>
                  <p className="mt-1 text-muted-foreground">포함 3/4 · 75% · 폭 30분</p>
                </div>
                <div className="border border-primary px-3 py-3">
                  <strong className="font-mono">[0, 100]</strong>
                  <p className="mt-1 text-muted-foreground">포함 4/4 · 100% · 폭 100분</p>
                </div>
              </div>
              <p className="mt-4 break-keep text-xs leading-5 text-muted-foreground">
                목표 포함률을 통과한 후보끼리 폭을 비교합니다.
              </p>
            </Panel>
          </div>

          <div className="mt-5 hidden grid-cols-4 gap-2 lg:grid">
            {scenes.map((scene, index) => (
              <section
                key={scene.code}
                aria-current={index === active ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-3 ${
                  index === active
                    ? "border-primary bg-primary/5"
                    : index < active
                      ? "border-primary/55"
                      : "border-border text-muted-foreground"
                }`}
              >
                <p className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 break-keep text-xs font-bold leading-5">{scene.code}</p>
              </section>
            ))}
          </div>

          <p className="mt-4 min-h-20 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-16">
            {scenes[active].note}
          </p>
        </div>

        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={scenes.map((scene) => scene.code)}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
