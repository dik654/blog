import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import PredictionContractViz from "./viz/PredictionContractViz";

export default function OutputLayer() {
  return (
    <section
      id="output-layer"
      data-teach-level="6"
      className="mb-16 scroll-mt-20"
    >
      <h2 className="mb-6 text-2xl font-bold">
        6. 마지막 숫자는 예측하려는 사건에 맞춰 해석합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          XOR에서는 답이 0 또는 1 하나이므로 출력 점수도 하나면 됩니다. 앞의
          정확한 논리 구성은 계단 함수로 <code>[0,1,1,0]</code>을 냈습니다.
          학습할 때는 제한 없는 점수인 <strong>로짓(logit)</strong>을 먼저
          만들고, 시그모이드(sigmoid)로 0과 1 사이의 수로 바꿀 수 있습니다.
        </p>
        <p>
          (가정) 은닉값 합에 4를 곱하고 6을 빼면 네 로짓은
          <code>[−2,2,2,−2]</code>입니다. 시그모이드를 적용하면 약
          <code>[0.119,0.881,0.881,0.119]</code>가 됩니다. 0.5를 기준으로
          판정하면 XOR 답과 같습니다. 이 수를 확률로 해석하려면 0/1 사건과
          베르누이 손실이라는 계약까지 맞아야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="XOR 로짓 하나를 0과 1 사이의 값으로 바꾸고 어떻게 채점할까요?"
        idea={
          <>
            시그모이드는 로짓을 0과 1 사이로 압축합니다. 정답이 1이면
            <code>p</code>가 클수록, 정답이 0이면 <code>1−p</code>가 클수록
            손실이 작아집니다.
          </>
        }
        formula={String.raw`p=\sigma(z)=\frac{1}{1+e^{-z}},\qquad \mathcal L=-\left[y\log p+(1-y)\log(1-p)\right]`}
        annotatedFormula={String.raw`\underbrace{p}_{\text{정답 1의 비율}}=\underbrace{\frac{1}{1+e^{-z}}}_{\text{로짓을 0과 1 사이로 압축}},\qquad \underbrace{\mathcal L}_{\text{자료 한 건의 손실}}=-\left[\underbrace{y\log p}_{y=1\text{일 때}}+\underbrace{(1-y)\log(1-p)}_{y=0\text{일 때}}\right]`}
        operations={[
          {
            expression: String.raw`\frac{1}{1+e^{-z}}`,
            annotation: ["제한 없는 로짓 z를", "0과 1 사이의 값 p로 바꿉니다"],
          },
          {
            expression: String.raw`y\log p`,
            annotation: [
              "정답 y가 1일 때만 남고",
              "p가 1에 가까울수록 손실을 줄입니다",
            ],
          },
          {
            expression: String.raw`(1-y)\log(1-p)`,
            annotation: [
              "정답 y가 0일 때만 남고",
              "p가 0에 가까울수록 손실을 줄입니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "z",
            name: "로짓",
            description: "확률 범위로 바꾸기 전의 제한 없는 점수입니다.",
          },
          {
            symbol: "p",
            name: "정답 1에 준 값",
            description:
              "베르누이(Bernoulli) 계약에서 정답이 1일 조건부 확률로 해석합니다.",
          },
          {
            symbol: "y\\in\\{0,1\\}",
            name: "정답",
            description: "자료 한 건의 이진 정답입니다.",
          },
        ]}
        assumptions={[
          "자료마다 0 또는 1인 사건 하나를 예측합니다.",
          "실제 코드에서는 시그모이드와 일반 로그를 따로 계산하지 않습니다.",
          "로짓 결합 이진 교차 엔트로피 연산에 원시 로짓을 넘깁니다.",
        ]}
        interpretation="z=2이면 p≈0.881입니다. 정답 y=1일 때 손실은 −log(0.881)≈0.127입니다. 같은 점수에서 정답이 0이면 손실은 −log(0.119)≈2.127로 커집니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>숫자 0~9처럼 서로 배타적인 답은 로짓 열 개를 함께 비교합니다</h3>
        <p>
          MNIST는 한 이미지의 정답이 열 숫자 중 하나입니다. 출력층은 로짓 열
          개를 만들고 소프트맥스(softmax)가 합이 1인 분포로 바꿉니다. 정답이
          여러 개 동시에 참일 수 있는 다중 레이블 문제는 각 레이블을 별도 0/1
          사건으로 봅니다. 이때는 표지별 시그모이드와 로짓 결합 이진 교차
          엔트로피를 사용합니다. 회귀는 값의 범위와 잡음 가정에 따라 다른 출력과
          손실을 고릅니다.
        </p>
      </div>

      <PredictionContractViz />

      <ExplainedFormula
        question="서로 배타적인 K개 답의 로짓을 합이 1인 분포로 어떻게 바꿀까요?"
        idea={
          <>
            각 로짓의 지수값을 전체 지수값의 합으로 나눕니다. 정답 범주의 확률이
            작을수록 음의 로그 손실이 커집니다.
          </>
        }
        formula={String.raw`p_k=\frac{e^{z_k}}{\sum_{j=1}^{K}e^{z_j}},\qquad \mathcal L=-\log p_y`}
        annotatedFormula={String.raw`\underbrace{p_k}_{k\text{번째 답의 확률}}=\frac{\overbrace{e^{z_k}}^{k\text{번째 양수 점수}}}{\underbrace{\sum_{j=1}^{K}e^{z_j}}_{\text{모든 점수의 합}}},\qquad \underbrace{\mathcal L}_{\text{손실}}=\underbrace{-\log p_y}_{\text{정답 y에 준 확률을 채점}}`}
        operations={[
          {
            expression: String.raw`e^{z_k}`,
            annotation: [
              "각 로짓을 양수로 바꾸고",
              "큰 로짓의 비중을 키웁니다",
            ],
          },
          {
            expression: String.raw`\sum_{j=1}^{K}e^{z_j}`,
            annotation: [
              "K개 값을 같은 합으로 나눠",
              "전체 확률의 합을 1로 만듭니다",
            ],
          },
          {
            expression: String.raw`-\log p_y`,
            annotation: [
              "정답 범주에 준 확률만 골라",
              "작은 확률을 크게 벌점 줍니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "K",
            name: "서로 배타적인 답의 수",
            description: "MNIST에서는 숫자 0부터 9까지 10입니다.",
          },
          {
            symbol: "z_k",
            name: "k번째 로짓",
            description: "정규화하기 전의 상대 점수입니다.",
          },
          {
            symbol: "p_y",
            name: "정답 범주의 확률",
            description: "손실이 직접 채점하는 값입니다.",
          },
        ]}
        assumptions={[
          "자료 한 건의 정답이 K개 중 정확히 하나입니다.",
          "수치 안정성을 위해 실제 구현은 소프트맥스와 로그를 결합한 교차 엔트로피 연산에 원시 로짓을 넘깁니다.",
        ]}
        interpretation="출력층을 고를 때는 숫자 범위만 보지 않습니다. 답들이 서로 경쟁하는지 먼저 확인합니다. 여러 개가 동시에 참일 수 있는지, 연속값의 잡음을 어떤 분포로 볼지도 정합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          정확도와 확률의 신뢰도도 다릅니다. 가장 큰 로짓이 같은 답을 가리키면
          정확도는 같을 수 있습니다. 0.99라고 말한 예측이 실제로 99% 맞는지는
          별도로 확인해야 합니다. 손실의 유도와 안정적인 구현은
          <Link to="/cs/ai/cross-entropy">교차 엔트로피 글</Link>에서
          이어집니다.
        </p>
      </div>
    </section>
  );
}
