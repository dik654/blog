import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ContrastivePathLocator, {
  ContrastiveMapReturn,
} from "../contrastive-learning/ContrastivePathLocator";
import {
  MiningFunnelViz,
  TripletMarginViz,
  TripletRoleViz,
  UnitGeometryViz,
} from "./TripletMetricLearningViz";
import {
  UNIT_GEOMETRY_FIXTURE,
} from "./calculations";

const SEMI_HARD_MINING_PSEUDOCODE = `function chooseSemiHard(
  anchor,
  positive,
  candidates,
  margin,
) {
  // 먼저 같은 상품이거나 관계를 확인할 수 없는 후보를 제외합니다.
  const legalNegatives = candidates.filter(
    (candidate) => candidate.relation === "negative",
  );

  // 이 글에서 고정한 squared Euclidean distance를 계산합니다.
  const positiveDistance = squaredL2(anchor, positive);

  // Positive보다 멀지만 margin 안에 있는 후보만 남깁니다.
  const semiHard = legalNegatives.filter((candidate) => {
    const negativeDistance = squaredL2(anchor, candidate.embedding);
    return positiveDistance < negativeDistance
      && negativeDistance < positiveDistance + margin;
  });

  // 조건을 만족하는 후보 가운데 가장 가까운 하나를 고릅니다.
  return minBy(semiHard, (candidate) =>
    squaredL2(anchor, candidate.embedding),
  );
}`;

const PYTORCH_DISTANCE_EXAMPLE = `from torch.nn import TripletMarginWithDistanceLoss

# FaceNet 식과 같은 squared Euclidean distance를 반환합니다.
def squared_l2(x, y):
    return ((x - y) ** 2).sum(dim=-1)

# 기본 TripletMarginLoss 대신 거리 함수를 명시합니다.
loss_fn = TripletMarginWithDistanceLoss(
    distance_function=squared_l2,
    margin=0.2,
    reduction="none",
)`;

export default function TripletMetricLearningArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="sku-42-triplet-mining"
        className="scroll-mt-20"
      >
        <ContrastivePathLocator current="triplet" />
        <h2 className="mb-5 text-2xl font-bold">
          같은 상품 한 장과 다른 상품 한 장을 anchor에서 비교합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            설명용 사례를 먼저 고정하겠습니다. 상품 <code>SKU-42</code>의 정면
            사진을 <code>A₁</code>, 같은 상품의 측면 사진을 <code>A₂</code>라고
            부릅니다. 다른 상품 사진 <code>D₁</code>도 함께 놓습니다.
            <code>A₁</code>이 두 거리를 재는 기준입니다.
          </p>
        </div>

        <TripletRoleViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기준인 <code>A₁</code>을 <strong>anchor</strong>라고 합니다. 가까워져야
            하는 <code>A₂</code>는 <strong>positive</strong>입니다. 멀어져야 하는
            <code>D₁</code>은 <strong>negative</strong>입니다. Triplet loss는
            positive와 negative 사이의 거리를 재지 않습니다. 같은 anchor에서
            출발한 <code>d²(A₁,A₂)</code>와 <code>d²(A₁,D₁)</code>을 비교합니다.
          </p>
          <p>
            이 글의 모든 수치는 L2 정규화된 embedding의
            <strong> squared Euclidean distance</strong>입니다. Positive 거리는
            0.4, negative 거리는 0.5, 필요한 margin은 0.2로 둡니다. Negative가
            0.6 이상이어야 조건을 만족하므로 현재 부족한 0.1이 loss로 남습니다.
          </p>
        </div>

        <TermBreakdown
          title="세 자리와 한 조건"
          items={[
            {
              term: "Anchor a",
              description: "Positive 거리와 negative 거리가 함께 출발하는 기준 embedding입니다.",
              example: "SKU-42 정면 사진 A₁.",
            },
            {
              term: "Positive p",
              description: "Anchor와 같은 의미라서 가까워져야 하는 embedding입니다.",
              example: "같은 SKU-42의 측면 사진 A₂.",
            },
            {
              term: "Negative n",
              description: "Anchor와 다른 의미라서 멀어져야 하는 embedding입니다.",
              example: "다른 상품 사진 D₁.",
              boundary: "가깝다는 이유만으로 negative라고 정할 수는 없습니다. 관계를 먼저 확인해야 합니다.",
            },
            {
              term: "Margin α",
              description: "Negative 거리가 positive 거리보다 더 커야 하는 최소 차이입니다.",
              example: "이 글에서는 설명용으로 0.2를 씁니다.",
              boundary: "거리 정의와 normalization이 바뀌면 같은 margin 숫자의 뜻도 달라집니다.",
            },
          ]}
        />
        <ContentBoundary article="triplet-metric-learning" />
      </section>

      <section id="geometry" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Unit embedding에서는 cosine을 squared distance로 바꿀 수 있습니다
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          그림에서는 원점에서 시작한 두 화살표를 보십시오. 화살표의 길이를 1로
          고정하면 방향의 내적과 끝점 사이의 거리가 하나의 식으로 연결됩니다.
        </p>

        <UnitGeometryViz />

        <ExplainedFormula
          question="Cosine 0.8인 두 unit embedding의 squared distance가 왜 0.4인가요?"
          idea={(
            <p>
              두 vector의 차이를 제곱해 펼치면 norm 두 개와 내적이 나옵니다. 두
              norm이 모두 1이므로 <code>1+1</code>이 되고, unit vector의 내적은
              cosine similarity가 됩니다.
            </p>
          )}
          formula={String.raw`\lVert a-p\rVert_2^2=2-2a^\top p`}
          annotatedFormula={String.raw`\begin{aligned}d_p^2&=\underbrace{\lVert a-p\rVert_2^2}_{\text{anchor와 positive의 squared distance}}\\&=\underbrace{\lVert a\rVert_2^2+\lVert p\rVert_2^2}_{\text{unit norm 두 개}}-\underbrace{2a^\top p}_{\text{방향 일치 정도의 두 배}}\\&=\underbrace{2-2\operatorname{cos}(a,p)}_{\text{unit vector에서의 변환}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\lVert a-p\rVert_2^2`,
              annotation: ["두 embedding의 성분 차이를 만들고", "각 차이를 제곱해 더합니다."],
            },
            {
              expression: String.raw`\lVert a\rVert_2^2+\lVert p\rVert_2^2-2a^\top p`,
              annotation: ["차이의 제곱을 전개해", "길이와 방향 항으로 나눕니다."],
            },
            {
              expression: String.raw`2-2\operatorname{cos}(a,p)`,
              annotation: ["두 길이를 1로 대입하고", "내적을 cosine으로 읽습니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`d_p^2`,
              name: "Positive squared distance",
              description: "Anchor와 positive 사이 Euclidean distance의 제곱입니다.",
            },
            {
              symbol: String.raw`a^\top p`,
              name: "Unit-vector inner product",
              description: "두 vector를 L2 정규화했을 때 cosine similarity와 같습니다.",
            },
          ]}
          assumptions={[
            "Anchor와 positive의 L2 norm이 모두 1입니다.",
            "이 글의 margin 계산도 같은 squared Euclidean distance를 사용합니다.",
          ]}
          interpretation={`cos(a,p)=${UNIT_GEOMETRY_FIXTURE.cosine}이면 d²p=2−2×${UNIT_GEOMETRY_FIXTURE.cosine}=${UNIT_GEOMETRY_FIXTURE.squaredDistance}입니다. 정규화하지 않은 (1,0)과 (2,0)은 cosine이 1이지만 squared distance가 1이므로 같은 축약을 쓸 수 없습니다.`}
        />
      </section>

      <section id="margin" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Hinge는 margin이 모자란 거리만 loss로 남깁니다
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          아래 눈금에서 positive 경계 0.4와 통과 경계 0.6을 먼저 찾으십시오. 그
          다음 C₁·D₁·E₁의 막대 끝이 어느 구간에 놓이는지 비교합니다.
        </p>

        <TripletMarginViz />

        <ExplainedFormula
          question="Positive squared distance 0.4, negative squared distance 0.5, margin 0.2이면 왜 loss가 0.1인가요?"
          idea={(
            <p>
              Positive 거리에서 negative 거리를 빼고 필요한 margin을 더합니다.
              값이 양수면 그만큼 순서가 부족합니다. 값이 0 이하라면 조건을 이미
              만족했으므로 hinge가 0으로 자릅니다.
            </p>
          )}
          formula={String.raw`\mathcal L_{tri}=\left[d_p^2-d_n^2+\alpha\right]_+`}
          annotatedFormula={String.raw`\begin{aligned}u&=\underbrace{d_p^2}_{\text{positive squared distance}}-\underbrace{d_n^2}_{\text{negative squared distance}}+\underbrace{\alpha}_{\text{필요한 거리 차이}}\\\mathcal L_{tri}&=\underbrace{\max(0,u)}_{\text{부족한 양수 위반량만 남김}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`d_p^2-d_n^2`,
              annotation: ["같은 anchor에서 잰 두 거리를 빼", "현재 상대 순서를 계산합니다."],
            },
            {
              expression: String.raw`+\alpha`,
              annotation: ["Negative가 더 멀어야 하는", "최소 차이를 요구합니다."],
            },
            {
              expression: String.raw`\max(0,u)`,
              annotation: ["조건을 만족한 음수 값은 0으로 자르고", "부족한 거리만 gradient로 남깁니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`d_p^2`,
              name: "Positive squared distance",
              description: "Anchor와 positive 사이의 squared Euclidean distance입니다.",
            },
            {
              symbol: String.raw`d_n^2`,
              name: "Negative squared distance",
              description: "같은 anchor와 negative 사이의 squared Euclidean distance입니다.",
            },
            {
              symbol: String.raw`\alpha`,
              name: "Margin",
              description: "Negative가 positive보다 더 멀어야 하는 최소 차이입니다.",
            },
          ]}
          assumptions={[
            "Positive와 negative 관계가 정확합니다.",
            "모든 항이 같은 squared Euclidean distance를 사용합니다.",
            "Embedding은 L2 정규화되어 있습니다.",
          ]}
          interpretation="C₁은 hard, D₁은 semi-hard, E₁은 easy입니다. 셋 모두 관계상 negative이지만 margin 식에서 남기는 loss와 선택 전략은 다릅니다."
        />

        <CalculationWalkthrough
          title="D₁이 남기는 위반량"
          question="d²p=0.4, d²n=0.5, α=0.2를 같은 식에 넣으면 무엇이 남나요?"
          scope="SKU-42 설명용 triplet 한 개의 수치입니다. FaceNet 논문의 측정 결과나 권장 margin이 아닙니다."
          steps={[
            {
              label: "현재 거리 차이",
              expression: "0.4 − 0.5",
              result: "−0.1",
              reason: "Negative가 positive보다 0.1 더 멀다는 뜻입니다.",
            },
            {
              label: "Margin 요구",
              expression: "−0.1 + 0.2",
              result: "0.1",
              reason: "요구한 차이는 0.2이므로 아직 0.1이 부족합니다.",
            },
            {
              label: "Hinge",
              expression: "max(0, 0.1)",
              result: "loss = 0.1",
              reason: "양수 위반량만 loss로 남습니다.",
            },
          ]}
          conclusion="D₁은 positive보다 멀지만 margin 안에 있으므로 semi-hard negative이고 loss 0.1을 남깁니다."
          caveats={[
            "E₁의 0.9를 넣으면 0.4−0.9+0.2=−0.3이므로 loss는 0입니다.",
            "비제곱 Euclidean distance를 쓰면 숫자와 margin을 다시 정해야 합니다.",
          ]}
        />

        <div className="not-prose my-8 border-y border-border py-5">
          <p className="text-xs font-bold text-muted-foreground">
            PyTorch에서 squared distance 계약을 명시하는 예시 · 이 저장소에서는 API 형태만 검증
          </p>
          <pre className="mt-3 overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6"><code>{PYTORCH_DISTANCE_EXAMPLE}</code></pre>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            공식 <code>TripletMarginLoss</code>는 Lp distance를 사용합니다. FaceNet의
            squared-distance 식을 그대로 재현하려면 거리 함수를 명시하고, margin도 그
            scale에서 해석해야 합니다.
          </p>
        </div>

        <div className="not-prose mt-7 scroll-mt-24" id="pytorch-distance-contract">
          <CitationBlock
            type="code"
            citeKey={1}
            source="PyTorch — TripletMarginLoss"
            href="https://docs.pytorch.org/docs/stable/generated/torch.nn.TripletMarginLoss.html"
          >
            공식 문서는 기본 loss가 p-norm distance와 margin으로 상대 거리를 계산한다고
            정의합니다. 논문 식과 라이브러리 기본값의 distance convention을 같은 것으로
            가정하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="mining" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Mining은 가까운 후보 찾기보다 먼저 관계 오류를 제거합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이제 같은 anchor <code>A₁</code>에 후보 네 개를 붙입니다. <code>B₁</code>은
            catalog ID가 다르지만 실제로는 같은 <code>SKU-42</code>입니다.
            <code>C₁·D₁·E₁</code>만 관계상 negative입니다. 이 네 후보의 거리는
            설명을 위해 0.35·0.3·0.5·0.9로 둡니다.
          </p>
        </div>

        <MiningFunnelViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            거리가 가장 가까운 후보를 곧바로 고르면 <code>B₁</code>을 negative로
            잘못 사용할 수 있습니다. 그래서 후보 생성과 관계 필터를 먼저 분리합니다.
            남은 후보에만 거리 조건을 적용하면 <code>C₁</code>은 hard,
            <code>D₁</code>은 semi-hard, <code>E₁</code>은 easy로 나뉩니다.
          </p>
          <p>
            FaceNet은 가장 어려운 negative를 무조건 고르는 대신, positive보다
            멀지만 margin 안에 있는 semi-hard negative를 사용했습니다. 이 사례에서는
            <code>0.4 &lt; d²n &lt; 0.6</code>을 만족하는 <code>D₁</code>입니다. 이 선택은
            현재 encoder가 만든 거리와 후보 pool, 관계 filter에 의존합니다. 따라서
            선택 결과만 저장하면 같은 triplet을 다시 만들 수 없습니다.
          </p>
        </div>

        <div className="not-prose my-8 border-y border-border py-5">
          <p className="text-xs font-bold text-muted-foreground">
            관계 필터와 semi-hard 조건을 차례로 적용하는 TypeScript 형태의 의사코드
          </p>
          <pre className="mt-3 overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6"><code>{SEMI_HARD_MINING_PSEUDOCODE}</code></pre>
        </div>

        <div id="paper-facenet" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Schroff et al. — FaceNet"
            href="https://openaccess.thecvf.com/content_cvpr_2015/html/Schroff_FaceNet_A_Unified_2015_CVPR_paper.html"
          >
            논문은 unit hypersphere의 squared Euclidean triplet loss와 online
            semi-hard negative selection을 얼굴 verification·recognition·clustering에
            적용합니다. 해당 margin과 mining 방식이 모든 retrieval data의 기본값이라는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Triplet은 상대 거리 조건과 후보 선택 조건을 함께 봐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Triplet loss가 답하는 질문은 절대 좌표가 아니라 같은 anchor에서 positive와
            negative의 순서가 margin을 만족하는지입니다. 하지만 어떤 negative가 그 식에
            들어갈지는 별도의 mining 과정이 결정합니다. 관계가 틀린 후보를 먼저 빼고,
            같은 distance convention에서 난이도를 분류해야 계산의 뜻이 유지됩니다.
          </p>
          <p>
            이 글은 특정 환경에서 margin이나 mining 주기를 고르지 않습니다. 실제
            선택에서는 encoder snapshot, candidate pool, 관계 filter와 downstream 평가를
            함께 고정해야 하며, 그 판단은 평가·실험 글에서 이어집니다.
          </p>
          <h3>스스로 확인하기</h3>
          <ol>
            <li>Cosine 0.8이 squared distance 0.4가 되는 전제는 무엇인가요? <strong>(답: Geometry)</strong></li>
            <li>D₁의 거리가 positive보다 큰데도 loss가 남는 이유는 무엇인가요? <strong>(답: Margin)</strong></li>
            <li>거리 0.35인 B₁을 가장 어려운 negative로 쓰면 안 되는 이유는 무엇인가요? <strong>(답: Mining)</strong></li>
          </ol>
        </div>
        <ContrastiveMapReturn current="triplet" />
      </section>
    </div>
  );
}
