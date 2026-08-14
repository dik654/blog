import ExplainedFormula from "@/components/ui/explained-formula";
import VllmCapacityLogViz from "./viz/VllmCapacityLogViz";

const CAPACITY_TERMS = [
  {
    symbol: "M_{pool}",
    name: "KV pool byte",
    description:
      "GPU memory에서 weight·runtime·여유분을 제외하고 KV block에 실제로 예약된 byte입니다.",
  },
  {
    symbol: "B_{token}",
    name: "Dense token-equivalent byte",
    description:
      "동일 shape의 모든 KV layer가 token 하나를 보존할 때의 byte입니다.",
  },
  {
    symbol: "N_{capacity}",
    name: "Cache token capacity",
    description:
      "Uniform full-attention 근사에서 KV pool에 들어가는 token 수입니다.",
  },
  {
    symbol: "L_{request}",
    name: "요청당 예약 길이",
    description:
      "보수적 상한에서는 max_model_len, trace 기반 계산에서는 각 active request의 실제 길이입니다.",
  },
] as const;

const LOG_TERMS = [
  {
    symbol: "C_{direct}",
    name: "직접 검산한 concurrency",
    description:
      "표시된 cache token 수를 한 max-length request의 token 수로 나눈 값입니다.",
  },
  {
    symbol: "C_{runtime}",
    name: "Runtime 보고 concurrency",
    description:
      "Engine이 cache group과 scheduler 규칙을 반영해 startup log에 표시한 값입니다.",
  },
  {
    symbol: String.raw`\Delta_C`,
    name: "단위 불일치 residual",
    description:
      "두 concurrency 계산의 차이로, 0이 아니면 표시 token의 의미를 더 확인해야 합니다.",
  },
] as const;

const BUDGET = [
  ["Weights", "checkpoint, quantization scale과 metadata"],
  ["Model extras", "vision encoder, drafter, embedding·LM head"],
  ["Runtime", "CUDA graph, workspace, allocator fragmentation"],
  ["KV cache", "토큰당 KV byte × active token 수"],
  ["Headroom", "peak memory와 장애 복구를 위한 여유"],
] as const;

export default function Capacity() {
  return (
    <section id="capacity" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        실측 capacity는 KV shape를 지지하지만, 세 모델의 raw token 수를 그대로
        나누면 안 됩니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 <code>max_model_len=65,536</code>에서 Gemma 4는 KV 88,824 token과
          maximum concurrency 1.36×, Muse Glimmer는 352,736 token과 5.38×를
          기록했습니다. 두 모델은 각각 <code>88,824÷65,536≈1.36</code>,{" "}
          <code>352,736÷65,536≈5.38</code>로 startup log가 직접 맞아떨어집니다.
          Muse가 실제로 약 3.6배 많은 cache token을 확보한 결과는 KV head 2개와
          head_dim 128이라는 작은 shape가 서빙에 유리하다는 결론과 일치합니다.
        </p>
        <p>
          다만 “토큰당 attention KV가 Qwen의 81.25%”라는 이론값과 “총 cache token이 Qwen의
          3.63배”라는 실측값은 같은 비율일 필요가 없습니다. 총 capacity는{" "}
          <code>남은 KV 예산 ÷ 토큰당 KV byte</code>이기 때문입니다. Weight
          quantization은 토큰당 KV byte를 바꾸지 않더라도 weight를 올린 뒤 남는
          KV 예산을 바꿀 수 있고, Qwen의 request당 fixed recurrent state,
          vision encoder·CUDA graph·workspace·TP 구성도 모델마다 다릅니다.
          토큰당 비용을 검증하려면 startup log의 총 token 수뿐 아니라 실제로 KV
          pool과 recurrent-state group에 예약된 byte도 함께 기록해야 합니다.
        </p>

        <h3 id="capacity-sliding" className="scroll-mt-20">
          이번 Gemma 결과에서는 sliding-window 절감이 보이지 않았습니다
        </h3>
        <p>
          Gemma의 50개 local layer가 window 1,024까지만 KV를 보존했다면 context
          65,536에서 full allocation보다 훨씬 작은 증가율을 보여야 합니다.
          그러나 실측에서는 local KV head 16개와 head_dim 256의 넓은 shape가
          먼저 드러났고 concurrency는 1.36×에 머물렀습니다. 따라서 이 vLLM build
          또는 해당 model path가 local layer를 cache allocation에서 full
          attention처럼 취급했을 가능성이 큽니다.
        </p>
        <p>
          vLLM 코드에도 hybrid allocator가 비활성화된 경우 sliding-window
          layer를 <code>FullAttentionSpec</code>으로 바꿔 모든 token의 block을
          할당하는 경로가 명시돼 있습니다. 다만 이 설명은 현재 관측과 구현을
          연결한 추론이므로, 실행 당시의 vLLM commit과 warning log,{" "}
          <code>--disable-hybrid-kv-cache-manager</code> 여부, 생성된 KV cache
          group을 남겨 확정해야 합니다.
        </p>

        <h3>Window를 줄여 max-seq를 늘렸던 판단은 여전히 맞습니다</h3>
        <p>
          Full-style allocation에서는 KV 예산이 고정되어 있으므로 request 하나의{" "}
          <code>max_model_len</code>을 줄이면 동시에 유지할 수 있는 sequence
          수가 늘어납니다. 그래서 window를 줄인 뒤 <code>max_num_seqs</code>를
          올린 것은 memory slot을 실제 scheduler concurrency로 바꾸는 올바른
          tuning이었습니다. Hybrid allocator가 local block을 회수하는
          model이라면 이 맞바꿈이 완화될 수 있지만, 이번 Gemma 관측처럼 절감이
          나타나지 않는 runtime에서는 기존 계산을 그대로 적용해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="고정된 KV pool에서 max context를 줄이면 왜 동시에 유지할 수 있는 요청 수가 늘어날까요?"
        idea={
          <>
            Uniform full-attention에서는 token 하나의 cache 비용이 일정합니다.
            KV pool byte를 토큰당 byte로 나누면 총 slot이 나오고, 그 slot을 요청
            하나가 예약하는 길이로 다시 나누면 동시에 유지할 수 있는 max-length
            sequence의 보수적 상한이 됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
N_{capacity} &= \left\lfloor\frac{M_{pool}}{B_{token}}\right\rfloor \\
C_{max} &\le \left\lfloor\frac{N_{capacity}}{L_{request}}\right\rfloor
\end{aligned}`}
        terms={CAPACITY_TERMS}
        assumptions={[
          "모든 layer가 같은 full-attention KV shape를 쓰는 단순 근사입니다. Hybrid layer는 앞 절의 layer별 memory 식으로 바꿉니다.",
          "Prefix-cache sharing, block rounding, speculative branch, encoder token과 request별 길이 차이는 제외합니다.",
          "max_num_seqs는 이 memory 상한 아래에서 scheduler가 허용할 요청 수를 제한할 뿐 KV pool을 늘리지 않습니다.",
        ]}
        interpretation="M_pool과 B_token이 고정이면 L_request를 절반으로 줄였을 때 이론적 C_max는 최대 두 배가 됩니다. 다만 실제 트래픽에서는 요청 길이가 서로 다르므로 마지막 승인은 active request 길이의 합과 latency·preemption을 함께 보는 load test로 해야 합니다."
        title="KV capacity와 동시성 상한"
      />

      <VllmCapacityLogViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="capacity-logs" className="scroll-mt-20">
          Qwen의 97,216과 5.17×은 같은 token 단위가 아닙니다
        </h3>
        <p>
          Qwen 행은 별도로 다뤄야 합니다. <code>97,216÷65,536≈1.48</code>인데
          runtime은 5.17×를 보고했으므로, 97,216을 Gemma·Muse의 cache token과
          같은 의미로 놓을 수 없습니다. Runtime이 concurrency 계산에 사용한
          max-length capacity는{" "}
          <code>65,536×5.17≈338,821 token-equivalent</code>입니다. 이는 hybrid
          cache grouping이나 표시 방식의 차이를 확인해야 할 신호이지, 97,216개의
          slot이 물리적으로 338,821개로 늘었다는 뜻은 아닙니다.
        </p>
        <p>
          따라서 운영 상한은 maximum-concurrency 한 줄만으로 확정하지 않습니다.
          실제 prompt 길이 분포를 넣고 active sequence를 늘리면서 GPU KV usage,
          preemption, TTFT와 inter-token latency를 함께 봅니다.{" "}
          <code>max_num_seqs</code>는 cache를 새로 만드는 옵션이 아니라
          scheduler가 유지할 sequence의 상한이므로, cache가 허용하는 수보다
          작으면 자원을 덜 쓰고 훨씬 크게 잡는다고 memory가 늘어나지는 않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Startup log의 ‘GPU KV cache size’와 ‘maximum concurrency’가 같은 단위인지 어떻게 확인할까요?"
        idea={
          <>
            먼저 표시된 cache token 수를 max_model_len으로 나눕니다. 그 값이
            runtime concurrency와 맞으면 단순 token capacity로 읽을 수 있고,
            차이가 크면 hybrid group·padding·token-equivalent 같은 다른 표시
            기준이 섞였다고 보고 원 로그와 cache spec을 확인합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
C_{direct} &= \frac{N_{log}}{L_{max}} \\
\Delta_C &= C_{runtime}-C_{direct}
\end{aligned}`}
        terms={LOG_TERMS}
        assumptions={[
          "두 로그가 같은 engine process·model load·TP/PP·kv_cache_dtype·max_model_len에서 나온 값이어야 합니다.",
          "Delta가 0에 가까운지는 표시 반올림 오차 범위에서 판단합니다.",
          "Delta는 오류의 원인을 알려 주는 증명이 아니라 단위·grouping을 추가 조사하게 하는 consistency check입니다.",
        ]}
        interpretation="Gemma와 Muse는 Δ_C가 반올림 범위에서 0이지만 Qwen 관측은 5.17−1.48≈3.69입니다. 따라서 Qwen의 97,216을 다른 두 모델의 raw cache token과 같은 열에서 비율 계산하는 대신, 해당 build의 cache-group log와 commit을 먼저 확인해야 합니다."
        title="vLLM capacity log 검산"
      />

      <div
        data-viz="serving-memory-budget"
        className="not-prose my-12 rounded-xl border border-border/70 bg-card p-5 sm:p-7"
      >
        <p className="text-xs font-bold text-primary">
          Per-replica VRAM budget
        </p>
        <h3 className="mt-2 text-lg font-bold">
          총 KV token 수는 토큰당 shape와 남은 memory를 함께 측정해야 설명됩니다
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {BUDGET.map(([label, detail], index) => (
            <article
              key={label}
              className="rounded-xl border bg-background p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm">{label}</strong>
                <span className="font-mono text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-xl border bg-muted/25 px-4 py-3 text-center font-mono text-xs font-bold sm:text-sm">
          N<sub>KV</sub> ≈ (VRAM − weights − extras − runtime − headroom) ÷ B
          <sub>token</sub>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="capacity-admission" className="scroll-mt-20">
          수용 인원은 최대 context 하나가 아니라 요청 길이 분포로 정합니다
        </h3>
        <p>
          모든 사용자에게 65,536 token을 예약하지는 않습니다. 업무 로그의
          input·output token p50·p95, multimodal token 수, prefix-cache hit
          rate를 workload trace로 만들고, 동시에 active한 요청의 KV 합이 예산을
          넘지 않도록 admission policy를 정합니다. 마지막에는
          beginning·middle·end needle과 실제 문서 질의를 함께 사용해 긴
          context가 단순히 실행만 되는 것이 아니라 필요한 정보를 회수하는지도
          확인합니다.
        </p>
      </div>
    </section>
  );
}
