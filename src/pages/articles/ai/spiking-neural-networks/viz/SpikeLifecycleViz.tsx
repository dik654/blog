import { StoryShell, useStory } from "../../kimi-k3-shared";

const steps = [
  { label: "입력", voltage: 22, title: "Spike·current가 들어옵니다", detail: "Event가 없으면 synaptic 계산을 건너뛸 수 있지만 membrane state는 시간에 따라 leak할 수 있습니다." },
  { label: "누적", voltage: 68, title: "Membrane potential을 누적합니다", detail: "이전 전압을 leak한 뒤 현재 input current를 더합니다." },
  { label: "발화", voltage: 100, title: "Threshold를 넘으면 spike=1입니다", detail: "Hard step은 forward event를 명확히 하지만 threshold 주변의 exact derivative를 제공하지 않습니다." },
  { label: "Reset", voltage: 14, title: "전압을 reset하고 다음 시점으로 갑니다", detail: "새 state가 다음 time step의 input이 되므로 학습 graph는 recurrent sequence가 됩니다." },
] as const;

export default function SpikeLifecycleViz() {
  const story = useStory(steps.length, 2800);
  const current = steps[story.step];
  return (
    <StoryShell
      title="LIF neuron의 한 spike 수명주기"
      subtitle="입력→누적→threshold→reset을 단계별로 확인합니다."
      labels={steps.map((step) => step.label)}
      {...story}
    >
      <div data-viz="lif-spike-lifecycle" data-viz-canvas="lif-spike-lifecycle-canvas" className="grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div className="min-w-0 rounded-lg border border-border p-5">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground"><span>Vrest</span><span>Vthreshold</span></div>
          <div className="relative mt-3 h-8 overflow-hidden rounded-lg border border-border bg-muted/20">
            <div className="h-full bg-primary/20 transition-[width] duration-300" style={{ width: `${current.voltage}%` }} />
            <div className="absolute inset-y-0 right-[8%] border-l border-dashed border-primary" />
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">stage={story.step + 1} · membrane={current.voltage}%</p>
        </div>
        <div className="min-w-0 border-l border-primary pl-5">
          <p className="text-xs font-black text-primary">{current.label}</p>
          <p className="mt-2 font-black">{current.title}</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{current.detail}</p>
        </div>
      </div>
    </StoryShell>
  );
}
