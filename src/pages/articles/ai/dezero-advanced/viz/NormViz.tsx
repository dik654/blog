import DezeroConceptViz from "../../DezeroConceptViz";

export default function NormViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="LAYER NORMALIZATION"
      title="feature 통계를 맞춘 뒤 학습 가능한 scale을 되돌린다"
      summary="LayerNorm은 배치가 아니라 각 샘플의 마지막 feature 축을 정규화하므로 배치 크기와 무관하게 같은 규칙을 적용할 수 있습니다."
      stages={[
        { tag: "STATS", title: "평균·분산 계산", description: "각 샘플의 feature 축에서 mean과 variance를 구합니다." },
        { tag: "NORMALIZE", title: "중심화와 스케일링", description: "eps를 더한 표준편차로 나누어 수치적으로 안정화합니다.", detail: "x̂ = (x-μ)/√(σ²+ε)" },
        { tag: "AFFINE", title: "gamma·beta 적용", description: "학습 가능한 scale과 bias로 필요한 표현 범위를 복원합니다.", detail: "y = γx̂ + β" },
        { tag: "CACHE", title: "backward 값 보관", description: "x_hat과 역표준편차를 저장해 gradient 계산에 재사용합니다." },
      ]}
      codeKey="layer-norm-fn"
      codeLabel="LayerNorm 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
