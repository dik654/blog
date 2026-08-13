import ExplainedFormula from "@/components/ui/explained-formula";
import VRAMBudgetViz from "./viz/VRAMBudgetViz";

export default function Practice() {
  return <section id="practice" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">배포에서는 weight·activation·KV·workspace를 분리하고 실제 kernel trace로 선택합니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>7B model의 weight를 FP16에서 nominal W4로 바꾸면 raw weight payload는 크게 줄지만 scale·zero-point·packing metadata가 더해지고, runtime activation·KV cache·temporary workspace는 그대로 남을 수 있습니다. 그래서 “model이 4분의 1 크기”와 “peak VRAM이 4분의 1”은 다른 주장입니다.</p>
      <p>숫자로 보면 FP16은 weight 하나에 2 byte를 쓰므로 70억 개의 raw payload가 14GB이고, packed INT4는 weight 하나에 0.5 byte를 써 3.5GB입니다. 이 계산은 decimal GB 기준의 weight payload만 센 값이며, 실제 peak VRAM에는 scale·packing metadata와 activation·KV cache·workspace·headroom을 다시 더해야 합니다.</p>
      <p>Candidate마다 base hash, method, bit width, group shape, scale dtype, weight/activation/KV/compute/accumulation dtype, engine·kernel version과 fallback operator를 기록합니다. 품질은 perplexity뿐 아니라 instruction following·structured output·long context·worst slice를 보고, warmup 뒤 target concurrency의 p50/p95·throughput·power·peak memory를 같은 request trace에서 측정합니다.</p>
    </div>
    <ExplainedFormula
      question="Weight-only quantization 뒤에도 전체 VRAM이 bit 비율만큼 줄지 않는 이유를 어떻게 계산할까요?"
      idea={<>Resident memory를 quantized weight payload와 scale metadata, activation, KV cache, workspace, 안전 여유로 나눕니다. Weight 항만 줄었다면 나머지는 같은 크기로 남습니다.</>}
      formula={String.raw`\begin{aligned}
M_{\mathrm{model}}&=M_{W,q}+M_{\mathrm{scale}}\\
M_{\mathrm{work}}&=M_{\mathrm{act}}+M_{\mathrm{KV}}+M_{\mathrm{workspace}}\\
M_{\mathrm{peak}}&=M_{\mathrm{model}}+M_{\mathrm{work}}+M_{\mathrm{headroom}}
\end{aligned}`}
      terms={[
        { symbol: "M_W,q", name: "quantized weights", description: "Low-bit packed weight tensor의 resident payload입니다." },
        { symbol: "M_scale", name: "quantization metadata", description: "Group scale·zero-point·block header와 alignment 비용입니다." },
        { symbol: "M_act", name: "activations", description: "Batch·prefill·layer 실행 중 유지되는 intermediate tensor입니다." },
        { symbol: "M_KV", name: "KV cache", description: "Layer·KV heads·head dimension·cache dtype·context·concurrency로 정해지는 attention state입니다." },
        { symbol: "M_workspace", name: "runtime workspace", description: "Kernel scratch·CUDA graph·communication·temporary dequant buffer입니다." },
      ]}
      assumptions={["Peak를 같은 batch·context·concurrency·engine allocator와 warmup 조건에서 측정합니다.", "Offload·paging·unified memory가 있으면 device와 host resident/transfer를 분리합니다.", "Weight-only method는 activation과 KV dtype을 자동으로 바꾸지 않습니다."]}
      interpretation="Weight 14GB→3.5GB여도 나머지 항이 10GB면 peak는 24GB→13.5GB로 줄어 약 44% 절감입니다. 확보한 공간으로 context·concurrency를 키우면 KV가 다시 늘 수 있습니다."
    />
    <ExplainedFormula
      question="압축률과 end-to-end speedup을 같은 숫자로 보면 왜 안 될까요?"
      idea={<>전체 지연 중 실제로 quantized kernel이 줄이는 비율만 빨라지고, sampling·communication·fallback·I/O처럼 그대로인 시간은 남습니다. Amdahl의 법칙으로 가능한 상한을 먼저 계산합니다.</>}
      formula={String.raw`S_{\mathrm{end\text{-}to\text{-}end}}\le \frac{1}{(1-p)+p/S_q}`}
      terms={[
        { symbol: "p", name: "accelerated time fraction", description: "Baseline latency 중 quantized kernel로 실제 대체되는 비율입니다." },
        { symbol: "S_q", name: "kernel speedup", description: "대상 low-bit operator가 같은 shape에서 baseline kernel보다 빨라진 배수입니다." },
        { symbol: "S_end-to-end", name: "request speedup", description: "Preprocess부터 sampling·communication까지 포함한 전체 요청의 최대 속도 향상입니다." },
      ]}
      assumptions={["Baseline과 candidate가 같은 output workload·batch·context·quality 조건이며 겹침 효과를 단순화했습니다.", "Kernel fallback이나 추가 dequantize가 있으면 p 또는 Sq가 줄어듭니다.", "Memory capacity 향상으로 batch를 바꾸면 latency와 throughput 실험을 별도로 설계합니다."]}
      interpretation="전체 시간의 60%만 2배 빨라지면 상한은 1/(.4+.3)=1.43배입니다. Weight bytes가 4분의 1이라고 request도 4배 빨라지는 것은 아닙니다."
    />
    <div className="not-prose my-8"><VRAMBudgetViz /></div>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>최종 artifact는 quality guardrail을 통과하면서 target concurrency의 p95 latency와 peak-memory SLA를 만족하는 가장 단순한 조합으로 선택합니다. Quantization과 pruning·distillation의 stage 순서와 통합 benchmark는 <a href="/ai/compression-pipeline">경량화 파이프라인</a>에서 이어갑니다.</p>
    </div>
  </section>;
}
