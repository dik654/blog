import VizFrame from "@/components/viz/VizFrame";

const eras = [
  ["2023", "Autonomous loop demo", "긴 경로에서 상태·검증 부족이 드러남"],
  ["2024", "Workflow", "개발자가 경로를 정해 예측 가능성을 확보"],
  ["2025", "Stronger agent loop", "모델이 분기 일부를 흡수하고 long-horizon task로 확장"],
  ["2025–26", "Context & harness", "발견·artifact·권한·검증·복구가 독립 설계 대상이 됨"],
  ["2026", "Loop / graph language", "실행 주기와 위험 checkpoint를 설명하는 최근 어휘"],
] as const;

export default function HistoryViz() {
  return (
    <VizFrame
      eyebrow="Historical lens"
      title="용어가 바뀐 것이 아니라 모델이 맡는 범위와 바깥 병목이 함께 이동했습니다"
      note="연도는 대표적인 공개 논의 시점을 보여 주는 읽기 보조선이며, 합의된 표준 연표가 아닙니다."
    >
      <div className="grid gap-5 lg:grid-cols-5">
        {eras.map(([year, name, detail]) => (
          <div key={year} className="min-w-0 border-t border-border/80 pt-4">
            <p className="font-mono text-xs font-bold text-primary">{year}</p>
            <p className="mt-3 text-sm font-bold leading-5 text-foreground">
              {name}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
