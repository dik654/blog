import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { XGBoostGainViz } from "../gbm-viz";
export default function XGBoostTreeObjectiveArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="한 leaf의 local objective"
          title="XGBoost는 gradient 합 G와 curvature 합 H로 leaf update를 계산한다"
        >
          한 row씩 보지 말고 leaf 안의 first·second derivative를 합칩니다.
          Regularization λ는 작은 H에서 leaf weight가 과도해지는 것을 누릅니다.
        </LessonHeader>
        <TermLesson
          name="XGBoost second-order leaf objective"
          oneLine="현재 round loss를 score 주변에서 2차 근사하고 leaf별 G·H 합과 L2 penalty로 최적 constant update를 구합니다."
          shape="G=Σgᵢ · H=Σhᵢ · w*=−G/(H+λ)"
          example="G=−6,H=2,λ=1이면 leaf update는 2입니다."
          boundary="현재 score 주변의 local quadratic approximation이며 validation improvement를 자동 보장하지 않습니다."
        />
        <XGBoostGainViz />
        <ExplainedFormula
          question="왜 leaf weight는 −G를 H+λ로 나눌까요?"
          idea="G의 반대 부호가 loss 감소 방향이고, curvature H와 penalty λ가 그 방향으로 얼마나 멀리 움직일지 제한합니다."
          formula={String.raw`w^*=-\frac{G}{H+\lambda}`}
          annotatedFormula={String.raw`\begin{aligned}G&=\underbrace{\sum_{i\in I}g_i}_{\text{leaf의 1차 방향을 합산}}\\H&=\underbrace{\sum_{i\in I}h_i}_{\text{leaf의 curvature를 합산}}\\D&=\underbrace{H+\lambda}_{\text{curvature에 penalty를 더함}}\\w^*&=\underbrace{-G/D}_{\substack{\text{감소 방향을 안정화한 크기로}\text{leaf update 결정}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_{i\in I}g_i`,
              annotation: [
                "leaf rows의 loss slope를 더해",
                "공통 update 방향 계산",
              ],
            },
            {
              expression: String.raw`H+\lambda`,
              annotation: [
                "curvature에 L2 penalty를 더해",
                "작은 denominator의 큰 update 억제",
              ],
            },
            {
              expression: String.raw`-G/(H+\lambda)`,
              annotation: [
                "합산 gradient의 반대 방향을 curvature로 나눠",
                "leaf constant update 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`G,H`,
              name: "Gradient·Hessian sums",
              description: "현재 leaf rows의 first·second derivative 합입니다.",
            },
            {
              symbol: String.raw`\lambda`,
              name: "Leaf L2 penalty",
              description: "Leaf weight 크기를 제한하는 regularization입니다.",
            },
          ]}
          assumptions={[
            "Second derivative가 정의되고 local quadratic approximation을 사용합니다.",
            "한 scalar output leaf를 설명합니다.",
          ]}
          interpretation="G=−6,H=2,λ=1이면 −(−6)/3=2입니다. λ가 커지면 같은 G에서도 update가 작아집니다."
        />
      </section>
      <section id="split-gain" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="Parent와 두 child 비교"
          title="Split gain은 child score 합에서 parent score와 split cost를 뺀 값이다"
        >
          Candidate threshold가 rows를 두 집합으로 나누면 각 집합의 최적 leaf
          score를 계산해 split 전 장부와 비교합니다.
        </LessonHeader>
        <TermLesson
          name="XGBoost second-order split gain"
          oneLine="Left·right child의 regularized local score 합이 parent 하나의 score보다 얼마나 좋아지는지 계산하는 split criterion입니다."
          shape="½[GL²/(HL+λ)+GR²/(HR+λ)−G²/(H+λ)]−γ"
          example="Gain이 0보다 클 때만 local objective에서 split cost γ를 갚고도 이득입니다."
          boundary="Positive training gain은 unseen data의 이득이 아니며 min-child·depth·sampling과 함께 제한합니다."
        />
        <ExplainedFormula
          question="왜 child 두 항을 더하고 parent 항과 γ를 뺄까요?"
          idea="Split 뒤 얻을 수 있는 두 최적 leaf score에서 split 전 하나의 leaf score를 빼야 순수 개선량만 남습니다. γ는 leaf 하나를 더 만든 구조 비용입니다."
          formula={String.raw`\operatorname{Gain}=\frac12\left[\frac{G_L^2}{H_L+\lambda}+\frac{G_R^2}{H_R+\lambda}-\frac{(G_L+G_R)^2}{H_L+H_R+\lambda}\right]-\gamma`}
          annotatedFormula={String.raw`\begin{aligned}S_L&=\underbrace{G_L^2/(H_L+\lambda)}_{\text{left child 최적 score}}\\S_R&=\underbrace{G_R^2/(H_R+\lambda)}_{\text{right child 최적 score}}\\S_P&=\underbrace{(G_L+G_R)^2/(H_L+H_R+\lambda)}_{\text{split 전 parent score}}\\\operatorname{Gain}&=\underbrace{\tfrac12(S_L+S_R-S_P)-\gamma}_{\substack{\text{child 개선에서 parent와}\text{split cost를 제거}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`S_L+S_R`,
              annotation: [
                "두 child가 각각 얻는 score를 더해",
                "split 뒤 총 local score 계산",
              ],
            },
            {
              expression: String.raw`S_L+S_R-S_P`,
              annotation: [
                "split 전 parent score를 빼",
                "순수 objective improvement 계산",
              ],
            },
            {
              expression: String.raw`\tfrac12(\cdot)-\gamma`,
              annotation: [
                "quadratic 계수와 구조 비용을 반영해",
                "candidate split 채택 여부 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\gamma`,
              name: "Split penalty",
              description: "Leaf 수가 하나 늘어나는 구조 복잡도 비용입니다.",
            },
            {
              symbol: String.raw`G_L,H_L,G_R,H_R`,
              name: "Child statistics",
              description:
                "Candidate threshold 양쪽 row의 derivative 합입니다.",
            },
          ]}
          assumptions={[
            "Parent G·H는 두 child 합과 같습니다.",
            "Missing direction과 sampling은 별도 builder contract입니다.",
          ]}
          interpretation="Gain≤0이면 local training objective에서도 split cost를 갚지 못하므로 후보를 버립니다."
        />
      </section>
      <section id="histogram" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="Threshold 후보 줄이기"
          title="Histogram builder는 raw value를 bin별 G·H 장부로 접는다"
        >
          고유값마다 threshold를 시험하지 않고 가까운 값을 같은 bin에 넣어 누적
          통계를 prefix scan합니다.
        </LessonHeader>
        <TermLesson
          name="Histogram split approximation"
          oneLine="연속 feature 값을 유한 bin으로 묶고 bin별 derivative statistics를 누적해 threshold 수와 row scan 비용을 줄이는 builder입니다."
          shape="raw values → quantile bins → per-bin (Σg,Σh) → prefix gain scan"
          example="10만 개 고유 나이를 256 bins로 줄이면 candidate와 statistics storage가 크게 줄어듭니다."
          boundary="Bin 수가 작으면 threshold 해상도가 줄고 version·device별 builder·determinism이 다를 수 있습니다."
        />
      </section>
      <section id="evidence" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="Objective와 system 경계"
          title="max_depth는 capacity, max_bin은 후보 해상도, device는 실행 경로다"
        >
          같은 숫자형 option이라도 model function과 search approximation과
          hardware path를 섞지 않습니다.
        </LessonHeader>
        <div id="paper-xgboost" className="scroll-mt-24">
          <CitationBlock
            source="XGBoost"
            citeKey={1}
            href="https://arxiv.org/abs/1603.02754"
          >
            <EvidenceGrid
              problem="Regularized tree boosting의 sparse·large-data 확장"
              contribution="Second-order objective·sparsity-aware split·weighted sketch와 system optimization"
              assumptions="논문 builder·hardware·dataset·당시 baseline"
              scope="KDD 2016의 objective와 공개 scale benchmark"
              notClaim="모든 current version·device·dataset에서 가장 빠르거나 정확함"
            />
          </CitationBlock>
        </div>
        <ConceptLadderViz
          title="XGBoost split 장부"
          description="Leaf score를 만든 뒤 parent와 child를 비교하고 histogram으로 후보를 줄입니다."
          steps={[
            { label: "Derivatives", detail: "Row별 g·h를 계산합니다." },
            { label: "Leaf", detail: "G·H 합으로 constant update를 구합니다." },
            { label: "Gain", detail: "Children−parent−penalty를 계산합니다." },
            {
              label: "Bins",
              detail: "Threshold 후보를 histogram으로 줄입니다.",
            },
          ]}
        />
        <ContentBoundary article="xgboost-tree-objective" />
      </section>
    </article>
  );
}
