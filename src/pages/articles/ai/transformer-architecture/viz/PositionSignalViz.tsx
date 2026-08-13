import VizFrame from "@/components/viz/VizFrame";

const methods = [
  ["Fixed sinusoidal", "embedding에 더함", "parameter 없음"],
  ["Learned absolute", "embedding에 더함", "position별 parameter"],
  ["RoPE", "Q·K를 회전", "relative phase"],
  ["ALiBi family", "score에 bias", "distance penalty"],
] as const;

export default function PositionSignalViz() {
  return (
    <VizFrame
      eyebrow="Position design"
      title="위치 방식은 공식 이름보다 attention 경로의 어디를 바꾸는지로 비교합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {methods.map(([name, location, effect]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 text-xs font-semibold text-primary">
              {location}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {effect}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
