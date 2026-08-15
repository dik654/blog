import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { QATLoopViz } from "../quantization/viz/ModernQuantizationViz";

export default function QuantizationAwareTrainingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          QAT는 배포 오차를 forward에 보여 주는 재학습입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Quantization-aware training</strong>은 float master weight를
            유지하면서 forward에 quantize–dequantize를 삽입해 rounding·clipping
            오차를 학습 중 노출하는 방법입니다.
          </p>
          <p>
            PTQ가 quality gate를 통과하지 못하고 data·compute를 쓸 수 있을 때
            후보가 됩니다. <a href="/ai/ptq-calibration">PTQ calibration</a>과
            달리 optimizer trajectory가 새로 생깁니다.
          </p>
        </div>
        <TermBreakdown
          title="QAT loop의 네 물체"
          items={[
            {
              term: "Float master weight",
              description:
                "Optimizer가 실제로 갱신하는 고정밀 parameter입니다.",
              example: "Adam moments도 float master와 연결됩니다.",
              boundary: "저장용 low-bit code와 같은 tensor가 아닙니다.",
            },
            {
              term: "Fake quantizer",
              description:
                "Forward에서 round·clip한 뒤 즉시 float로 복원합니다.",
              example: "다음 float operator가 low-bit error를 보게 합니다.",
              boundary:
                "실제 integer kernel 실행과 동일하다고 단정하지 않습니다.",
            },
            {
              term: "STE",
              description: "Backward에서 쓸 surrogate derivative입니다.",
              example: "Range 안에서 ∂FQ/∂x≈1로 둡니다.",
              boundary: "Round의 참 derivative가 아닙니다.",
            },
            {
              term: "Converted artifact",
              description:
                "학습 graph를 실제 deployable operator와 packing으로 바꾼 결과입니다.",
              example: "Fallback op와 kernel revision을 기록합니다.",
              boundary:
                "Fake-quant checkpoint score만으로 release하지 않습니다.",
            },
          ]}
        />
        <QATLoopViz />
        <ContentBoundary article="quantization-aware-training" />
      </section>
      <section id="fake-quant" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Forward는 계단형 quantizer를 그대로 통과합니다
        </h2>
        <ExplainedFormula
          question="Fake quantization은 왜 quantize 뒤 곧바로 dequantize하나요?"
          idea={
            <p>
              Low-bit code의 오차를 만들되 나머지 training graph는 float tensor
              interface를 유지하기 위해서입니다.
            </p>
          }
          formula={String.raw`q=Q(x;s,z),\quad \hat x=s(q-z),\quad L=L(f_{\theta}(\hat x),y)`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{Q(x;s,z)}_{\text{low-bit 오차 생성}}\\\hat x&=\underbrace{s(q-z)}_{\text{float graph로 복원}}\\\hat y&=\underbrace{f_\theta(\hat x)}_{\text{오차를 포함해 예측}}\\L&=\underbrace{L(\hat y,y)}_{\text{target과 비교}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`Q(x;s,z)`,
              annotation: [
                "scale·zero-point를 적용해",
                "discrete forward error 생성",
              ],
            },
            {
              expression: String.raw`s(q-z)`,
              annotation: [
                "code를 float 단위로 복원해",
                "다음 training operator에 전달",
              ],
            },
            {
              expression: String.raw`L(f_\theta(\hat x),y)`,
              annotation: [
                "오차가 포함된 prediction과 target을 비교해",
                "학습 signal 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "Q",
              name: "Quantize operator",
              description: "Round·clip을 수행합니다.",
            },
            {
              symbol: String.raw`\hat x`,
              name: "Fake-quantized value",
              description: "Low-bit 오차를 가진 float tensor입니다.",
            },
            {
              symbol: "L",
              name: "Task loss",
              description: "Quantized forward output을 평가합니다.",
            },
          ]}
          assumptions={[
            "Float master parameter를 유지합니다.",
            "Observer·scale freeze 시점을 recipe에 기록합니다.",
            "Fake graph와 target backend semantics를 대조합니다.",
          ]}
          interpretation="QAT가 학습하는 것은 low-bit code를 없애는 법이 아니라, 그 code가 만드는 오차를 견디는 parameter 배치입니다."
        />
      </section>
      <section id="ste" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Backward는 round를 그대로 미분하지 않습니다
        </h2>
        <ExplainedFormula
          question="Round의 derivative가 0인데 gradient를 어떻게 전달하나요?"
          idea={
            <p>
              Representable range 안에서는 fake quantizer를 identity처럼,
              밖에서는 포화 gate처럼 근사합니다.
            </p>
          }
          formula={String.raw`\frac{\partial \hat x}{\partial x}\approx\mathbf1[r_{\min}\le x\le r_{\max}],\quad \frac{\partial L}{\partial x}\approx\frac{\partial L}{\partial\hat x}\mathbf1[x\in R]`}
          annotatedFormula={String.raw`\begin{aligned}\frac{\partial \hat x}{\partial x}&\approx\underbrace{\mathbf1[r_{\min}\le x\le r_{\max}]}_{\substack{\text{range 안에서는 identity처럼 1}\\\text{포화된 밖에서는 0}}}\\\frac{\partial L}{\partial x}&\approx\underbrace{\frac{\partial L}{\partial\hat x}}_{\text{upstream gradient}}\underbrace{\mathbf1[x\in R]}_{\text{STE gate로 전달 여부 결정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[x\in R]`,
              annotation: [
                "현재 값이 representable range인지 검사해",
                "gradient 통과 여부 결정",
              ],
            },
            {
              expression: String.raw`(\partial L/\partial\hat x)\mathbf1[x\in R]`,
              annotation: [
                "upstream gradient에 gate를 곱해",
                "float master로 보낼 surrogate 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R",
              name: "Representable range",
              description: "현재 scale이 표현하는 float 구간입니다.",
            },
            {
              symbol: String.raw`\partial L/\partial\hat x`,
              name: "Upstream gradient",
              description: "뒤쪽 graph에서 돌아온 loss 변화율입니다.",
            },
            {
              symbol: "STE",
              name: "Straight-through estimator",
              description:
                "Discrete operation을 위한 근사 backward rule입니다.",
            },
          ]}
          assumptions={[
            "STE variant마다 range 밖과 scale gradient 정의가 다릅니다.",
            "이 근사는 true derivative나 discrete optimum을 보장하지 않습니다.",
            "Optimizer·data·normalization state도 recipe 일부입니다.",
          ]}
          interpretation="Forward와 backward가 의도적으로 다른 규칙을 쓰므로, training graph와 export graph의 parity 검증이 필수입니다."
        />
      </section>
      <section id="release" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Converted artifact에서 다시 시작합니다
        </h2>
        <div id="paper-integer-qat" className="scroll-mt-24">
          <CitationBlock
            source="Integer-Arithmetic-Only Inference"
            citeKey={1}
            href="https://arxiv.org/abs/1712.05877"
          >
            <strong>문제:</strong> integer-only hardware에서 효율적으로
            inference함. <strong>기여:</strong> affine quantization과 QAT
            procedure를 함께 제시. <strong>전제:</strong> 당시
            MobileNet·ImageNet·COCO·CPU 조건. <strong>근거 범위:</strong> 논문의
            training·integer inference 설계. <strong>과장 금지:</strong> 현대
            LLM·FP8·모든 accelerator에 같은 recipe를 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
