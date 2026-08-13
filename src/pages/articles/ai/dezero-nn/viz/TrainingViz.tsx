import DezeroConceptViz from "../../DezeroConceptViz";

export default function TrainingViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="TRAINING LOOP"
      title="한 스텝의 순서를 고정해야 학습 상태가 섞이지 않는다"
      summary="예측, loss, backward, update, gradient 초기화는 각각 단순하지만 순서를 흐리면 이전 스텝의 gradient가 다음 스텝에 남습니다."
      stages={[
        { tag: "PREDICT", title: "forward", description: "미니배치를 모델에 넣어 예측값을 계산합니다." },
        { tag: "MEASURE", title: "loss", description: "목표와 예측의 차이를 하나의 스칼라로 요약합니다." },
        { tag: "DIFF", title: "backward", description: "loss에서 모든 파라미터까지 gradient를 전파합니다." },
        { tag: "APPLY", title: "update 후 초기화", description: "optimizer step 뒤 gradient를 비워 다음 배치를 준비합니다." },
      ]}
      codeKey="loss-fn"
      codeLabel="loss·학습 루프 보기"
      onOpenCode={onOpenCode}
    />
  );
}
