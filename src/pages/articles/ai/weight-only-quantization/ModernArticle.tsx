import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { WeightOnlyMethodViz } from "../quantization/viz/ModernQuantizationViz";

export default function WeightOnlyQuantizationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Weight-only quantization은 weight를 줄이고 activation은 높은
          precision으로 남깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Weight-only quantization</strong>은 checkpoint weight를
            low-bit로 저장·읽되 activation과 보통의 accumulation은 더 높은
            precision으로 유지하는 배포 방식입니다.
          </p>
          <p>
            <a href="/ai/quantization">Quantizer 기초</a>에서 element error를
            배웠다면, 여기서는 실제 calibration input을 통과한 layer output을
            보존하는 이유를 봅니다.
          </p>
        </div>
        <TermBreakdown
          title="이름 하나에 섞이면 안 되는 네 층"
          items={[
            {
              term: "Method",
              description: "Low-bit weight를 만드는 보정 절차입니다.",
              example: "GPTQ와 AWQ가 여기에 해당합니다.",
              boundary: "INT4라는 숫자 format과 같은 말이 아닙니다.",
            },
            {
              term: "Numerical format",
              description: "Code가 값을 표현하는 방식입니다.",
              example: "INT4·NF4·FP8처럼 codebook이 다릅니다.",
              boundary: "같은 bit 수라도 표현값과 error가 다릅니다.",
            },
            {
              term: "Execution profile",
              description: "Weight·activation·KV·compute dtype 조합입니다.",
              example: "W4A16은 weights 4-bit, activation 16-bit입니다.",
              boundary: "KV dtype은 별도 설정일 수 있습니다.",
            },
            {
              term: "Container",
              description: "Tensor encoding과 metadata를 담는 file 규격입니다.",
              example: "GGUF는 여러 quantized tensor type을 담을 수 있습니다.",
              boundary:
                "Container 이름만으로 method와 kernel을 확정하지 않습니다.",
            },
          ]}
        />
        <WeightOnlyMethodViz />
        <ContentBoundary article="weight-only-quantization" />
      </section>
      <section id="output-reconstruction" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Weight 차이보다 실제 layer output 차이를 줄입니다
        </h2>
        <ExplainedFormula
          question="왜 ‖W-Ŵ‖보다 ‖XW-XŴ‖를 최소화하나요?"
          idea={
            <p>
              같은 weight error도 calibration input에서 자주 크게 활성화되는
              channel에 있으면 output을 더 많이 바꾸기 때문입니다.
            </p>
          }
          formula={String.raw`E=W-\widehat W,\quad \widehat W^*=\arg\min_{\widehat W\in\mathcal Q}\|XE\|_F^2=\arg\min\operatorname{tr}(E^\top X^\top X E)`}
          annotatedFormula={String.raw`\begin{aligned}E&=\underbrace{W-\widehat W}_{\text{weight error}}\\D&=\underbrace{XE}_{\text{output으로 전파}}\\J(\widehat W)&=\underbrace{\|D\|_F^2}_{\text{output error 크기}}\\\widehat W^*&=\underbrace{\operatorname*{arg\,min}_{\widehat W\in\mathcal Q}J(\widehat W)}_{\text{허용 후보 중 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`W-\widehat W`,
              annotation: [
                "float weight에서 후보 weight를 빼",
                "weight error matrix 생성",
              ],
            },
            {
              expression: String.raw`XE`,
              annotation: [
                "실제 calibration activation을 곱해",
                "output으로 전파된 error 계산",
              ],
            },
            {
              expression: String.raw`\arg\min_{\widehat W\in\mathcal Q}\|XE\|_F^2`,
              annotation: [
                "허용 low-bit 후보 중",
                "layer output error가 작은 weight 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: "X",
              name: "Calibration activations",
              description:
                "현재 layer에 들어온 representative input rows입니다.",
            },
            {
              symbol: "W",
              name: "Float weights",
              description: "원 checkpoint의 weight matrix입니다.",
            },
            {
              symbol: String.raw`\widehat W`,
              name: "Quantized weights",
              description: "허용 codebook·group layout에 속하는 후보입니다.",
            },
            {
              symbol: String.raw`\mathcal Q`,
              name: "Candidate set",
              description:
                "Format과 granularity가 허용하는 low-bit weights입니다.",
            },
          ]}
          assumptions={[
            "한 layer의 proxy이며 전체 task loss와 같지 않습니다.",
            "Calibration distribution 밖 input을 보장하지 않습니다.",
            "Packing·kernel 성능은 objective 밖에서 측정합니다.",
          ]}
          interpretation="X의 첫 channel norm이 10배 크면 그 방향의 작은 weight error도 output에 크게 나타나므로 동일하게 취급하지 않습니다."
        />
      </section>
      <section id="gptq-awq" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          GPTQ와 AWQ는 같은 목적에 다른 보정 경로를 씁니다
        </h2>
        <ExplainedFormula
          question="AWQ의 equivalent scaling은 왜 function을 유지할 수 있나요?"
          idea={
            <p>
              Input channel을 a로 나누고 대응 weight row를 a만큼 곱하면 float
              matrix product는 같지만 weight range와 quantization error 분포는
              달라집니다.
            </p>
          }
          formula={String.raw`XW=(XD^{-1})(DW),\quad \widehat W_D=Q(DW),\quad Y_q=(XD^{-1})\widehat W_D`}
          annotatedFormula={String.raw`\begin{aligned}X'&=\underbrace{XD^{-1}}_{\text{activation 재조정}}\\W'&=\underbrace{DW}_{\text{weight 역방향 조정}}\\XW&=\underbrace{X'W'}_{\text{float function 보존}}\\\widehat W'&=\underbrace{Q(W')}_{\text{low-bit weight 생성}}\\Y_q&=\underbrace{X'\widehat W'}_{\text{근사 output 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`(XD^{-1})(DW)`,
              annotation: [
                "서로 역인 channel scaling을 양쪽에 적용해",
                "float matrix product 보존",
              ],
            },
            {
              expression: String.raw`Q(DW)`,
              annotation: [
                "중요 channel의 effective range를 바꾼 뒤",
                "low-bit weight 생성",
              ],
            },
            {
              expression: String.raw`(XD^{-1})\widehat W_D`,
              annotation: [
                "activation 보정과 quantized weight를 곱해",
                "근사 output 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "D",
              name: "Channel scaling",
              description:
                "Activation statistics로 정한 diagonal scale matrix입니다.",
            },
            {
              symbol: "Q",
              name: "Weight quantizer",
              description: "Scaled weights를 low-bit code로 바꿉니다.",
            },
            {
              symbol: String.raw`Y_q`,
              name: "Quantized output",
              description: "Weight-only path의 layer output입니다.",
            },
          ]}
          assumptions={[
            "D의 diagonal 원소는 0이 아닙니다.",
            "Float identity와 quantized result의 equality를 혼동하지 않습니다.",
            "실제 AWQ search·clipping·kernel 세부는 구현 revision에 의존합니다.",
          ]}
          interpretation="Equivalent scaling은 float function을 유지한 채 어느 channel이 quantization resolution을 더 받는지 바꿉니다."
        />
      </section>
      <section id="artifact-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          File label이 아니라 exact artifact와 kernel을 검증합니다
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div id="paper-gptq" className="scroll-mt-24">
            <CitationBlock
              source="GPTQ"
              citeKey={1}
              href="https://arxiv.org/abs/2210.17323"
            >
              <strong>문제:</strong> 대형 generative model의 one-shot weight
              quantization. <strong>기여:</strong> approximate second-order
              blockwise 보정. <strong>전제:</strong> 논문의
              model·hardware·kernel. <strong>근거 범위:</strong> GPTQ
              algorithm과 당시 실험. <strong>과장 금지:</strong> 모든 4-bit
              artifact의 고정 speedup이 아닙니다.
            </CitationBlock>
          </div>
          <div id="paper-awq" className="scroll-mt-24">
            <CitationBlock
              source="AWQ"
              citeKey={2}
              href="https://arxiv.org/abs/2306.00978"
            >
              <strong>문제:</strong> salient channel의 weight-only error.{" "}
              <strong>기여:</strong> activation-aware scaling과 TinyChat.{" "}
              <strong>전제:</strong> 논문의 LLM/VLM·device·packing.{" "}
              <strong>근거 범위:</strong> AWQ search와 실험.{" "}
              <strong>과장 금지:</strong> GPTQ와 같은 method이거나 모든
              runtime에 같은 이득이라는 뜻은 아닙니다.
            </CitationBlock>
          </div>
        </div>
        <div id="spec-gguf" className="mt-5 scroll-mt-24">
          <CitationBlock
            source="GGUF specification"
            citeKey={3}
            href="https://github.com/ggml-org/ggml/blob/master/docs/gguf.md"
          >
            <strong>문제:</strong> Tensor와 typed metadata를 mmap 가능한
            binary로 교환함. <strong>기여:</strong> Header·metadata·tensor
            layout 규격. <strong>전제:</strong> 사용하는 GGUF version과 tensor
            type. <strong>근거 범위:</strong> Container semantics.{" "}
            <strong>과장 금지:</strong> Quantization method·quality·supported
            kernel을 파일명만으로 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
