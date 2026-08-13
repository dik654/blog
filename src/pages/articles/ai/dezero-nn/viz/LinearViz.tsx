import DezeroConceptViz from "../../DezeroConceptViz";

export default function LinearViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="LINEAR LAYER"
      title="shape 계약과 초기화가 전결합 레이어의 핵심이다"
      summary="Linear는 단순한 행렬곱처럼 보이지만 입력·출력 shape, bias broadcasting, 재현 가능한 초기화까지 하나의 계약으로 묶어야 합니다."
      stages={[
        { tag: "SHAPE", title: "입력 차원 확인", description: "배치 축을 유지한 채 마지막 feature 축을 읽습니다.", detail: "[N, in]" },
        { tag: "INIT", title: "Xavier 초기화", description: "입력 차원에 맞춰 weight 분산을 조절합니다.", detail: "std = sqrt(1 / in)" },
        { tag: "AFFINE", title: "행렬곱과 bias", description: "입력과 weight를 곱한 뒤 bias를 broadcast합니다.", detail: "y = xW + b" },
        { tag: "GRAD", title: "양방향 gradient", description: "입력과 weight 양쪽으로 행렬곱 gradient를 전달합니다.", detail: "gx = gyWᵀ · gW = xᵀgy" },
      ]}
      codeKey="linear-struct"
      codeLabel="Linear 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
