import ExplainedFormula from "@/components/ui/explained-formula";
import SpectrumTraceViz from "./viz/SpectrumTraceViz";

export default function Spectrum() {
  return (
    <section id="spectrum" data-teach-level="4" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">여덟 밝기 값에서 반복 횟수를 셉니다</h2>
      <SpectrumTraceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          설명용 입력의 한 줄을 <code>+1, −1</code>이 번갈아 나타나는 여덟 칸으로
          단순화하겠습니다. 주파수 번호 <code>k=4</code>의 기준도 같은 방향으로 네 번
          반복되므로 위치별 곱은 모두 <code>+1</code>이고 합은 8입니다. 공간에서 흩어져
          보이던 반복이 주파수 좌표에서는 하나의 큰 값으로 모입니다.
        </p>
        <p>
          이 계산은 입력을 다른 좌표로 표현할 뿐입니다. 실제 얼굴 crop에는 많은 방향과
          반복 횟수가 함께 들어 있고, 어느 막대가 생성 과정 때문에 생겼는지는 별도
          실험으로 확인해야 합니다. 따라서 spectrum의 봉우리를 곧바로 진위 label로
          해석하지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="여덟 칸의 번갈아 나타나는 밝기가 k=4 막대에 얼마나 모일까요?"
        idea={<>각 위치의 밝기에 k=4 기준값을 곱해 더합니다. 이 사례에서는 두 배열이 같아 여덟 항이 모두 +1입니다.</>}
        formula={String.raw`X_4=\sum_{n=0}^{7}x_n e^{-i2\pi(4)n/8}=8`}
        annotatedFormula={String.raw`\begin{aligned}
x_n&=\underbrace{[1,-1,1,-1,1,-1,1,-1]}_{\text{설명용 밝기 한 줄}},\\
b_{4,n}&=\underbrace{[1,-1,1,-1,1,-1,1,-1]}_{k=4\text{ 기준의 실수값}},\\
x_nb_{4,n}&=\underbrace{[1,1,1,1,1,1,1,1]}_{\text{위치별 곱}},\\
|X_4|&=\underbrace{|1+1+1+1+1+1+1+1|}_{\text{같은 반복이 모인 크기}}=8.
\end{aligned}`}
        operations={[
          { expression: String.raw`x_n`, annotation: ["한 행에서 여덟 밝기 값을 순서대로 읽음", "평균을 뺀 설명용 값이라 +1과 −1로 단순화"] },
          { expression: String.raw`x_nb_{4,n}`, annotation: ["k=4 기준의 같은 위치와 곱함", "밝기와 기준의 부호가 같아 각 항은 +1"] },
          { expression: String.raw`|X_4|`, annotation: ["여덟 곱을 더해 8", "복소 계수의 크기를 주파수 막대 높이로 읽음"] },
        ]}
        terms={[
          { symbol: "n", name: "위치 번호", description: "왼쪽부터 0에서 7까지 붙인 밝기 칸의 번호입니다." },
          { symbol: "k", name: "주파수 번호", description: "여덟 칸 안에서 기준 무늬가 몇 번 방향을 바꾸는지 나타냅니다." },
          { symbol: "X₄", name: "k=4 계수", description: "입력과 k=4 기준이 얼마나 같은 방향인지 모은 값입니다." },
        ]}
        assumptions={[
          "실제 얼굴 영상이 아니라 좌표 변환을 설명하기 위한 1차원 여덟 칸 사례입니다.",
          "밝기 평균과 정규화 방식은 후보 사이에서 같게 둡니다.",
          "실제 detector는 2차원 spectrum과 학습된 여러 특징을 사용할 수 있습니다.",
        ]}
        interpretation="k=4 막대가 8이라는 사실은 네 번 반복되는 밝기 변화가 강하다는 뜻입니다. 이 입력이 가짜라는 뜻은 아닙니다."
      />
    </section>
  );
}
