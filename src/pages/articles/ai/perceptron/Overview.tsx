import PerceptronViz from "./viz/PerceptronViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        퍼셉트론은 입력을 score 하나로 줄여 선형 경계를 만든다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <strong>퍼셉트론(perceptron)</strong>은 여러 입력에 서로 다른 weight를
          곱해 더한 뒤, 그 값이 threshold를 넘었는지에 따라 0 또는 1을 출력하는
          선형 분류기다. Frank Rosenblatt이 1950년대 후반에 제안했으며, 오늘날의
          신경망과 형태가 완전히 같지는 않지만 “데이터를 보고 weight를
          조정한다”는 학습 관점을 대중화한 출발점으로 볼 수 있습니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">
          생물학적 뉴런과의 유사성
        </h3>
        <p className="leading-7">
          이 구조는 생물학적 뉴런에서 영감을 받았습니다. 수상돌기로 받은 신호를
          세포체가 모아 축삭으로 내보내는 모습을, 입력에 weight를 적용해
          합산하고 activation function으로 출력을 정하는 계산으로 단순화한
          것입니다. 다만 이는 학습을 설명하기 위한 공학적 비유이며 실제 뉴런의
          복잡한 동작을 그대로 재현한 모델은 아닙니다.
        </p>
      </div>
      <div className="mt-8">
        <PerceptronViz />
      </div>
      <ExplainedFormula
        question="입력 vector 하나를 두 class 중 하나로 어떻게 나눌까?"
        idea={<>먼저 <M>{"w"}</M>가 중요하게 보는 방향으로 input을 projection하고, bias로 경계 위치를 옮깁니다. 마지막 step function은 score의 부호만 남깁니다.</>}
        formula={String.raw`z=w^\top x+b=\sum_{i=1}^{d}w_i x_i+b,\qquad \hat y=H(z)=\begin{cases}1&z>0\\0&z\le 0\end{cases}`}
        terms={[
          { symbol: "x\\in\\mathbb{R}^{d}", name: "input vector", description: "분류할 sample의 d개 feature입니다." },
          { symbol: "w\\in\\mathbb{R}^{d}", name: "weight vector", description: "각 feature의 방향과 상대적 중요도를 정합니다." },
          { symbol: "b\\in\\mathbb{R}", name: "bias", description: "결정 경계를 원점에서 평행 이동합니다." },
          { symbol: "H", name: "Heaviside step", description: "연속 score를 0 또는 1의 class label로 바꿉니다." },
        ]}
        assumptions={["binary classification과 hard threshold를 사용하는 고전적 perceptron을 기준으로 합니다.", "z=0일 때 어느 class로 둘지는 구현 convention이며 여기서는 0으로 둡니다."]}
        interpretation="z=0, 즉 wᵀx+b=0이 결정 경계입니다. 2차원에서는 직선, 3차원에서는 평면, 일반 d차원에서는 hyperplane이므로 한 퍼셉트론의 positive region은 하나의 half-space입니다."
      />
      <ExplainedFormula
        question="분류를 틀렸을 때 결정 경계를 어느 방향으로 움직일까?"
        idea={<>정답 <M>{"y"}</M>와 예측 <M>{"\\hat y"}</M>의 차이에 input을 곱해, 틀린 sample을 올바른 쪽으로 보내는 방향으로 weight와 bias를 이동합니다.</>}
        formula={String.raw`w\leftarrow w+\eta(y-\hat y)x,\qquad b\leftarrow b+\eta(y-\hat y)`}
        terms={[
          { symbol: "y\\in\\{0,1\\}", name: "target", description: "sample의 정답 label입니다." },
          { symbol: String.raw`\hat y`, name: "prediction", description: "현재 경계가 낸 0 또는 1입니다." },
          { symbol: String.raw`\eta>0`, name: "learning rate", description: "한 mistake가 경계를 움직이는 크기입니다." },
        ]}
        assumptions={["sample을 하나씩 보는 online perceptron update입니다.", "training data가 선형 분리 가능할 때 고전적 convergence theorem이 유한 mistake 후 수렴을 보장합니다."]}
        interpretation="정답을 맞히면 y−ŷ=0이므로 update하지 않습니다. 데이터가 선형 분리 불가능하면 이 규칙은 한 경계에 수렴하지 않고 계속 흔들릴 수 있으며, 그 대표 예가 XOR입니다."
      />
      <div
        id="paper-perceptron"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 해설 · Rosenblatt의 Perceptron
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          역사적 기여는 현대 MLP 전체가 아니라 example로 connection을 바꾸는 학습
          관점입니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          1958년 논문은 pattern을 저장하고 분류하는 probabilistic system과
          connection-strength adaptation을 제시했습니다. 여기서 가져와야 할
          핵심은 고정 logic 대신 data의 error로 weight를 바꾼다는 발상입니다.
          현대의 differentiable activation, multilayer backpropagation과 GPU
          training까지 이 원문에 들어 있었다고 소급해서 읽으면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
