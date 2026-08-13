import ExplainedFormula from "@/components/ui/explained-formula";
import MarginViz from "./viz/MarginViz";
import { Link } from "react-router-dom";

export default function Convergence() {
  return (
    <section id="convergence" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        수렴 정리: 언제 퍼셉트론의 실수가 끝나는가
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          퍼셉트론은 training example을 하나 보고 예측한 뒤, 틀렸을 때만 weight를
          바꿉니다. 여기서 <strong>mistake</strong>는 loss가 조금 높다는 뜻이
          아니라 class 0과 1을 잘못 예측한 한 번의 사건입니다. 그러면 자연스럽게
          이런 질문이 생깁니다. “같은 example을 계속 보여 주면 언젠가는 모든
          training example을 맞히고 update를 멈출까?”
        </p>
        <p>
          답은 <strong>데이터를 직선 하나로 나눌 수 있을 때만 그렇다</strong>입니다.
          더 정확히는 정답 class의 점들이 경계 양쪽에 놓이기만 해서는 부족하고,
          경계에 딱 붙지 않은 채 작은 여유를 가져야 합니다. 이 가장 작은 여유를
          <strong>margin</strong>이라고 합니다.
        </p>
      </div>

      <MarginViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>R과 γ를 그림의 언어로 먼저 읽기</h3>
        <p>
          정리에는 두 길이가 나옵니다. <strong>R</strong>은 원점에서 가장 멀리
          떨어진 input의 거리, 즉 input들이 얼마나 큰 범위까지 퍼져 있는지에 대한
          상한입니다. <strong>γ(감마)</strong>는 정답을 모두 맞히는 경계 가운데
          하나를 골랐을 때, 그 경계와 가장 가까운 training example 사이의
          거리입니다. Weight 방향의 길이를 1로 맞추면 signed score를 실제 거리로
          읽을 수 있습니다.
        </p>
        <p>
          Vector의 길이와 dot product가 아직 낯설다면
          <Link to="/ai/math-vectors-inner-products">
            벡터·내적·norm 기초 글
          </Link>
          에서 (3,4)의 길이부터 계산하고 돌아오면 됩니다. 이 글에서도 필요한
          뜻을 바로 설명하지만, 아래 증명의 부등식까지 직접 확인하려면 projection과
          Cauchy–Schwarz inequality가 그 수학적 연결고리입니다.
        </p>
        <p>
          R이 같은데 γ가 크면 두 class 사이에 넓은 빈 통로가 있다는 뜻이고,
          update가 찾아야 할 방향도 비교적 분명합니다. 반대로 γ가 작으면 가장
          가까운 점이 경계에 바짝 붙어 있으므로 mistake 횟수의 이론적 상한이
          빠르게 커집니다.
        </p>
      </div>

      <ExplainedFormula
        question="선형 분리 가능한 데이터에서 퍼셉트론은 최대 몇 번까지 틀릴 수 있을까요?"
        idea={
          <>
            설명을 단순하게 만들기 위해 class 0을 −1, class 1을 +1로 바꿉니다.
            그러면 정답 쪽에 있는 example은 y와 score의 곱이 양수가 됩니다. 모든
            input 크기가 R 이하이고, 어떤 경계가 모든 example에 최소 γ의 여유를
            주면 전체 mistake 수 M에 상한을 둘 수 있습니다.
          </>
        }
        formula={String.raw`\underbrace{\lVert x_i\rVert\le R}_{\text{input 크기의 상한}},\qquad
\underbrace{y_i(w_*^\top x_i)\ge\gamma>0}_{\text{모든 example의 최소 여유}}
\qquad\Longrightarrow\qquad
\underbrace{M\le\left(\frac{R}{\gamma}\right)^2}_{\text{mistake 횟수의 상한}}`}
        terms={[
          {
            symbol: "x_i",
            name: "i번째 input",
            description:
              "Training 순서에서 퍼셉트론이 한 번에 보고 예측하는 feature vector입니다.",
          },
          {
            symbol: "y_i\in\{-1,+1\}",
            name: "정답의 부호",
            description:
              "두 class를 계산하기 편하도록 −1과 +1로 표현합니다.",
          },
          {
            symbol: "R",
            name: "가장 큰 input 거리",
            description:
              "모든 input이 원점에서 R 이내에 있다는 뜻입니다. 값의 scale이 커지면 R도 커집니다.",
          },
          {
            symbol: "w_*",
            name: "정답을 모두 나누는 방향",
            description:
              "길이를 1로 맞춘 weight vector이며, 모든 training example을 올바른 쪽에 둡니다.",
          },
          {
            symbol: String.raw`\gamma`,
            name: "최소 margin",
            description:
              "모든 training example 중 결정 경계에 가장 가까운 점이 확보한 거리입니다.",
          },
          {
            symbol: "M",
            name: "Mistake count",
            description:
              "잘못 예측해 실제로 perceptron update가 일어난 총횟수입니다.",
          },
        ]}
        assumptions={[
          "모든 training example을 틀리지 않게 나누는 하나의 직선·평면이 실제로 존재해야 합니다.",
          "그 경계와 가장 가까운 example의 거리 γ가 0보다 커야 합니다.",
          "같은 scale에서 거리를 비교하며, bias는 input에 값이 항상 1인 feature를 하나 붙여 포함할 수 있습니다.",
        ]}
        interpretation="예를 들어 R=2, γ=0.5라면 bound는 16회입니다. γ만 절반인 0.25가 되면 bound는 64회로 네 배가 됩니다. 이는 실제로 반드시 그만큼 틀린다는 예측이 아니라, 최악의 경우에도 이 횟수를 넘지 않는다는 보수적인 상한입니다."
        title="거리 두 개로 mistake 상한 읽기"
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 R/γ의 제곱이 나오는가</h3>
        <p>
          오분류가 한 번 일어날 때마다 새 weight는 정답 separator 방향으로 적어도
          γ만큼 전진합니다. 따라서 M번 틀린 뒤 그 방향으로 전진한 양은 최소
          Mγ입니다. 한편 매 update에 더하는 input의 크기는 R 이하이므로, weight의
          전체 길이는 아무리 커져도 대략 R√M보다 빠르게 자랄 수 없습니다. 같은
          weight에 대한 두 설명을 결합하면 Mγ ≤ R√M이고, 양변을 정리해
          M ≤ (R/γ)²를 얻습니다.
        </p>
        <p>
          이 증명은 퍼셉트론이 매 step마다 loss를 매끄럽게 줄인다고 말하지
          않습니다. Training example의 순서에 따라 중간 경계는 흔들릴 수 있지만,
          positive margin이라는 강한 조건 아래에서는 오분류가 무한히 반복될 수
          없다고 말합니다.
        </p>

        <h3>XOR과 label noise에서는 왜 적용할 수 없는가</h3>
        <p>
          XOR은 모든 점을 맞히는 직선이 없으므로 w*와 positive γ 자체를 정할 수
          없습니다. 같은 input에 서로 다른 label이 붙은 noisy data도 마찬가지입니다.
          이때 update가 멈추지 않는 현상은 learning rate만 줄인다고 해결되지
          않습니다. 새로운 feature나 nonlinear hidden layer를 도입하거나, 일부
          오차를 허용하는 다른 objective와 model을 선택해야 합니다.
        </p>
      </div>
    </section>
  );
}
