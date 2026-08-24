import ExplainedFormula from "@/components/ui/explained-formula";
import ContextMatrixViz from "./viz/ContextMatrixViz";
import WeightingViz from "./viz/WeightingViz";

export default function Distributional() {
  return (
    <section id="distributional" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Context를 정의하고 세는 순간 representation의 inductive bias가 결정된다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Word–context matrix의 row는 target 단어, column은 context
          feature입니다. Symmetric window를 쓰면 좌우 주변 token을 세고,
          directional window는 left·right를 다른 feature로 둘 수 있습니다.
          Dependency context는 “목적어-of-먹다”처럼 문법 관계를 보존하고,
          term–document matrix는 같은 문서에 등장하는 주제적 관계를 강조합니다.
        </p>
        <p className="leading-8">
          작은 계산을 해보면 구조가 선명해집니다. Token sequence를 [고양이,
          우유, 마신다]로 단순화하고 방향을 구분하지 않는 window 1을 쓰면, target
          “우유”에서 X(우유, 고양이)와 X(우유, 마신다)가 각각 1 증가합니다.
          Window 2로 넓히면 더 먼 token도 열에 들어오므로 count가 늘지만, 그
          관계가 현재 task에 필요한 문법 관계인지 단순한 같은 문서의 주제
          관계인지는 별도로 검증해야 합니다.
        </p>
      </div>

      <ContextMatrixViz />

      <ExplainedFormula
        question="Corpus token sequence에서 word–context matrix의 한 cell은 어떻게 누적되는가?"
        idea={
          <>
            각 target position t 주변의 offset δ를 순회하고 target이 w, 이웃이
            c일 때 cell을 증가시킵니다. 거리 weight를 두면 가까운 context가 더
            크게 기여합니다.
          </>
        }
        formula={String.raw`\begin{aligned}X_{wc}&=\sum_t\sum_{\delta\in\mathcal W}\omega(\delta)I_{t,\delta}\\I_{t,\delta}&=\mathbf 1[x_t=w,\ x_{t+\delta}=c]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}X_{wc}&=\underbrace{\sum_t\sum_{\delta\in\mathcal W}\omega(\delta)I_{t,\delta}}_{\text{distance weight 계산}}\\I_{t,\delta}&=\underbrace{\mathbf 1[x_t=w,\ x_{t+\delta}=c]}_{\text{indicator 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_t\sum_{\delta\in\mathcal W}\omega(\delta)I_{t,\delta}`, annotation: ["distance weight이(가) 식의 결과에 기여하는","방식을 계산합니다.","각 target position t 주변의 offset δ를","순회하고 target이 w, 이웃이 c일 때 cell을"] },
          { expression: String.raw`\mathbf 1[x_t=w,\ x_{t+\delta}=c]`, annotation: ["indicator이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 target position t 주변의 offset δ를","순회하고 target이 w, 이웃이 c일 때 cell을"] },
        ]}
        terms={[
          {
            symbol: "X_{wc}",
            name: "weighted co-occurrence",
            description:
              "Target w와 context c가 설계한 window 안에서 함께 관측된 총 weight입니다.",
          },
          {
            symbol: "\\mathcal W",
            name: "context offsets",
            description:
              "예를 들어 {−2,−1,1,2}처럼 target 주변에서 셀 위치를 정합니다.",
          },
          {
            symbol: "\\omega(\\delta)",
            name: "distance weight",
            description:
              "균일 count면 1, 가까운 단어를 강조하면 거리에 따라 감소합니다.",
          },
          {
            symbol: "I_{t,\\delta}",
            name: "indicator",
            description:
              "두 token 조건이 참일 때만 해당 pair count를 더합니다.",
          },
        ]}
        assumptions={[
          "Linear token window를 예로 들었습니다. Dependency·document context는 feature 정의가 달라집니다.",
          "Sentence boundary·subsampling·minimum count·dynamic window 정책도 실제 X를 바꿉니다.",
        ]}
        interpretation="Window size는 단순 hyperparameter가 아니라 무엇을 ‘같은 문맥’으로 볼지 정하는 측정 정의입니다. 좁은 window가 항상 syntax, 넓은 window가 항상 semantics를 보장하는 것은 아니므로 downstream task에서 검증합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Raw count는 association보다 frequency를 크게 반영한다</h3>
        <p className="leading-8">
          “the”처럼 어디에나 나오는 context는 많은 row에서 count가 큽니다. PMI는
          실제 joint probability를 w와 c가 독립일 때의 기대값과 비교해, 단순
          빈도보다 pair의 놀라운 정도를 측정합니다. PPMI는 신뢰하기 어려운
          negative association을 0으로 자르지만, rare pair의 noisy high PMI와
          zero cell 문제까지 해결하지는 않습니다.
        </p>
      </div>

      <WeightingViz />

      <ExplainedFormula
        question="두 단어가 우연한 독립 기대보다 더 자주 함께 나타났는지 어떻게 측정하는가?"
        idea={
          <>
            Joint probability를 두 marginal의 곱으로 나눕니다. Ratio가 1이면
            독립 기대와 같고, 1보다 크면 더 자주, 작으면 덜 자주 관측된
            것입니다. Log가 곱셈 ratio를 덧셈 score로 바꿉니다.
          </>
        }
        formula={String.raw`\begin{aligned}\operatorname{PMI}(w,c)&=\log\frac{P(w,c)}{P(w)P(c)}\\\operatorname{PPMI}(w,c)&=\max(0,\operatorname{PMI}(w,c))\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\operatorname{PMI}(w,c)&=\underbrace{\log\frac{P(w,c)}{P(w)P(c)}}_{\text{기준량당 비율}}\\\operatorname{PPMI}(w,c)&=\underbrace{\max(0,\operatorname{PMI}(w,c))}_{\text{경계 후보 선택}}\end{aligned}`}
        operations={[
          { expression: String.raw`\log\frac{P(w,c)}{P(w)P(c)}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Joint probability를 두 marginal의 곱으로","나눕니다."] },
          { expression: String.raw`\max(0,\operatorname{PMI}(w,c))`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Joint probability를 두 marginal의 곱으로","나눕니다."] },
        ]}
        terms={[
          {
            symbol: "P(w,c)",
            name: "joint probability",
            description:
              "Sampling한 word–context event가 pair (w,c)일 확률입니다.",
          },
          {
            symbol: "P(w)P(c)",
            name: "independence baseline",
            description:
              "두 event가 독립이라고 가정했을 때 기대되는 pair 확률입니다.",
          },
          {
            symbol: "PMI",
            name: "association log-ratio",
            description:
              "양수는 기대보다 많음, 0은 기대와 같음, 음수는 기대보다 적음을 뜻합니다.",
          },
          {
            symbol: "PPMI",
            name: "positive PMI",
            description:
              "Negative PMI를 0으로 만든 sparse nonnegative weighting입니다.",
          },
        ]}
        assumptions={[
          "Probability는 동일한 word–context event sampling scheme에서 추정해야 합니다.",
          "Unseen pair의 PMI는 정의되지 않으므로 smoothing·shift·zero 처리 정책이 필요합니다.",
        ]}
        interpretation="PPMI는 corpus frequency를 association으로 바꾸는 하나의 weighting입니다. Corpus가 작으면 희귀 pair가 과대평가될 수 있어 context distribution smoothing, shifted PPMI와 frequency threshold를 함께 비교합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          예를 들어 같은 event 표본공간에서 P(w,c)=0.02이고 P(w)=P(c)=0.1이면
          독립 기대는 0.1×0.1=0.01입니다. 실제 joint가 그 두 배이므로 자연로그
          PMI는 log(2)≈0.693이고, 양수라서 PPMI도 0.693입니다. 반대로 count가
          0이면 log(0)을 계산할 수 없으므로 smoothing을 할지, 최소 count 아래를
          버릴지, 해당 cell을 관측 불가로 둘지 정책을 먼저 고정해야 합니다.
        </p>
      </div>
    </section>
  );
}
