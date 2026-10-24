import { Link } from "react-router-dom";

const CORE_STEPS = [
  {
    id: "submission",
    label: "제출",
    detail: "CPU가 작업을 준비·전달하고 GPU stream이 실행하는 두 시간축을 나란히 봅니다.",
    href: "/cs/ai/launch-overhead-and-cpu-gpu-synchronization",
  },
  {
    id: "replay",
    label: "재생",
    detail: "같은 작업 순서와 주소를 기록해 반복 제출 비용을 줄이는 조건을 확인합니다.",
    href: "/cs/ai/cuda-graph-capture",
  },
  {
    id: "traffic",
    label: "이동",
    detail: "Attention 중간값을 모두 저장하지 않고 조각별 상태만 남겨 HBM 왕복을 줄입니다.",
    href: "/cs/ai/flash-attention-io-aware-kernel",
  },
  {
    id: "kernel",
    label: "커널",
    detail: "입력 모양과 mask, 작업 분할에 맞는 attention 구현과 설정을 고릅니다.",
    href: "/cs/ai/attention-kernel-anatomy-and-backends",
  },
] as const;

const REFERENCES = [
  {
    id: "trtllm",
    label: "TensorRT-LLM",
    detail: "KV 예약·보존 정책과 fused attention kernel이 한 엔진에서 만나는 지점을 봅니다.",
    href: "/cs/ai/tensorrt-llm-kv-cache-and-kernels",
  },
  {
    id: "comparison",
    label: "엔진 비교",
    detail: "같은 요청을 네 엔진에 넣고 저장·예약·재사용·겹침·kernel 결정을 같은 눈금으로 봅니다.",
    href: "/cs/ai/inference-engine-design-axes",
  },
] as const;

const ALL_STEPS = [...CORE_STEPS, ...REFERENCES] as const;
type ExecutionKernelStep = (typeof ALL_STEPS)[number]["id"];

const FINDINGS: Record<ExecutionKernelStep, string> = {
  submission:
    "GPU 계산이 짧아도 CPU가 다음 작업을 늦게 제출하거나 너무 넓은 범위를 기다리면 실행열이 빕니다. 제출 완료와 계산 완료를 같은 시각으로 보면 원인을 놓칩니다.",
  replay:
    "CUDA Graph는 계산을 없애는 기능이 아닙니다. 작업 순서와 주소를 한 번 준비해 반복 제출 경로를 줄이며, 입력 모양·주소·수명이 기록과 맞아야 합니다.",
  traffic:
    "FlashAttention은 같은 attention 출력을 유지하면서 점수 행렬의 저장·재읽기를 피합니다. 조각마다 기준값과 지수합·가중합을 갱신해야 같은 답을 얻습니다.",
  kernel:
    "Backend 이름만으로 실행 경로를 정할 수 없습니다. Causal 위치 정렬, prefill·decode 모양, 분할 결과 합치기, 지원 dtype과 workspace를 함께 확인해야 합니다.",
  trtllm:
    "TensorRT-LLM의 동시 수용과 실행 특성은 paged KV라는 이름 하나가 아니라 미래 출력 예약, pool 배치, 보존 정책과 attention kernel의 결합에서 나옵니다.",
  comparison:
    "엔진 차이는 단일 kernel 순위보다 저장 단위, 미래 출력 예약, prefix 색인, CPU–GPU 겹침, kernel 소유 경계라는 다섯 결정에서 읽는 편이 정확합니다.",
};

const NEXT: Record<ExecutionKernelStep, ExecutionKernelStep | null> = {
  submission: "replay",
  replay: "traffic",
  traffic: "kernel",
  kernel: "trtllm",
  trtllm: "comparison",
  comparison: null,
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

export function ExecutionKernelSeriesLocator({
  current,
}: {
  current: ExecutionKernelStep;
}) {
  const currentStep = ALL_STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="GPU 요청이 CPU 제출에서 attention kernel까지 내려가는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">
          Transformer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/inference-runtime-anatomy" className="hover:text-primary">
          추론 복제본
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          GPU 실행 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4">
        <p className="text-[9px] font-bold text-primary">공통 원리 · 같은 계산의 제출과 데이터 이동을 줄이는 순서</p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
          {CORE_STEPS.map((step, index) => (
            <StepLink key={step.id} step={step} index={index} active={step.id === current} />
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-[9px] font-bold text-muted-foreground">구현 참고 · 엔진이 위 결정을 조합하는 방식</p>
        <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
          {REFERENCES.map((step, index) => (
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
          <strong className="block text-foreground">계산량과 기다림을 따로 셉니다</strong>
          제출 횟수, GPU 계산, 메모리 이동, 결과 동치 중 무엇이 바뀌었는지 같은 시간표와 수치 사례에서 확인합니다.
        </div>
      </div>
    </aside>
  );
}

export function ExecutionKernelMapReturn({
  current,
}: {
  current: ExecutionKernelStep;
}) {
  const nextId = NEXT[current];
  const next = nextId ? ALL_STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 GPU 실행 지도에 되돌려 놓기"
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
          to="/cs/ai/vllm-spec-decode"
          className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 최적화 · 생성 단계를 줄이는 방법 →
        </Link>
      )}
    </aside>
  );
}
