import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";
import PerceptronViz from "./viz/PerceptronViz";

export default function Overview() {
  return (
    <>
      <section
        id="overview"
        data-teach-level="S"
        className="mb-16 scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          1. 두 센서가 모두 켜졌을 때만 문을 엽니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            (가정) 문에 센서가 두 개 있고, 둘 다 켜진 <code>(1, 1)</code>에서만
            문이 열려야 합니다. 나머지 <code>(0, 0)</code>, <code>(1, 0)</code>,
            <code>(0, 1)</code>에서는 닫혀 있어야 합니다. 네 상태를 매번 따로
            외우는 대신, 입력을 점수 하나로 줄여 0보다 큰지만 확인할 수
            있습니다.
          </p>
          <p>
            <strong>한 문장 답은 이렇습니다.</strong> 입력을 점수 하나로 줄여
            0을 기준으로 가르고, 오답이 난 입력 방향으로 점수표를 옮기면 됩니다.
            다만 이 방법은 직선 하나로 나뉘는 문제까지만 풉니다.
          </p>
          <p>
            이 답을 들으면 세 질문이 남습니다. 두 입력을 왜 점수 하나로
            줄일까요? 판정이 틀리면 숫자를 어떤 순서로 고칠까요? 네 점이 직선
            하나로 나뉘지 않으면 무엇을 바꿔야 할까요? 같은 문 사례로 세 질문을
            차례로 답합니다.
          </p>
        </div>
      </section>

      <section
        id="black-box"
        data-teach-level="B"
        className="mb-16 scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          2. 네 상태를 네 규칙으로 외우지 않고 숫자 한 줄로 셉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            (가정) 첫 센서 값에 0.5, 둘째 센서 값에도 0.5를 곱해 더한 뒤 0.7을
            뺍니다. 그러면 네 점수는 차례로 −0.7, −0.2, −0.2, 0.3입니다. 앞의 세
            값은 0 이하라 문을 닫고, 마지막 값만 0보다 커서 문을 엽니다.
          </p>
          <p>
            여기서 필요한 일은 세 가지뿐입니다. 각 입력이 결과에 미치는 크기를
            정하고, 문이 열리는 기준 위치를 옮기며, 마지막에는 점수의 부호만
            남깁니다. 이 세 일이 한 줄로 이어져 네 상태를 모두 처리합니다.
          </p>
        </div>
      </section>

      <section id="names" data-teach-level="3" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 먼저 본 세 역할에 표준 이름을 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            각 입력에 곱해 결과에 미치는 크기를 정하는 수는
            가중치(weight)입니다. 전체 기준을 같은 만큼 옮기는 수는
            편향(bias)입니다. 점수가 0을 넘었는지만 보고 0 또는 1을 내는 규칙은
            계단 함수(step function)입니다.
          </p>
          <p>
            이 세 계산을 묶은 선형 분류기가{" "}
            <strong>퍼셉트론(perceptron)</strong>입니다. Frank Rosenblatt이
            1958년 논문에서 제안한 체계는 현대 신경망 전체와 같지 않습니다. 이
            논문은 정답과 다른 결과를 보고 연결 강도를 바꾼다는 학습 관점을
            분명하게 제시했습니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 본 뒤 이름을 붙입니다"
          items={[
            {
              term: "가중치 (weight) · w",
              description: "입력마다 결과 점수에 보탤 방향과 크기입니다.",
              example:
                "두 센서에 0.5씩 주면 켜진 센서 하나가 점수 0.5를 보탭니다.",
              boundary:
                "가중치 하나만으로는 문이 열리는 기준 위치를 옮기지 못합니다.",
            },
            {
              term: "편향 (bias) · b",
              description:
                "모든 입력 조합의 점수를 같은 만큼 옮겨 경계 위치를 정합니다.",
              example:
                "b=−0.7이면 합이 0.7보다 클 때만 최종 점수가 양수가 됩니다.",
              boundary: "편향은 입력에 따라 달라지는 별도 규칙이 아닙니다.",
            },
            {
              term: "계단 함수 (step function) · H",
              description:
                "연속적인 점수에서 부호만 남겨 0 또는 1을 출력합니다.",
              example: "−0.2는 0, 0.3은 1이 됩니다.",
              boundary: "출력 0과 1은 확률이 아니라 이진 판정입니다.",
            },
          ]}
        />
        <PerceptronViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            생물학적 뉴런의 입력 수집·합산·발화에서 영감을 얻었지만, 이 대응은
            계산을 떠올리는 비유입니다. 실제 뉴런의 시간 변화와 화학 작용을
            그대로 재현한 모델이라고 읽으면 안 됩니다.
          </p>
        </div>
      </section>

      <section id="trace" data-teach-level="4" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 틀린 `(1, 1)`을 한 번 고쳐 네 상태를 다시 검사합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 현재 퍼셉트론이 어떻게 판정하는지 식으로 고정합니다. 가중치
            방향으로 입력을 모은 점수에 편향을 더한 값이 0인 곳이 결정
            경계입니다. 2차원에서는 직선이며, 한쪽 반평면은 1이고 다른 쪽은
            0입니다.
          </p>
        </div>
        <ExplainedFormula
          question="입력 벡터 하나를 두 범주 중 하나로 어떻게 나눌까요?"
          idea={
            <>
              먼저 <M>{"w"}</M>가 중요하게 보는 방향으로 입력을 모으고, 편향으로
              경계 위치를 옮깁니다. 계단 함수는 점수의 부호만 남깁니다.
            </>
          }
          formula={String.raw`z=w^\top x+b=\sum_{i=1}^{d}w_i x_i+b,\qquad \hat y=H(z)=\begin{cases}1&z>0\\0&z\le 0\end{cases}`}
          annotatedFormula={String.raw`z=\underbrace{w^\top x}_{\text{입력별 기여를 합침}}+\underbrace{b}_{\text{경계 위치를 이동}},\qquad \hat y=\underbrace{H(z)}_{\text{점수의 부호만 남김}}=\begin{cases}1&z>0\\0&z\le 0\end{cases}`}
          operations={[
            {
              expression: String.raw`w^\top x`,
              annotation: [
                "입력마다 가중치를 곱하고",
                "모든 기여를 점수 하나로 더합니다",
              ],
            },
            {
              expression: "b",
              annotation: [
                "모든 점수를 같은 만큼 옮겨",
                "z=0인 결정 경계의 위치를 정합니다",
              ],
            },
            {
              expression: String.raw`H(z)`,
              annotation: [
                "z>0이면 1, z≤0이면 0",
                "점수 크기가 아니라 부호만 출력합니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "x\\in\\mathbb{R}^{d}",
              name: "입력 벡터",
              description: "분류할 자료 한 건의 d개 특성값입니다.",
            },
            {
              symbol: "w\\in\\mathbb{R}^{d}",
              name: "가중치 벡터",
              description: "각 특성값이 점수에 보탤 방향과 크기입니다.",
            },
            {
              symbol: "b\\in\\mathbb{R}",
              name: "편향",
              description: "결정 경계를 원점에서 평행 이동합니다.",
            },
          ]}
          assumptions={[
            "두 범주를 0과 1로 딱 잘라 판정하는 고전적 퍼셉트론입니다.",
            "z=0일 때 어느 쪽으로 둘지는 구현마다 다를 수 있으며 여기서는 0으로 둡니다.",
          ]}
          interpretation="(가정) w=(0.5,0.5), b=−0.7입니다. 그러면 (1,0)의 점수는 −0.2라 0이고, (1,1)의 점수는 0.3이라 1입니다. 이 출력은 확률이 아닙니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이제 일부러 마지막 상태를 틀리는 값에서 시작합니다. (가정)
            <code>w=(0.5,0.5)</code>, <code>b=−1.1</code>이면
            <code>(1,1)</code>의 점수는 −0.1이라 0을 냅니다. 정답 1과의 차이 1에
            학습률 0.1과 입력을 곱해 가중치와 편향을 같은 방향으로 옮깁니다.
          </p>
        </div>
        <ExplainedFormula
          question="분류를 틀렸을 때 결정 경계를 어느 방향으로 움직일까요?"
          idea={
            <>
              정답 <M>{"y"}</M>와 예측 <M>{"\\hat y"}</M>의 차이에 입력을 곱해,
              틀린 자료를 올바른 쪽으로 보내는 방향으로 가중치와 편향을
              옮깁니다.
            </>
          }
          formula={String.raw`w\leftarrow w+\eta(y-\hat y)x,\qquad b\leftarrow b+\eta(y-\hat y)`}
          annotatedFormula={String.raw`w\leftarrow w+\underbrace{\eta(y-\hat y)x}_{\text{오답 입력 방향으로 이동}},\qquad b\leftarrow b+\underbrace{\eta(y-\hat y)}_{\text{경계 전체를 이동}}`}
          operations={[
            {
              expression: String.raw`y-\hat y`,
              annotation: [
                "맞히면 0이라 바꾸지 않음",
                "1을 0으로 틀리면 +1",
                "0을 1로 틀리면 −1",
              ],
            },
            {
              expression: String.raw`\eta(y-\hat y)x`,
              annotation: [
                "오답의 방향 x를 사용하고",
                "학습률 η로 한 번의 이동 크기를 제한합니다",
              ],
            },
            {
              expression: String.raw`\eta(y-\hat y)`,
              annotation: ["편향도 같은 부호로 옮겨", "경계를 평행 이동합니다"],
            },
          ]}
          terms={[
            {
              symbol: "y\\in\\{0,1\\}",
              name: "정답",
              description: "현재 자료가 가져야 할 분류값입니다.",
            },
            {
              symbol: String.raw`\hat y`,
              name: "예측",
              description: "현재 경계가 낸 0 또는 1입니다.",
            },
            {
              symbol: String.raw`\eta>0`,
              name: "학습률",
              description: "오답 한 번이 숫자를 옮기는 크기입니다.",
            },
          ]}
          assumptions={[
            "자료를 한 건씩 보고 바로 고치는 방식입니다.",
            "직선으로 완전히 나눌 수 있어야 합니다. 경계와 자료 사이에도 양의 여유가 있어야 오답 횟수의 유한 상한을 적용할 수 있습니다.",
          ]}
          interpretation="(가정) η=0.1에서 오차가 1이면 w는 (0.6,0.6), b는 −1.0이 됩니다. 네 점수는 −1.0, −0.4, −0.4, 0.2여서 AND 네 상태를 모두 맞힙니다."
        />
        <AlgorithmBlock
          title="AND 오답 한 번을 고치고 전체 네 상태를 재검사하는 절차 (의사코드)"
          input={[
            "(가정) x=(1,1), y=1; w=(0.5,0.5), b=−1.1, η=0.1",
            "전체 확인 집합={(0,0)→0,(1,0)→0,(0,1)→0,(1,1)→1}",
          ]}
          steps={[
            {
              code: "z ← dot(w,x)+b = 0.5+0.5−1.1 = −0.1",
              note: "현재 점수부터 계산합니다.",
            },
            {
              code: "ŷ ← 1 if z>0 else 0 = 0",
              note: "정답 1과 달라서 이번 자료는 오답입니다.",
            },
            {
              code: "error ← y−ŷ = 1−0 = 1",
              note: "맞혔다면 0이 되어 다음 두 수정이 사라집니다.",
            },
            {
              code: "w ← w+η·error·x = (0.6,0.6)",
              note: "켜진 두 입력 방향으로 가중치를 각각 0.1 올립니다.",
            },
            {
              code: "b ← b+η·error = −1.0",
              note: "네 상태가 공유하는 경계 위치도 0.1 옮깁니다.",
            },
            {
              code: "scores ← [−1.0,−0.4,−0.4,0.2]",
              note: "한 자료만 다시 보지 않고 네 상태 전체를 같은 식에 넣습니다.",
            },
            {
              code: "predictions ← [0,0,0,1]",
              note: "네 정답과 모두 같아졌습니다. 다른 순서나 시작값에서는 수정 횟수가 달라질 수 있습니다.",
            },
          ]}
          output="w=(0.6,0.6), b=−1.0; AND 네 상태의 오답 0개"
          repeatUntil="전체 자료를 한 바퀴 보았을 때 오답이 없거나 정한 최대 반복 수에 도달할 때까지 자료를 순서대로 봅니다. 직선으로 나눌 수 없으면 오답 0개가 되지 않을 수 있습니다."
        />

        <div
          id="paper-perceptron"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            원문을 같은 질문에 적용합니다
          </p>
          <h3 className="mt-2 text-base font-bold text-foreground">
            Rosenblatt의 기여는 현대 MLP 전체가 아니라 오답으로 연결 강도를
            바꾸는 관점입니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            1958년 논문은 입력 무늬를 저장하고 분류하는 확률적 체계와 연결
            강도의 적응을 다룹니다. 위 AND 의사코드는 그 발상을 현재의 선형 분류
            표기로 축소한 교육용 절차입니다. 미분 가능한 활성화 함수, 다층
            역전파와 GPU 학습까지 원문에 들어 있었다고 소급해서 읽으면 안
            됩니다.
          </p>
        </div>
        <div
          id="source-scikit-perceptron"
          className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            실제 코드에서는 무엇을 고정할까요?
          </p>
          <h3 className="mt-2 text-base font-bold text-foreground">
            scikit-learn 구현은 손실 함수와 학습률 방식을 고정합니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            공식 소스의 생성자는 공통 확률적 경사 하강 분류기에
            <code className="mx-1">loss=&quot;perceptron&quot;</code>과
            <code className="mx-1">learning_rate=&quot;constant&quot;</code>를
            넘깁니다. 그래서 위 의사코드는 핵심 수정 방향을 보여 주지만, 실제
            <code className="mx-1">fit</code>에는 자료 섞기, 최대 반복 횟수,
            조기 종료 같은 운영 조건도 함께 들어갑니다.
          </p>
          <a
            href="https://github.com/scikit-learn/scikit-learn/blob/0d4fe1463f83a341337628a2880d1d174a723bfa/sklearn/linear_model/_perceptron.py"
            className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            고정 커밋의 공식 구현 보기
          </a>
        </div>
      </section>
    </>
  );
}
