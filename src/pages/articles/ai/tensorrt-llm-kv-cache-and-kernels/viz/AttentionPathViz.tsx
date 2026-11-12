import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attention-op — 층 하나의 attention 앞에서 하는 일(RoPE, KV 쓰기, FP8이면 양자화)을
 * TensorRT-LLM은 invokeQKVPreprocessing 한 번에 묶고 fused MHA로 넘긴다(context 단계).
 * vLLM은 모델 층이 RoPE를 먼저 적용하고 do_kv_cache_update의 reshape_and_cache_flash가 K·V를 따로 쓴 뒤
 * flash_attn_varlen_func에 block_table을 넘긴다.
 */
interface Step {
  name: string;
  detail: string;
}

const TRT: readonly Step[] = [
  { name: "invokeQKVPreprocessing 한 번", detail: "bias · RoPE · KV cache 쓰기 · 양자화 출력" },
  { name: "fused multi-head attention", detail: "cache와 attention 계산" },
];

const VLLM: readonly Step[] = [
  { name: "모델 층의 RoPE", detail: "위치 정보를 먼저 넣음" },
  { name: "reshape_and_cache_flash", detail: "K·V를 slot 위치에 따로 씀" },
  { name: "flash_attn_varlen_func", detail: "block_table을 넘겨 attention" },
];

const JOBS = ["RoPE 적용", "새 K·V를 cache에 쓰기", "FP8 KV면 쓰기 전 양자화", "cache 전체와 attention"] as const;

const SCENES = [
  { label: "층 하나에서 할 일", summary: "RoPE → KV 쓰기 → attention", lit: "jobs", note: "Q·K·V를 받으면 위치 정보를 넣는 RoPE를 적용하고, 새 K·V를 cache에 쓰고, cache 전체와 attention을 계산합니다. FP8 KV라면 쓰기 전에 양자화도 합니다. 두 엔진의 차이는 이 일을 몇 번의 호출로 나누느냐입니다." },
  { label: "TensorRT-LLM context 단계", summary: "앞의 일을 한 묶음으로", lit: "trt", note: "attentionOp.cpp가 bias, RoPE 계수, KV cache 버퍼, 양자화 출력 버퍼를 한 parameter 묶음에 담아 invokeQKVPreprocessing 한 번으로 넘깁니다. 그 뒤 fused multi-head attention kernel이 attention을 계산합니다." },
  { label: "vLLM FlashAttention backend", summary: "RoPE와 KV 쓰기가 따로", lit: "vllm", note: "RoPE는 모델 층이 먼저 적용하고, do_kv_cache_update가 reshape_and_cache_flash로 K·V를 slot 위치에 따로 씁니다. attention은 외부 FlashAttention 함수가 block_table을 받아 계산합니다." },
  { label: "합친 쪽이 얻고 내주는 것", summary: "왕복 감소 ↔ 지원 조합 부담", lit: "both", note: "합치면 Q·K·V를 GPU 메모리에서 읽고 쓰는 왕복이 줄어듭니다. 대신 kernel 하나가 맡는 조합이 많아져, 모델 구조나 dtype이 바뀔 때마다 그 kernel 쪽에 지원을 넣어야 합니다." },
] as const;

function Lane({ title, steps, lit, color }: { title: string; steps: readonly Step[]; lit: boolean; color: string }) {
  return (
    <div className={`min-w-0 transition-opacity duration-300 motion-reduce:transition-none ${lit ? "opacity-100" : "opacity-35"}`}>
      <p className="mb-2 text-xs font-bold" style={{ color }}>
        {title}
      </p>
      <ol className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
        {steps.map((step, index) => (
          <li key={step.name} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 rounded-md border px-2 py-1.5 sm:px-3 sm:py-2" style={{ borderColor: color }}>
              <p className="font-mono text-[10px] font-bold leading-4 [overflow-wrap:anywhere] sm:text-xs">
                {index + 1}. {step.name}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{step.detail}</p>
            </div>
            {index < steps.length - 1 && (
              <span className="hidden shrink-0 text-center text-xs text-muted-foreground sm:block" aria-hidden>
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AttentionPathViz() {
  return (
    <SceneShell
      eyebrow="attention 앞의 일"
      title="같은 일을 TensorRT-LLM은 한 묶음으로, vLLM은 나눠서 부릅니다"
      description="위 칩은 층 하나의 attention에서 할 일이고, 아래 두 줄은 각 엔진이 그 일을 부르는 순서입니다. 번호가 호출 순서입니다."
      note="TensorRT-LLM 줄은 context 단계 경로입니다. 줄의 칸 수는 본문이 적은 단계 이름의 수이며, 메모리 왕복 횟수를 잰 값이 아닙니다."
      ariaLabel="TensorRT-LLM과 vLLM의 attention 전처리 호출 순서 비교"
      scenes={SCENES}
      render={(active) => {
        const lit = SCENES[active].lit;
        return (
          <div className="min-w-0 space-y-3 sm:space-y-4">
            <ul className={`flex-wrap gap-1.5 sm:flex sm:gap-2 transition-opacity duration-300 motion-reduce:transition-none ${lit === "jobs" ? "flex opacity-100" : "hidden opacity-50"}`}>
              {JOBS.map((job) => (
                <li key={job} className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-[11px]">
                  {job}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
              <Lane title="TensorRT-LLM" steps={TRT} lit={lit === "trt" || lit === "both"} color="#059669" />
              <Lane title="vLLM" steps={VLLM} lit={lit === "vllm" || lit === "both"} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}
