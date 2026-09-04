import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { AugmentationContractViz } from "./viz/ModernAugmentationViz";

export default function DataAugmentationFoundationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Data augmentation은 사진을 많이 만드는 일이 아니라 허용할 변화를 정의하는 일입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">같은 상품을 조금 옆에서 찍거나 조명이 달라져도 상품 ID는 그대로입니다. 반대로 숫자 6을 뒤집거나 신호등 색을 바꾸면 정답이 달라질 수 있습니다. Augmentation은 <strong>배포에서 생길 변화 중 target 의미를 보존하는 범위</strong>를 training에 넣는 모델링입니다.</p>
          <p>
            transform 이름부터 고르지는 않습니다. 무엇이 달라질 수 있는지, 무엇은 반드시 같아야 하는지, target을 그대로 둘지 함께 바꿀지를 차례로 적는 게 먼저입니다.
          </p>
        </div>
        <TermBreakdown title="처음 구분할 세 용어" items={[
          { term: "Label-preserving transformation", description: "Input은 달라져도 현재 task의 target 의미는 유지되는 변화입니다.", example: "상품 분류에서 작은 crop과 밝기 변화.", boundary: "좌우 방향·색·시간이 target인 task에서는 같은 변환이 허용되지 않을 수 있습니다." },
          { term: "Augmentation distribution", description: "Transform 종류뿐 아니라 적용 확률·parameter 범위·순서를 함께 정한 sampling policy입니다.", example: "확률 0.5 flip 뒤 ±10% brightness." },
          { term: "Target map", description: "Sampling한 같은 parameter로 class·box·mask·keypoint·soft label을 유효한 target으로 갱신하는 함수입니다.", example: "Image를 오른쪽으로 12px 옮기면 box의 x 좌표도 12px 이동." },
        ]} />
        <AugmentationContractViz />
        <ContentBoundary article="data-augmentation" />
      </section>

      <section id="target-map" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Input transform T와 target map τ는 한 장의 receipt입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Classification label은 그대로일 수 있지만 detection box와 segmentation mask는 그렇지 않습니다. Random angle을 image와
            annotation에서 따로 뽑으면 눈으로는 그럴듯해도 정답이 어긋난 pair가 됩니다. Receipt에는 source ID·transform revision·sampled
            parameter·target-map revision을 함께 둡니다.
          </p>
        </div>
      </section>

      <section id="objective" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">허용한 변화는 training objective의 expectation이 됩니다</h2>
        <ExplainedFormula
          question="한 원본 sample이 transformation distribution 전체의 학습 신호가 되는 동안 각 연산은 무엇을 하나요?"
          idea={<p>
            Policy에서 parameter ω를 뽑은 다음 같은 ω로 input과 target을 바꾸고 loss를 계산합니다. 마지막에 sample과 transform
            randomness를 평균합니다.
          </p>}
          formula={String.raw`\begin{aligned}x_i'&=T_{\omega}(x_i),\quad y_i'=\tau_{\omega}(y_i)\\L_i(\omega)&=\ell(f_\theta(x_i'),y_i')\\\bar L_i&=\mathbb E_{\omega\sim\mathcal A}[L_i(\omega)]\\\widehat R_{\rm aug}(\theta)&=\frac1N\sum_{i=1}^N\bar L_i\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\omega&\sim\underbrace{\mathcal A}_{\text{policy에서 parameter sampling}}\\x_i'&=\underbrace{T_\omega(x_i)}_{\text{sampled input 생성}}\\y_i'&=\underbrace{\tau_\omega(y_i)}_{\text{같은 parameter로 target 갱신}}\\L_i(\omega)&=\underbrace{\ell(f_\theta(x_i'),y_i')}_{\text{변환된 pair의 error 계산}}\\\bar L_i&=\underbrace{\mathbb E_{\omega\sim\mathcal A}[L_i(\omega)]}_{\text{transform randomness 평균}}\\\widehat R_{\rm aug}(\theta)&=\underbrace{\frac1N\sum_{i=1}^N\bar L_i}_{\text{training sample 평균}}\end{aligned}`}
          operations={[
            { expression: String.raw`\omega\sim\mathcal A`, annotation: ["policy에서 한 transform parameter를 뽑아", "이번 training pair의 변화를 고정"] },
            { expression: String.raw`T_\omega(x_i)`, annotation: ["source input에 변화를 적용해", "model이 읽을 augmented input 생성"] },
            { expression: String.raw`\tau_\omega(y_i)`, annotation: ["같은 random parameter를 target에 적용해", "input과 정답의 의미를 동기화"] },
            { expression: String.raw`\frac1N\sum_i\mathbb E_\omega`, annotation: ["원본 sample과 transform 결과를 평균해", "허용 변화 전체에서 낮은 risk를 요구"] },
          ]}
          terms={[
            { symbol: String.raw`\mathcal A`, name: "Augmentation distribution", description: "Transform family·범위·확률·순서를 포함한 policy입니다." },
            { symbol: String.raw`\omega`, name: "Sampled parameter", description: "이번 step에서 실제 사용한 angle·crop·strength·mask입니다." },
            { symbol: String.raw`\tau_\omega`, name: "Target map", description: "Class·coordinate·probability target을 같은 parameter로 갱신합니다." },
            { symbol: String.raw`\ell`, name: "Task loss", description: "변환된 input prediction과 유효한 target을 비교합니다." },
          ]}
          assumptions={["Transformation policy가 실제 deployment variation을 근사합니다.", "Input과 target이 동일한 sampled parameter를 공유합니다.", "Policy fit과 sampling은 training split 안에서만 일어납니다."]}
          interpretation="Augmentation은 file count가 아니라 empirical risk를 바꿉니다. Policy가 현실보다 넓으면 invariance가 아니라 label noise를 학습합니다."
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">첫 release gate는 더 강한 policy가 아니라 label counterexample입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            변환 전후 target이 달라지는 fixture, annotation이 어긋나는 fixture, validation sample을 source로 사용한 fixture를 먼저
            실패시킵니다. transform strength와 probability를 tuning하는 것은 그 뒤입니다.
          </p></div>
        <div id="paper-randaugment" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Cubuk et al. — RandAugment" href="https://arxiv.org/abs/1909.13719">Operation 수와 공통 magnitude로 augmentation search space를 줄인 방법입니다. 논문 dataset·model·operation set의 결과이지 두 parameter가 어떤 task의 label invariance도 자동으로 발견한다는 뜻은 아닙니다.</CitationBlock></div>
      </section>
    </div>
  );
}
