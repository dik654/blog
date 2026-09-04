import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InferenceOptimizationLayersViz from "./inference-optimization-layers/viz/InferenceOptimizationLayersViz";

/**
 * 추론 최적화의 층: model·kernel·runtime·system 과 ROI
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "지도" 글이다. quantization·fusion·paged attention·batching·disaggregation 같은 기법은 각자의 정본 글에 두고
 * 링크로만 배치하며, 이 글이 소유하는 것은 지도의 mechanism 이다: 어느 층이 어느 병목을 건드리고 어떤 층과 상호작용하는지,
 * Amdahl 로 상한을 계산하는 법, ROI 로 순서를 정하는 법, regression 을 잡는 benchmark gate.
 */
export default function InferenceOptimizationLayersArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          최적화는 네 층으로 나뉘고 각 층은 end-to-end 의 자기 구간만 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            inference optimization 은 같은 model 로 요청 하나의 시간과 GPU 시간당 처리량을 개선하는 모든 작업을 가리킵니다. 어디를 고치느냐에 따라 model,
            kernel, runtime, system 네 층으로 나뉩니다. 층마다 건드리는 병목이 다르므로 한 층의 이득은 나머지 층이 차지한 시간에 갇힙니다.
          </p>
          <p>
            요청 하나가 100 ms 걸리고 그중 attention 이 40 ms 라면 attention kernel 을 2배 빠르게 해도 80 ms 입니다. 남은 60 ms 는 GEMM,
            scheduler 의 CPU 시간, 통신이 차지하고 있어 kernel 층이 손댈 수 없습니다. 이 글은 그 구조를 지도로 그리고 지도 위에서 무엇을 먼저 할지 고르는 계산을
            소유합니다.
          </p>
          <p>
            기법 자체는 각자의 정본 글이 다룹니다. quantization 은{" "}
            <Link to="/ai/quantized-model-deployment">quantized model deployment</Link>, kernel
            fusion 은 <Link to="/gpu/cuda-kernel-fusion">CUDA kernel fusion</Link>, paged attention
            은 <Link to="/ai/vllm-paged-attention">PagedAttention</Link>, continuous batching 은{" "}
            <Link to="/ai/vllm-serving#engine-loop">vLLM 입문</Link>, prefill 분리는{" "}
            <Link to="/ai/disaggregated-prefill-decode-serving">disaggregated serving</Link> 이
            정본입니다.
          </p>
          <p>
            이어지는 절은 네 층의 정의와 각 층이 건드리는 병목, Amdahl 로 계산하는 상한, 층 사이의
            상호작용과 hardware-aware 설계, ROI 로 순서를 정하는 계산, 그리고 regression 을 잡는
            benchmark gate 순서로 갑니다.
          </p>
        </div>
        <InferenceOptimizationLayersViz />
        <ContentBoundary article="inference-optimization-layers" />
      </section>

      <section id="layers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          층은 고치는 대상이 아니라 건드리는 병목으로 구분합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            model-level optimization 은 weight 와 계산 그래프 자체를 바꿔 읽어야 할 byte 와 해야 할
            FLOP 을 줄입니다. quantization, pruning, distillation, MLA 같은 architecture 변경이
            여기 속하고, 건드리는 병목은{" "}
            <Link to="/ai/prefill-decode-phase-dynamics#arithmetic-intensity">decode 의 weight read</Link>{" "}
            와 prefill 의 compute 입니다. 출력이 달라질 수 있어 품질 검증이 따라붙습니다.
          </p>
          <p>
            kernel-level optimization 은 같은 계산을 GPU 에서 더 빨리 하도록 kernel 을 바꿉니다. operator-level 은 attention 이나
            GEMM 하나를 tile 크기, SRAM 재사용, 정밀도로 최적화합니다. graph-level 은 여러 operator 를 fusion 해 HBM 왕복과 launch 를
            줄입니다. 건드리는 병목은 kernel 의 HBM 대역폭과 SM 활용률이며 출력은 수치 오차 안에서 같습니다.
          </p>
          <p>
            runtime-level optimization 은 kernel 사이와 요청 사이의 시간을 줄입니다. CUDA graph 로
            launch 를 지우고, continuous batching 으로 GPU 가 빈 자리를 채우고, paged KV 로 메모리를
            낭비 없이 쓰고, prefix caching 으로 같은 계산을 건너뜁니다. 건드리는 병목은{" "}
            <Link to="/ai/launch-overhead-and-cpu-gpu-synchronization#submission-pipeline">CPU 제출</Link>{" "}
            과 GPU 메모리 용량, 그리고 batch 의 크기입니다.
          </p>
          <p>
            system-level optimization 은 GPU 여러 장과 요청의 흐름을 배치합니다. prefill 과 decode
            를 다른 GPU 로 나누고, KV 를 어디에 두고 옮길지 정하고, router 가 cache 가 있는 replica
            로 보내고, autoscaling 이 replica 수를 맞춥니다. 건드리는 병목은 요청 사이의 간섭과
            cluster 전체의 GPU 시간입니다.
          </p>
          <p>
            같은 이름의 기법이 다른 층에 놓일 수도 있습니다. FlashAttention 은 kernel 층이지만 attention 의 memory 접근을 바꾼다는 점에서 model 층의
            설계 판단과 맞닿습니다. speculative decoding 은 runtime 층에 두지만 draft model 을 고르는 일은 model 층입니다. 분류의 기준은 이름이
            아니라 무엇을 줄이는가입니다.
          </p>
        </div>
        <TermBreakdown
          title="네 층과 각 층이 건드리는 병목"
          items={[
            { term: "Model-level", description: "weight·architecture 를 바꿔 읽을 byte 와 FLOP 을 줄입니다.", example: "weight-only INT4, MLA, distillation", boundary: "출력이 바뀌므로 품질 parity 검증이 필수이고 memory-bound 구간에서만 대역폭 이득이 납니다." },
            { term: "Kernel-level (operator · graph)", description: "같은 계산을 SRAM 재사용·fusion 으로 더 빨리 합니다.", example: "FlashAttention, GEMM epilogue fusion", boundary: "이득은 그 kernel 이 end-to-end 에서 차지한 비율에 갇히고 shape·hardware 마다 다시 tuning 해야 합니다." },
            { term: "Runtime-level", description: "kernel 사이·요청 사이의 빈 시간과 메모리 낭비를 줄입니다.", example: "CUDA graph, continuous batching, paged KV, prefix cache", boundary: "CPU 병목과 메모리 용량이 문제일 때만 이득이고 GPU 가 이미 병목이면 처리량이 늘지 않습니다." },
            { term: "System-level", description: "GPU 여러 장과 요청 흐름을 배치해 간섭과 cluster 시간을 줄입니다.", example: "prefill/decode 분리, cache-aware routing, autoscaling", boundary: "전송·조정 비용이 새로 생기므로 단일 GPU 의 기법과 상쇄되는지 end-to-end 로 재야 합니다." },
          ]}
        />
      </section>

      <section id="amdahl" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 구간을 아무리 빠르게 해도 상한은 나머지 구간의 비율이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Amdahl 의 법칙은 전체 시간 중 비율 p 를 차지하는 구간을 s 배 빠르게 했을 때 전체 speedup 이 1/((1−p)+p/s) 라는 식입니다. s 를 무한히 키워도
            1/(1−p) 를 넘지 못하므로 최적화를 고르기 전에 그 구간의 p 를 먼저 재야 합니다.
          </p>
          <p>
            end-to-end 100 ms 에 attention 40 ms 면 p=0.4 입니다. attention 을 2배 빠르게 하면 1/(0.6+0.2)=1.25 배, 즉 80 ms
            이고 10배 빠르게 해도 1/(0.6+0.04)=1.56 배인 64 ms 입니다. 상한은 1/0.6=1.67 배, 60 ms 이며 그 아래로는 attention 이 아니라
            나머지 60 ms 를 건드려야 합니다.
          </p>
          <p>
            end-to-end optimization 은 이 계산을 구간마다 하고 나서 층을 고르는 태도입니다. 구간 하나의 micro benchmark 가 3배 빨라졌다는 숫자는 p 를
            곱하기 전에는 의미가 없습니다. p 는 model, batch, 입력 길이에 따라 달라지므로 대상 workload 의 profile 에서 읽어야 합니다.
          </p>
          <p>
            model 층의 예로 weight-only quantization 은 weight byte 를 절반으로 줄이지만 그 이득은 weight read 에 묶인 구간에만 납니다.
            decode 에서 GEMM 35 ms 중 28 ms 가 weight streaming 이고 7 ms 가 compute 라면 절감은 14 ms 입니다.
          </p>
          <p>
            batch 가 커져 GEMM 이 compute-bound 가 되면 절감은 0 에 가까워집니다. 같은 기법의 p 가 batch 에 따라 0.28 에서 0 으로 움직이는 셈입니다.
            기법 이름만 보고는 p 를 알 수 없으니 대상 workload 의 profile 에서 읽어야 합니다.
          </p>
          <p>
            이 글의 Amdahl 은 일반형이고, low-bit kernel 로 대체되는 비율만 s 배가 된다는{" "}
            <Link to="/ai/quantized-model-deployment#runtime-release">quantized-kernel Amdahl bound</Link>{" "}
            와 fusion 절감을 baseline 비중으로 정규화하는{" "}
            <Link to="/gpu/cuda-kernel-fusion#release-gate">fusion ROI boundary</Link> 는 이 식을 각
            기법에 맞게 좁힌 것입니다. 측정 쪽의 achieved ledger 는{" "}
            <Link to="/gpu/cuda-perf-analysis#throughput-ledger">CUDA 성능 분석</Link> 글이 다룹니다.
          </p>
        </div>
        <ExplainedFormula
          question="구간 하나를 s 배 빠르게 하면 end-to-end 는 몇 배 빨라지나요?"
          idea="전체를 1 로 두면 최적화하지 않은 구간 (1−p) 는 그대로 남고 최적화한 구간 p 만 s 로 나뉩니다. 새 시간의 역수가 speedup 이고 s 가 아무리 커도 (1−p) 는 남습니다."
          formula={String.raw`S(p,s)=\frac{1}{(1-p)+\dfrac{p}{s}},\qquad \lim_{s\to\infty}S=\frac{1}{1-p}`}
          annotatedFormula={String.raw`S(p,s)=\frac{1}{\underbrace{(1-p)}_{\text{손대지 않은 구간의 비율}}+\underbrace{\dfrac{p}{s}}_{\text{s 배 빨라진 구간의 새 비율}}}`}
          operations={[
            { expression: String.raw`1-p`, annotation: ["전체에서 최적화 대상 비율을 빼", "그대로 남는 시간 계산"] },
            { expression: String.raw`p/s`, annotation: ["대상 비율을 speedup 으로 나눠", "빨라진 뒤의 새 비율 계산"] },
            { expression: String.raw`1/((1-p)+p/s)`, annotation: ["두 비율의 합의 역수를 취해", "end-to-end speedup 확정"] },
          ]}
          terms={[
            { symbol: String.raw`p`, name: "대상 구간 비율", description: "end-to-end 시간 중 최적화가 건드리는 구간의 비율입니다. profile 에서 읽습니다." },
            { symbol: String.raw`s`, name: "구간 speedup", description: "그 구간 자체가 빨라진 배수입니다. micro benchmark 가 주는 숫자입니다." },
            { symbol: String.raw`S`, name: "End-to-end speedup", description: "요청 하나의 전체 시간이 빨라진 배수입니다. 상한은 1/(1−p) 입니다." },
          ]}
          assumptions={["구간이 직렬로 이어지고 서로 겹치지 않는다고 가정합니다. CPU 제출이 GPU 실행과 겹치는 구간은 겹친 뒤의 critical path 로 p 를 다시 잡아야 합니다.", "최적화가 다른 구간의 시간을 바꾸지 않는다고 가정하며 실제로는 상호작용이 있습니다."]}
          interpretation="p=0.4, s=2 면 S=1.25 로 100 ms 가 80 ms 가 되고, s=10 이어도 1.56 입니다. p 가 0.28 인 weight read 를 2배 빠르게 하면 1.16 이고 batch 가 커져 p 가 0 에 가까워지면 S 도 1 로 돌아옵니다. micro benchmark 의 s 보다 profile 의 p 가 결과를 정합니다."
        />
      </section>

      <section id="interactions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          층은 독립이 아니어서 한 층의 선택이 다른 층의 p 와 s 를 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Amdahl 의 직렬 가정은 층 사이의 상호작용에서 깨집니다. model 층에서 INT4 를 고르면 kernel 층은 dequant 가 붙은 GEMM kernel 을 새로 써야
            합니다. runtime 층에서 graph 를 켜면 kernel 은 capture 가능해야 합니다. system 층에서 prefill 을 분리하면 decode GPU 의 병목이
            compute 에서 weight read 로 옮겨 가 model 층의 p 가 커집니다.
          </p>
          <p>
            hardware-aware optimization 은 이 상호작용을 hardware 쪽에서 읽는 태도입니다. 같은
            kernel 도 HBM 대역폭, SRAM 크기, tensor core 의 지원 정밀도에 따라 병목이 다르므로,{" "}
            <Link to="/ai/sionic-glm-b300#paper-roofline">roofline</Link> 위에서 그 hardware 의
            arithmetic intensity 경계를 먼저 보고 어느 층이 이득을 낼지 정합니다.
          </p>
          <p>
            H100 에서 memory-bound 였던 decode GEMM 이 대역폭과 연산 비율이 다른 GPU 에서는 compute-bound 일 수 있습니다. 그러면 weight
            quantization 의 p 는 0 에 가까워집니다. 같은 기법의 층별 이득이 hardware 마다 다른 이유입니다.
          </p>
          <p>
            algorithm–hardware co-design 은 한 걸음 더 가서 알고리즘 자체를 hardware 의 경계에 맞춰 바꿉니다. FlashAttention 은 SRAM 에
            들어가는 tile 로 attention 을 다시 썼습니다. PagedAttention 은 OS 의 paging 을 KV cache 에 옮겼고 MLA 는 KV byte 를
            줄이려고 attention 의 수식을 바꿨습니다.
          </p>
          <p>
            세 예는 각각 kernel, runtime, model 층에 놓이지만 출발점은 모두 hardware 의 병목입니다. 층은 결과가 놓이는 자리입니다. co-design 은 그
            자리를 정하기 전에 병목을 먼저 봅니다.
          </p>
          <p>
            상호작용은 이득만이 아니라 손실도 만듭니다. quantization 이 만든 dequant 는 fusion 하지 않으면 새 kernel 과 launch 를 더합니다. graph
            capture 는 dynamic 한 attention backend 를 piecewise 로 밀어내 launch 절감을 줄입니다. disaggregation 은 KV 전송이라는
            새 구간을 더해 p 의 분모를 키웁니다. 층을 하나 더할 때마다 profile 을 다시 재야 하는 이유입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="층 사이 상호작용의 예를 더 보려면"
          preview="한 층의 변경은 다른 층의 병목 위치와 가능한 선택지를 함께 옮깁니다."
        >
          <p>
            model → kernel: INT4 weight 는 FP16 tensor core 로 계산하려면 dequant 가 필요하고 그 dequant 를 GEMM 안에 fusion 한
            kernel 이 있어야 이득이 launch 로 새지 않습니다.
          </p>
          <p>
            runtime → kernel: CUDA graph 는 CPU 동기화와 값에 따른 분기가 없는 kernel 만 capture 하므로 kernel 선택이 graph 호환성으로
            제한됩니다.
          </p>
          <p>
            system → model: prefill 을 분리한 decode GPU 는 batch 가 커져도 weight read 가 병목으로
            남는 시간이 길어져 weight quantization 의 p 가 커집니다.
          </p>
          <p>
            runtime → system: prefix caching 의 hit rate 는 router 가 같은 prefix 를 같은 replica 로 보낼 때만 높습니다. cache-
            aware routing 이 system 층의 전제 조건이 됩니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="roi" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          ROI 는 절감 시간에 트래픽을 곱하고 구현과 검증 비용으로 나눈 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            optimization ROI 는 어떤 최적화가 벌어 주는 값을 그것을 만들고 검증하고 유지하는 비용으로 나눈 비율입니다. 벌어 주는 값은 요청당 절감 시간에 트래픽과 GPU
            시간의 단가를 곱한 것입니다. 같은 절감이라도 트래픽이 100배면 값도 100배가 됩니다. ROI 는 기법의 속성이 아니라 workload 의 속성입니다.
          </p>
          <p>
            attention kernel 교체가 요청당 20 ms 를 줄인다고 합시다. 하루 200만 요청이면 GPU 시간
            4만 초, 약 11 GPU 시간이고 시간당 2 달러면 하루 22 달러, 한 해 8천 달러입니다. 구현
            3주와 검증 1주에 4만 달러가 들면 회수에 5년이 걸리니 이 트래픽에서는 하지 않는 편이
            낫습니다.
          </p>
          <p>
            같은 기법을 하루 2억 요청에 적용하면 한 해 80만 달러라 회수 기간이 3주 미만입니다. 같은 조직 안에서도 ROI 순서는 model 별, endpoint 별로 다릅니다.
            트래픽이 작은 endpoint 에서는 runtime 의 설정 변경처럼 구현 비용이 거의 없는 층부터 고르는 것이 맞습니다.
          </p>
          <p>
            latency 절감의 값은 GPU 시간만이 아닙니다. TPOT 이 SLO 를 넘겨 요청이 거부되거나 사용자가 이탈하는 endpoint 라면 절감 1 ms 의 값은 GPU
            단가보다 훨씬 큽니다. 이미 SLO 안에 있는 endpoint 라면 처리량으로 환산한 GPU 절감만이 값입니다. 식의 v 항이 그 차이를 담습니다.
          </p>
          <p>
            비용 쪽에는 구현만 넣으면 안 됩니다. model 층은 품질 parity 검증, kernel 층은 shape 별 tuning 과 hardware 세대마다의 재검증, system
            층은 운영 복잡도가 붙습니다. 검증 비용이 구현 비용보다 큰 층이 흔합니다. 그 검증이 다음 절의 benchmark gate 입니다.
          </p>
        </div>
        <ExplainedFormula
          question="이 최적화를 지금 하는 것이 맞나요?"
          idea="벌어 주는 값은 절감 시간 × 트래픽 × 단가이고, 비용은 구현·검증·유지의 합입니다. 비율이 1 을 넘는 기간이 회수 기간이며 트래픽이 값을 정합니다."
          formula={String.raw`\mathrm{ROI}=\frac{\Delta t\cdot Q\cdot v}{C_{\rm impl}+C_{\rm verify}+C_{\rm maint}}`}
          annotatedFormula={String.raw`\mathrm{ROI}=\frac{\underbrace{\Delta t}_{\text{요청당 절감 시간}}\cdot\underbrace{Q}_{\text{기간 내 요청 수}}\cdot\underbrace{v}_{\text{절감 1 초의 값}}}{\underbrace{C_{\rm impl}}_{\text{구현}}+\underbrace{C_{\rm verify}}_{\text{검증}}+\underbrace{C_{\rm maint}}_{\text{유지}}}`}
          operations={[
            { expression: String.raw`\Delta t\cdot Q`, annotation: ["요청당 절감 시간에 기간의 요청 수를 곱해", "기간 내 절감된 총 시간 계산"] },
            { expression: String.raw`(\Delta t\cdot Q)\cdot v`, annotation: ["절감 시간에 단가를 곱해", "벌어 주는 값을 돈으로 환산"] },
            { expression: String.raw`C_{\rm impl}+C_{\rm verify}+C_{\rm maint}`, annotation: ["구현·검증·유지 비용을 더해", "분모 확정"] },
          ]}
          terms={[
            { symbol: String.raw`\Delta t`, name: "요청당 절감", description: "end-to-end 로 잰 요청 하나의 절감 시간입니다. Amdahl 을 거친 값이어야 합니다." },
            { symbol: String.raw`Q`, name: "요청 수", description: "회수를 판단하는 기간 동안의 요청 수입니다. 예시 하루 200만 또는 2억." },
            { symbol: String.raw`v`, name: "절감 1 초의 값", description: "GPU 시간 단가이거나, SLO 를 넘긴 endpoint 라면 거부·이탈을 막는 값입니다." },
            { symbol: String.raw`C_{\rm verify}`, name: "검증 비용", description: "품질 parity, shape 별 tuning, hardware 세대 재검증의 비용입니다. 구현보다 큰 경우가 흔합니다." },
          ]}
          assumptions={["Δt 가 트래픽 구간에서 일정하다고 가정하며 batch 가 바뀌면 Amdahl 의 p 가 움직여 Δt 도 바뀝니다.", "v 를 GPU 단가로만 두면 SLO 위반의 값을 놓칩니다."]}
          interpretation="Δt=20 ms, Q=하루 200만, v=2 달러/GPU 시간이면 한 해 약 8천 달러이고 4만 달러 비용의 회수에 5년이 걸립니다. Q 가 100배면 3주입니다. 같은 기법의 ROI 가 트래픽으로 100배 달라지므로 순서는 endpoint 마다 다시 매깁니다."
        />
        <AlgorithmBlock
          title="최적화 선택 loop: profile → 층 귀속 → Amdahl → ROI → gate"
          input={["대상 workload 의 요청 분포와 트래픽 Q", "end-to-end profile (구간별 시간)", "후보 기법 목록과 각 기법의 micro speedup s"]}
          steps={[
            { code: "segments = profile(workload)  # attention·GEMM·CPU·통신 구간과 비율 p_i", note: "micro benchmark 가 아니라 대상 workload 의 batch 와 입력 길이에서 잰 분해여야 p 가 맞습니다." },
            { code: "for each candidate c: layer = layer_of(c); p = share(segments, layer)", note: "기법을 층에 귀속시키면 그 층이 건드리는 구간의 p 가 정해집니다." },
            { code: "S = 1 / ((1-p) + p/s_c); dt = T_e2e * (1 - 1/S)", note: "Amdahl 로 end-to-end 절감을 구합니다. s 가 커도 p 가 작으면 dt 는 작습니다." },
            { code: "roi = dt * Q * v / (C_impl + C_verify + C_maint)", note: "트래픽과 검증 비용을 넣어야 순서가 뒤바뀌지 않습니다." },
            { code: "pick argmax roi; implement; rerun benchmark gate; profile again", note: "한 층을 바꾸면 다른 층의 p 가 움직이므로 다음 후보는 새 profile 로 다시 평가합니다." },
          ]}
          output="ROI 순으로 정렬된 최적화 순서와 각 단계의 gate 통과 기록"
          repeatUntil="남은 후보의 ROI 가 1 아래이거나 SLO 와 처리량 목표를 만족할 때까지"
        />
      </section>

      <section id="regression-gate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Regression 은 같은 조건의 benchmark 를 매 변경마다 다시 돌려야만 잡힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            performance regression 은 변경 뒤에 같은 workload 의 latency 나 처리량이 나빠지는 일입니다. 최적화 작업에서 특히 흔한데, 한 층의 개선이
            다른 층의 조건을 깨뜨리기 때문입니다. graph 가 조용히 eager 로 떨어지거나, 새 kernel 이 특정 shape 에서 느리거나, quantization 이 품질을
            떨어뜨려 재시도를 늘리는 식입니다.
          </p>
          <p>
            benchmark gate 는 변경마다 같은 조건에서 같은 지표를 재고 정해진 문턱을 넘으면 변경을
            막는 절차입니다. 조건은 <Link to="/ai/serving-benchmark-methodology#protocol">warm 상태</Link>
            의 고정 λ sweep 과 같은 입력 분포이고, 지표는 <Link to="/ai/serving-latency-metrics-and-slo#metrics">TTFT·TPOT 의 p50·p99</Link>
            와 SLO 안에서의 처리량, 그리고 model 층 변경이라면 품질 parity 입니다.
          </p>
          <p>
            문턱은 noise 보다 커야 합니다. 같은 설정을 다섯 번 돌려 run 사이 편차가 2% 라면 3% 나빠짐은 noise 일 수 있으므로 문턱을 편차의 2배 이상으로 두고
            paired 로 비교합니다. 반대로 문턱을 10% 로 두면 5% 씩 세 번 쌓인 regression 을 놓칩니다.
          </p>
          <p>
            gate 는 낮은 batch 와 높은 batch 를 모두 포함해야 합니다. graph fallback 은 낮은 batch 의 TPOT 에만 나타납니다. quantization
            의 이득 소멸과 새 kernel 의 shape 문제는 높은 batch 에서 나타납니다. 한 지점의 benchmark 는 두 종류의 regression 중 하나를 반드시
            놓칩니다.
          </p>
          <p>
            regression 이 잡히면 첫 질문은 어느 층이 깨졌는가입니다. profile 을 다시 재 구간별 시간을
            변경 전과 비교하면 어느 구간이 늘었는지 보이고, 그 구간의 층이 원인입니다. CPU 구간이
            늘었으면 <Link to="/ai/launch-overhead-and-cpu-gpu-synchronization#capture-failure">capture failure</Link>
            부터, GEMM 구간이 늘었으면 kernel 선택부터 봅니다.
          </p>
        </div>
        <TermBreakdown
          title="Benchmark gate 의 구성 요소"
          items={[
            { term: "고정 조건", description: "warm 상태, 같은 입력 분포, 같은 λ sweep, 같은 hardware 와 driver.", example: "prompt 길이 분포와 동시성 8·32·128 세 지점", boundary: "조건이 하나라도 다르면 차이가 변경 때문인지 알 수 없습니다." },
            { term: "지표와 문턱", description: "TTFT·TPOT p50·p99, SLO 안 처리량, 품질 parity 를 noise 의 2배 이상 문턱으로 봅니다.", example: "run 편차 2% 면 문턱 4%", boundary: "문턱이 크면 작은 regression 이 누적되고 작으면 noise 로 gate 가 흔들립니다." },
            { term: "양끝 batch", description: "낮은 batch 와 높은 batch 를 모두 재야 CPU 병목형과 GPU 병목형 regression 을 둘 다 잡습니다.", example: "동시성 1 과 128", boundary: "한 지점만 재면 graph fallback 이나 kernel shape 문제 중 하나를 놓칩니다." },
          ]}
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="Gene M. Amdahl · Validity of the single processor approach to achieving large scale computing capabilities (AFIPS 1967)"
            citeKey={1}
            href="https://dl.acm.org/doi/10.1145/1465482.1465560"
            type="paper"
          >
            병렬화할 수 없는 구간이 남아 있는 한 전체 speedup 이 그 구간의 비율로 제한된다는 원 논문입니다.
            이 글은 그 식을 병렬화가 아니라 한 구간의 speedup 일반에 적용했으며, 구간이 직렬이고
            서로 독립이라는 가정이 층 사이 상호작용에서 깨진다는 점은 이 글의 해석입니다.
          </CitationBlock>
          <CitationBlock
            source="vLLM project · Optimization and Tuning (docs)"
            citeKey={2}
            href="https://docs.vllm.ai/en/latest/configuration/optimization.html"
            type="code"
          >
            enforce-eager 가 compile 과 graph capture 를 건너뛴다는 설명과 최적화 수준이 piecewise·full
            cudagraph 를 단계별로 켠다는 서술의 출처입니다. runtime 층의 설정 변경이 구현 비용이 거의
            없는 층이라는 이 글의 주장은 그 설정이 존재한다는 사실에 근거하며 성능 수치는 인용하지
            않습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/ai/serving-benchmark-methodology">Serving benchmark methodology</Link>
        </p>
      </section>
    </div>
  );
}
