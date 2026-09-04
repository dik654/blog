import ExplainedFormula from "@/components/ui/explained-formula";
import LearningLoopViz from "./viz/LearningLoopViz";

export default function LearningLoop() {
  return (
    <section id="learning-loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        데이터 한 batch가 파라미터 update가 되기까지
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          가장 단순한 supervised learning을 예로 들면 한 example은 입력{" "}
          <strong>x</strong>와 target <strong>y</strong>의 쌍입니다. 이미지
          분류에서는 x가 높이·너비·channel 축을 가진 pixel tensor이고, y는 정답
          class입니다. 여러 example을 batch 축에 쌓으면 같은 연산을 한 번에
          실행할 수 있지만, batch는 새로운 종류의 데이터가 아니라 계산을 묶는
          단위입니다.
        </p>
        <p>
          모델 <strong>fθ</strong>에서 θ는 모든 weight와 bias를 뜻합니다. Forward
          pass는 현재 θ로 prediction ŷ와 각 층의 중간 activation을 만들고, loss는
          prediction과 target의 차이를 하나의 scalar로 줄입니다. Backpropagation은
          그 scalar에서 출발해 chain rule로 각 파라미터의 gradient를 계산하며,
          optimizer는 gradient와 자신의 state를 이용해 다음 θ를 정합니다.
        </p>
      </div>

      <LearningLoopViz />

      <ExplainedFormula
        question="한 batch의 예측 오차가 어떻게 파라미터 update로 이어질까요?"
        idea={
          <p>
            현재 파라미터로 각 example의 예측을 만든 뒤 example별 loss의 평균을 구합니다. 그 평균 loss가 가장 빠르게 커지는 방향인 gradient의 반대쪽으로
            파라미터를 조금 이동합니다.
          </p>
        }
        formula={
          "\\hat{y}_i=f_{\\theta}(x_i),\\qquad " +
          "\\mathcal{L}_{B}(\\theta)=\\frac{1}{|B|}\\sum_{i\\in B}\\ell(\\hat{y}_i,y_i),\\qquad " +
          "\\theta_{t+1}=\\theta_t-\\eta\\nabla_{\\theta}\\mathcal{L}_{B}(\\theta_t)"
        }
        terms={[
          {
            symbol: "x_i, y_i",
            name: "입력과 target",
            description:
              "i번째 example에서 모델이 관측하는 값과 맞혀야 할 기준입니다.",
          },
          {
            symbol: "f_{\\theta}",
            name: "파라미터화된 모델",
            description:
              "현재 weight·bias θ로 입력을 prediction에 매핑합니다.",
          },
          {
            symbol: "\\ell, \\mathcal{L}_{B}",
            name: "Example loss와 batch objective",
            description:
              "개별 오차를 재고 batch 안에서 평균해 update의 scalar 기준을 만듭니다.",
          },
          {
            symbol: "\\nabla_{\\theta}\\mathcal{L}_{B}",
            name: "Gradient",
            description:
              "각 파라미터를 조금 바꿀 때 batch loss가 변하는 방향과 민감도입니다.",
          },
          {
            symbol: "\\eta",
            name: "Learning rate",
            description:
              "한 step에서 gradient 방향으로 얼마나 이동할지 정하는 크기입니다.",
          },
        ]}
        assumptions={[
          "식은 이해를 위한 기본 gradient descent 형태이며, AdamW 같은 optimizer는 momentum·scale·weight decay state를 더 사용합니다.",
          "Loss를 낮추는 것은 training objective에 대한 최적화이며, 처음 보는 data에서의 성능을 자동으로 보장하지 않습니다.",
        ]}
        interpretation="Backpropagation은 파라미터를 직접 고치는 규칙이 아니라 gradient를 효율적으로 계산하는 알고리즘이고, 실제 update 규칙은 optimizer가 소유합니다."
        title="Prediction · objective · update를 한 줄로 읽기"
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Training·validation·test는 서로 다른 질문에 답한다</h3>
        <p>
          Training set은 gradient update에 사용합니다. Validation set은 learning rate, architecture, early stopping 같은
          선택을 비교하는 데 쓰되 그 데이터로 파라미터를 직접 update하지는 않습니다. Test set은 선택이 끝난 뒤 새 데이터에서의 성능을 보고하는 독립 기준입니다. 결과를 본 뒤
          설정을 계속 바꾸면 사실상 validation set으로 사용한 셈이 됩니다.
        </p>
        <p>
          Training loss가 내려가는데 validation loss가 다시 오르면 먼저
          overfitting을 의심하되, split 사이의 distribution 차이와 data leakage도
          확인해야 합니다. 반대로 둘 다 높은 경우에는 model capacity, feature와
          target의 정보량, optimizer·learning rate 문제를 나누어 진단합니다.
          <strong> Generalization</strong>은 training example을 기억하는 능력이
          아니라, 같은 목표를 가진 새 example에서도 유용한 prediction을 내는
          능력입니다.
        </p>
        <h3>학습과 inference의 경계</h3>
        <p>
          학습은 forward 뒤에 loss·backward·update가 이어지지만 inference는 학습된 θ를 고정하고 새 입력에 forward만 실행합니다. 그래서
          inference는 gradient와 optimizer state를 보통 저장하지 않아도 되지만 생성 모델은 KV cache처럼 다음 출력을 위한 runtime state를 별도로
          둘 수 있습니다. 같은 모델이라도 학습과 서빙의 memory 병목이 달라지는 이유입니다.
        </p>
      </div>
    </section>
  );
}
