import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

const BIT_WIDTH_TERMS = [
  { symbol: "b_{payload}", name: "payload bit", description: "Q8은 8bit, NVFP4는 4bit(E2M1)입니다." },
  { symbol: "b_{scale}", name: "block scale bit", description: "Q8은 fp16 scale 16bit, NVFP4는 E4M3 scale 8bit입니다." },
  { symbol: "g", name: "group size", description: "Q8은 32개 원소, NVFP4는 16개 원소가 scale 하나를 공유합니다." },
] as const;

export default function QuantizationVramTradeoff() {
  return (
    <section id="quantization-vram-tradeoff" className="scroll-mt-20 space-y-7">
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>Q8과 NVFP4는 같은 payload+scale 공식의 다른 지점입니다</h2>
        <p className="leading-8">
          Q8과 NVFP4는 payload bit에 block마다 붙는 scale bit을 원소 수로 나눠 더한 같은 공식 위의 두 지점입니다. 서로 다른 계열로 갈라 볼 필요가 없습니다.
          Q8은 8bit payload에 32개 원소당 scale 1개를 더해 평균 8.5bit/parameter가 되고 NVFP4는 4bit payload에 16개 원소당 scale
          1개를 더해 평균 4.5bit/parameter가 됩니다.
        </p>
        <p className="leading-8">
          27.781B parameter에 이 두 값을 적용하면 Q8은 약 27.48GiB, NVFP4는 약 14.55GiB입니다. Q8은 이미 계산한 mixed FP8
          checkpoint의 28.75GiB와 거의 같은 자리이고 NVFP4는 그 절반에 가깝습니다.
        </p>
      </div>

      <TermBreakdown
        title="Q8과 NVFP4를 같은 항목으로 비교합니다"
        items={[
          {
            term: "Q8 (Q8_0 계열)",
            description: "8bit payload와 block당 scale로 평균 8.5bit/parameter입니다.",
            example: "27.781B에 적용하면 약 27.48GiB입니다.",
            boundary: "INT8 W8A8은 Turing·Ampere·Ada·Hopper 세대에서 실행됩니다.",
          },
          {
            term: "NVFP4",
            description: "4bit E2M1 payload와 16개 원소당 E4M3 scale로 평균 4.5bit/parameter입니다.",
            example: "27.781B에 적용하면 약 14.55GiB입니다.",
            boundary: "Blackwell급 tensor core 지원이 필요합니다.",
          },
        ]}
      />

      <ExplainedFormula
        question="Q8·NVFP4처럼 block마다 scale이 붙는 format의 평균 bit 폭은 어떻게 계산하나요?"
        idea={<>Payload bit에 block 하나당 붙는 scale bit을 그 block의 원소 수로 나눠 더하면, 원소 하나가 평균적으로 차지하는 bit 폭이 나옵니다.</>}
        formula={String.raw`b_{avg}=b_{payload}+\frac{b_{scale}}{g}`}
        annotatedFormula={String.raw`b_{avg}=\underbrace{b_{payload}}_{\text{원소 하나의 순수 payload bit}}+\underbrace{\frac{b_{scale}}{g}}_{\text{block scale을 원소 수 }g\text{로 나눈 몫}}`}
        operations={[
          { expression: String.raw`b_{scale}/g`, annotation: ["Block 하나의 scale bit을", "그 block에 속한 원소 수로 나눠"] },
          { expression: String.raw`b_{payload}+b_{scale}/g`, annotation: ["Payload bit에 더해", "원소당 평균 overhead를 반영"] },
        ]}
        terms={BIT_WIDTH_TERMS}
        assumptions={[
          "Tensor-level 추가 scale이나 packing alignment는 무시한 1차 근사입니다.",
          "두 format 모두 element당 overhead가 우연히 0.5bit로 같아 payload 차이가 그대로 평균에 반영됩니다.",
        ]}
        interpretation="Q8은 8+16/32=8.5bit, NVFP4는 4+8/16=4.5bit입니다. llama.cpp의 Llama-3.1-8B 실측(8.5008bit·7.95GiB)이 이 계산과 거의 일치합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          다만 이 값은 payload와 scale을 더한 1차 근사일 뿐입니다. NVFP4는 Blackwell급 tensor core가 있어야 실행되고 Q8류 INT8 W8A8은
          Turing 이후 더 넓은 세대에서 돌기 때문에 hardware 지원 범위 자체가 다릅니다.
        </p>
      </div>

      <div id="paper-q8-quantization" className="scroll-mt-20">
        <CitationBlock
          source="llama.cpp · GGUF quantize tool README"
          citeKey={6}
          type="code"
          href="https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md"
        >
          <p><strong>문제:</strong> GGUF의 여러 quantization type이 실제로 어느 정도 크기·속도·품질을 내는지 한 reference model로 비교합니다.</p>
          <p><strong>핵심 기여:</strong> Llama-3.1-8B에서 Q8_0가 8.5008bit/weight·7.95GiB로 나온다는 실측 표를 공개합니다.</p>
          <p><strong>전제:</strong> 해당 llama.cpp revision과 표에 쓰인 정확한 Llama-3.1-8B checkpoint·측정 조건입니다.</p>
          <p><strong>근거 범위:</strong> Q8_0 block-scale overhead가 만드는 평균 bit 폭을 검증하는 project 실측 근거입니다.</p>
          <p><strong>비주장:</strong> 다른 model이나 revision에서 같은 bit 폭·품질을 보장한다는 뜻은 아닙니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
