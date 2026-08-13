import DezeroConceptViz from "../../DezeroConceptViz";

export default function OverviewViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="NEURAL NETWORK STACK"
      title="연산 그래프 위에 상태와 학습 규칙을 쌓는다"
      summary="자동 미분 엔진이 gradient를 계산하면 Layer는 파라미터를 모으고, Optimizer는 그 파라미터를 일관된 순서로 갱신합니다."
      stages={[
        { tag: "MODEL", title: "레이어 조합", description: "모델이 하위 레이어와 파라미터의 소유 관계를 정합니다." },
        { tag: "FORWARD", title: "예측 계산", description: "Linear와 activation을 연결해 입력을 예측값으로 바꿉니다." },
        { tag: "LOSS", title: "오차를 스칼라로 요약", description: "회귀나 분류 목표에 맞는 loss를 계산합니다." },
        { tag: "UPDATE", title: "파라미터 갱신", description: "backward 뒤 optimizer가 gradient를 읽어 weight를 바꿉니다." },
      ]}
      codeKey="model-trait"
      codeLabel="Model 계약 보기"
      onOpenCode={onOpenCode}
    />
  );
}
