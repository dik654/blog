import ExplainedFormula from "@/components/ui/explained-formula";
import TrainInferenceGapViz from "./viz/TrainInferenceGapViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Training({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Teacher forcing은 objective 계산을 단순화하지만 inference prefix와 다르다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Training에서는 target sequence를 한 칸 오른쪽으로 이동해 이전 정답 token을
          decoder input으로 준다. 이를 teacher forcing이라고 한다. 각 step이 올바른 prefix에
          조건부이므로 token-level negative log-likelihood를 안정적으로 계산할 수 있지만,
          recurrent decoder state는 여전히 이전 step에 의존해 시간축 전체가 완전히 병렬화되지는 않는다.
        </p>
      </div>

      <ExplainedFormula
        question="Padding이 섞인 target batch에서 어떤 token만 training loss에 포함할까?"
        idea={<>정답 prefix로 각 position의 conditional probability를 계산하고, 실제 target token인 위치만 mask mₜ=1로 남긴 뒤 유효 token 수로 평균냅니다.</>}
        formula={String.raw`\begin{aligned}p_t^*&=P_\theta(y_t^*\mid y_{<t}^*,X)\\N&=\sum_{t=1}^{T}m_t\\\mathcal L_{\rm TF}&=-\frac{1}{N}\sum_{t=1}^{T}m_t\log p_t^*\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}p_t^*&=\underbrace{P_\theta(y_t^*\mid y_{<t}^*,X)}_{\text{허용 경계 판정}}\\N&=\underbrace{\sum_{t=1}^{T}m_t}_{\text{valid-token mask 계산}}\\\mathcal L_{\rm TF}&=\underbrace{-\frac{1}{N}\sum_{t=1}^{T}m_t\log p_t^*}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`P_\theta(y_t^*\mid y_{<t}^*,X)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","정답 prefix로 각 position의 conditional","probability를 계산하고, 실제 target","token인 위치만 mask mₜ=1로 남긴 뒤 유효"] },
          { expression: String.raw`\sum_{t=1}^{T}m_t`, annotation: ["valid-token mask이(가) 식의 결과에 기여하는","방식을 계산합니다.","정답 prefix로 각 position의 conditional","probability를 계산하고, 실제 target"] },
          { expression: String.raw`-\frac{1}{N}\sum_{t=1}^{T}m_t\log p_t^*`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","정답 prefix로 각 position의 conditional","probability를 계산하고, 실제 target","token인 위치만 mask mₜ=1로 남긴 뒤 유효"] },
        ]}
        terms={[
          { symbol: "y_t^*", name: "gold target", description: "Dataset이 제공한 timestep t의 정답 token입니다." },
          { symbol: "y_{<t}^*", name: "gold prefix", description: "Teacher forcing에서 decoder가 조건으로 받는 정답 prefix입니다." },
          { symbol: "m_t", name: "valid-token mask", description: "Padding과 loss에서 제외할 위치를 0으로 만드는 mask입니다." },
          { symbol: "\\sum_t m_t", name: "normalizer", description: "Batch마다 실제 token 수가 달라도 token 평균을 맞춥니다." },
        ]}
        assumptions={["Cross-entropy reduction을 token 평균으로 정의한 예입니다.", "Label smoothing·class weight를 적용하면 target distribution과 가중합이 달라집니다."]}
        interpretation="낮은 teacher-forced loss는 정답 prefix에서의 conditional modeling을 측정한다. Model이 만든 prefix에서의 recovery와 search quality를 자동으로 보장하지 않습니다."
      />
      <CodeViewButton
        onClick={() => onCodeRef("training-loop", codeRefs["training-loop"])}
      />

      <TrainInferenceGapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          작은 계산으로 mask의 역할을 확인할 수 있다. 정답 probability가 0.8, 0.5인
          두 token 뒤에 padding 하나가 있다면 mask는 (1,1,0), 유효 token 수는 2다.
          따라서 token-average NLL은 −(log 0.8+log 0.5)/2≈0.458이며 padding의
          probability는 합과 분모에 모두 들어가지 않는다.
        </p>
        <h3>Exposure bias는 진단할 현상이지 단일 원인으로 단정할 수 없다</h3>
        <p>
          Inference에서는 정답 prefix를 알 수 없으므로 model이 선택한 token을 다음 input으로
          사용한다. Scheduled sampling은 training input을 점차 model sample로 바꾸는
          curriculum을 제안했지만 task와 estimator에 따라 trade-off가 있으며 보편적인
          개선 공식은 아니다. 더 최근의 분석은 model의 self-recovery 때문에 오류가 항상
          누적되는 것은 아니라는 결과도 보고하므로, prefix perturbation과 sequence metric으로
          실제 failure를 측정한 뒤 intervention을 고른다.
        </p>
      </div>

      <div id="paper-scheduled-sampling" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · Prefix curriculum</p>
        <p className="mt-2 text-sm font-semibold">Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">정답 prefix만 주는 training과 model prefix를 쓰는 inference의 차이를 줄이기 위해, training 중 입력을 정답 token에서 model sample로 점차 바꾸는 curriculum을 제안합니다. 논문이 다룬 recurrent sequence task의 실험 결과이며, 어떤 schedule도 모든 task에서 일관되게 좋아진다는 보장은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://proceedings.neurips.cc/paper/2015/hash/e995f98d56967d946471af29d7bf99f1-Abstract.html" target="_blank" rel="noreferrer">원 논문과 schedule 보기</a>
      </div>

      <div id="paper-self-recovery" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · 통념의 적용 범위</p>
        <p className="mt-2 text-sm font-semibold">Exposure Bias versus Self-Recovery</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Model이 이전 오류를 언제나 계속 증폭한다는 설명을 그대로 받아들이지 않고, perturbed prefix 뒤에서 정상 trajectory로 회복하는 현상을 측정합니다. 이 결과는 train–inference 조건 차이가 사라졌다는 뜻이 아니라, 실제 failure를 prefix perturbation과 sequence metric으로 확인해야 한다는 근거입니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://aclanthology.org/2021.emnlp-main.415/" target="_blank" rel="noreferrer">논문과 평가 설정 보기</a>
      </div>
    </section>
  );
}
