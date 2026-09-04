import ExplainedFormula from "@/components/ui/explained-formula";
import ConditionalProbabilityViz from "./viz/ConditionalProbabilityViz";

export default function ConditionalProbability() {
  return (
    <section id="conditional-probability" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">조건부확률과 연쇄법칙: 정보를 받은 뒤 확률을 다시 읽는 법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
            Sample space 안에서 관심 있는 outcome을 묶은 집합을 event라고 부릅니다. “앞면이 정확히 한 번”과 “첫 toss가 H”처럼 서로 다른 event를 정의할
            수 있습니다. 조건부확률은 새로운 사실을 알았을 때 가능한 경우를 그 조건 안으로 좁힌 뒤 target event가 차지하는 비율을 다시 계산합니다.
          </p>
        <p>
            Sequence model은 긴 문장을 한 번에 맞히는 대신 앞서 본 token을 조건으로 다음 token의 확률을 반복해서 계산합니다. 이 관점이 중요한 이유입니다.
            연쇄법칙은 이 작은 조건부확률들을 곱하면 전체 sequence의 joint probability가 된다는 정확한 연결고리입니다.
          </p>
      </div>

      <ConditionalProbabilityViz />

      <ExplainedFormula
        question="첫 toss가 H라고 알게 된 뒤, 앞면이 정확히 한 번일 확률은 어떻게 바뀔까요?"
        idea={<>조건 B 밖의 outcome은 더 이상 가능한 경우가 아니므로 제외합니다. 그다음 A와 B를 동시에 만족하는 mass를 B 전체 mass로 나누어, B 안의 합이 다시 1이 되도록 정규화합니다.</>}
        formula={String.raw`P(A\mid B)=\frac{P(A\cap B)}{P(B)}=\frac{1/4}{1/2}=\frac12,\qquad P(B)>0`}
        terms={[
          { symbol: "A", name: "target event", description: "확률을 알고 싶은 사건입니다. 여기서는 앞면이 정확히 한 번 나오는 경우입니다." },
          { symbol: "B", name: "condition event", description: "이미 일어났다고 알게 된 사건입니다. 여기서는 첫 toss가 H인 경우입니다." },
          { symbol: "A\\cap B", name: "intersection", description: "A와 B를 동시에 만족하는 outcome의 집합입니다." },
          { symbol: "P(A\\mid B)", name: "conditional probability", description: "B가 일어났다는 정보 아래에서 다시 계산한 A의 probability입니다." },
        ]}
        assumptions={["P(B)가 0보다 커야 비율을 정의할 수 있습니다.", "처음에 정한 sample space와 probability distribution은 유지하고, B 안으로 범위만 제한합니다."]}
        interpretation="전체 네 outcome에서는 A가 두 개였지만 B를 알게 되면 {HH,HT}만 남습니다. 그중 A를 만족하는 HT가 하나이므로 결과는 1/2입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>분모가 0이면 조건부확률을 이 비율로 정의할 수 없다</h3>
        <p><code>P(B)=0</code>이면 B 안에서 확률의 합을 다시 1로 만들기 위해 나눌 양이 없습니다. 예를 들어 두 번만 던지는 실험에서 “앞면이 세 번 나온다”는 event를 조건으로 둘 수 없습니다. 이때 <code>0/0</code>을 0이나 1로 정하는 것이 아니라, 위의 event 기반 조건부확률이 정의되지 않는다고 말해야 합니다. 연속분포의 한 점처럼 probability 0인 조건을 다루려면 density나 regular conditional probability 같은 별도 틀이 필요합니다.</p>
      </div>

      <ExplainedFormula
        question="여러 단계가 이어지는 sequence의 확률을 단계별 예측으로 어떻게 분해할까요?"
        idea={<>두 event의 정의를 곱셈 형태로 고친 뒤 같은 작업을 반복합니다. 각 단계는 지금까지 관측한 prefix를 조건으로 다음 값 하나의 확률을 계산합니다.</>}
        formula={String.raw`P(y_1,\ldots,y_T\mid x)=\prod_{t=1}^{T}P\!\left(y_t\mid y_1,\ldots,y_{t-1},x\right)`}
        terms={[
          { symbol: "x", name: "given context", description: "처음부터 알고 있는 입력입니다. 번역에서는 source 문장입니다." },
          { symbol: "y_t", name: "current outcome", description: "t번째에 관측하거나 생성할 target token입니다." },
          { symbol: "y_{<t}", name: "prefix condition", description: "현재 token 앞에 있는 모든 target token입니다." },
          { symbol: "\\prod", name: "product over steps", description: "각 단계의 조건부확률을 모두 곱합니다." },
        ]}
        assumptions={["표시한 순서가 고정되어 있어야 어떤 값이 이전 조건인지 정할 수 있습니다.", "각 조건의 probability가 정의되는 범위에서 적용합니다."]}
        interpretation="연쇄법칙 자체는 독립성을 가정하지 않습니다. 오히려 이전 token에 대한 의존성을 각 조건부확률 안에 그대로 남깁니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>독립과 상호배타는 서로 다른 관계다</h3>
        <p><code>P(A∩B)=P(A)P(B)</code>는 A와 B가 독립일 때만 쓸 수 있습니다. 독립은 B를 알아도 A의 확률이 바뀌지 않는다는 뜻입니다. 반면 상호배타(mutually exclusive)는 두 event가 동시에 일어날 수 없어 <code>A∩B=∅</code>라는 뜻입니다. 확률이 양수인 두 event가 상호배타라면 교집합 확률은 0이지만 <code>P(A)P(B)&gt;0</code>이므로 독립일 수 없습니다.</p>
        <p>연쇄법칙의 <code>P(A∩B)=P(A|B)P(B)</code>는 독립성을 요구하지 않습니다. B를 알았을 때 A의 확률이 달라진다면 그 변화가 조건부확률에 남기 때문에, 언어처럼 앞뒤 의존성이 큰 데이터를 표현할 수 있습니다.</p>
      </div>
    </section>
  );
}
