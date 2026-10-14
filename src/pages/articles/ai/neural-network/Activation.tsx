import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import LinearCollapseViz from "./viz/LinearCollapseViz";

export default function Activation() {
  return (
    <section
      id="activation"
      data-teach-level="4"
      className="mb-16 scroll-mt-20"
    >
      <h2 className="mb-6 text-2xl font-bold">
        4. 비선형 계산이 없으면 두 층은 한 층으로 접힙니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          층을 여러 개 적었다고 해서 자동으로 휘어진 경계가 생기지는 않습니다.
          (가정) 첫 계산이 <code>z₁=2x−1</code>이고 둘째 계산이
          <code>z₂=3z₁+2</code>라면, 첫 식을 둘째 식에 넣어
          <code>z₂=6x−1</code>로 합칠 수 있습니다. 중간값을 저장했어도 최종
          계산은 직선 하나입니다.
        </p>
        <p>
          중간에 렐루(ReLU)를 넣으면 <code>z₂=3·ReLU(2x−1)+2</code>가 됩니다.
          <code>x≤0.5</code>에서는 값이 2에 머물고, 그보다 클 때만 기울기 6으로
          증가합니다. 입력 구간에 따라 다른 식이 선택되므로 아핀 식 하나로는
          합칠 수 없습니다. XOR 구성의 계단 함수도 같은 구조적 역할을 합니다.
        </p>
      </div>

      <LinearCollapseViz />

      <ExplainedFormula
        question="활성화 함수가 없는 아핀 층 두 개를 왜 하나로 합칠 수 있을까요?"
        idea={
          <>
            첫 층의 출력을 둘째 식에 그대로 넣습니다. 행렬 곱과 편향을 묶으면 새
            가중치 행렬 하나와 새 편향 하나만 남습니다.
          </>
        }
        formula={String.raw`z_1=xW_1+b_1,\qquad z_2=z_1W_2+b_2=x(W_1W_2)+(b_1W_2+b_2)`}
        annotatedFormula={String.raw`z_2=\underbrace{(xW_1+b_1)W_2+b_2}_{\text{첫 출력을 둘째 식에 대입}}=x\underbrace{(W_1W_2)}_{\text{합쳐진 가중치}}+\underbrace{(b_1W_2+b_2)}_{\text{합쳐진 편향}}`}
        operations={[
          {
            expression: String.raw`(xW_1+b_1)W_2+b_2`,
            annotation: [
              "두 층 사이에 다른 규칙이 없어서",
              "첫 층 식을 둘째 층에 그대로 대입합니다",
            ],
          },
          {
            expression: String.raw`W_1W_2`,
            annotation: [
              "두 번의 좌표 섞기를 미리 곱해",
              "효과가 같은 가중치 행렬 하나를 만듭니다",
            ],
          },
          {
            expression: String.raw`b_1W_2+b_2`,
            annotation: [
              "첫 편향도 둘째 좌표계로 옮긴 뒤",
              "마지막 편향과 합칩니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "W_1W_2",
            name: "합쳐진 가중치",
            description: "두 층의 선형 섞기를 한 번에 수행합니다.",
          },
          {
            symbol: "b_1W_2+b_2",
            name: "합쳐진 편향",
            description:
              "두 번의 기준 이동을 마지막 좌표계에서 하나로 모읍니다.",
          },
        ]}
        assumptions={[
          "두 행렬의 안쪽 차원이 맞아 곱셈이 가능합니다.",
          "두 층 사이에 활성화 함수, 정규화, 분기처럼 합칠 수 없는 계산이 없습니다.",
        ]}
        interpretation="숫자 예에서는 W₁=2, b₁=−1, W₂=3, b₂=2이므로 합쳐진 가중치는 6, 편향은 −1입니다. 깊이는 2지만 함수는 z₂=6x−1인 아핀 함수 하나입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>활성화 함수는 표현력과 학습 경로를 함께 바꿉니다</h3>
        <p>
          계단 함수는 XOR 논리를 정확히 그리기 쉽습니다. 하지만 대부분 구간의
          기울기가 0이라 표준 역전파로 가중치를 배우기 어렵습니다. 렐루는 양수
          구간의 기울기를 남깁니다. 시그모이드와 하이퍼볼릭 탄젠트(tanh)는
          부드럽지만 큰 입력에서 기울기가 작아질 수 있습니다. 구조적 역할과
          기울기 특성을 함께 봐야 합니다.
        </p>
        <p>
          각 함수의 값과 기울기는
          <Link to="/cs/ai/activation-functions">활성화 함수 글</Link>에서 같은
          입력값으로 비교합니다. 여기서는 비선형 계산이 층을 하나로 합칠 수 없게
          만든다는 역할만 사용합니다.
        </p>
      </div>
    </section>
  );
}
