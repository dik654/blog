import ExplainedFormula from "@/components/ui/explained-formula";
import PracticeWorkflowViz from "./viz/PracticeWorkflowViz";

export default function Practice() {
  return (
    <section id="practice" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습이 끝난 adapter가 아니라, base와 결합해 검증된 serving artifact가 배포 단위입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Adapter checkpoint에는 base revision·tokenizer·chat template·target module·rank·α·dropout·initialization·quantization config·data/split·training code를 연결합니다. Load 시 실제 base hash와 module shape가 맞지 않으면 이름이 비슷해도 실패시킵니다.</p>
        <p>평가는 frozen base, adapter-enabled, 가능하면 full fine-tuning baseline을 같은 prompt와 decoding으로 비교합니다. Target gain뿐 아니라 general capability regression·format·safety·긴 길이와 seed variance를 봅니다. QLoRA는 full-precision LoRA와도 비교해야 quantized base에서 온 차이를 분리할 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="Unmerged LoRA를 base weight에 합치면 왜 같은 linear output을 만들 수 있을까요?"
        idea={<>분배법칙으로 W와 sBA를 먼저 더한 새 weight를 만들 수 있습니다. 같은 dtype에서 dropout이 꺼진 deterministic inference라면 두 경로의 결과가 수치 오차 범위에서 일치해야 합니다.</>}
        formula={String.raw`Wx+sBAx=(W+sBA)x=W'x,\qquad W'=W+sBA`}
        terms={[
          { symbol: "W", name: "base weight", description: "Adapter와 호환되는 원본 linear weight입니다." },
          { symbol: "sBA", name: "adapter delta", description: "학습된 low-rank update를 base shape로 materialize한 값입니다." },
          { symbol: "W'", name: "merged weight", description: "Base와 adapter를 합쳐 한 matmul로 실행할 수 있는 새 artifact입니다." },
        ]}
        assumptions={["Inference에서 adapter dropout이 꺼져 있고 같은 bias·dtype·operator를 사용합니다.", "Base revision과 target module shape가 학습 시점과 일치합니다.", "Quantization·rounding·different accumulation이 들어가면 bitwise equality가 아니라 tolerance와 task metric으로 비교합니다."]}
        interpretation="Unmerged output과 merged output의 logit max error를 먼저 검사한 뒤 task metric·latency를 비교합니다. 여러 adapter를 동적으로 바꿔야 한다면 merge 이점과 routing 유연성을 맞바꿉니다."
      />
      <ExplainedFormula
        question="QLoRA adapter를 merge한 뒤 왜 ‘원래 4-bit base에 adapter만 더했다’고 볼 수 없을까요?"
        idea={<>Quantizer Q는 rounding과 clipping이 있는 비선형 연산이므로 일반적으로 덧셈을 보존하지 않습니다. Dequantize한 base에 delta를 더한 뒤 다시 quantize하면 새로운 code·scale·오차를 가진 artifact가 됩니다.</>}
        formula={String.raw`Q\!\left(D(q_W,s_W)+sBA\right)\ne q_W+Q(sBA)\quad\text{(generally)}`}
        terms={[
          { symbol: "Q,D", name: "quantize · dequantize", description: "Real-valued weight와 low-bit code/metadata 사이 변환입니다." },
          { symbol: "q_W,s_W", name: "base quantized artifact", description: "QLoRA training에 사용한 frozen code와 scale입니다." },
          { symbol: "sBA", name: "learned delta", description: "Higher precision으로 학습된 adapter update입니다." },
        ]}
        assumptions={["Requantization method·grouping·calibration·dtype·kernel을 새 artifact manifest에 기록합니다.", "Merged fp16/bf16과 merged-requantized quality를 unmerged QLoRA와 각각 비교합니다.", "Equality가 우연히 성립하는 scalar/quantization cell이 있어도 일반적인 선형성은 아닙니다."]}
        interpretation="Merge 후 4-bit로 다시 저장하려면 새 quantization error가 생깁니다. 그래서 unmerged 4-bit base+adapter, merged higher-precision, merged+requantized를 서로 다른 checksum과 benchmark로 승인합니다."
      />
      <div className="not-prose my-8"><PracticeWorkflowViz /></div>
      <div id="standard-peft-lora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 구현 참고 · Hugging Face PEFT LoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">PEFT 문서는 현재 LoraConfig의 rank·alpha·target_modules·dropout·bias·modules_to_save와 initialization, merge 관련 구현 경계를 제공합니다. 이 글은 특정 version의 default를 영구 표준으로 가정하지 않으며, 실제 설치 version의 config·checkpoint format·target module mapping을 manifest에 고정합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://huggingface.co/docs/peft/main/package_reference/lora" target="_blank" rel="noreferrer">현재 LoraConfig와 구현 옵션 보기</a>
      </div>
    </section>
  );
}
