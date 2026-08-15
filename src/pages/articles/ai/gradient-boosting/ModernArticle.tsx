import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { BoostingFunctionViz } from "../gbm-viz";

export default function GradientBoostingArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="먼저 tree 하나"
          title="Decision tree는 input 공간을 leaf 칸으로 나누는 piecewise-constant 함수다"
        >
          Boosting을 배우기 전에 weak learner의 shape부터 봅니다. Split 질문을
          따라 도착한 leaf 하나가 현재 tree의 상수 output을 소유합니다.
        </LessonHeader>
        <TermLesson
          name="Decision tree as a piecewise-constant function"
          oneLine="Feature split로 input 공간을 겹치지 않는 terminal region으로 나누고, sample이 도착한 leaf의 상수 값을 출력하는 함수입니다."
          shape="x → split path → exactly one leaf Rⱼ → value wⱼ"
          example="면적 60㎡ 이하는 3억, 초과는 6억을 출력하면 두 구간을 가진 regression tree입니다."
          boundary="Leaf value는 probability가 아니라 additive logit일 수 있고 missing·category routing은 구현마다 다릅니다."
        />
        <BoostingFunctionViz />
        <ExplainedFormula
          question="왜 모든 leaf 값을 더하지 않고 sample이 속한 leaf 하나만 남을까요?"
          idea="Leaf region은 서로 겹치지 않게 input 공간을 나눕니다. Indicator는 x가 속한 region에서만 1이므로 정확히 한 상수 값만 output에 남습니다."
          formula={String.raw`h(x)=\sum_{j=1}^{J}w_j\mathbf1[x\in R_j]`}
          annotatedFormula={String.raw`\begin{aligned}I_j(x)&=\underbrace{\mathbf1[x\in R_j]}_{\substack{\text{x가 leaf j에 있으면 1}\text{아니면 0}}}\\c_j(x)&=\underbrace{w_jI_j(x)}_{\text{선택 leaf의 값만 남김}}\\h(x)&=\underbrace{\sum_{j=1}^{J}c_j(x)}_{\substack{\text{모든 leaf 항을 더하되}\text{활성 항 하나만 output}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[x\in R_j]`,
              annotation: [
                "split path로 leaf membership을 판정해",
                "활성 region만 1로 표시",
              ],
            },
            {
              expression: String.raw`w_j\mathbf1[x\in R_j]`,
              annotation: [
                "leaf 상수에 membership을 곱해",
                "선택된 leaf value만 유지",
              ],
            },
            {
              expression: String.raw`\sum_j w_j\mathbf1[x\in R_j]`,
              annotation: [
                "region별 항을 합쳐",
                "input 전체에서 정의된 tree 함수 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`R_j`,
              name: "Leaf region",
              description: "Split 조건이 만든 terminal input subset입니다.",
            },
            {
              symbol: String.raw`w_j`,
              name: "Leaf value",
              description: "Region j에 도착한 sample이 받는 상수 update입니다.",
            },
          ]}
          assumptions={[
            "Leaf regions가 input domain을 겹치지 않게 partition합니다.",
            "Regression tree의 scalar output을 설명합니다.",
          ]}
          interpretation="55㎡ sample은 첫 indicator만 1이라 3억을, 75㎡ sample은 둘째 indicator만 1이라 6억을 받습니다."
        />
      </section>
      <section id="functional-gradient" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="현재 함수를 고치는 방향"
          title="Gradient boosting은 parameter가 아니라 prediction function의 negative gradient를 tree로 근사한다"
        >
          각 round는 현재 score에서 sample별로 loss가 가장 빨리 줄어드는 방향을
          계산하고, 새 tree가 그 target을 근사하게 합니다.
        </LessonHeader>
        <TermLesson
          name="Functional gradient boosting"
          oneLine="현재 prediction score에서 loss의 negative derivative를 pseudo-target으로 만들고 weak tree를 stagewise additive function에 더하는 방법입니다."
          shape="Fₘ₋₁ → rᵢₘ=−∂ℓ/∂F → fit hₘ → Fₘ=Fₘ₋₁+ηhₘ"
          example="Squared loss에서 y=7,F=4면 residual 3이고 h=2.4,η=.2이면 새 score는 4.48입니다."
          boundary="Squared loss 외에는 residual이 y−F와 같지 않고 tree가 gradient를 완벽히 표현한다는 보장도 없습니다."
        />
        <ExplainedFormula
          question="왜 loss derivative에 minus를 붙이고 새 tree에 learning rate를 곱할까요?"
          idea="Gradient는 loss가 증가하는 방향이므로 부호를 뒤집어 감소 방향을 만듭니다. Learning rate는 한 tree의 근사 오차가 ensemble을 크게 흔들지 않도록 update 크기를 줄입니다."
          formula={String.raw`r_{im}=-\left.\frac{\partial\ell(y_i,F)}{\partial F}\right|_{F_{m-1}(x_i)},\quad F_m=F_{m-1}+\eta h_m`}
          annotatedFormula={String.raw`\begin{aligned}g_{im}&=\underbrace{\left.\frac{\partial\ell(y_i,F)}{\partial F}\right|_{F_{m-1}(x_i)}}_{\text{현재 score의 loss 증가율}}\\r_{im}&=\underbrace{-g_{im}}_{\text{부호를 뒤집어 감소 방향 생성}}\\h_m&\approx\underbrace{r_{\cdot m}}_{\text{tree가 sample별 방향을 근사}}\\F_m&=\underbrace{F_{m-1}+\eta h_m}_{\substack{\text{기존 함수에 축소한}\text{새 tree update를 더함}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`-\partial\ell/\partial F`,
              annotation: [
                "loss 증가율의 부호를 뒤집어",
                "loss가 줄어드는 pseudo-target 생성",
              ],
            },
            {
              expression: String.raw`\eta h_m`,
              annotation: [
                "tree output에 step size를 곱해",
                "한 round의 update 크기 축소",
              ],
            },
            {
              expression: String.raw`F_{m-1}+\eta h_m`,
              annotation: [
                "기존 ensemble에 새 weak learner를 더해",
                "다음 prediction 함수 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_{im}`,
              name: "Pseudo-residual",
              description:
                "Round m에서 sample i가 원하는 score 수정 방향입니다.",
            },
            {
              symbol: String.raw`h_m`,
              name: "Weak tree",
              description:
                "Pseudo-residual을 leaf 상수로 근사하는 새 tree입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Shrinkage rate",
              description: "새 tree contribution을 줄이는 learning rate입니다.",
            },
          ]}
          assumptions={[
            "Loss가 current score에서 미분 가능합니다.",
            "Tree는 pseudo-residual에 같은 training rows로 fit합니다.",
          ]}
          interpretation="Squared loss의 residual은 y−F이지만 logistic loss에서는 score link를 포함한 derivative가 target이 됩니다."
        />
      </section>
      <section id="shrinkage" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="Step 크기와 ensemble 길이"
          title="Learning rate와 early stopping은 따로 고를 수 없는 한 쌍이다"
        >
          작은 η는 tree 하나의 목소리를 낮추므로 보통 더 많은 round가
          필요합니다. Validation curve는 그 조합에서 ensemble 길이를 선택합니다.
        </LessonHeader>
        <TermLesson
          name="Boosting shrinkage · early stopping"
          oneLine="새 tree update의 step size와 independent validation에서 선택한 best round를 함께 관리하는 ensemble-length 계약입니다."
          shape="small η ↔ more candidate rounds · validation metric → best_iteration"
          example="η=.05는 η=.2의 1/4 update이므로 같은 방향을 따라가려면 대체로 더 많은 tree가 필요합니다."
          boundary="작은 η가 자동으로 overfit을 막거나 항상 더 좋은 solution을 보장하지 않으며 search budget도 함께 맞춰야 합니다."
        />
      </section>
      <section id="comparison" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="세 구현은 마지막에 비교"
          title="같은 parameter 이름보다 같은 data·search·hardware 예산을 맞춘다"
        >
          XGBoost·LightGBM·CatBoost는 tree growth와 defaults가 달라 depth·round
          숫자만 같게 두면 capacity가 다릅니다.
        </LessonHeader>
        <TermLesson
          name="Comparable GBM experiment contract"
          oneLine="같은 split·feature artifact·metric·search budget·hardware에서 library별 parameter를 공통 capacity·sampling·regularization 제약으로 대응하는 비교 원칙입니다."
          shape="same data + same search budget + same system budget → quality·latency·memory"
          example="Time split, 50 trials, early-stop rule, CPU thread 수를 고정하고 선택이 끝난 뒤 test를 한 번 엽니다."
          boundary="Library default와 depth를 그대로 맞추는 것은 공정한 function capacity match가 아닐 수 있습니다."
        />
        <div id="paper-gradient-boosting" className="scroll-mt-24">
          <CitationBlock
            source="Greedy Function Approximation"
            citeKey={1}
            href="https://doi.org/10.1214/aos/1013203451"
          >
            <EvidenceGrid
              problem="일반 differentiable loss의 stagewise additive 방향"
              contribution="Function-space negative-gradient base-learner fitting"
              assumptions="Differentiable loss·base learner family·stagewise optimization"
              scope="논문의 algorithm formulation과 regression·classification 실험"
              notClaim="Finite ensemble의 global optimum·calibration·모든 dataset 우위"
            />
          </CitationBlock>
        </div>
        <ConceptLadderViz
          title="Gradient boosting 조립 순서"
          description="Tree shape를 본 뒤 loss direction과 ensemble control을 붙입니다."
          steps={[
            { label: "Leaf", detail: "Input을 상수 region으로 나눕니다." },
            {
              label: "Direction",
              detail: "Negative loss derivative를 계산합니다.",
            },
            { label: "Add", detail: "Tree가 방향을 근사해 함수에 더합니다." },
            {
              label: "Select",
              detail: "Validation과 공정 예산으로 model을 고릅니다.",
            },
          ]}
        />
        <ContentBoundary article="gradient-boosting" />
      </section>
    </article>
  );
}
