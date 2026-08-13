import DezeroConceptViz from "../../DezeroConceptViz";

export default function ForwardViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="FORWARD PASS"
      title="계산과 그래프 기록을 한 번에 수행한다"
      summary="Function 호출은 입력값으로 출력을 계산한 뒤, 역전파에 필요한 입력·출력 관계와 generation을 함께 남깁니다."
      stages={[
        { tag: "READ", title: "입력 데이터 읽기", description: "Variable에서 실제 배열을 꺼내 Function에 넘깁니다." },
        { tag: "COMPUTE", title: "국소 연산 실행", description: "Add, Mul, MatMul 같은 forward 규칙으로 출력값을 계산합니다." },
        { tag: "WRAP", title: "출력을 Variable로 포장", description: "새 출력에 다음 generation 값을 부여합니다." },
        { tag: "RECORD", title: "creator edge 기록", description: "backward가 찾아올 수 있도록 Function과 출력을 연결합니다." },
      ]}
      codeKey="func-call"
      codeLabel="Func::call 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
