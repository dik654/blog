import { MathFlow, MathLedger, MathVizFrame } from "../../math-viz-primitives";

export default function FieldMechanismViz() {
  return (
    <MathVizFrame
      eyebrow="유한체 계산"
      title="정수 계산을 p개의 상태 안에서 되돌릴 수 있게 만든다"
      description="소수 p를 modulus로 택하면 0이 아닌 모든 residue가 곱셈 역원을 가지므로, 나눗셈을 포함한 다항식 계산을 유한한 상태 안에서 정확히 수행할 수 있습니다."
      note="mod 7에서 3으로 나눈다는 말은 정수 나눗셈이 아니라 3의 역원 5를 곱한다는 뜻입니다."
    >
      <MathFlow
        steps={[
          {
            label: "INPUT",
            title: "정수 연산",
            body: "덧셈과 곱셈을 먼저 수행합니다.",
            code: "5 + 6 = 11",
          },
          {
            label: "REDUCE",
            title: "mod p",
            body: "p의 배수 차이는 같은 residue로 묶습니다.",
            code: "11 mod 7 = 4",
          },
          {
            label: "INVERT",
            title: "0이 아닌 값의 역원",
            body: "p가 소수이면 곱해 1이 되는 값이 유일합니다.",
            code: "3⁻¹ = 5",
          },
          {
            label: "DIVIDE",
            title: "나눗셈도 체 연산",
            body: "역원을 곱해 다시 같은 집합 안에 머뭅니다.",
            code: "6 / 3 = 6·5 = 2",
          },
        ]}
      />
      <div className="mt-8 border-t border-border pt-6">
        <MathLedger
          items={[
            {
              label: "SET",
              value: "{0,1,2,3,4,5,6}",
              meaning: "F₇의 일곱 residue",
            },
            { label: "ADD", value: "5+6 ≡ 4", meaning: "결과를 0…6으로 환원" },
            { label: "MUL", value: "3·5 ≡ 1", meaning: "3과 5는 서로 역원" },
            {
              label: "FAIL",
              value: "0⁻¹ 없음",
              meaning: "나눗셈에서 0은 제외",
            },
          ]}
        />
      </div>
    </MathVizFrame>
  );
}
