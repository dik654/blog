import VizFrame from "@/components/viz/VizFrame";

const modes = [
  {
    label: "TRAIN",
    title: "Dataset의 정답 prefix",
    trace: "A → B → predict C",
    body: "앞 위치의 model 오답과 무관하게 y<t를 조건으로 씁니다.",
  },
  {
    label: "INFERENCE",
    title: "Model이 생성한 prefix",
    trace: "A → B′ → predict ?",
    body: "한 번의 오답이 뒤 position의 조건으로 남습니다.",
  },
];

export default function TeacherForcingGapViz() {
  return (
    <VizFrame
      eyebrow="Prefix contract"
      title="같은 position도 training과 inference에서 보는 prefix가 달라질 수 있습니다"
      description="Teacher forcing은 병렬 supervised signal을 주지만, 실제 생성은 model의 이전 선택 위에서 계속됩니다."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {modes.map((mode) => (
          <article key={mode.label} className="min-w-0 border-t border-border/70 pt-4">
            <p className="text-xs font-bold text-primary">{mode.label}</p>
            <p className="mt-3 font-semibold text-foreground">{mode.title}</p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">{mode.trace}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{mode.body}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
