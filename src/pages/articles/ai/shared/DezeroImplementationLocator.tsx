import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "autodiff",
    label: "계산 기록",
    detail: "값을 만든 연산을 기록하고 갈라진 gradient를 다시 합칩니다.",
    href: "/cs/ai/dezero-autodiff",
    parent: "/cs/ai/backprop-optimization#tensor-backward",
    parentLabel: "배열의 모양을 따라 오차를 되돌리는 역전파",
  },
  {
    id: "nn",
    label: "학습 상태",
    detail: "파라미터를 등록하고 같은 신원을 유지한 채 반복해서 갱신합니다.",
    href: "/cs/ai/dezero-nn",
    parent: "/cs/ai/training-pipeline#loop",
    parentLabel: "한 배치를 예측·미분·갱신하는 학습 루프",
  },
  {
    id: "advanced",
    label: "시간 상태",
    detail: "시퀀스 상태·실행 모드·난수 상태의 수명 경계를 구현합니다.",
    href: "/cs/ai/dezero-advanced",
    parent: "/cs/ai/rnn#architecture",
    parentLabel: "이전 hidden state를 다음 시점으로 넘기는 RNN",
  },
] as const;

export type DezeroImplementationStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<DezeroImplementationStep, string> = {
  autodiff: "숫자 하나가 자신을 만든 계산을 기억하면 역전파를 어떻게 실행할 수 있습니까?",
  nn: "계산한 gradient를 같은 파라미터에 한 번만 적용하고 다시 시작하려면 무엇을 저장해야 합니까?",
  advanced: "이전 시점의 값은 이어 가면서 과거 계산 그래프는 어디에서 끊어야 합니까?",
};

const FINDINGS: Record<DezeroImplementationStep, string> = {
  autodiff: "자동 미분은 미분 공식 모음이 아닙니다. 순전파가 만든 값·연산·세대를 그래프로 남기고, 출력에서 역순으로 읽으며 같은 입력으로 돌아온 gradient를 합치는 실행 시스템입니다.",
  nn: "학습 루프의 기준점은 파라미터의 신원입니다. Model 등록, backward gradient, optimizer state와 checkpoint가 모두 같은 신원을 가리켜야 연속 실행과 재시작 실행을 비교할 수 있습니다.",
  advanced: "상태형 레이어는 값의 수명과 계산 그래프의 수명을 분리해야 합니다. 같은 시퀀스에서는 값을 넘기고, chunk 경계에서는 그래프를 끊으며, 새 표본에서는 상태를 초기화합니다.",
};

export function DezeroImplementationLocator({ current }: { current: DezeroImplementationStep }) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="신경망 구현 실습에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <span>밑바닥부터 구현</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{currentStep.label}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">실무</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p>
          <p className="mt-1 break-keep text-xs leading-6 text-muted-foreground">
            완성된 라이브러리를 쓰는 법보다, 실행 상태를 직접 만들고 반례로 검증하는 과정을 따라갑니다.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">시작할 개념 앵커</p>
          <Link to={currentStep.parent} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            {currentStep.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px" aria-label="Rust 신경망 구현 세 단계">
        {STEPS.map((step, index) => (
          <Link
            key={step.id}
            to={step.href}
            aria-current={step.id === current ? "step" : undefined}
            className={`min-w-0 bg-background px-3 py-3 ${step.id === current ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{step.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 sm:block">{step.detail}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function DezeroImplementationMapReturn({ current }: { current: DezeroImplementationStep }) {
  const position = STEPS.findIndex((step) => step.id === current);
  const next = STEPS[position + 1];

  return (
    <aside id="dezero-implementation-return" className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 신경망 구현 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/eda-workflow"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 구현 · ${next.label} →` : "다음 묶음 · 실무 데이터 준비로 이동 →"}
      </Link>
    </aside>
  );
}
