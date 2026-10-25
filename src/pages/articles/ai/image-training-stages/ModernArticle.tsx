import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ImageClassificationPathLocator, {
  ImageClassificationMapReturn,
} from "../image-classification-pipeline/ImageClassificationPathLocator";
import {
  ImageTrainingStageViz,
  StageFailureBoundaryViz,
} from "./viz/ImageTrainingStageViz";

function BatchHandoffLedger() {
  const rows = [
    {
      stage: "S0 · 160px",
      arithmetic: "64 images/GPU × 4 GPUs × 1회 누적 = 256 images/update",
      meaning: "label이 있는 이미지로 기준 checkpoint c0를 만듭니다.",
    },
    {
      stage: "S1 · 320px",
      arithmetic: "16 images/GPU × 4 GPUs × 4회 누적 = 256 images/update",
      meaning:
        "해상도가 커져 한 GPU의 batch는 줄었지만, 누적 횟수를 늘려 update당 이미지 수를 맞춥니다.",
    },
    {
      stage: "비교 범위",
      arithmetic: "둘 다 256 images/update",
      meaning:
        "한 update의 표본 수만 맞춘 것입니다. 픽셀 수·crop 분포·메모리·연산량이 같아진 것은 아닙니다.",
    },
  ] as const;

  return (
    <div
      className="not-prose my-8 border-y border-border"
      aria-label="160픽셀과 320픽셀 학습 단계의 effective batch 계산"
    >
      <p className="py-3 text-xs font-bold text-primary">
        checkpoint를 넘기기 전에 한 update의 크기 맞추기
      </p>
      <ol className="divide-y divide-border">
        {rows.map((row, index) => (
          <li
            key={row.stage}
            className="grid gap-2 py-4 sm:grid-cols-[2rem_10rem_minmax(0,1fr)] sm:items-start"
          >
            <span className="font-mono text-xs font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <strong className="block break-keep text-sm">{row.stage}</strong>
              <code className="mt-1 block break-words text-xs leading-5">
                {row.arithmetic}
              </code>
            </div>
            <p className="break-keep text-xs leading-5 text-muted-foreground">
              {row.meaning}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PseudoLabelLedger() {
  const rows = [
    {
      label: "약한 변형으로 예측",
      arithmetic: "q(신발 | weak(u-042)) = .96",
      meaning: "현재 모델이 신발에 가장 큰 확률을 둡니다.",
    },
    {
      label: "기준과 비교",
      arithmetic: ".96 ≥ τ=.95 → Iτ=1",
      meaning: "임시 label ‘신발’을 loss에 넣습니다.",
    },
    {
      label: "강한 변형으로 다시 예측",
      arithmetic: "p(신발 | strong(u-042)) = .72",
      meaning: "같은 이미지의 더 어려운 모습에서 신발 확률을 읽습니다.",
    },
    {
      label: "loss 계산",
      arithmetic: "−ln(.72) = .3285",
      meaning:
        "강한 변형에서도 임시 label을 유지하도록 parameter를 갱신합니다.",
    },
  ] as const;

  return (
    <div
      className="not-prose my-8 border-y border-border"
      aria-label="label이 없는 이미지 u-042가 임시 label loss를 만드는 계산"
    >
      <p className="py-3 text-xs font-bold text-primary">
        u-042 한 장이 loss에 들어가는 과정
      </p>
      <ol className="divide-y divide-border">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className="grid gap-2 py-4 sm:grid-cols-[2rem_11rem_minmax(0,1fr)] sm:items-start"
          >
            <span className="font-mono text-xs font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <strong className="block break-keep text-sm">{row.label}</strong>
              <code className="mt-1 block break-words text-xs leading-5">
                {row.arithmetic}
              </code>
            </div>
            <p className="break-keep text-xs leading-5 text-muted-foreground">
              {row.meaning}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ImageTrainingStagesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <ImageClassificationPathLocator current="training-stages" />
        <h2 className="mb-6 text-2xl font-bold">한 run, 세 단계</h2>
        <ImageTrainingStageViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              해상도와 임시 label을 한꺼번에 바꾸면 결과가 달라진 이유를 알 수
              없습니다.
            </strong>{" "}
            이 글은 하나의 학습 run <code>img-cls-07</code>을 따라갑니다. 먼저
            160px의 label이 있는 이미지로 기준점을 만들고, 320px 단계로
            checkpoint를 넘긴 뒤, label이 없는 이미지 <code>u-042</code> 하나가
            loss에 들어가는 순간까지 추적합니다.
          </p>
          <p>
            여기서 stage는 단순한 일정표가 아닙니다. 입력 해상도, 한 update가
            보는 이미지 수, optimizer 상태처럼 학습의 의미를 정하는 값이 같은
            구간입니다. 그중 하나가 바뀌면 이전 checkpoint를 사용하더라도 새
            stage로 구분해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="세 단계에서 이어지는 상태"
          items={[
            {
              term: "기준 학습",
              description:
                "160px 이미지와 사람 label로 checkpoint c0를 만듭니다.",
            },
            {
              term: "해상도 전환",
              description:
                "c0의 weight를 넘겨받되 320px 입력과 새 batch 구성을 사용합니다.",
            },
            {
              term: "임시 label",
              description:
                "label이 없는 이미지의 약한 변형에서 확신한 답을 강한 변형의 학습 목표로 사용합니다.",
            },
            {
              term: "변경 축",
              description:
                "각 단계에서 무엇을 바꿨는지 하나씩 분리해야 결과의 원인을 설명할 수 있습니다.",
            },
          ]}
        />
        <ContentBoundary article="image-training-stages" />
      </section>

      <section id="resolution-stage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">해상도 전환</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            160px에서 320px로 바꾸면 픽셀 수가 네 배가 되어 한 GPU에 넣을 수
            있는 이미지 수가 줄어들 수 있습니다. 이때 device별 batch만 비교하면
            한 optimizer update가 실제로 몇 장을 보았는지 놓칩니다. device 수와
            gradient 누적 횟수까지 곱한 effective batch를 비교해야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="해상도를 바꾼 두 단계에서 한 update가 보는 이미지 수를 어떻게 맞추나요?"
          idea={
            <p>
              한 GPU의 이미지 수에 GPU 수와 update 전 누적 횟수를 차례로
              곱합니다.
            </p>
          }
          formula={String.raw`B_{\rm eff}=B_{\rm device}\,G\,A_g`}
          annotatedFormula={String.raw`\begin{aligned}B_{\rm step}&=\underbrace{B_{\rm device}G}_{\substack{\text{모든 GPU가 한 번에 본}\\\text{이미지 수}}}\\[4pt]B_{\rm eff}&=\underbrace{B_{\rm step}A_g}_{\substack{\text{optimizer를 갱신하기 전}\\\text{누적한 전체 이미지 수}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`B_{\rm device}G`,
              annotation: [
                "한 GPU의 batch에 GPU 수를 곱해",
                "한 micro-step의 전체 이미지 수를 구함",
              ],
            },
            {
              expression: String.raw`B_{\rm step}A_g`,
              annotation: [
                "micro-step 이미지 수에 누적 횟수를 곱해",
                "한 optimizer update의 이미지 수를 구함",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`B_{\rm device}`,
              name: "GPU당 batch",
              description: "한 GPU가 micro-step 한 번에 읽는 이미지 수입니다.",
            },
            {
              symbol: "G",
              name: "GPU 수",
              description: "같은 gradient를 만드는 GPU의 개수입니다.",
            },
            {
              symbol: String.raw`A_g`,
              name: "누적 횟수",
              description:
                "optimizer를 한 번 갱신하기 전에 gradient를 더하는 micro-step 수입니다.",
            },
          ]}
          assumptions={[
            "마지막에 남는 불완전 batch와 반복 sampling은 계산에서 제외했습니다.",
            "두 단계가 같은 4개 GPU를 사용한다고 가정했습니다.",
            "effective batch가 같아도 입력의 픽셀 수와 crop 분포는 다릅니다.",
          ]}
          interpretation="S0은 64×4×1=256장, S1은 16×4×4=256장입니다. update당 표본 수를 맞춘 뒤에야 해상도 변경의 영향을 조금 더 분리해서 볼 수 있습니다."
        />
        <BatchHandoffLedger />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            checkpoint에는 model weight만 있는 것이 아닙니다. optimizer의
            momentum이나 Adam moment, 현재 learning-rate 위치도 다음 update에
            영향을 줍니다. 따라서 해상도 단계가 무엇을 넘겨받았는지 명시해야
            합니다. ViT처럼 위치 표현이 입력 격자 크기와 연결된 모델은 position
            embedding을 새 격자에 맞추는 과정도 필요합니다. 이 과정은{" "}
            <Link to="/cs/ai/vision-transformer#positional-embedding">
              Vision Transformer의 위치 표현
            </Link>
            에서 더 깊게 다룹니다.
          </p>
        </div>
      </section>

      <section id="pseudo-label" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">임시 label 통과</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            해상도 단계를 분리한 뒤에는 label이 없는 이미지 한 장이 학습에
            들어오는 경로를 볼 수 있습니다. <code>u-042</code>를 약하게 바꾼
            화면에서 모델이 신발이라고 .96만큼 확신하고, 기준 .95를 넘을 때만
            ‘신발’을 임시 label로 사용합니다. 그다음 같은 이미지를 강하게 바꾼
            화면에서도 신발을 예측하도록 학습합니다.
          </p>
        </div>
        <ExplainedFormula
          question="u-042는 언제 loss에 들어가고, 무엇을 줄이나요?"
          idea={
            <p>
              약한 변형에서 가장 큰 확률이 기준을 넘을 때만 그 class를 임시
              label로 삼아 강한 변형의 cross-entropy를 계산합니다.
            </p>
          }
          formula={String.raw`\mathcal L_u=\mathbf1[q_{\max}\ge\tau]\operatorname{CE}(\widehat y,r)`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{p_\theta(y\mid a_w(u))}_{\text{약한 변형에서 class 확률 계산}}\\[4pt]\widehat y&=\underbrace{\arg\max_c q_c}_{\text{가장 큰 확률의 class를 임시 label로 선택}}\\[4pt]I_\tau&=\underbrace{\mathbf1[\max_c q_c\ge\tau]}_{\text{기준을 넘으면 1, 아니면 0}}\\[4pt]\mathcal L_u&=\underbrace{I_\tau\operatorname{CE}(\widehat y,p_\theta(y\mid a_s(u)))}_{\text{통과한 이미지의 강한 변형에서만 loss 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p_\theta(y\mid a_w(u))`,
              annotation: [
                "label 없는 이미지를 약하게 바꿔",
                "현재 class 확률을 읽음",
              ],
            },
            {
              expression: String.raw`\arg\max_cq_c`,
              annotation: ["가장 큰 확률의 class를 골라", "임시 label을 만듦"],
            },
            {
              expression: String.raw`\mathbf1[\max_cq_c\ge\tau]`,
              annotation: [
                "가장 큰 확률과 기준을 비교해",
                "loss에 포함할지 결정함",
              ],
            },
            {
              expression: String.raw`I_\tau\operatorname{CE}(\widehat y,r)`,
              annotation: [
                "통과 표시와 cross-entropy를 곱해",
                "강한 변형의 예측을 임시 label에 가까이 보냄",
              ],
            },
          ]}
          terms={[
            {
              symbol: "u",
              name: "label 없는 이미지",
              description: "이 예시에서는 u-042입니다.",
            },
            {
              symbol: String.raw`a_w,a_s`,
              name: "약한 변형·강한 변형",
              description:
                "임시 답을 읽는 화면과 그 답을 유지하도록 연습하는 화면입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "확신 기준",
              description: "임시 label을 loss에 넣기 위한 최소 확률입니다.",
            },
            {
              symbol: String.raw`I_\tau`,
              name: "통과 표시",
              description: "기준을 넘으면 1, 넘지 못하면 0입니다.",
            },
          ]}
          assumptions={[
            "약한 변형과 강한 변형이 이미지의 class 의미를 바꾸지 않는다고 가정합니다.",
            "label이 없는 이미지가 학습하려는 class 범위 안에 있다고 가정합니다.",
            ".95는 설명용 기준이며, 정답임을 보장하는 확률이 아닙니다.",
          ]}
          interpretation="u-042에서는 .96≥.95이므로 통과 표시가 1입니다. 강한 변형의 신발 확률이 .72라면 이 이미지의 loss는 −ln(.72)=.3285입니다."
        />
        <PseudoLabelLedger />
        <div id="paper-fixmatch" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Sohn et al. — FixMatch"
            href="https://proceedings.neurips.cc/paper/2020/hash/06964dce9addb1c5cb5d6e3d9838f733-Abstract.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>질문.</strong> 적은 label과 많은 label 없는 이미지를
                어떻게 함께 학습에 사용할 수 있을까요?
              </p>
              <p>
                <strong>방법.</strong> 약한 변형에서 confidence가 높은 예측을
                임시 label로 고르고, 강한 변형의 예측이 그 label을 따르게
                합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문이 사용한 label 수, dataset,
                augmentation과 model 조건에서의 benchmark와 ablation입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> confidence 기준 하나가 범위 밖
                이미지나 class 불균형에서 임시 label의 정답을 보장한다는 뜻은
                아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">바뀐 원인 분리</h2>
        <StageFailureBoundaryViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 출발 checkpoint에서 해상도만 바꾼 가지와 임시 label만 추가한
            가지를 따로 보면 각 변화가 결과에 미친 방향을 구분할 수 있습니다. 두
            변화를 동시에 적용한 결과 하나만 남기면 품질이 올라도 어느 변화가
            기여했는지, 품질이 떨어져도 어느 변화가 원인인지 설명할 수 없습니다.
          </p>
          <p>
            이것이 stage를 나누는 이유입니다. stage는 학습 순서를 보기 좋게
            표시하는 이름이 아니라, 달라진 조건과 이어받은 상태를 분리해 결과를
            해석하는 경계입니다.
          </p>
        </div>
        <div id="paper-fixres" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Touvron et al. — Fixing the train-test resolution discrepancy"
            href="https://proceedings.neurips.cc/paper/9035-fixing-the-train-test-resolution-discrepancy.pdf"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>질문.</strong> 학습과 평가에서 crop·해상도가 달라질 때
                물체가 차지하는 상대 크기의 차이를 어떻게 다뤄야 할까요?
              </p>
              <p>
                <strong>방법.</strong> 학습·평가 해상도와 scale의 관계를
                명시하고, 평가 해상도에 맞춰 classifier 계층을 미세 조정합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문의 모델, dataset, crop과
                fine-tuning 조건에서 측정한 결과입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 해상도를 높이는 것만으로 없던 세부
                정보가 생기거나 모든 이미지 과제의 성능이 오른다는 뜻은
                아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>

        <ImageClassificationMapReturn current="training-stages" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>스스로 확인하기</h3>
          <ol>
            <li>
              160px 단계와 320px 단계가 모두 update당 256장을 보도록 만든 계산은
              무엇인가요? <strong>(답: 해상도 전환)</strong>
            </li>
            <li>
              u-042의 .96이 .95를 넘은 뒤 .72가 loss .3285로 바뀌는 순서를
              설명할 수 있나요? <strong>(답: 임시 label 통과)</strong>
            </li>
            <li>
              해상도와 임시 label을 한 번에 바꾸면 결과의 원인을 말할 수 없는
              이유는 무엇인가요? <strong>(답: 바뀐 원인 분리)</strong>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
