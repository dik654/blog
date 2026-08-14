import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";

export default function Expectation({ title }: { title?: string }) {
  return (
    <section id="expectation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "기댓값 정본을 정보량에 적용하면 분포 전체의 비용이 된다"}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <Link to="/ai/math-random-variables-expectation#expectation">기댓값 정본</Link>에서
          정의한 확률 가중 평균을 surprisal에 적용합니다. 자주 발생하는 사건의 비용에는
          큰 비중을, 드문 사건의 비용에는 작은 비중을 주므로 한 번의 관측 비용을
          distribution 전체의 평균 비용으로 바꿀 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="사건마다 다른 비용 f(x)를 실제 분포 P 전체에서 어떻게 평균낼까?"
        idea={<>각 사건의 비용 f(x)에 그 사건이 실제로 나타날 확률 P(x)를 곱해 더합니다. 학습에서는 P를 직접 모르므로 i.i.d. sample 평균인 empirical risk로 근사합니다.</>}
        formula={String.raw`\begin{aligned}\mathbb E_{x\sim P}[f(x)]&=\sum_xP(x)f(x)\\[3pt]R(\theta)&=\mathbb E_{(x,y)\sim P_{\rm data}}[\ell_\theta(x,y)]\\[3pt]\widehat R_n(\theta)&=\frac1n\sum_{i=1}^{n}\ell_\theta(x_i,y_i)\end{aligned}`}
        terms={[
          { symbol: "P", name: "모집단 분포", description: "실제 환경에서 input과 label이 생성되는 알 수 없는 분포입니다." },
          { symbol: "f(x)", name: "사건별 측정값", description: "이 글에서는 surprisal 또는 sample loss가 들어갑니다." },
          { symbol: "R(\theta)", name: "population risk", description: "새로운 데이터에서 기대하는 model loss입니다." },
          { symbol: "\\widehat R_n", name: "empirical risk", description: "관측한 n개 training sample로 계산한 평균 loss입니다." },
        ]}
        assumptions={["Training sample이 동일한 data-generating distribution에서 뽑혔다고 가정합니다.", "낮은 empirical risk만으로 낮은 population risk가 보장되지는 않으므로 validation과 regularization이 필요합니다."]}
        interpretation="Mini-batch loss는 population objective 그 자체가 아니라 noisy estimator입니다. Batch 크기와 sampling 방식이 gradient variance에 영향을 주는 이유도 여기에 있습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>어떤 함수를 평균내느냐가 다음 개념을 가른다</h3>
        <p>
          이제 기대값 안에 <code>−log P(x)</code>를 넣으면 실제 분포 자체의
          entropy가 되고, <code>−log Q(x)</code>를 넣으면 모델 Q로 데이터를
          설명하는 cross-entropy가 된다. 두 식은 평균을 내는 분포는 P로 같고,
          log 안에 들어가는 분포만 다르다.
        </p>
        <p>
          예를 들어 세 sample의 loss가 각각 <code>0.2, 0.5, 0.8</code>이면
          empirical risk는 <code>(0.2+0.5+0.8)/3=0.5</code>다. 이 값은 관측한
          세 sample의 평균일 뿐 실제 환경 전체의 평균은 아니다. 같은 계산을 여러
          독립 validation sample과 slice에서 다시 확인해야 training data를 잘 맞춘
          결과와 population에서 일반화되는 결과를 구분할 수 있다.
        </p>
      </div>
    </section>
  );
}
