import VizFrame from "@/components/viz/VizFrame";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const stages = [
  { label: "입력", name: "입력 계약", input: "IDs [1,211,87]", operation: "embedding + position + causal mask", output: "X⁰ [1,3,4]" },
  { label: "조회", name: "Self-attention · 위치 조회", input: "Q,K,V [1,2,3,2]", operation: "QKᵀ/√2 + causal mask", output: "token update A [1,3,4]" },
  { label: "운반", name: "Residual + norm · 상태 운반", input: "X⁰ + A", operation: "기존 state와 attention update를 결합", output: "X¹ [1,3,4]" },
  { label: "변환", name: "Feed-forward · 특징 변환", input: "X¹ [1,3,4]", operation: "4 → 8 → 4, 위치마다 같은 MLP", output: "feature update F [1,3,4]" },
  { label: "출력", name: "LM head · 어휘 점수", input: "마지막 위치 h₂ [4]", operation: "h₂W_vocab → softmax 또는 loss", output: "다음 token logits [|V|]" },
] as const;

export default function TransformerBlockViz() {
  const controls = useAnimatedScenes(stages.length, 4600, { loop: false });
  const active = stages[controls.active];
  return (
    <VizFrame
      eyebrow="Execution map"
      title="Transformer를 입력 tensor에서 task output까지 하나의 계약으로 읽습니다"
      description="[BOS, 나는, 밥을] 세 token의 shape를 유지한 채 token 축 조회와 feature 축 변환이 번갈아 일어납니다."
      note="B=1, N=3, D=4, head 2개, d_ff=8인 교육용 shape입니다. 실제 model의 값이나 성능 측정치가 아닙니다."
    >
      <div
        id={controls.playbackId}
        data-viz="transformer-block-flow"
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px sm:grid-cols-5">
          {stages.map((stage, index) => (
            <button
              type="button"
              key={stage.name}
              onClick={() => controls.setActive(index)}
              aria-pressed={index === controls.active}
              className={`min-w-0 bg-background px-2 py-3 text-left ${index === controls.active ? "text-primary" : "text-muted-foreground"}`}
            >
              <span className="font-mono text-[9px]">0{index + 1}</span>
              <strong className="mt-1 block break-keep text-xs text-foreground">{stage.label}</strong>
              <span className="mt-1 hidden text-[10px] leading-4 lg:block">{stage.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 border-y border-border/70 py-4 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1.2fr)_2rem_minmax(0,1fr)] sm:items-center">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground">입력</p>
            <p className="mt-1 break-all font-mono text-xs font-bold">{active.input}</p>
          </div>
          <span className="hidden text-center text-muted-foreground sm:block" aria-hidden>→</span>
          <div className="min-w-0 border-l-2 border-primary/45 pl-3">
            <p className="text-[10px] font-bold text-primary">{active.name}</p>
            <p className="mt-1 break-keep text-xs leading-5">{active.operation}</p>
          </div>
          <span className="hidden text-center text-muted-foreground sm:block" aria-hidden>→</span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground">출력</p>
            <p className="mt-1 break-all font-mono text-xs font-bold">{active.output}</p>
          </div>
        </div>

        <AnimatedSceneControls labels={stages.map((stage) => stage.label)} {...controls} playLabel="계산 재생" />
      </div>
    </VizFrame>
  );
}
