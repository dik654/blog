import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ContrastivePathLocator, {
  ContrastiveMapReturn,
} from "../contrastive-learning/ContrastivePathLocator";
import {
  NTXentCalculationViz,
  SimCLRBatchShapeViz,
  TemperatureCollisionViz,
} from "./SimCLRInfoNCEViz";
import {
  NT_XENT_FIXTURE,
  SIMCLR_BATCH_FIXTURE,
  TEMPERATURE_RATIO_FIXTURE,
} from "./calculations";

const SYMMETRIC_LOSS_PSEUDOCODE = `function simclrLoss(
  cosine: number[][],
  positiveOf: number[],
  tau: number,
) {
  // 각 view를 한 번씩 anchor로 사용합니다.
  const anchorLosses = cosine.map((row, anchor) => {
    // 자기 자신과의 similarity는 후보 분모에서 제외합니다.
    const candidates = row.filter((_, index) => index !== anchor);

    // Positive가 후보 배열의 어느 위치인지 다시 맞춥니다.
    const positive = positiveOf[anchor];
    const positiveIndex = positive > anchor ? positive - 1 : positive;

    // Cosine을 temperature로 나눈 뒤 candidate softmax loss를 계산합니다.
    return crossEntropy(candidates.map((score) => score / tau), positiveIndex);
  });

  // i→j와 j→i를 포함한 모든 anchor loss를 평균합니다.
  return mean(anchorLosses);
}`;

export default function SimCLRInfoNCEArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="simclr-b3-six-view-batch"
        className="scroll-mt-20"
      >
        <ContrastivePathLocator current="simclr" />
        <h2 className="mb-5 text-2xl font-bold">
          원본 세 개를 두 번씩 변환하면 여섯 개의 분류 문제가 생깁니다
        </h2>

        <SimCLRBatchShapeViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 같은 상품의 두 사진을 positive로 정했습니다. 이제 원본
            <code> A·B·C</code>에 augmentation을 각각 두 번 적용해
            <code> A₁·A₂·B₁·B₂·C₁·C₂</code>를 만듭니다. 원본 수
            <code> N=3</code>이 encoder 입력 <code>2N=6</code>개로 펼쳐집니다.
          </p>
          <p>
            <code>A₁</code>을 anchor로 보면 자기 자신은 후보가 아닙니다. 남은
            다섯 view 가운데 같은 원본에서 나온 <code>A₂</code>가 positive이고,
            다른 원본의 네 view는 negative로 취급됩니다. SimCLR은 이 과정을 여섯
            view 각각에 반복합니다.
          </p>
        </div>

        <TermBreakdown
          title="원본 수와 view 수를 섞지 않기 위한 네 이름"
          items={[
            { term: "Source sample", description: "두 view가 공유하는 변환 전 원본입니다.", example: "원본 A 한 장." },
            { term: "Augmented view", description: "독립적으로 뽑은 변환을 거친 실제 encoder 입력입니다.", example: "A₁과 A₂." },
            { term: "Anchor", description: "현재 positive 후보를 찾는 기준 view입니다.", example: "A₁을 기준으로 A₂를 찾습니다." },
            { term: "In-batch candidate", description: "Anchor 자신을 제외하고 분모에 들어가는 view입니다.", example: "N=3이면 anchor마다 5개입니다.", boundary: "다른 source가 실제 semantic duplicate일 가능성은 별도로 검사합니다." },
          ]}
        />
        <ContentBoundary article="simclr-infonce" />
      </section>

      <section id="batch" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          같은 pair도 anchor 방향이 바뀌면 다른 분모를 가집니다
        </h2>
        <div className="not-prose my-7 grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <div className="bg-background px-4 py-5">
            <span className="text-[10px] font-bold text-primary">A₁ → A₂</span>
            <strong className="mt-2 block break-keep text-sm leading-6">A₁이 anchor</strong>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">A₂·B₁·B₂·C₁·C₂가 후보</span>
          </div>
          <span className="hidden items-center bg-background px-3 text-muted-foreground sm:flex" aria-hidden="true">+</span>
          <div className="bg-background px-4 py-5">
            <span className="text-[10px] font-bold text-primary">A₂ → A₁</span>
            <strong className="mt-2 block break-keep text-sm leading-6">A₂가 anchor</strong>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">A₁·B₁·B₂·C₁·C₂가 후보</span>
          </div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>A₁→A₂</code>와 <code>A₂→A₁</code>은 같은 positive pair를
            쓰지만 anchor가 다릅니다. 각 방향에서 자기 자신을 제외하는 열도
            달라집니다. 그래서 원본 하나의 pair는 두 anchor loss를 만들고, 전체
            batch에서는 <code>2N</code>개 loss를 평균합니다.
          </p>
          <p>
            이 구분을 생략하면 view 두 장을 한 문제로만 세거나, 자기 자신을
            분모에 남겨 가장 쉬운 정답을 추가하는 구현 오류가 생깁니다.
          </p>
        </div>
        <div className="not-prose my-7 border-y border-border py-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">자기 자신을 제외하고 양방향 loss를 평균하는 TypeScript 형태의 의사코드</p>
          <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6"><code>{SYMMETRIC_LOSS_PSEUDOCODE}</code></pre>
        </div>
      </section>

      <section id="objective" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          NT-Xent는 다섯 후보 중 positive 하나를 맞히는 softmax입니다
        </h2>
        <NTXentCalculationViz />
        <ExplainedFormula
          question="Anchor i가 positive j를 다른 view보다 높은 확률로 선택하게 하려면 무엇을 계산하나요?"
          idea={<p>Cosine similarity를 temperature로 나눠 logit을 만들고, anchor 자신을 제외한 후보의 지수 점수를 모두 더합니다. Positive 지수 점수를 그 합으로 나눈 뒤 negative log를 취합니다.</p>}
          formula={String.raw`\ell_{i,j}=-\log\frac{\exp(\operatorname{sim}(z_i,z_j)/\tau)}{\sum_{k=1}^{2N}\mathbf{1}[k\ne i]\exp(\operatorname{sim}(z_i,z_k)/\tau)}`}
          annotatedFormula={String.raw`\begin{aligned}s_{ik}&=\underbrace{\operatorname{sim}(z_i,z_k)/\tau}_{\text{cosine을 temperature로 조절}}\\Z_i&=\underbrace{\sum_{k=1}^{2N}\mathbf{1}[k\ne i]\exp(s_{ik})}_{\text{자기 자신을 제외한 후보 합}}\\p(j\mid i)&=\underbrace{\exp(s_{ij})/Z_i}_{\text{positive 선택 확률}}\\\ell_{i,j}&=\underbrace{-\log p(j\mid i)}_{\text{positive 확률의 negative log}}\end{aligned}`}
          operations={[
            { expression: String.raw`\operatorname{sim}(z_i,z_k)/\tau`, annotation: ["정규화된 두 vector의 cosine을 구하고", "양수 temperature로 나눕니다."] },
            { expression: String.raw`\mathbf{1}[k\ne i]`, annotation: ["anchor 자신과의 항만 가리고", "positive와 나머지 후보는 모두 남깁니다."] },
            { expression: String.raw`\exp(s_{ij})/Z_i`, annotation: ["positive 지수 점수를", "후보 지수 점수의 합으로 나눕니다."] },
            { expression: String.raw`-\log p(j\mid i)`, annotation: ["positive 확률이 작을수록", "더 큰 loss를 남깁니다."] },
          ]}
          terms={[
            { symbol: "N", name: "Source batch size", description: "Augmentation 전 원본 sample 수입니다." },
            { symbol: "2N", name: "View count", description: "원본마다 두 view를 만든 encoder 입력 수입니다." },
            { symbol: String.raw`\tau`, name: "Temperature", description: "후보 점수의 상대 간격을 조절하는 양수입니다." },
            { symbol: String.raw`Z_i`, name: "Candidate partition", description: "Anchor 자신을 제외한 후보 지수 점수의 합입니다." },
          ]}
          assumptions={["두 augmentation view가 현재 task의 의미를 보존합니다.", "다른 source에서 나온 view를 negative로 쓰는 in-batch 가정을 명시합니다.", "Similarity를 계산하기 전에 projection을 L2 normalize합니다.", "전체 loss는 양방향 anchor loss 2N개를 평균합니다."]}
          interpretation="NT-Xent는 절대 거리를 지정하는 식이 아닙니다. 같은 batch의 후보 가운데 positive view를 선택하는 분류 loss입니다."
        />
        <CalculationWalkthrough
          title="A₁이 A₂를 선택할 확률과 loss"
          question="cosine이 [0.8, 0.4, 0.1, −0.1, 0.0]이고 τ=0.5일 때 A₂의 확률은 얼마인가요?"
          scope="A₁ 한 방향의 설명용 수치입니다. 실제 학습 품질이나 전체 batch 평균을 뜻하지 않습니다."
          steps={[
            { label: "Temperature scaling", expression: "[0.8, 0.4, 0.1, −0.1, 0.0] ÷ 0.5", result: "[1.6, 0.8, 0.2, −0.2, 0.0]", reason: "모든 후보에 같은 temperature를 적용해 softmax logit을 만듭니다." },
            { label: "Candidate partition", expression: "exp(1.6)+exp(0.8)+exp(0.2)+exp(−0.2)+exp(0)", result: `Z = ${NT_XENT_FIXTURE.partition}`, reason: "Anchor 자신은 이미 제외했고 positive를 포함한 다섯 후보 점수를 모두 더합니다." },
            { label: "Positive probability", expression: `exp(1.6) ÷ ${NT_XENT_FIXTURE.partition}`, result: `p(A₂|A₁) = ${NT_XENT_FIXTURE.positiveProbability}`, reason: "Positive A₂의 지수 점수를 전체 후보 합으로 나눕니다." },
            { label: "Directional loss", expression: `−log(${NT_XENT_FIXTURE.positiveProbability})`, result: `ℓ(A₁,A₂) = ${NT_XENT_FIXTURE.loss}`, reason: "Positive 선택 확률의 negative log가 이 anchor 방향의 loss입니다." },
          ]}
          conclusion={`이 수치에서 A₁은 A₂에 약 ${NT_XENT_FIXTURE.positiveProbability}의 확률을 주고 ${NT_XENT_FIXTURE.loss}의 loss를 남깁니다. A₂→A₁을 비롯한 나머지 방향도 계산해 평균해야 전체 batch loss가 됩니다.`}
          caveats={["표의 cosine은 계산을 설명하기 위한 값이며 SimCLR 논문의 측정 결과가 아닙니다.", "실제 구현에서는 log-sum-exp 방식으로 softmax를 계산해 overflow를 막습니다."]}
        />
      </section>

      <section id="temperature" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Temperature를 낮추기 전에 분모의 후보가 정말 negative인지 확인합니다
        </h2>
        <TemperatureCollisionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 후보 similarity 차이가 <code>{TEMPERATURE_RATIO_FIXTURE.similarityGap}</code>이면 상대 지수 점수 비는 <code>exp(0.1/τ)</code>입니다. <code>τ=1</code>에서는 약 <code>{TEMPERATURE_RATIO_FIXTURE.broadRatio}</code>지만 <code> τ=0.1</code>에서는 약 <code>{TEMPERATURE_RATIO_FIXTURE.sharpRatio}</code>로 커집니다. 작은 temperature는 가까운 후보의 차이를 더 크게 반영합니다.
          </p>
          <p>
            문제는 후보 관계가 틀렸을 때도 같은 확대가 적용된다는 점입니다. 서로 다른 source ID가 실제로 같은 상품이면 그 view는 hidden positive입니다. 이를 negative로 분모에 넣은 채 temperature만 낮추면 같은 의미를 더 강하게 밀어냅니다. Temperature sweep과 duplicate·same-class collision audit을 같은 실험에서 봐야 합니다.
          </p>
        </div>
        <div id="paper-simclr" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock type="paper" citeKey={1} source="Chen et al. — A Simple Framework for Contrastive Learning of Visual Representations" href="https://proceedings.mlr.press/v119/chen20j.html">
            논문 2.1절과 Algorithm 1은 N개 원본에서 2N개 view를 만들고, 자기 자신을 제외한 분모와 양방향 positive loss를 사용합니다. 논문은 normalized embedding과 temperature, augmentation 조합, 큰 batch의 효과를 ImageNet·ResNet·해당 학습 설정에서 평가했습니다. 이 결과를 모든 domain의 기본 temperature나 batch 크기로 일반화하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">부모 지도에 되돌려 놓기</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["입력", `${SIMCLR_BATCH_FIXTURE.sourceCount} source → ${SIMCLR_BATCH_FIXTURE.viewCount} views`],
            ["후보", `anchor마다 ${SIMCLR_BATCH_FIXTURE.candidateCountPerAnchor} candidates`],
            ["목표", "positive exp score ÷ Z"],
            ["경계", "temperature + hidden-positive audit"],
          ].map(([label, result]) => (
            <div key={label} className="min-w-0 bg-background px-4 py-4">
              <span className="text-[10px] font-bold text-primary">{label}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{result}</strong>
            </div>
          ))}
        </div>
        <ContrastiveMapReturn current="simclr" />
      </section>
    </div>
  );
}
