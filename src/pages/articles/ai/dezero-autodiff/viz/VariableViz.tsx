import DezeroConceptViz from "../../DezeroConceptViz";

export default function VariableViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="AUTODIFF CONTRACT"
      title="값 하나가 계산 이력을 갖는 구조"
      summary="Variable은 숫자 배열만 감싸는 객체가 아니라 gradient와 creator를 연결하는 계산 그래프의 노드입니다."
      stages={[
        { tag: "DATA", title: "연산값 보관", description: "순전파 결과와 shape를 Variable 내부에 둡니다.", detail: "data: ArrayD<f64>" },
        { tag: "GRAD", title: "미분값 보관", description: "gradient도 Variable로 두어 다시 미분할 수 있게 합니다.", detail: "grad: Option<Variable>" },
        { tag: "EDGE", title: "생성 연산 연결", description: "creator가 이전 Function을 가리켜 역추적 경로를 만듭니다.", detail: "creator: Option<Func>" },
        { tag: "ORDER", title: "세대 기록", description: "generation 값으로 backward 실행 순서를 정합니다.", detail: "generation: usize" },
      ]}
      codeKey="var-struct"
      codeLabel="Variable 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
