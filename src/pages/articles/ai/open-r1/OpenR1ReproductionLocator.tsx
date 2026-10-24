import { Link } from "react-router-dom";

const STAGES = [
  {
    label: "재현 범위",
    detail: "Distillation·pure RL·multi-stage 중 어떤 주장을 재현할지 고릅니다.",
    href: "#overview",
  },
  {
    label: "SFT 경계",
    detail: "고정된 teacher trace에서 실제로 loss를 받는 token을 정합니다.",
    href: "#sft-process",
  },
  {
    label: "온라인 갱신",
    detail: "현재 policy가 rollout을 만들고 상대 reward로 다음 policy를 갱신합니다.",
    href: "#grpo-process",
  },
  {
    label: "검증기",
    detail: "정답·형식·code test가 보는 것과 놓치는 것을 구분합니다.",
    href: "#reward-system",
  },
  {
    label: "데이터 계보",
    detail: "생성·파싱·검증·탈락 사유를 다시 계산할 수 있게 남깁니다.",
    href: "#data-pipeline",
  },
  {
    label: "평가 계약",
    detail: "Prompt·sampling·scoring 조건과 불확실성을 score에 붙입니다.",
    href: "#evaluation",
  },
] as const;

export function OpenR1ReproductionLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Open-R1 재현 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/llm-training-stages" className="hover:text-primary">
          LLM 학습 단계
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          Open-R1 재현
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            프로젝트 해설
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            공개 checkpoint가 아니라 학습 recipe를 재현하려면 어떤 상태와 증거를 끝까지 보존해야 합니까?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            직속 부모 지도
          </p>
          <Link
            to="/cs/ai/llm-training-stages#stage-map"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            Pretraining 뒤 SFT와 preference·RL 단계를 구분하기 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="Open-R1 recipe를 재현하는 여섯 단계"
      >
        {STAGES.map((stage, index) => (
          <a
            key={stage.label}
            href={stage.href}
            className="min-w-0 bg-background px-3 py-3 text-foreground hover:text-primary"
          >
            <span className="font-mono text-[9px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="mt-1 block break-keep text-xs leading-5">
              {stage.label}
            </strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
              {stage.detail}
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function OpenR1ReproductionMapReturn() {
  return (
    <aside
      id="open-r1-reproduction-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 Open-R1 재현 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        재현 단위는 model weight 하나가 아닙니다. 출발 checkpoint, token supervision, 현재 policy의 rollout, verifier version, 데이터 계보, sampling 평가 계약을 같은 receipt로 묶어야 어느 단계가 결과를 만들었는지 다시 확인할 수 있습니다.
      </p>
      <Link
        to="/cs/ai/llm-monitoring-observability-and-drift"
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        다음 단계 · 학습 뒤 운영 trace와 drift를 관측하는 방법 보기 →
      </Link>
    </aside>
  );
}
