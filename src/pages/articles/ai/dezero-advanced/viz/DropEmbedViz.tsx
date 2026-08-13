import DezeroConceptViz from "../../DezeroConceptViz";

export default function DropEmbedViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="MODE & INDEXING"
      title="Dropout과 Embedding은 forward 정보를 backward에 넘긴다"
      summary="두 연산의 목적은 다르지만 forward에서 만든 mask 또는 index를 저장해 같은 위치에 gradient를 돌려준다는 구현 패턴은 같습니다."
      stages={[
        { tag: "MASK", title: "Dropout mask 생성", description: "학습 중 일부 원소를 0으로 만들고 살아남은 값의 기댓값을 보정합니다." },
        { tag: "MODE", title: "train/eval 분기", description: "추론에서는 무작위성을 제거하고 입력을 그대로 반환합니다." },
        { tag: "LOOKUP", title: "Embedding 행 선택", description: "정수 ID에 해당하는 weight 행만 읽어 밀집 벡터를 만듭니다." },
        { tag: "SCATTER", title: "선택 행에 gradient 합산", description: "같은 ID가 반복되면 해당 행의 gradient를 scatter-add 합니다." },
      ]}
      codeKey="dropout-fn"
      codeLabel="Dropout·Embedding 보기"
      onOpenCode={onOpenCode}
    />
  );
}
