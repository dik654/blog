import { MathFlow, MathVizFrame } from "../../math-viz-primitives";

export default function ButterflyViz() {
  return (
    <MathVizFrame
      eyebrow="Radix-2 butterfly"
      title="even·odd 부분 결과 한 쌍으로 출력 두 개를 만든다"
      description="ω^(k+n/2)=−ω^k이므로 같은 E[k]와 ω^kO[k]를 한 번은 더하고 한 번은 빼서 반대편 출력까지 계산합니다."
      note="Radix-2는 n이 2의 거듭제곱일 때의 한 구현입니다. 실제 성능은 stage 순서, bit reversal, cache·shared memory 이동에도 좌우됩니다."
    >
      <MathFlow
        steps={[
          {
            label: "SPLIT",
            title: "even / odd",
            body: "계수 index가 짝수인 다항식과 홀수인 다항식으로 나눕니다.",
          },
          {
            label: "RECURSE",
            title: "E[k], O[k]",
            body: "크기 n/2 transform 두 개를 한 번씩 계산합니다.",
          },
          {
            label: "TWIDDLE",
            title: "t=ωᵏO[k]",
            body: "odd 결과의 phase를 출력 k에 맞춥니다.",
          },
          {
            label: "MERGE",
            title: "E+t, E−t",
            body: "k와 k+n/2 출력이 동시에 생깁니다.",
          },
        ]}
      />
    </MathVizFrame>
  );
}
