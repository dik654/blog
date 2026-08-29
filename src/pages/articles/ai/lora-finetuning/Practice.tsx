import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import PracticeWorkflowViz from "./viz/PracticeWorkflowViz";

export default function Practice() {
  return (
    <section id="practice" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        배포 단위는 adapter 파일 하나가 아닙니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          학습이 끝나면 작은 adapter checkpoint가 생깁니다. 하지만 이 파일만으로는
          같은 모델을 복원할 수 없습니다. Adapter는 정확한 base revision,
          tokenizer와 target module 위에서만 의미가 있기 때문입니다.
        </p>
        <p>
          따라서 실제 배포 단위는 base와 adapter를 함께 식별하고, load·merge와
          task 평가를 통과한 serving artifact입니다. 이름이 비슷해도 base hash나
          module shape가 다르면 조용히 계속하지 않고 실패시켜야 합니다.
        </p>
        <p>
          평가는 frozen base와 adapter-enabled model을 같은 prompt와 decoding으로
          비교합니다. 가능하면 full fine-tuning baseline도 추가합니다. Target
          성능뿐 아니라 general capability, format, safety, 긴 길이와 seed variance를
          함께 봐야 개선과 회귀를 구분할 수 있습니다.
        </p>
      </div>
      <ProgressiveDetail
        title="재현 가능한 adapter manifest에는 무엇을 고정해야 하나요?"
        preview="Base·tokenizer·adapter 구조·학습 데이터·배포 변환을 하나의 versioned artifact로 묶어야 합니다."
      >
        <p>
          Base revision과 hash, tokenizer, chat template, target module, rank, α,
          dropout, initialization과 quantization config를 기록합니다. Data split과
          training code revision도 같은 manifest에 연결합니다.
        </p>
        <p>
          Merge 전후에는 logit maximum error와 relative error의 tolerance를 먼저
          고정하고 task metric을 함께 확인합니다. QLoRA라면 full-precision LoRA도
          비교해 quantized base에서 생긴 차이를 분리합니다.
        </p>
      </ProgressiveDetail>
      <ExplainedFormula
        question="Unmerged LoRA를 base weight에 합치면 왜 같은 linear output을 만들 수 있을까요?"
        idea={<>분배법칙으로 W와 sBA를 먼저 더한 새 weight를 만들 수 있습니다. 같은 dtype에서 dropout이 꺼진 deterministic inference라면 두 경로의 결과가 수치 오차 범위에서 일치해야 합니다.</>}
        formula={String.raw`\begin{aligned}
Wx+sBAx&=(W+sBA)x\\
&=W'x\\
W'&=W+sBA
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
Wx+sBAx&=\underbrace{(\underbrace{W+sBA}_{\text{adapter delta 계산}})x}_{\text{adapter delta 계산}}\\
&=\underbrace{W'x}_{\text{merged weight 계산}}\\
W'&=W+sBA
\end{aligned}`}
        operations={[
          { expression: String.raw`(W+sBA)x`, annotation: ["adapter delta이(가) 식의 결과에 기여하는 방식을","계산합니다.","분배법칙으로 W와 sBA를 먼저 더한 새 weight를 만들","수 있습니다."] },
          { expression: String.raw`W'x`, annotation: ["merged weight이(가) 식의 결과에 기여하는 방식을","계산합니다.","분배법칙으로 W와 sBA를 먼저 더한 새 weight를 만들","수 있습니다."] },
          { expression: String.raw`W+sBA`, annotation: ["adapter delta이(가) 식의 결과에 기여하는 방식을","계산합니다.","분배법칙으로 W와 sBA를 먼저 더한 새 weight를 만들","수 있습니다."] },
        ]}
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
        formula={String.raw`\begin{aligned}
\widetilde W&=D(q_W,s_W)+sBA\\
Q(\widetilde W)&\ne q_W+Q(sBA)\\
&\text{(generally)}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\widetilde W&=\underbrace{D(q_W,s_W)+sBA}_{\text{base quantized artifact 계산}}\\
Q(\widetilde W)&\ne q_W+Q(sBA)\\
&\text{(generally)}
\end{aligned}`}
        operations={[
          { expression: String.raw`D(q_W,s_W)+sBA`, annotation: ["base quantized artifact이(가) 식의 결과에","기여하는 방식을 계산합니다.","Quantizer Q는 rounding과 clipping이","있는 비선형 연산이므로 일반적으로 덧셈을 보존하지 않습니다."] },
        ]}
        terms={[
          { symbol: "Q,D", name: "quantize · dequantize", description: "Real-valued weight와 low-bit code/metadata 사이 변환입니다." },
          { symbol: "q_W,s_W", name: "base quantized artifact", description: "QLoRA training에 사용한 frozen code와 scale입니다." },
          { symbol: "sBA", name: "learned delta", description: "Higher precision으로 학습된 adapter update입니다." },
          { symbol: "W tilde", name: "merged real-valued weight", description: "Dequantize한 base와 adapter delta를 더했지만 아직 다시 quantize하지 않은 weight입니다." },
        ]}
        assumptions={["Requantization method·grouping·calibration·dtype·kernel을 새 artifact manifest에 기록합니다.", "Merged fp16/bf16과 merged-requantized quality를 unmerged QLoRA와 각각 비교합니다.", "Equality가 우연히 성립하는 scalar/quantization cell이 있어도 일반적인 선형성은 아닙니다."]}
        interpretation="Merge 후 4-bit로 다시 저장하려면 새 quantization error가 생깁니다. 그래서 unmerged 4-bit base+adapter, merged higher-precision, merged+requantized를 서로 다른 checksum과 benchmark로 승인합니다."
      />
      <div className="not-prose my-8"><PracticeWorkflowViz /></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Merge는 adapter 하나를 base에 영구히 합칠 때는 맞는 선택입니다. 하지만
          같은 base로 task마다 다른 adapter를 계속 바꿔 서빙해야 한다면, task 수만큼
          merged 전체 복사본을 만들고 로드하는 방식은 storage와 전환 지연 모두에서
          비효율적입니다.
        </p>
        <p>
          <strong>Multi-LoRA serving</strong>은 frozen base weight를 한 번만
          GPU에 상주시키고, 여러 adapter의 unmerged A·B를 base와 별도로 올려
          같은 batch 안에서 서로 다른 adapter를 쓰는 요청을 동시에 처리합니다.
        </p>
        <p>
          Adapter switching은 요청(또는 batch)마다 어떤 adapter를 적용할지
          고르는 결정입니다. Base를 다시 로드하지 않고 A·B만 바꿔 끼우는 것이
          핵심이며, 그래서 전환 비용이 base 크기가 아니라 adapter 크기에 비례합니다.
        </p>
        <p>
          이 방식이 성립하려면 서로 다른 rank·target module을 가진 adapter를
          하나의 batched 연산으로 묶는 kernel과, 자주 쓰지 않는 adapter를
          GPU 메모리에서 내리고 다시 올리는 관리 정책이 필요합니다. Merge 전용
          경로보다 구현이 복잡한 대신, adapter 전환 지연을 base 재로드 없이
          요청 단위로 낮출 수 있습니다.
        </p>
      </div>
      <AlgorithmBlock
        title="Multi-LoRA batch에서 요청별 adapter를 적용하는 순서"
        input={[
          "batch: 각 요청 i의 (prompt tokens, adapter_id_i)",
          "resident_base: 한 번만 상주하는 frozen weight W",
          "adapter_registry: adapter_id → target module별 (A,B) 매핑",
        ]}
        steps={[
          { code: "for i in batch: ensure_loaded(adapter_registry[adapter_id_i])", note: "요청에 필요한 adapter가 GPU에 없으면 그때 올립니다(cold switch는 지연을 추가합니다)." },
          { code: "h_base = W @ x_batch", note: "batch 전체에 대해 frozen base matmul은 단 한 번 계산합니다." },
          { code: "for i in batch: delta_i = s_i * B[adapter_id_i] @ (A[adapter_id_i] @ x_i)", note: "요청마다 자신의 adapter로만 low-rank delta를 계산합니다(batched grouped-matmul kernel)." },
          { code: "y_i = h_base_i + delta_i", note: "같은 base 위에 서로 다른 adapter 결과를 각 요청에 맞게 더합니다." },
        ]}
        output="batch의 각 요청이 자신에게 배정된 adapter만 반영한 next-token 분포"
        repeatUntil="다음 batch가 다른 adapter 조합으로 들어올 때마다 base는 그대로 두고 2~4단계만 반복합니다."
      />
      <div id="reading-s-lora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · S-LoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sheng 등은 하나의 base 위에서 수천 개의 LoRA adapter를 단일 또는
          다중 GPU에서 동시에 서빙하기 위해, adapter 메모리를 unified paging으로
          관리하고 서로 다른 adapter를 가진 요청들을 하나의 batched GEMM으로
          처리하는 custom CUDA kernel을 제안했습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문은 이 설계로 동시에 서빙 가능한 adapter 수를 수 자릿수(orders of
          magnitude) 늘리고, throughput을 최대 4배까지 높였다고 보고했습니다.
          이는 논문의 benchmark 환경과 adapter rank·수 조건에서의 결과이며, 모든
          base model이나 batch 구성에서 같은 배율을 보장하지는 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2311.03285" target="_blank" rel="noreferrer">Unified paging과 batched adapter 서빙 보기</a>
      </div>
      <div id="standard-peft-lora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 구현 참고 · Hugging Face PEFT LoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          PEFT 문서는 현재 LoraConfig의 rank, alpha, target_modules, dropout, bias와
          modules_to_save를 설명합니다. Initialization과 merge 관련 구현 경계도
          함께 제공합니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 글은 특정 version의 default를 영구 표준으로 가정하지 않습니다. 실제
          설치 version의 config, checkpoint format과 target module mapping을
          manifest에 고정해야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://huggingface.co/docs/peft/main/package_reference/lora" target="_blank" rel="noreferrer">현재 LoraConfig와 구현 옵션 보기</a>
      </div>
    </section>
  );
}
