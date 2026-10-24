import { Link } from "react-router-dom";

const CORE_STEPS = [
  {
    id: "budget",
    label: "예산",
    detail: "가중치·KV·작업 공간이 GPU 메모리 안에 들어가는지 byte 단위로 셉니다.",
    href: "/cs/ai/model-vram-budgeting",
  },
  {
    id: "startup",
    label: "기동",
    detail: "프로세스를 나누고 가중치 적재·profile·warmup을 거쳐 요청 가능한 상태를 만듭니다.",
    href: "/cs/ai/inference-runtime-anatomy",
  },
  {
    id: "capacity",
    label: "수용",
    detail: "확정된 KV 공간을 요청 길이와 지연 조건을 만족하는 동시 요청 수로 바꿉니다.",
    href: "/cs/ai/llm-serving-capacity",
  },
  {
    id: "multimodal",
    label: "확장",
    detail: "사진이 encoder 계산·문장 자리·KV·cache key를 어떻게 더하는지 추적합니다.",
    href: "/cs/ai/multimodal-serving-pipeline",
  },
] as const;

const IMPLEMENTATIONS = [
  {
    id: "sglang",
    label: "SGLang",
    detail: "token 단위 KV 칸, 수용 비율, retract, CPU–GPU 겹침을 고정 소스에서 확인합니다.",
    href: "/cs/ai/sglang-runtime-anatomy",
  },
  {
    id: "local",
    label: "llama.cpp",
    detail: "한 기기의 KV cell, 블록 양자화, CPU·GPU 층 배치를 고정 소스에서 확인합니다.",
    href: "/cs/ai/llama-cpp-local-inference",
  },
] as const;

const ALL_STEPS = [...CORE_STEPS, ...IMPLEMENTATIONS] as const;
type InferenceRuntimeStep = (typeof ALL_STEPS)[number]["id"];

const FINDINGS: Record<InferenceRuntimeStep, string> = {
  budget:
    "모델 이름이나 parameter 수만으로 적재 여부를 판정할 수 없습니다. 가중치, 요청별 상태, 실행 중 임시 공간과 안전 여유를 같은 byte 장부에 올려야 합니다.",
  startup:
    "Replica는 프로세스가 떴다고 준비된 것이 아닙니다. shard 적재, peak 측정, KV pool 확정, graph·kernel warmup을 마쳐야 요청을 받을 수 있습니다.",
  capacity:
    "KV token 수를 사용자 수로 바로 읽을 수 없습니다. 요청 길이 분포, block rounding, preemption과 지연 목표를 적용해야 실제 admission 상한이 됩니다.",
  multimodal:
    "사진은 별도 부속물이 아닙니다. encoder 계산을 거친 뒤 문장 자리를 차지하고 KV와 cache key, scheduling 예산까지 바꿉니다.",
  sglang:
    "SGLang은 실행 중 요청의 미래 출력을 비율로 예약하고, 예상이 빗나가면 retract하며, CPU 준비와 GPU 실행을 겹칩니다.",
  local:
    "llama.cpp는 여러 요청의 KV를 하나의 cell 배열과 sequence bit로 구분하고, 양자화와 layer offload로 한 기기의 메모리 경계를 맞춥니다.",
};

const NEXT: Record<InferenceRuntimeStep, InferenceRuntimeStep | null> = {
  budget: "startup",
  startup: "capacity",
  capacity: "multimodal",
  multimodal: "sglang",
  sglang: "local",
  local: null,
};

function StepLink({
  step,
  index,
  active,
}: {
  step: (typeof ALL_STEPS)[number];
  index: number;
  active: boolean;
}) {
  return (
    <Link
      to={step.href}
      aria-current={active ? "step" : undefined}
      className={`group grid min-w-0 grid-cols-[1.55rem_minmax(0,1fr)] gap-2 border-t-2 pt-3 ${
        active
          ? "border-primary text-foreground"
          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
      }`}
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full border text-[9px] font-bold ${
          active ? "border-primary bg-primary text-primary-foreground" : "border-border"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <strong className="block break-keep text-xs leading-5">{step.label}</strong>
        <span className="mt-1 block text-[10px] leading-4">{step.detail}</span>
      </span>
    </Link>
  );
}

export function InferenceRuntimeSeriesLocator({
  current,
}: {
  current: InferenceRuntimeStep;
}) {
  const currentStep = ALL_STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="모델 파일에서 요청 가능한 추론 replica까지 이어지는 지도"
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
          실행 가능한 replica · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4">
        <p className="text-[9px] font-bold text-primary">공통 원리 · 한 replica가 준비되고 요청을 받는 순서</p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
          {CORE_STEPS.map((step, index) => (
            <StepLink key={step.id} step={step} index={index} active={step.id === current} />
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-[9px] font-bold text-muted-foreground">구현 참고 · 같은 원리가 실제 코드에서 달라지는 지점</p>
        <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
          {IMPLEMENTATIONS.map((step, index) => (
            <StepLink
              key={step.id}
              step={step}
              index={CORE_STEPS.length + index}
              active={step.id === current}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_17rem] sm:items-start">
        <div>
          <p className="text-[9px] font-bold text-primary">이 글이 확인할 질문</p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">{FINDINGS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/40 pl-3 text-[11px] leading-5 text-muted-foreground">
          <strong className="block text-foreground">순서와 구현을 분리해 읽습니다</strong>
          위 네 단계는 공통 원리입니다. 아래 두 글은 그 다음 단계가 아니라 같은 원리를 서로 다른 구현에서 확인하는 참고 경로입니다.
        </div>
      </div>
    </aside>
  );
}

export function InferenceRuntimeMapReturn({
  current,
}: {
  current: InferenceRuntimeStep;
}) {
  const nextId = NEXT[current];
  const next = nextId ? ALL_STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 추론 replica 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      {next ? (
        <Link
          to={next.href}
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 확대 · {next.label} →
        </Link>
      ) : (
        <Link
          to="/cs/ai/inference-engine-design-axes"
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          추론 엔진 비교 지도로 돌아가기 →
        </Link>
      )}
    </aside>
  );
}
