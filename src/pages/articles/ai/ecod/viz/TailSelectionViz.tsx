import VizFrame from "@/components/viz/VizFrame";

const cases = [
  ["negative skew", "긴 왼쪽 tail", "left contribution"],
  ["near symmetric", "방향 근거가 약함", "두 tail을 별도 확인"],
  ["positive skew", "긴 오른쪽 tail", "right contribution"],
] as const;

export default function TailSelectionViz() {
  return (
    <VizFrame
      eyebrow="Tail selection"
      title="Skewness는 이상 여부가 아니라 어느 방향을 우선 볼지 정합니다"
      description="작은 값과 큰 값이 모두 드물 수 있지만, 분포가 치우친 방향을 이용하면 feature마다 서로 다른 tail을 고를 수 있습니다."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {cases.map(([name, shape, result]) => (
          <div key={name} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="font-mono text-xs font-bold text-primary">{name}</p>
            <div className="my-4 flex h-12 items-end gap-1" aria-hidden="true">
              {(name === "negative skew" ? [1, 2, 3, 5, 9, 12, 10] : name === "positive skew" ? [10, 12, 9, 5, 3, 2, 1] : [2, 5, 9, 12, 9, 5, 2]).map((height, i) => (
                <span key={i} className="min-w-0 flex-1 rounded-sm bg-primary/25" style={{ height: `${height * 3}px` }} />
              ))}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">{shape}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{result}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
