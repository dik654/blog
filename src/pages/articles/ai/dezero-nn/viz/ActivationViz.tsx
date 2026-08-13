import DezeroConceptViz from "../../DezeroConceptViz";

export default function ActivationViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="NONLINEARITY"
      title="activation은 목적과 gradient 특성으로 고른다"
      summary="함수 모양만 비교하기보다 출력 범위, 포화 구간, 역전파에서 재사용할 값을 함께 보면 구현 선택이 분명해집니다."
      stages={[
        { tag: "RELU", title: "희소한 양수 활성", description: "양수 구간의 gradient를 그대로 통과시켜 깊은 MLP에 적합합니다.", detail: "max(0, x)" },
        { tag: "SIGMOID", title: "0과 1 사이의 gate", description: "확률이나 비율을 표현하지만 큰 절댓값에서 포화됩니다.", detail: "y(1-y)" },
        { tag: "TANH", title: "0 중심의 상태", description: "-1과 1 사이 출력을 만들어 순환 상태 후보에 자주 씁니다.", detail: "1-y²" },
        { tag: "GELU", title: "부드러운 gate", description: "Transformer 계열에서 널리 쓰며 근사식의 미분까지 구현합니다." },
      ]}
      codeKey="activation-fn"
      codeLabel="activation 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
