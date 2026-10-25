import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ContrastivePathLocator, {
  ContrastiveMapReturn,
} from "../contrastive-learning/ContrastivePathLocator";
import {
  LogPlacementViz,
  MultiPositiveLossViz,
  PositiveMaskViz,
  SupConBatchViz,
} from "./SupervisedContrastiveViz";
import { SUPCON_BATCH_FIXTURE } from "./calculations";

const POSITIVE_MASK_ALGORITHM = {
  input: [
    "labels=[신발,신발,신발,신발,가방,가방]",
    "logits: shape [6,6], diagonal은 자기 자신",
  ],
  steps: [
    {
      code: "candidate_mask[i,a] = (a ≠ i)",
      note: "각 anchor 행에서 자기 자신만 공통 분모 후보에서 제외합니다.",
    },
    {
      code: "positive_mask[i,p] = candidate_mask[i,p] ∧ (label[p] = label[i])",
      note: "Self를 이미 지운 뒤 같은 label인 칸만 positive로 표시합니다.",
    },
    {
      code: "log_prob[i,:] = logits[i,:] − logsumexp(logits[i,candidate_mask])",
      note: "Positive와 negative가 함께 있는 공통 후보 분모에서 log-probability를 계산합니다.",
    },
    {
      code: "anchor_loss[i] = −sum(log_prob[i,positive_mask]) / positive_count[i]",
      note: "Positive마다 negative log-probability를 계산하고 positive 수로 평균합니다.",
    },
    {
      code: "loss = mean(anchor_loss[i] for i where positive_count[i] > 0)",
      note: "논문의 two-view batch에서는 모든 anchor에 paired view가 있습니다. Guard는 one-view 변형의 빈 집합을 드러냅니다.",
    },
  ],
  output: "batch의 valid anchor 평균 supervised contrastive loss",
} as const;

export default function SupervisedContrastiveArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="supcon-three-source-six-view-batch"
        className="scroll-mt-20"
      >
        <ContrastivePathLocator current="supervised" />
        <h2 className="mb-5 text-2xl font-bold">
          1. 같은 class의 다른 원본까지 가까워질 대상으로 봅니다
        </h2>

        <SupConBatchViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            설명용 batch에는 신발 사진 <code>A·B</code>와 가방 사진
            <code> C</code>가 있습니다. 각 원본을 두 번씩 변환하면 encoder 입력은
            <code> A₁·A₂·B₁·B₂·C₁·C₂</code> 여섯 개가 됩니다. 모든 수치는
            계산을 설명하기 위한 가정입니다.
          </p>
          <p>
            <code>A₁</code>을 기준으로 두면 같은 원본의 <code>A₂</code>만
            가까워질 대상이 아닙니다. 같은 <code>신발</code> label을 가진 다른
            원본의 <code>B₁·B₂</code>도 함께 가까워져야 합니다. 한 label이
            anchor마다 여러 관계로 펼쳐지는 지점이 이 글의 질문입니다.
          </p>
          <p>
            지금은 이름보다 개수를 붙잡으면 됩니다. 원본은 3개, view는 6개,
            <code>A₁</code> 자신을 뺀 후보는 5개입니다. 그중 가까워질 대상은
            3개이고 다른 label 후보는 2개입니다.
          </p>
        </div>
        <ContentBoundary article="supervised-contrastive-learning" />
      </section>

      <section id="positive-set" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. Self를 지운 뒤 같은 label인 세 칸만 표시합니다
        </h2>

        <PositiveMaskViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 <code>A₁</code>과 자기 자신이 만나는 칸을 지웁니다. 남은 다섯
            칸에서 label이 <code>신발</code>인 <code>A₂·B₁·B₂</code>를 표시합니다.
            이 index 집합을 <strong>positive set P(A₁)</strong>이라고 합니다.
          </p>
          <p>
            <code>C₁·C₂</code>는 positive set에는 없지만 계산에서 사라지지
            않습니다. 둘은 다른 label이므로 negative로 남아 공통 분모에
            들어갑니다. 따라서 positive를 모으는 mask와 분모 후보를 정하는
            mask는 서로 다른 역할을 합니다.
          </p>
        </div>

        <TermBreakdown
          title="한 anchor 행을 만드는 네 이름"
          items={[
            {
              term: "Anchor i",
              description: "현재 positive와 negative 후보를 비교하는 기준 view입니다.",
              example: "이 글에서는 A₁입니다.",
            },
            {
              term: "Candidate set A(i)",
              description: "Anchor 자신만 제외한 모든 multiview batch index입니다.",
              example: "A(A₁)={A₂,B₁,B₂,C₁,C₂}입니다.",
            },
            {
              term: "Positive set P(i)",
              description: "Candidate 가운데 anchor와 label이 같은 index 집합입니다.",
              example: "P(A₁)={A₂,B₁,B₂}입니다.",
            },
            {
              term: "Positive count |P(i)|",
              description: "Anchor loss에서 같은 비중으로 평균할 positive 수입니다.",
              example: "A₁의 positive count는 3입니다.",
              boundary: "논문의 two-view 구성과 달리 view 하나만 쓰는 변형에서는 0이 될 수 있습니다.",
            },
          ]}
        />
      </section>

      <section id="objective" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. Positive마다 선택 실패량을 계산한 뒤 평균합니다
        </h2>

        <MultiPositiveLossViz />

        <ExplainedFormula
          question="A₁의 positive가 세 개라면 공통 후보 분모에서 loss 하나를 어떻게 만듭니까?"
          idea={(
            <p>
              Anchor 자신을 뺀 다섯 후보의 지수 점수를 모두 더해 공통 분모를
              만듭니다. 세 positive 각각의 확률에 negative log를 적용한 뒤
              positive 수로 나눕니다.
            </p>
          )}
          formula={String.raw`\mathcal L^{sup}_{out,i}=-\frac{1}{|P(i)|}\sum_{p\in P(i)}\log\frac{\exp(z_i\cdot z_p/\tau)}{\sum_{a\in A(i)}\exp(z_i\cdot z_a/\tau)}`}
          annotatedFormula={String.raw`\begin{aligned}P(i)&=\underbrace{\{p\in A(i):y_p=y_i\}}_{\text{self를 뺀 same-label positive}}\\Z_i&=\underbrace{\sum_{a\in A(i)}\exp(z_i\cdot z_a/\tau)}_{\text{positive와 negative를 합친 공통 분모}}\\\mathcal L^{sup}_{out,i}&=\underbrace{-\frac{1}{|P(i)|}\sum_{p\in P(i)}\log\frac{\exp(z_i\cdot z_p/\tau)}{Z_i}}_{\text{positive별 negative log-probability의 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{p\in A(i):y_p=y_i\}`,
              annotation: ["Anchor 자신은 제외하고", "같은 label인 후보 index를 모읍니다."],
            },
            {
              expression: String.raw`\sum_{a\in A(i)}\exp(z_i\cdot z_a/\tau)`,
              annotation: ["Positive와 negative 지수 점수를", "하나의 후보 분모로 더합니다."],
            },
            {
              expression: String.raw`\log\frac{\exp(z_i\cdot z_p/\tau)}{Z_i}`,
              annotation: ["Positive 하나가 받은 확률을 구하고", "그 선택 실패량을 negative log로 셉니다."],
            },
            {
              expression: String.raw`\frac{1}{|P(i)|}\sum_{p\in P(i)}`,
              annotation: ["Positive별 loss를 모두 더한 뒤", "positive 개수로 평균합니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`A(i)`,
              name: "Candidate index set",
              description: "Multiview batch에서 anchor i 자신을 제외한 index 집합입니다.",
            },
            {
              symbol: String.raw`P(i)`,
              name: "Positive index set",
              description: "A(i) 가운데 anchor와 label이 같은 index 집합입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Temperature",
              description: "정규화된 projection similarity의 상대 간격을 조절하는 양수입니다.",
            },
            {
              symbol: String.raw`Z_i`,
              name: "Candidate partition",
              description: "Anchor i의 positive와 negative 후보 지수 점수를 모두 더한 값입니다.",
            },
          ]}
          assumptions={[
            "각 원본에서 두 view를 만들고 두 view에 같은 label을 복사합니다.",
            "Projection z는 L2 정규화하며 논문과 같은 inner product similarity를 사용합니다.",
            "Positive 관계가 현재 class label의 의미와 맞습니다.",
            "전체 batch loss는 anchor별 loss를 평균합니다.",
          ]}
          interpretation={`설명용 지수 점수가 8·4·2·1·1이면 Z=${SUPCON_BATCH_FIXTURE.partition}입니다. 세 positive 확률은 0.5·0.25·0.125입니다. Negative log를 평균하면 A₁의 loss는 약 ${SUPCON_BATCH_FIXTURE.outsideLogLoss}입니다.`}
        />

        <CalculationWalkthrough
          title="A₁의 multi-positive loss"
          question="지수 점수 8·4·2·1·1에서 positive 세 개의 평균 loss는 얼마입니까?"
          scope="A₁ 한 anchor의 설명용 수치입니다. 논문의 측정 결과나 권장 logit이 아닙니다."
          steps={[
            {
              label: "공통 분모",
              expression: "8 + 4 + 2 + 1 + 1",
              result: "Z = 16",
              reason: "Self를 제외한 positive 3개와 negative 2개의 지수 점수를 모두 셉니다.",
            },
            {
              label: "Positive 확률",
              expression: "[8,4,2] ÷ 16",
              result: "[0.5, 0.25, 0.125]",
              reason: "P(A₁)의 세 후보만 분자에 한 번씩 놓습니다.",
            },
            {
              label: "Positive별 loss",
              expression: "−log([0.5,0.25,0.125])",
              result: "[0.693, 1.386, 2.079]",
              reason: "각 positive가 공통 분모에서 받은 선택 실패량입니다.",
            },
            {
              label: "Anchor 평균",
              expression: "(0.693 + 1.386 + 2.079) ÷ 3",
              result: `L(A₁) = ${SUPCON_BATCH_FIXTURE.outsideLogLoss}`,
              reason: "Positive가 많은 anchor의 loss가 개수만큼 커지지 않도록 세 항을 평균합니다.",
            },
          ]}
          conclusion="한 anchor의 계산은 공통 분모 하나와 positive별 log 항 세 개로 이루어집니다. Negative는 분모 경쟁에는 참여하지만 positive 평균의 항으로 직접 채점되지는 않습니다."
          caveats={[
            "실제 구현은 수치 안정성을 위해 log-sum-exp를 사용합니다.",
            "Loss의 절대값만으로 다른 objective나 batch recipe의 성능을 비교하지 않습니다.",
          ]}
        />

        <AlgorithmBlock
          title="Label mask에서 batch loss까지 옮기는 절차 (의사코드)"
          input={POSITIVE_MASK_ALGORITHM.input}
          steps={POSITIVE_MASK_ALGORITHM.steps}
          output={POSITIVE_MASK_ALGORITHM.output}
        />
      </section>

      <section id="log-placement" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. Positive 합을 log 안으로 옮기면 같은 식이 아닙니다
        </h2>

        <LogPlacementViz />

        <ExplainedFormula
          question="같은 P(i)를 써도 논문 식 (2)와 식 (3)의 positive 비중은 왜 달라집니까?"
          idea={(
            <p>
              식 (2)는 positive마다 log를 먼저 적용하고 평균합니다. 식 (3)은
              positive 확률을 먼저 평균한 뒤 log를 한 번만 적용합니다. 이 순서
              차이가 gradient에서 각 positive가 받는 target weight를 바꿉니다.
            </p>
          )}
          formula={String.raw`X^{out}_{ip}=\frac{1}{|P(i)|},\qquad X^{in}_{ip}=\frac{\exp(z_i\cdot z_p/\tau)}{\sum_{p'\in P(i)}\exp(z_i\cdot z_{p'}/\tau)}`}
          annotatedFormula={String.raw`\begin{aligned}X^{out}_{ip}&=\underbrace{\frac{1}{|P(i)|}}_{\text{모든 positive에 같은 target weight}}\\X^{in}_{ip}&=\underbrace{\frac{\exp(z_i\cdot z_p/\tau)}{\sum_{p'\in P(i)}\exp(z_i\cdot z_{p'}/\tau)}}_{\text{현재 positive similarity 비율의 target weight}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\frac{1}{|P(i)|}`,
              annotation: ["Positive 수만 세어", "현재 similarity와 무관한 같은 비중을 줍니다."],
            },
            {
              expression: String.raw`\exp(z_i\cdot z_p/\tau)`,
              annotation: ["Positive p의 현재 지수 점수를", "positive 집합 안의 weight로 사용합니다."],
            },
            {
              expression: String.raw`\sum_{p'\in P(i)}\exp(z_i\cdot z_{p'}/\tau)`,
              annotation: ["Positive 지수 점수만 더해", "그 안에서 상대 비중을 정규화합니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`X^{out}_{ip}`,
              name: "Outside-log positive target",
              description: "논문 식 (2)의 gradient에서 positive p가 받는 같은 target weight입니다.",
            },
            {
              symbol: String.raw`X^{in}_{ip}`,
              name: "Inside-log positive target",
              description: "논문 식 (3)의 gradient에서 현재 similarity에 비례하는 target weight입니다.",
            },
          ]}
          assumptions={[
            "두 식은 같은 multiview batch, label mask, temperature와 denominator를 사용합니다.",
            "표시한 X는 논문 식 (4)~(6)의 gradient 분석에서 나온 positive target 항입니다.",
          ]}
          interpretation={`지수 점수 [8,4,2]에서 식 (2)의 target weight는 [0.333,0.333,0.333]입니다. 식 (3)은 [0.571,0.286,0.143]을 줍니다. 논문은 이 분석과 해당 실험 조건을 근거로 식 (2)를 이후 SupCon objective로 사용합니다.`}
        />

        <div id="paper-supcon" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Khosla et al. — Supervised Contrastive Learning"
            href="https://papers.nips.cc/paper_files/paper/2020/hash/d89a66c7c80a29b1bdbab0f2a1a94af8-Paper.pdf"
          >
            논문 §3.2는 N개 sample을 두 번 augment한 2N multiview batch를 정의하고,
            식 (2)의 log 바깥 평균과 식 (3)의 log 안 합을 비교합니다. 식 (4)~(6)은
            두 objective의 positive target weight가 달라지는 과정을 분석합니다.
            Table 1의 78.7%와 67.4%는 ImageNet·ResNet-50·batch size 6144라는 논문
            조건의 저자 보고 결과이며 다른 domain의 성능 보장이 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundaries" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          5. Two-view batch와 label의 의미를 바꾸면 경계도 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문의 기본 구성에서는 원본마다 view가 두 개입니다. 어떤 anchor를
            골라도 같은 원본의 다른 view가 한 개 있으므로 <code>P(i)</code>가
            비지 않습니다. 따라서 기존 설명처럼 <code>C₁</code>을 positive가 없는
            anchor로 보는 것은 이 구성과 맞지 않습니다. <code>C₂</code>가 있기
            때문입니다.
          </p>
          <p>
            구현을 원본마다 한 view만 쓰는 방식으로 바꾸거나 custom sampler가
            같은 label sample을 한 개만 뽑으면 빈 positive set이 생길 수 있습니다.
            그때는 0으로 나누지 않도록 anchor를 명시적으로 제외하고 valid-anchor
            수를 기록해야 합니다. 이는 논문 식을 그대로 구현한 결과가 아니라
            batch 구성 변경에 따른 방어 규칙입니다.
          </p>
          <p>
            Label 자체도 관계의 근거일 뿐입니다. 상위 class가 같아도 retrieval에서
            반드시 가까워야 할 대상이 아닐 수 있고, label 오류가 있으면 잘못된
            positive를 끌어당깁니다. 어떤 pair가 실제 task에서 맞는지와 embedding이
            downstream 성능을 높였는지는 다음 평가 글에서 따로 확인합니다.
          </p>
        </div>
      </section>

      <section id="return-map" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">6. 부모 지도에 되돌려 놓기</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["입력", "3 originals → 6 views"],
            ["관계", "P(A₁)={A₂,B₁,B₂}"],
            ["계산", "positive별 −log 후 평균"],
            ["경계", "two-view·label 의미"],
          ].map(([label, result]) => (
            <div key={label} className="min-w-0 bg-background px-4 py-4">
              <span className="text-[10px] font-bold text-primary">{label}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{result}</strong>
            </div>
          ))}
        </div>
        <ContrastiveMapReturn current="supervised" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <h3>읽고 바로 확인할 세 질문</h3>
          <p>
            <code>A₁</code>의 denominator에는 들어가지만 <code>P(A₁)</code>에는
            들어가지 않는 view는 무엇입니까? (답: 2절)
          </p>
          <p>
            지수 점수 <code>8·4·2·1·1</code>에서 positive loss 세 개를 평균하면
            왜 약 <code>1.386</code>이 됩니까? (답: 3절)
          </p>
          <p>
            논문의 two-view batch에서 <code>C₁</code>의 positive set이 비지 않는
            이유는 무엇입니까? (답: 5절)
          </p>
        </div>
      </section>
    </div>
  );
}
