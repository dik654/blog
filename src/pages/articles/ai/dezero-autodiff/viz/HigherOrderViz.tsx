import DezeroConceptViz from "../../DezeroConceptViz";

export default function HigherOrderViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="HIGHER-ORDER GRADIENT"
      title="역전파 연산도 그래프에 남기면 다시 미분할 수 있다"
      summary="create_graph를 켠 첫 번째 backward가 새 계산 그래프를 만들고, 그 결과인 grad에서 backward를 한 번 더 호출합니다."
      stages={[
        { tag: "FWD", title: "원래 함수 계산", description: "x에서 y까지 첫 계산 그래프를 만듭니다.", detail: "y = f(x)" },
        { tag: "1ST", title: "1차 미분 기록", description: "create_graph=true로 미분 계산 자체를 추적합니다.", detail: "gx = dy/dx" },
        { tag: "RESET", title: "기존 gradient 초기화", description: "두 번째 역전파가 이전 값과 섞이지 않도록 정리합니다." },
        { tag: "2ND", title: "gradient를 다시 미분", description: "gx.backward()로 2차 미분을 얻습니다.", detail: "d²y/dx²" },
      ]}
      codeKey="backward"
      codeLabel="고차 미분 경로 보기"
      onOpenCode={onOpenCode}
    />
  );
}
