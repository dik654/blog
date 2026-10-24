import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "structure",
    label: "기억의 모양",
    track: "구조",
    detail: "Token별 KV를 남기는 attention과 같은 크기 state를 갱신하는 DeltaNet을 층마다 나눕니다.",
    href: "/cs/ai/qwen36-hybrid-architecture",
  },
  {
    id: "runtime",
    label: "요청 상태",
    track: "수명",
    detail: "KV·recurrent matrix·convolution history를 같은 accepted prefix에 맞춰 commit하고 되돌립니다.",
    href: "/cs/ai/qwen36-hybrid-runtime",
  },
  {
    id: "sparse",
    label: "희소 변형",
    track: "참고",
    detail: "같은 3:1 리듬에서 full attention을 indexer가 고른 일부 위치만 읽는 희소 attention으로 바꿉니다.",
    href: "/cs/ai/qwen38-flash-next-architecture",
  },
] as const;

type HybridSequenceStep = (typeof STEPS)[number]["id"];

const FINDINGS: Record<HybridSequenceStep, string> = {
  structure:
    "64층을 한 종류로 세면 기억 크기를 틀립니다. Qwen3.6은 16개 attention 층에 token별 KV를, 48개 DeltaNet 층에 요청당 고정 state를 남깁니다.",
  runtime:
    "모양이 다른 세 상태도 하나의 요청 과거를 나타냅니다. Prefill·decode·추측 실행 뒤에는 KV·Delta state·convolution history가 같은 승인 경계에 있어야 합니다.",
  sparse:
    "Qwen3.8은 3:1 혼합 리듬을 유지하면서 full attention을 희소 조회로 바꿉니다. 그 결과 요청 상태에 KV뿐 아니라 indexer key가 추가됩니다.",
};

const NEXT: Record<HybridSequenceStep, HybridSequenceStep | null> = {
  structure: "runtime",
  runtime: "sparse",
  sparse: null,
};

export function HybridSequenceSeriesLocator({ current }: { current: HybridSequenceStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="한 모델이 두 종류의 기억을 만들고 요청 상태로 넘기는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/linear-attention-and-state-space-models" className="hover:text-primary">
          Sequence mixer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/hybrid-kv-cache-allocation" className="hover:text-primary">
          서로 다른 기억
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          하이브리드 모델 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-x-3 gap-y-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <StepLink key={step.id} step={step} index={index} active={step.id === current} />
        ))}
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div>
          <p className="text-[9px] font-bold text-primary">이 글이 확인할 질문</p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">{FINDINGS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/40 pl-3 text-[11px] leading-5 text-muted-foreground">
          <strong className="block text-foreground">모양과 수명을 나눠 봅니다</strong>
          모델 구조는 어떤 상태가 생기는지 정하고, 런타임은 그 상태를 언제 만들고 확정하고 버릴지 정합니다.
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
      className={`grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t-2 pt-3 ${
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

export function HybridSequenceMapReturn({ current }: { current: HybridSequenceStep }) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 하이브리드 모델 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/expert-parallelism-moe-systems"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 확대 · ${next.label} →` : "다음 주제 · 여러 GPU에 expert를 나누는 방법 →"}
      </Link>
    </aside>
  );
}
