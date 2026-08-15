import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { CatBoostOrderingViz } from "../gbm-viz";
export default function CatBoostOrderedLearningArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="먼저 prediction shift"
          title="현재 row를 이미 본 model로 그 row의 gradient를 만들면 target이 자기 prediction에 새어든다"
        >
          Ordered boosting은 permutation에서 현재 row보다 앞선 rows만 학습한
          prefix model로 현재 row의 pseudo-residual을 계산합니다.
        </LessonHeader>
        <TermLesson
          name="CatBoost ordered boosting"
          oneLine="현재 row를 포함하지 않은 permutation-prefix model prediction에서 그 row의 gradient target을 만들어 prediction shift를 줄이는 boosting 방법입니다."
          shape="permutation π · prefix rows π₁…πₜ₋₁ → F^{<t}(xπₜ) → gradient for row πₜ"
          example="순서 A,C,B,D에서 B의 gradient model은 A·C만 보고 B·D는 보지 않습니다."
          boundary="외부 validation·time/group split을 대체하지 않고 ordered category statistic과 ordered gradient는 다른 계산입니다."
        />
        <CatBoostOrderingViz />
      </section>
      <section id="prefix-gradient" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="Prefix prediction에서 derivative"
          title="B의 label은 loss에만 들어가고 B를 fit한 model에는 들어가지 않는다"
        >
          현재 row의 target은 derivative를 계산하는 데 필요하지만, 그
          derivative가 평가하는 prediction은 이전 prefix로만 만들어야 합니다.
        </LessonHeader>
        <ExplainedFormula
          question="왜 row πₜ의 gradient를 full model F가 아니라 prefix model F^{<t}에서 평가할까요?"
          idea="자기 label을 사용해 이미 자신에게 맞춘 prediction에서 오차를 재면 optimistic shift가 생깁니다. Prefix model은 현재 row를 fit하지 않은 상태를 만듭니다."
          formula={String.raw`r_{\pi_t}=-\left.\frac{\partial\ell(y_{\pi_t},F(x_{\pi_t}))}{\partial F}\right|_{F=F^{(<t)}}`}
          annotatedFormula={String.raw`\begin{aligned}D_{<t}&=\underbrace{\{\pi_s:s<t\}}_{\text{현재 row 앞의 prefix}}\\F^{(<t)}&=\underbrace{\operatorname{fit}(D_{<t})}_{\text{현재 row 없이 model fit}}\\p_{\pi_t}&=\underbrace{F^{(<t)}(x_{\pi_t})}_{\text{prefix model의 현재 row prediction}}\\g_{\pi_t}&=\underbrace{\frac{\partial\ell(y_{\pi_t},p_{\pi_t})}{\partial p_{\pi_t}}}_{\text{그 prediction에서 loss slope 계산}}\\r_{\pi_t}&=\underbrace{-g_{\pi_t}}_{\text{loss 감소 방향으로 반전}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{\pi_1,\ldots,\pi_{t-1}\}`,
              annotation: [
                "permutation에서 현재 위치 앞만 골라",
                "leakage-free prefix dataset 생성",
              ],
            },
            {
              expression: String.raw`\operatorname{fit}(D_{<t})`,
              annotation: [
                "현재 row를 제외한 prefix로 fit해",
                "자기 label을 보지 않은 prediction 생성",
              ],
            },
            {
              expression: String.raw`-\partial\ell/\partial F`,
              annotation: [
                "prefix prediction의 loss slope를 뒤집어",
                "현재 row의 pseudo-residual 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\pi_t`,
              name: "Current permuted row",
              description:
                "Permutation에서 t번째로 gradient를 만들 sample입니다.",
            },
            {
              symbol: String.raw`F^{(<t)}`,
              name: "Prefix model",
              description:
                "현재 row보다 앞선 rows만 학습한 prediction function입니다.",
            },
            {
              symbol: String.raw`p_{\pi_t}`,
              name: "Leakage-free prediction",
              description:
                "Prefix model이 현재 row input에 낸 prediction입니다.",
            },
          ]}
          assumptions={[
            "Permutation과 prefix model family가 versioned되어 있습니다.",
            "External validation·time boundary는 별도로 유지합니다.",
          ]}
          interpretation="A,C,B,D에서 B의 prefix는 A,C입니다. B의 y는 loss slope에 쓰이지만 prefix fit에는 쓰이지 않습니다."
        />
      </section>
      <section id="symmetric-tree" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="Tree shape도 별도 선택"
          title="Oblivious tree는 같은 depth의 모든 node가 같은 질문을 공유한다"
        >
          Ordered boosting이 target path를 제어한다면 symmetric tree는 function
          shape를 제한합니다. 두 장치를 한 개념으로 합치지 않습니다.
        </LessonHeader>
        <TermLesson
          name="Oblivious · symmetric decision tree"
          oneLine="같은 depth의 모든 node가 동일 feature·threshold split을 사용해 root-to-leaf path를 규칙적인 bit code로 만드는 tree 구조입니다."
          shape="depth d의 split rule 하나 → 2^d regular leaf paths"
          example="Depth 0에서 age<30, depth 1에서 income<5천을 쓰면 모든 depth-1 node가 같은 income 질문을 사용합니다."
          boundary="규칙적 inference와 regularization 이점이 있어도 비대칭 관계를 같은 budget으로 가장 잘 표현한다는 뜻은 아닙니다."
        />
      </section>
      <section id="evidence" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="두 leakage 경로 분리"
          title="Ordered target statistic과 ordered boosting은 각각 category value와 gradient prediction을 보호한다"
        >
          Categorical encoding이 자기 target을 보지 않는 것과 gradient model이
          현재 row를 보지 않는 것은 다른 경계입니다. 둘 다 별도 test가
          필요합니다.
        </LessonHeader>
        <div id="paper-catboost" className="scroll-mt-24">
          <CitationBlock
            source="CatBoost"
            citeKey={1}
            href="https://proceedings.neurips.cc/paper/2018/hash/14491b756b3a51daac41c24863285549-Abstract.html"
          >
            <EvidenceGrid
              problem="Target statistics와 boosting의 prediction shift"
              contribution="Ordered target statistics·ordered boosting과 symmetric-tree implementation"
              assumptions="논문 permutation·dataset·implementation·baseline 조건"
              scope="NeurIPS 2018 analysis와 공개 quality·runtime 비교"
              notClaim="모든 categorical dataset·time split·current version의 보편 우위"
            />
          </CitationBlock>
        </div>
        <ConceptLadderViz
          title="CatBoost ordering 경계"
          description="Category statistic과 gradient prediction을 각각 자기 row에서 분리합니다."
          steps={[
            { label: "Permute", detail: "Row 순서를 먼저 고정합니다." },
            { label: "Prefix", detail: "현재 row 이전만 model에 넣습니다." },
            {
              label: "Gradient",
              detail: "Prefix prediction에서 residual을 만듭니다.",
            },
            {
              label: "Tree",
              detail: "Symmetric path로 function shape를 제한합니다.",
            },
          ]}
        />
        <ContentBoundary article="catboost-ordered-learning" />
      </section>
    </article>
  );
}
