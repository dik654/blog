import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "fundamentals",
    label: "상태",
    detail: "새 위치의 K·V를 남기고 다음 위치에서 다시 읽습니다.",
    href: "/cs/ai/kv-cache-fundamentals",
  },
  {
    id: "quantization",
    label: "표현",
    detail: "같은 K·V를 더 작은 숫자 형식으로 쓰고 복원합니다.",
    href: "/cs/ai/kv-cache-quantization",
  },
  {
    id: "allocation",
    label: "할당",
    detail: "요청마다 다른 길이의 기록을 block 단위로 배정합니다.",
    href: "/cs/ai/vllm-paged-attention",
  },
  {
    id: "reuse",
    label: "재사용",
    detail: "앞부분이 같은 요청끼리 이미 만든 block을 공유합니다.",
    href: "/cs/ai/prefix-caching-radix-attention",
  },
] as const;

type KVCacheStep = (typeof STEPS)[number]["id"];

const CLOSURE: Record<KVCacheStep, string> = {
  fundamentals:
    "KV cache는 요청마다 생기는 계산 상태입니다. Q는 현재 조회에 쓰고, K·V는 다음 위치에서도 읽도록 남깁니다.",
  quantization:
    "양자화는 KV의 위치나 head 수를 없애지 않습니다. 저장 원소의 표현 폭을 줄이고, 쓰기와 읽기 사이에 scale 계약을 추가합니다.",
  allocation:
    "PagedAttention은 KV의 수학적 의미를 바꾸지 않고, 가변 길이 상태를 고정 크기 block으로 나눠 물리 공간에 배정합니다.",
  reuse:
    "Prefix cache는 모델·토큰·위치 조건이 같은 앞부분의 KV block만 재사용하며, 이후 다른 부분은 요청별로 갈라집니다.",
};

export function KVCacheSeriesLocator({ current }: { current: KVCacheStep }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  const currentStep = STEPS[currentIndex];

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="추론에서 KV cache가 상태에서 재사용으로 이어지는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">
          Transformer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/vllm-serving" className="hover:text-primary">
          추론 엔진
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          KV cache · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-3 sm:grid-cols-4" aria-label="KV cache의 네 단계">
        {STEPS.map((step, index) => {
          const active = step.id === current;
          return (
            <Link
              key={step.id}
              to={step.href}
              aria-current={active ? "step" : undefined}
              className={`relative min-w-0 border-t-2 px-1 pt-3 ${
                active
                  ? "border-primary text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              <span className="text-[9px] font-bold">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{step.label}</strong>
              <span className="mt-1 block text-[10px] leading-4">{step.detail}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div>
          <p className="text-[9px] font-bold text-primary">현재 글이 확인할 경계</p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">{CLOSURE[current]}</p>
        </div>
        <div className="border-l-2 border-primary/40 pl-3 text-[11px] leading-5 text-muted-foreground">
          <strong className="block text-foreground">같은 상태, 서로 다른 결정</strong>
          무엇을 남길지, 어떤 숫자로 쓸지, 어디에 놓을지, 언제 공유할지는 각각 다른 단계가 결정합니다.
        </div>
      </div>
    </aside>
  );
}

export function KVCacheSeriesMapReturn({ current }: { current: KVCacheStep }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[currentIndex + 1];

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 KV cache 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{CLOSURE[current]}</p>
      {next ? (
        <Link
          to={next.href}
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 결정 · {next.label} →
        </Link>
      ) : (
        <Link
          to="/cs/ai/vllm-serving"
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          추론 엔진 전체 흐름으로 돌아가기 →
        </Link>
      )}
    </aside>
  );
}
