import VizFrame from "@/components/viz/VizFrame";

const contracts = [
  {
    name: "ECOD paper",
    order: "차원 합산 → 세 score 중 max",
    detail: "left-only·right-only·skew-auto가 row마다 경쟁",
  },
  {
    name: "PyOD 3.6.4 source",
    order: "feature별 max → 차원 합산",
    detail: "각 열에서 tail contribution을 고른 뒤 모두 더함",
  },
] as const;

export default function AggregationContractViz() {
  return (
    <VizFrame
      eyebrow="Reproduction boundary"
      title="max와 sum의 순서가 바뀌면 같은 이름이어도 같은 score가 아닙니다"
      description="연산 두 개가 교환법칙을 만족하지 않으므로 논문 재현과 library 운영 결과를 구분해야 합니다."
      note="모델 카드에는 package version과 score 식을 함께 남기고, upgrade 때 동일 row의 순위가 유지되는지 회귀 테스트합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {contracts.map((contract) => (
          <div key={contract.name} className="min-w-0 rounded-lg border border-border/70 bg-background p-5">
            <p className="text-xs font-bold text-primary">{contract.name}</p>
            <p className="mt-3 text-base font-bold leading-6 text-foreground">{contract.order}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{contract.detail}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
