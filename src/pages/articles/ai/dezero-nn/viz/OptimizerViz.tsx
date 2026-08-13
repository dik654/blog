import DezeroConceptViz from "../../DezeroConceptViz";

export default function OptimizerViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="OPTIMIZER STATE"
      title="gradient를 어떤 상태와 결합하느냐가 update를 바꾼다"
      summary="SGD는 현재 gradient만 사용하지만 Adam은 파라미터마다 1차·2차 모멘트를 유지하고 초기 편향을 보정합니다."
      stages={[
        { tag: "GRAD", title: "gradient 수집", description: "모델이 노출한 파라미터 중 gradient가 있는 항목만 갱신합니다." },
        { tag: "MOMENT", title: "이동평균 갱신", description: "Adam은 방향과 크기의 이동평균을 파라미터별로 저장합니다.", detail: "mₜ · vₜ" },
        { tag: "CORRECT", title: "초기 편향 보정", description: "0에서 시작한 모멘트가 초기에 작게 추정되는 문제를 보정합니다." },
        { tag: "STEP", title: "weight update", description: "학습률과 보정된 상태를 사용해 새 파라미터 값을 계산합니다." },
      ]}
      codeKey="adam"
      codeLabel="Adam 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
