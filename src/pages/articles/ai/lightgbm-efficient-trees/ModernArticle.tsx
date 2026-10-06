import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { LightGBMEfficiencyViz } from "../gbm-viz";
export default function LightGBMEfficientTreesArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section id="problem" className="space-y-6 scroll-mt-20">
        <h2 className="text-2xl font-bold">
          10,000개 row를 3,000개만 보고 여섯 sparse column을 두 묶음으로 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Split을 찾을 row가 10,000개라고 합시다. GOSS는 gradient가 큰 상위 20%인
            2,000개를 모두 남깁니다. 이어서 전체 row 수의 10%인 1,000개를 나머지
            8,000개에서 무작위로 뽑습니다. 따라서 이번 통계는 3,000개 row를 훑습니다.
          </p>
          <p>
            여섯 sparse feature는 같은 row에서 동시에 켜지지 않아 EFB로 두 effective
            column에 묶을 수 있습니다. 현재 terminal leaf 세 개의 예상 gain이
            [3, 7, 5]라면 leaf-wise growth는 gain 7인 leaf 하나만 다음에 확장합니다.
          </p>
          <p className="font-semibold">그림을 넘기기 전에 세 가지를 예측해 보세요.</p>
          <ol>
            <li>GOSS가 이번 split 통계를 위해 10,000개 row를 전부 쓸까요?</li>
            <li>뽑힌 small-gradient row의 통계 weight는 (1−0.2)/0.1=8일까요?</li>
            <li>Gain이 모두 양수이므로 세 terminal leaf를 한꺼번에 확장할까요?</li>
          </ol>
          <p>
            답은 <strong>아니요, 예, 아니요</strong>입니다. 세 기법은 같은 절약을 세
            이름으로 부르는 것이 아니라 각각 row 수, effective column 수, 다음 split
            위치를 바꿉니다.
          </p>
        </div>
        <LightGBMEfficiencyViz />
        <ContentBoundary article="lightgbm-efficient-trees" />
        <TermLesson
          name="Gradient-based One-Side Sampling · GOSS"
          oneLine="큰-gradient rows는 유지하고 작은-gradient 집단에서는 전체 row 수의 b만큼 뽑아 보정 weight로 split statistics를 근사하는 row sampling입니다."
          shape="top aN large gradients + bN sampled from the remainder + weight (1−a)/b"
          example="a=.2,b=.1이면 sampled small-gradient row의 통계 weight는 .8/.1=8입니다."
          boundary="Hard-example loss가 아니며 small-gradient subsample variance와 실제 boosting mode를 확인해야 합니다."
        />
        <ExplainedFormula
          question="왜 작은-gradient sample에 (1−a)/b를 곱할까요?"
          idea="Small-gradient 집단은 전체의 1−a인데 그 안에서 전체 row 수의 b만큼만 관측합니다. 빠진 집단의 총 통계 규모를 복원하려고 표본 기여를 (1−a)/b배로 키웁니다."
          formula={String.raw`w_{\rm small}=\frac{1-a}{b}`}
          annotatedFormula={String.raw`\begin{aligned}p_{\rm large}&=\underbrace{a}_{\text{큰 gradient row 유지 비율}}\\p_{\rm small}&=\underbrace{b}_{\text{전체 row 수 기준 작은-gradient 표본 몫}}\\m_{\rm low}&=\underbrace{1-a}_{\text{작은-gradient 집단의 전체 몫}}\\w_{\rm small}&=\underbrace{m_{\rm low}/p_{\rm small}}_{\substack{\text{표본 기여를 키워}\text{집단 통계 규모를 보정}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-a`,
              annotation: [
                "전체에서 large-gradient 유지 몫을 빼",
                "small-gradient 모집단 몫 계산",
              ],
            },
            {
              expression: String.raw`(1-a)/b`,
              annotation: [
                "작은-gradient 집단 몫을 전체 기준 표본 몫으로 나눠",
                "sampled row의 통계 weight 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`a`,
              name: "Large-gradient fraction",
              description: "반드시 유지하는 큰-gradient row 비율입니다.",
            },
            {
              symbol: String.raw`b`,
              name: "Small-gradient sample fraction",
              description: "작은-gradient 집단에서 뽑는 수를 전체 row 수로 나눈 비율입니다.",
            },
          ]}
          assumptions={[
            "논문 표기와 sampling 정의를 따릅니다.",
            "Gain estimator variance와 finite-sample bias는 별도 평가합니다.",
          ]}
          interpretation="a=.2,b=.1이면 weight=8입니다. 이는 row의 training loss weight가 아니라 split-statistic 보정입니다."
        />
      </section>
      <section id="bundling" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="Sparse column 운반"
          title="EFB는 동시에 켜지지 않는 feature를 offset bin 하나에 묶는다"
        >
          One-hot처럼 대부분 0인 columns가 같은 row에서 겹치지 않으면 서로 다른
          bin range를 배정해 한 bundled coordinate로 운반할 수 있습니다.
        </LessonHeader>
        <TermLesson
          name="Exclusive Feature Bundling · EFB"
          oneLine="동시 non-zero 충돌이 드문 sparse features를 서로 다른 offset 범위에 배치해 effective column 수를 줄이는 방법입니다."
          shape="feature A bins [1..p] · feature B bins [p+1..q] → one bundle"
          example="A와 B가 같은 row에서 동시에 1이 아니면 bundle value가 어느 원래 feature에서 왔는지 복원할 수 있습니다."
          boundary="충돌이 많으면 정보가 섞이고 optimal bundling은 어려워 구현이 근사를 사용합니다."
        />
      </section>
      <section id="leaf-growth" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="다음 split 위치"
          title="Leaf-wise growth는 현재 gain이 가장 큰 terminal leaf 하나를 확장한다"
        >
          Level-wise처럼 같은 depth의 모든 node를 키우지 않습니다. 같은 leaf
          budget에서 training loss를 빨리 줄일 수 있지만 한 branch가 깊어질 수
          있습니다.
        </LessonHeader>
        <TermLesson
          name="Leaf-wise tree growth"
          oneLine="현재 estimated gain이 가장 큰 terminal leaf에 다음 split budget을 배분하는 비대칭 성장 규칙입니다."
          shape="terminal gains [3,7,5] → expand gain-7 leaf only"
          example="세 leaf gain이 3·7·5이면 gain 7인 leaf를 쪼개고 다른 둘은 그대로 둡니다."
          boundary="작은 data에서는 깊은 작은 leaf가 overfit할 수 있어 num_leaves·min_data_in_leaf·max_depth를 함께 제한합니다."
        />
      </section>
      <section id="evidence" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="세 절약의 failure owner"
          title="Row variance·column collision·deep branch를 따로 측정한다"
        >
          빠르다는 한 숫자로 합치지 않고 GOSS estimator, EFB conflict, leaf
          depth distribution을 별도 receipt로 남깁니다.
        </LessonHeader>
        <div id="paper-lightgbm" className="scroll-mt-24">
          <CitationBlock
            source="LightGBM"
            citeKey={1}
            href="https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html"
          >
            <EvidenceGrid
              problem="Large rows·high-dimensional sparse features의 GBDT scan 비용"
              contribution="GOSS row sampling과 EFB column bundling"
              assumptions="논문 dataset·implementation·hardware·baseline 조건"
              scope="NeurIPS 2017 algorithm과 공개 quality·speed 비교"
              notClaim="모든 modern version·dense dataset·device의 보편 우위"
            />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              논문 Algorithm 2는 <code>topN=a×len(I)</code>, <code>randN=b×len(I)</code>로
              둡니다. 따라서 이 글의 a=.2, b=.1, N=10,000 사례는 2,000+1,000 rows와
              보정 계수 8을 사용합니다.
            </p>
          </CitationBlock>
        </div>
        <ConceptLadderViz
          title="LightGBM 비용 축"
          description="세 기법이 줄이는 대상을 섞지 않습니다."
          steps={[
            { label: "Rows", detail: "GOSS가 split 통계 row를 줄입니다." },
            { label: "Columns", detail: "EFB가 sparse feature 수를 줄입니다." },
            {
              label: "Leaves",
              detail: "Gain이 큰 leaf에 budget을 집중합니다.",
            },
            {
              label: "Validate",
              detail: "Variance·collision·depth를 따로 봅니다.",
            },
          ]}
        />
      </section>
    </article>
  );
}
