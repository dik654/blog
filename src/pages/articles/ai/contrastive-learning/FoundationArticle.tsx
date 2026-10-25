import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ContrastivePathLocator, { ContrastiveMapReturn } from "./ContrastivePathLocator";
import {
  PairContractViz,
  PairMeaningOverviewViz,
  ProjectionHandoffViz,
} from "./viz/ModernContrastiveViz";

const PAIR_RECEIPT_CODE = `type PairRelation = "positive" | "negative" | "unknown";

type PairReceipt = {
  // 어떤 두 sample을 비교했는지 고정합니다.
  leftSampleId: string;
  rightSampleId: string;

  // 학습에 넣을 관계와 그 판단 근거를 분리합니다.
  relation: PairRelation;
  relationSource: "same-sku" | "human-review" | "unverified";

  // 무엇을 보존하려는지와 어떤 변환을 썼는지 기록합니다.
  target: "product-identity";
  transformationRevision: "color-v3";
};`;

export default function ContrastiveLearningFoundationArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="sku-42-product-search-pairs"
        className="scroll-mt-20"
      >
        <ContrastivePathLocator current="pair-contract" />
        <h2 className="mb-5 text-2xl font-bold">
          두 사진을 가깝게 만들기 전에 무엇이 같다는 뜻인지 정해야 합니다
        </h2>

        <PairMeaningOverviewViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            상품 검색 모델에 <code>SKU-42</code>의 정면 사진을 넣는다고 하겠습니다.
            같은 상품을 밝게 찍은 crop은 가까워져야 하고, 다른 상품인
            <code> SKU-77</code>은 멀어져야 합니다. 중복 상품인지 확인되지 않은
            판매자 사진은 어느 쪽인지 아직 모릅니다.
          </p>
          <p>
            대조 학습은 이 세 관계를 vector 사이의 거리로 옮깁니다. 모델은 파일
            이름만 보고 관계를 알지 못합니다. 따라서 첫 설계 대상은 loss 이름이
            아니라 현재 업무에서 보존할 의미와 구분할 의미입니다.
          </p>
        </div>

        <TermBreakdown
          title="이 글에서 구분할 세 관계"
          items={[
            {
              term: "Positive pair",
              description: "현재 업무에서 보존할 의미가 같아 가까워지게 할 두 sample입니다.",
              example: "같은 SKU의 원본과 밝은 crop.",
            },
            {
              term: "Negative pair",
              description: "현재 업무에서 반드시 구분해야 하므로 멀어지게 할 두 sample입니다.",
              example: "서로 다른 SKU.",
            },
            {
              term: "Unknown pair",
              description: "같거나 다르다는 근거가 부족해 학습 신호에서 제외할 관계입니다.",
              example: "중복 등록인지 확인되지 않은 판매자 사진.",
              boundary: "다른 record라는 이유만으로 negative로 만들지 않습니다.",
            },
          ]}
        />
        <ContentBoundary article="contrastive-learning" />
      </section>

      <section id="pair-contract" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Positive는 두 파일의 속성이 아니라 업무상 관계입니다
        </h2>

        <PairContractViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 색 변화도 상품 식별에서는 무시해도 되지만 피부 병변 분류에서는
            진단 단서를 지울 수 있습니다. Positive transformation으로 정한 변화는
            모델에 “이 변화는 구분하지 말라”는 불변성 가정을 줍니다. 그러므로
            augmentation 이름만 저장해서는 어떤 가정을 학습했는지 되돌릴 수 없습니다.
          </p>
          <p>
            Pair 기록에는 두 sample ID, relation, 판단 근거, target, transformation
            revision을 함께 둡니다. Unknown을 허용하면 불확실한 후보가 강한
            negative 신호로 바뀌는 일을 막을 수 있습니다.
          </p>
        </div>

        <div className="not-prose my-7 border-y border-border py-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">
            관계 판단을 다시 확인하기 위한 TypeScript 기록 예시
          </p>
          <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6">
            <code>{PAIR_RECEIPT_CODE}</code>
          </pre>
        </div>
      </section>

      <section id="projection" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Encoder의 h와 loss가 비교할 z를 따로 둡니다
        </h2>

        <ProjectionHandoffViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 encoder <code>fθ</code>가 두 view를 <code>h</code>로 바꿉니다.
            <code> h</code>는 분류나 검색에서 재사용할 표현입니다. Projection head
            <code> gφ</code>는 이를 contrastive loss가 직접 비교할 공간의
            <code> z̃</code>로 옮깁니다. 마지막으로 L2 norm으로 나누면 길이가 1인
            <code> z</code>가 됩니다.
          </p>
        </div>

        <CalculationWalkthrough
          title="Projection을 unit vector로 바꾸는 계산"
          question="z̃=(3,4)는 어떻게 z=(0.6,0.8)이 되고, r=(1,0)과 cosine 0.6을 만드나요?"
          scope="두 차원의 설명용 projection만 계산합니다. 실제 모델 품질이나 학습 결과를 뜻하지 않습니다."
          steps={[
            {
              label: "L2 norm",
              expression: "√(3² + 4²)",
              result: "5",
              reason: "두 성분 제곱을 더한 뒤 제곱근을 구해 vector 길이를 얻습니다.",
            },
            {
              label: "Normalization",
              expression: "(3/5, 4/5)",
              result: "z = (0.6, 0.8)",
              reason: "각 성분을 자기 길이로 나눠 방향은 유지하고 길이를 1로 맞춥니다.",
            },
            {
              label: "Cosine similarity",
              expression: "0.6×1 + 0.8×0",
              result: "0.6",
              reason: "두 unit vector의 대응 성분을 곱해 더하면 방향의 cosine이 됩니다.",
            },
          ]}
          conclusion="이 fixture에서 z̃의 길이 5는 제거되고, reference 방향과의 일치 정도 0.6만 비교에 남습니다."
          caveats={[
            "영벡터는 정규화할 수 없으므로 구현에서는 오류 처리나 epsilon 정책이 필요합니다.",
            "h와 z 중 무엇을 배포할지는 학습 방법의 계약이며 이름을 섞어 저장하면 재현할 수 없습니다.",
          ]}
        />

        <div id="paper-simclr-handoff" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Chen et al. — A Simple Framework for Contrastive Learning of Visual Representations"
            href="https://proceedings.mlr.press/v119/chen20j.html"
          >
            SimCLR은 두 augmentation view를 같은 encoder에 넣고, representation
            <code> h</code>를 projection head로 <code>z</code>에 옮겨 contrastive
            loss를 적용합니다. 논문의 linear evaluation에서는 학습 뒤 projection
            head를 버리고 <code>h</code>를 사용합니다. 이 결과는 논문의 ImageNet·ResNet·학습
            설정 범위에 한정합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="release" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          관계 형식이 정해진 뒤에 다음 objective를 고릅니다
        </h2>

        <div className="not-prose my-7 grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
          <div className="bg-background px-4 py-4">
            <span className="text-[10px] font-bold text-primary">AUGMENTATION PAIR</span>
            <strong className="mt-2 block break-keep text-sm leading-6">한 원본에서 두 view</strong>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">다음 · SimCLR과 NT-Xent</span>
          </div>
          <span className="hidden items-center text-muted-foreground sm:flex" aria-hidden="true">·</span>
          <div className="bg-background px-4 py-4">
            <span className="text-[10px] font-bold text-primary">RELATIVE TRIPLET</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Anchor·positive·negative</strong>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">다음 · Margin과 mining</span>
          </div>
          <span className="hidden items-center text-muted-foreground sm:flex" aria-hidden="true">·</span>
          <div className="bg-background px-4 py-4">
            <span className="text-[10px] font-bold text-primary">CLASS LABEL</span>
            <strong className="mt-2 block break-keep text-sm leading-6">한 anchor의 여러 positive</strong>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">다음 · Supervised contrastive</span>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pair 관계가 맞는지 확인하지 않은 채 loss만 바꾸면 잘못된 의미를 더
            정교하게 학습할 뿐입니다. 색 변화가 target을 파괴하는 반례, hidden
            positive, projection head를 잘못 배포한 경우를 먼저 확인한 뒤 관계
            형식에 맞는 다음 글로 이동합니다.
          </p>
        </div>

        <div id="paper-alignment-uniformity" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Wang & Isola — Understanding Contrastive Representation Learning through Alignment and Uniformity"
            href="https://proceedings.mlr.press/v119/wang20k.html"
          >
            이 논문은 positive pair가 가까워지는 alignment와 normalized
            representation이 unit hypersphere에 퍼지는 uniformity를 분리해
            분석합니다. 이 분석이 어떤 pair나 augmentation이 업무상 옳은지를
            대신 판단해 주지는 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">부모 지도에 되돌려 놓기</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["관계", "positive · negative · unknown", "업무상 의미와 근거"],
            ["불변성", "target · transformation revision", "반례로 보존 여부 확인"],
            ["표현", "x → h → z̃ → z", "h와 loss 공간의 handoff"],
          ].map(([label, path, result]) => (
            <div key={label} className="min-w-0 bg-background px-4 py-4">
              <span className="text-[10px] font-bold text-primary">{label}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{result}</strong>
              <code className="mt-3 block break-words font-mono text-[10px] leading-5 text-muted-foreground">{path}</code>
            </div>
          ))}
        </div>
        <ContrastiveMapReturn current="pair-contract" />
      </section>
    </div>
  );
}
