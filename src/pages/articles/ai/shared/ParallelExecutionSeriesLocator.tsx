import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "experts",
    label: "선택 계산",
    track: "개념",
    detail: "Token이 고른 expert만 다른 GPU로 보내 계산하고 원래 token 위치로 결과를 돌려놓습니다.",
    href: "/cs/ai/expert-parallelism-moe-systems",
  },
  {
    id: "axes",
    label: "분할 축",
    track: "개념",
    detail: "행렬·층·요청·token 열 가운데 무엇을 나누는지에 따라 통신의 모양이 달라집니다.",
    href: "/cs/ai/tensor-and-pipeline-parallel-inference",
  },
  {
    id: "placement",
    label: "물리 배치",
    track: "실무",
    detail: "통신이 잦은 축은 빠른 링크 안에 두고, 후보 배치는 같은 부하에서 측정해 선택합니다.",
    href: "/cs/ai/parallelism-strategy-and-placement",
  },
] as const;

type ParallelExecutionStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<ParallelExecutionStep, string> = {
  experts: "선택된 expert가 다른 GPU에 있으면 어떤 값을 보내고, 어떤 결과를 기다려야 할까요?",
  axes: "TP·PP·DP·context parallel은 각각 무엇을 나누고 어떤 통신을 만들까요?",
  placement: "같은 GPU 수에서도 어느 분할 축을 빠른 링크 안에 놓아야 할까요?",
};

const FINDINGS: Record<ParallelExecutionStep, string> = {
  experts:
    "Expert를 나누면 모든 가중치를 복제하지 않아도 되지만, token 입력과 결과가 선택된 expert까지 왕복합니다. 평균 전송량뿐 아니라 가장 늦은 expert GPU가 층의 완료 시점을 정합니다.",
  axes:
    "TP는 층 안의 부분합, PP는 층 구간 사이 activation, context parallel은 KV block을 옮깁니다. DP는 모델을 복제하므로 한 번의 forward 안에서는 이 통신이 없습니다.",
  placement:
    "분할 숫자만 정해서는 충분하지 않습니다. 층마다 통신하는 TP를 노드 안의 빠른 링크에 가두고, 실제 rank와 GPU 대응 및 통신 시간을 확인해야 합니다.",
};

const NEXT: Record<ParallelExecutionStep, ParallelExecutionStep | null> = {
  experts: "axes",
  axes: "placement",
  placement: null,
};

export function ParallelExecutionSeriesLocator({ current }: { current: ParallelExecutionStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="한 모델의 계산을 여러 GPU에 나누는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/vllm-serving" className="hover:text-primary">
          모델 서빙
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/model-vram-budgeting" className="hover:text-primary">
          한 복사본의 자원
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          여러 GPU 실행 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-x-3 gap-y-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t-2 pt-3 ${
              step.id === current
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            <span
              className={`flex size-7 items-center justify-center rounded-full border text-[10px] font-bold ${
                step.id === current ? "border-primary bg-primary text-primary-foreground" : "border-border"
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
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[9px] font-bold text-primary">이 글이 답할 질문</p>
        <p className="mt-1 break-keep text-sm font-bold leading-6">{QUESTIONS[current]}</p>
      </div>
    </aside>
  );
}

export function ParallelExecutionMapReturn({ current }: { current: ParallelExecutionStep }) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 여러 GPU 실행 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/disaggregated-prefill-decode-serving"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 확대 · ${next.label} →` : "다음 주제 · 입력 처리와 생성을 서로 다른 GPU 풀에 나누기 →"}
      </Link>
    </aside>
  );
}
