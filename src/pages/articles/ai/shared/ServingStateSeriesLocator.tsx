import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "adapter",
    label: "Adapter 상태",
    track: "선택",
    detail: "요청이 고른 LoRA·soft prompt를 base 가중치와 분리해 적재하고 batch 안에서 섞어 계산합니다.",
    href: "/cs/ai/multi-adapter-serving",
  },
  {
    id: "layers",
    label: "층별 KV",
    track: "보관",
    detail: "Global·local 층의 읽기 범위가 다를 때 실제 block 소유량도 줄어드는지 구분합니다.",
    href: "/cs/ai/hybrid-kv-cache-allocation",
  },
  {
    id: "window",
    label: "창 밖 KV",
    track: "회수",
    detail: "창 밖 block을 돌려주는 시점과 처음 token을 남겨야 하는 attention sink 조건을 추적합니다.",
    href: "/cs/ai/sliding-window-kv-and-attention-sinks",
  },
] as const;

type ServingStateStep = (typeof STEPS)[number]["id"];

const FINDINGS: Record<ServingStateStep, string> = {
  adapter:
    "Base 가중치는 공유해도 요청마다 고른 adapter는 별도 상태입니다. Kernel의 구간 표, GPU·CPU 적재 한도, KV 재사용 key가 adapter의 정체를 함께 지켜야 합니다.",
  layers:
    "Attention이 최근 위치만 읽는 규칙과 KV block을 실제로 반환하는 규칙은 다릅니다. 층별 보존량은 allocator가 창 밖 block의 소유권을 해제할 때만 줄어듭니다.",
  window:
    "창 밖 KV는 block 경계에서 반환할 수 있지만, 창 없이 학습한 모델은 처음 token의 attention sink까지 버리면 분포가 무너질 수 있습니다.",
};

const NEXT: Record<ServingStateStep, ServingStateStep | null> = {
  adapter: "layers",
  layers: "window",
  window: null,
};

export function ServingStateSeriesLocator({ current }: { current: ServingStateStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="한 replica가 요청별 가중치와 기록을 GPU에 보관하는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">
          Transformer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/inference-runtime-anatomy" className="hover:text-primary">
          추론 replica
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          요청별 GPU 상태 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-x-4 gap-y-4 sm:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-[9px] font-bold text-primary">요청이 선택하는 상태</p>
          <StepLink step={STEPS[0]} index={0} active={current === "adapter"} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-primary">요청이 실행되며 생기는 상태</p>
          <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2">
            {STEPS.slice(1).map((step, index) => (
              <StepLink key={step.id} step={step} index={index + 1} active={step.id === current} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div>
          <p className="text-[9px] font-bold text-primary">이 글이 확인할 질문</p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">{FINDINGS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/40 pl-3 text-[11px] leading-5 text-muted-foreground">
          <strong className="block text-foreground">같은 GPU 메모리라도 수명이 다릅니다</strong>
          Adapter는 요청이 선택해 적재하고, KV는 token을 생성하며 늘어납니다. 둘의 소유자·cache key·회수 조건을 따로 봅니다.
        </div>
      </div>
    </aside>
  );
}

function StepLink({
  step,
  index,
  active,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: boolean;
}) {
  return (
    <Link
      to={step.href}
      aria-current={active ? "step" : undefined}
      className={`mt-2 grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t-2 pt-3 ${
        active
          ? "border-primary text-foreground"
          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
      }`}
    >
      <span
        className={`flex size-7 items-center justify-center rounded-full border text-[10px] font-bold ${
          active ? "border-primary bg-primary text-primary-foreground" : "border-border"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <strong className="break-keep text-sm leading-5">{step.label}</strong>
          <span className="text-[9px] font-bold text-primary">{step.track}</span>
        </span>
        <span className="mt-1 block break-keep text-[11px] leading-5">{step.detail}</span>
      </span>
    </Link>
  );
}

export function ServingStateMapReturn({ current }: { current: ServingStateStep }) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 요청별 GPU 상태 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/qwen36-hybrid-architecture"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 확대 · ${next.label} →` : "다음 주제 · 두 종류의 기억을 쓰는 모델 →"}
      </Link>
    </aside>
  );
}
