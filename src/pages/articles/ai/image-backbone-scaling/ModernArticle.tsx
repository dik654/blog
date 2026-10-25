import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ImageClassificationPathLocator, {
  ImageClassificationMapReturn,
} from "../image-classification-pipeline/ImageClassificationPathLocator";
import {
  ImageBackboneBudgetViz,
  RuntimeFrontierViz,
} from "./viz/ImageBackboneBudgetViz";

function ResolutionLedger() {
  const rows = [
    {
      label: "한 축의 patch 수",
      arithmetic: "224 px ÷ 16 px/patch = 14 patches",
      reason: "사진 한 변을 patch 한 변으로 나눕니다.",
    },
    {
      label: "전체 image token 수",
      arithmetic: "14 patches × 14 patches = 196 tokens",
      reason: "높이와 너비의 patch 위치를 곱합니다.",
    },
    {
      label: "전역 attention score 항목",
      arithmetic: "196 queries × 196 keys = 38,416 entries",
      reason: "한 head·한 layer에서 모든 query와 key의 조합을 셉니다.",
    },
    {
      label: "448px 입력의 항목 수",
      arithmetic: "28² tokens → 784² = 614,656 entries",
      reason: "한 변이 두 배면 token은 네 배, token 쌍은 열여섯 배가 됩니다.",
    },
    {
      label: "증가율",
      arithmetic: "614,656 ÷ 38,416 = 16×",
      reason: "같은 head·layer·patch 크기의 score matrix를 비교합니다.",
    },
  ] as const;

  return (
    <div
      className="not-prose my-8 border-y border-border"
      aria-label="224픽셀과 448픽셀 입력의 attention score 항목 수 계산"
    >
      <p className="py-3 text-xs font-bold text-primary">
        계산을 한 줄씩 확인하기
      </p>
      <ol className="divide-y divide-border">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className="grid gap-2 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-start"
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
              {row.reason}
            </p>
          </li>
        ))}
      </ol>
      <p className="border-t border-border py-3 text-xs leading-5 text-muted-foreground">
        여기서는 special token, 여러 head와 layer, QKV projection, MLP,
        activation, cache와 kernel 차이를 세지 않습니다. 이 계산은 전역
        attention의 score matrix가 해상도에 따라 얼마나 빨리 커지는지 보여주는
        구조적 비교입니다.
      </p>
    </div>
  );
}

export default function ImageBackboneScalingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <ImageClassificationPathLocator current="backbone-budget" />
        <h2 className="mb-6 text-2xl font-bold">같은 이미지, 다른 계산</h2>
        <ImageBackboneBudgetViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              Backbone의 이름만으로는 이미지 한 장의 실행 비용을 알 수 없습니다.
            </strong>{" "}
            입력 해상도와 공간 정보를 섞는 방식이 함께 정해져야 계산량과
            메모리가 구체적인 모양을 갖습니다. 같은 사진의 한 변을 두 배로
            키우면 CNN이 훑는 공간 위치는 네 배가 되지만, 모든 patch token 쌍을
            비교하는 전역 attention의 score matrix는 열여섯 배가 됩니다.
          </p>
          <p>
            Backbone은 픽셀을 여러 작업에서 다시 쓸 수 있는 표현으로 바꾸는
            모델의 본체입니다. 분류 head는 그 표현을 class logit으로 바꿉니다.
            그래서 이 글에서는 모델 이름을 나열하지 않고, 같은 사진이 표현으로
            바뀌는 경로와 해상도 비용을 먼저 추적합니다. ViT 내부 tensor 모양은{" "}
            <Link to="/cs/ai/vision-transformer">Vision Transformer</Link>에서
            더 깊게 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="비교 전에 고정할 네 가지"
          items={[
            {
              term: "공간 상호작용",
              description:
                "CNN의 local convolution, ViT의 global attention처럼 위치 정보를 섞는 규칙입니다.",
            },
            {
              term: "입력 계약",
              description:
                "해상도·patch 크기·색 순서·정규화가 weight의 학습 조건과 맞아야 합니다.",
            },
            {
              term: "크기 조절 축",
              description:
                "Depth·width·resolution 가운데 무엇을 얼마나 바꿨는지 따로 기록합니다.",
            },
            {
              term: "실행 조건",
              description:
                "같은 장비·정밀도·batch·동시성에서 품질과 지연·처리량·메모리를 측정합니다.",
            },
          ]}
        />
        <ContentBoundary article="image-backbone-scaling" />
      </section>

      <section id="resolution-cost" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">해상도 비용</h2>
        <ExplainedFormula
          question="정사각 이미지의 한 변 r을 두 배로 키우면 CNN의 공간 위치와 ViT의 전역 attention score 항목은 얼마나 늘어날까요?"
          idea={
            <p>
              Patch 한 변 P를 고정하면 한 축의 patch 수는 r/P입니다. 전체 image
              token은 두 축의 patch 수를 곱하고, 전역 attention은 그 token의
              모든 query–key 조합을 만듭니다.
            </p>
          }
          formula={String.raw`N=(r/P)^2,\quad C_{\rm pair}=N^2`}
          annotatedFormula={String.raw`\begin{aligned}n_{\rm axis}&=\underbrace{r/P}_{\substack{\text{사진 한 변을 patch 폭으로 나눠}\\\text{축별 patch 수 계산}}}\\[4pt]N&=\underbrace{n_{\rm axis}^2}_{\substack{\text{높이와 너비 위치를 곱해}\\\text{전체 image token 수 계산}}}\\[4pt]C_{\rm CNN}&\propto\underbrace{r^2}_{\text{공간 위치 수에 비례}}\\[4pt]C_{\rm pair}&\propto\underbrace{N^2}_{\substack{\text{모든 query-key 조합을 만들어}\\\text{score matrix 항목 계산}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`r/P`,
              annotation: [
                "사진 길이를 patch 폭으로 나눠",
                "한 축의 token 위치를 구함",
              ],
            },
            {
              expression: String.raw`n_{\rm axis}^2`,
              annotation: [
                "두 공간 축의 위치 수를 곱해",
                "전체 image token을 구함",
              ],
            },
            {
              expression: String.raw`r^2`,
              annotation: [
                "높이와 너비를 곱해",
                "CNN의 공간 위치 증가율을 구함",
              ],
            },
            {
              expression: String.raw`N^2`,
              annotation: [
                "query 수와 key 수를 곱해",
                "전역 attention 항목 수를 구함",
              ],
            },
          ]}
          terms={[
            {
              symbol: "r",
              name: "입력 한 변",
              description: "정사각형으로 단순화한 사진 한 변의 픽셀 수입니다.",
            },
            {
              symbol: "P",
              name: "Patch 한 변",
              description:
                "Image token 하나로 묶는 patch 한 변의 픽셀 수입니다.",
            },
            {
              symbol: "N",
              name: "Image tokens",
              description: "Special token을 제외한 patch 위치 수입니다.",
            },
            {
              symbol: String.raw`C_{\rm pair}`,
              name: "Score matrix 항목",
              description:
                "한 attention head·한 layer에서 query와 key를 짝지은 항목 수입니다.",
            },
          ]}
          assumptions={[
            "Patch 크기와 layer의 depth·width는 고정합니다.",
            "전역 attention의 score matrix 항목만 비교합니다. Local/window attention은 다른 증가율을 가질 수 있습니다.",
            "FLOPs는 실제 지연이 아닙니다. Memory traffic과 kernel 실행은 목표 장비에서 측정합니다.",
          ]}
          interpretation="P=16이면 224px에서 196 tokens와 38,416 pair entries가 생깁니다. 448px에서는 784 tokens와 614,656 entries가 생기므로 token은 4배, pair entries는 16배입니다."
        />
        <ResolutionLedger />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 계산이 알려 주는 것은 정확한 latency가 아니라{" "}
            <strong>증가 방향</strong>
            입니다. CNN도 layer와 channel 수에 따라 실제 연산량이 달라지고,
            ViT도 window attention이나 token 축소를 쓰면 전역 N² 경로와
            달라집니다. 따라서 구조식은 비싼 후보를 미리 가려내는 데 쓰고, 남은
            후보는 같은 실행 환경에서 측정해야 합니다.
          </p>
        </div>
      </section>

      <section id="compound-scaling" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">세 축을 함께 키우기</h2>
        <ExplainedFormula
          question="EfficientNet의 compound scaling은 depth·width·resolution을 한 단계에서 어떻게 함께 움직일까요?"
          idea={
            <p>
              한 축만 계속 키우지 않고 공통 단계 φ가 늘 때마다 세 축을 미리 찾은
              비율로 함께 키웁니다. Convolutional compute가 depth에는 선형,
              width와 resolution에는 대략 제곱으로 반응한다는 근사를 사용합니다.
            </p>
          }
          formula={String.raw`d=\alpha^\phi,\quad w=\beta^\phi,\quad r=\gamma^\phi`}
          annotatedFormula={String.raw`\begin{aligned}d&=\underbrace{\alpha^\phi}_{\text{block depth를 단계별 확대}}\\[3pt]w&=\underbrace{\beta^\phi}_{\text{channel width를 단계별 확대}}\\[3pt]r&=\underbrace{\gamma^\phi}_{\text{입력 한 변을 단계별 확대}}\\[3pt]2&\approx\underbrace{\alpha\beta^2\gamma^2}_{\substack{\text{세 축의 compute 효과를 곱해}\\\text{한 단계의 예산을 제한}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\alpha^\phi`,
              annotation: [
                "depth 비율을 단계 수만큼 누적해",
                "block 반복 수를 키움",
              ],
            },
            {
              expression: String.raw`\beta^\phi`,
              annotation: [
                "width 비율을 단계 수만큼 누적해",
                "channel 수를 키움",
              ],
            },
            {
              expression: String.raw`\gamma^\phi`,
              annotation: [
                "resolution 비율을 단계 수만큼 누적해",
                "공간 증거를 늘림",
              ],
            },
            {
              expression: String.raw`\alpha\beta^2\gamma^2`,
              annotation: ["세 축의 비용 증가를 곱해", "단계별 compute를 근사"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\phi`,
              name: "공통 단계",
              description:
                "Model family 전체의 크기를 한 칸 올리는 계수입니다.",
            },
            {
              symbol: String.raw`\alpha`,
              name: "Depth 비율",
              description: "한 단계마다 block 수를 늘리는 비율입니다.",
            },
            {
              symbol: String.raw`\beta`,
              name: "Width 비율",
              description: "한 단계마다 channel 수를 늘리는 비율입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "Resolution 비율",
              description: "한 단계마다 입력 한 변을 늘리는 비율입니다.",
            },
          ]}
          assumptions={[
            "EfficientNet 논문의 convolutional compute 근사와 B0 기준 탐색을 전제로 합니다.",
            "논문이 찾은 α=1.2, β=1.1, γ=1.15는 해당 탐색 조건의 결과입니다.",
            "Architecture·dataset·accelerator가 달라지면 비율과 실행 결과를 다시 검증합니다.",
          ]}
          interpretation="φ=1에서 1.2 × 1.1² × 1.15² = 1.92027이므로 한 단계의 convolutional compute가 약 2배가 됩니다. 이는 균형 있게 후보를 만드는 heuristic이지, 목표 GPU에서 가장 빠른 모델을 정하는 공식은 아닙니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            세 축을 함께 키운다는 말은 세 축의 효과가 같다는 뜻이 아닙니다.
            Depth는 표현을 여러 번 갱신하고, width는 한 번에 보관하는 channel
            수를 늘리며, resolution은 처음부터 더 많은 공간 위치를 만듭니다.
            Compound scaling은 이 세 가지를 한 resource 단계로 묶어 후보군을
            만드는 규칙입니다.
          </p>
        </div>
      </section>

      <section id="budget-comparison" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">실측으로 고르기</h2>
        <RuntimeFrontierViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pareto frontier에는 다른 후보가 모든 측정축에서 동시에 앞서지 못하는
            후보만 남습니다. 그림의 C는 B보다 품질이 낮으면서 더 느리고 메모리도
            더 사용하므로 제외할 수 있습니다. 반면 A와 B의 우열은 서비스가
            허용하는 지연·메모리 상한과 필요한 품질에 따라 달라집니다.
          </p>
          <p>
            이 글은 특정 Backbone을 고르지 않습니다. 같은 split과 입력 변환,
            weight 출처, 정밀도, batch, 동시성, 장비를 고정한 실험이 있어야
            환경별 선택을 내릴 수 있기 때문입니다. 그 선택과 롤백 기준은 별도의
            실무 글에서 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="한 행에 함께 기록할 값"
          items={[
            {
              term: "품질",
              description:
                "같은 split에서 macro recall·NLL·중요 slice와 seed별 편차를 계산합니다.",
            },
            {
              term: "지연",
              description:
                "같은 batch·정밀도·warmup·동시성에서 p50과 p95를 측정합니다.",
            },
            {
              term: "용량",
              description:
                "처리량·peak device memory·model artifact 크기를 함께 기록합니다.",
            },
            {
              term: "출처",
              description:
                "Pretraining data 범위, weight revision, license와 입력 변환을 보존합니다.",
            },
          ]}
        />

        <div id="paper-efficientnet" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Tan & Le — EfficientNet"
            href="https://proceedings.mlr.press/v97/tan19a.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 정해진 resource에서 ConvNet의
                depth·width·resolution을 어떻게 함께 늘릴지 정합니다.
              </p>
              <p>
                <strong>기여.</strong> 세 축을 하나의 compound coefficient로
                조절하는 scaling method를 제시합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문의 NAS
                baseline·ImageNet·transfer benchmark와 convolutional compute
                근사입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 논문의 계수와 모델 순위가 모든
                장비와 workload에서 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <div id="paper-convnext" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Liu et al. — ConvNeXt"
            href="https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Transformer 시대의 학습법과 구조 선택으로
                standard ConvNet을 다시 검토합니다.
              </p>
              <p>
                <strong>기여.</strong> ResNet의 학습법과 block을 단계적으로 바꾼
                ConvNeXt family를 제시합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문의 cumulative modernization
                ablation과 benchmark입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 하나의 block 변경이 모든 결과를
                만든다는 단일 원인 주장이 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <div id="paper-vit" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={3}
            source="Dosovitskiy et al. — Vision Transformer"
            href="https://openreview.net/forum?id=YicbFdNTTy"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Image patch에 표준 Transformer encoder를
                적용할 수 있는지 검증합니다.
              </p>
              <p>
                <strong>기여.</strong> Patch projection과 대규모 pretraining 뒤
                transfer하는 vision architecture를 제시합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 원 논문의 data·compute·fine-tuning
                조건과 image classification transfer 결과입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 작은 dataset에서 처음부터 학습한
                ViT가 항상 CNN보다 낫다는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>

        <ImageClassificationMapReturn current="backbone-budget" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>스스로 확인하기</h3>
          <ol>
            <li>
              224px를 448px로 키울 때 전역 attention score 항목이 왜 16배가
              되나요? <strong>(답: 해상도 비용)</strong>
            </li>
            <li>
              Compound scaling은 세 축의 최적값을 증명하나요?{" "}
              <strong>(답: 세 축을 함께 키우기)</strong>
            </li>
            <li>
              FLOPs가 더 작은 모델을 곧바로 배포 모델로 고르면 안 되는 이유는
              무엇인가요? <strong>(답: 실측으로 고르기)</strong>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
