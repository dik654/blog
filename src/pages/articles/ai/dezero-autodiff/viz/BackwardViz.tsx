import DezeroConceptViz from "../../DezeroConceptViz";

export default function BackwardViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="REVERSE MODE"
      title="출력에서 입력으로 chain rule을 전달한다"
      summary="역전파는 generation이 큰 Function부터 처리하고, 같은 Variable로 모이는 gradient는 덮어쓰지 않고 합산합니다."
      stages={[
        { tag: "SEED", title: "출력 gradient 초기화", description: "스칼라 출력의 미분값을 1로 두고 역추적을 시작합니다." },
        { tag: "SORT", title: "Function 순서 결정", description: "generation 기준 우선순위로 뒤쪽 연산부터 꺼냅니다." },
        { tag: "CHAIN", title: "국소 backward 실행", description: "출력 gradient와 국소 미분을 곱해 입력 gradient를 구합니다." },
        { tag: "ACCUM", title: "분기 gradient 합산", description: "여러 경로가 한 변수로 합쳐지면 각 경로의 기여를 더합니다." },
      ]}
      codeKey="backward"
      codeLabel="backward 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
