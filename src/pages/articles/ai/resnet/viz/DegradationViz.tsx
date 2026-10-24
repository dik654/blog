import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    label: "실패 확인",
    title: "더 깊은 plain CNN의 training error도 더 높아졌습니다",
    input: "얕은 plain net · 깊은 plain net",
    operation: "같은 dataset에서 train error와 test error를 함께 비교",
    output: "깊은 쪽의 train error까지 증가",
    note: "표현 가능한 함수가 더 많다는 사실과 optimizer가 좋은 해를 실제로 찾는다는 사실은 다릅니다.",
  },
  {
    label: "표현 변경",
    title: "Block 전체 H(x) 대신 입력에 더할 F(x)를 계산합니다",
    input: "x = 5 · 목표 H(x) = 4",
    operation: "F(x)=H(x)−x=−1을 residual branch가 학습",
    output: "y=x+F(x)=5−1=4",
    note: "F(x)=0이면 곧바로 y=x가 되므로 identity를 여러 nonlinear layer가 새로 합성할 필요가 없습니다.",
  },
  {
    label: "두 경로",
    title: "Backward에서도 shortcut 항과 residual 항이 함께 남습니다",
    input: "upstream gradient = 2 · JF(x)=0.25",
    operation: "2 × (I + JF) = 2 × (1 + 0.25)",
    output: "input gradient = 2.5",
    note: "Identity 항이 생겨도 상쇄나 다른 activation의 영향은 남으므로 gradient가 절대 사라지지 않는다는 보장은 아닙니다.",
  },
  {
    label: "Shape 계약",
    title: "해상도와 channel이 바뀌면 shortcut도 같은 shape로 맞춥니다",
    input: "[1,64,56,56] → [1,128,28,28]",
    operation: "Residual stride 2 · shortcut 1×1 projection stride 2",
    output: "두 branch 모두 [1,128,28,28]",
    note: "이 경우 shortcut에는 parameter가 생기며 순수 identity path와 계산·gradient 성질이 달라집니다.",
  },
] as const;

export default function DegradationViz() {
  const controls = useAnimatedScenes(scenes.length, 5200, { loop: false });
  const scene = scenes[controls.active];

  return (
    <VizFrame
      eyebrow="잔차 경로"
      title="학습 실패에서 실제 residual block의 shape까지 한 번에 추적합니다"
      description="재생하지 않아도 장면을 직접 고를 수 있고, 재생하면 네 상태가 5.2초 간격으로 한 번만 진행됩니다."
    >
      <div
        id={controls.playbackId}
        data-viz
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
          {scenes.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => controls.setActive(index)}
              aria-pressed={controls.active === index}
              className={`min-w-0 bg-background px-3 py-3 text-left ${controls.active === index ? "text-primary" : "text-muted-foreground"}`}
            >
              <span className="font-mono text-[9px]">0{index + 1}</span>
              <strong className="mt-1 block break-keep text-xs text-foreground">
                {item.label}
              </strong>
            </button>
          ))}
        </div>

        <div aria-live="polite" className="border-y border-border/70 py-5">
          <p className="text-[10px] font-bold text-primary">
            장면 {String(controls.active + 1).padStart(2, "0")} · {scene.label}
          </p>
          <h3 className="mt-2 break-keep text-lg font-bold leading-7">{scene.title}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1.15fr)_1.5rem_minmax(0,1fr)] sm:items-stretch">
            <div className="min-w-0 border border-border bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">입력 상태</p>
              <p className="mt-2 break-keep font-mono text-xs font-bold leading-6">{scene.input}</p>
            </div>
            <span aria-hidden className="hidden items-center justify-center text-muted-foreground sm:flex">→</span>
            <div className="min-w-0 border-l-2 border-primary bg-primary/[0.04] p-4">
              <p className="text-[10px] font-bold text-primary">이번 계산</p>
              <p className="mt-2 break-keep text-xs font-semibold leading-6">{scene.operation}</p>
            </div>
            <span aria-hidden className="hidden items-center justify-center text-muted-foreground sm:flex">→</span>
            <div className="min-w-0 border border-border bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">출력 상태</p>
              <p className="mt-2 break-keep font-mono text-xs font-bold leading-6">{scene.output}</p>
            </div>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{scene.note}</p>
        </div>

        <noscript>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
            {scenes.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>: {item.input} → {item.operation} → {item.output}. {item.note}
              </li>
            ))}
          </ol>
        </noscript>

        <AnimatedSceneControls labels={scenes.map((item) => item.label)} {...controls} playLabel="과정 재생" />
      </div>
    </VizFrame>
  );
}
