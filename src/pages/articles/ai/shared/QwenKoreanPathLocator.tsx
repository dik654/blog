import { Link } from "react-router-dom";

const PATH = [
  {
    label: "출력 경로",
    detail: "문자열이 token·logit·확률을 거쳐 다음 문자로 나옴",
    href: "/cs/ai/tokenizer#overview",
  },
  {
    label: "현상 진단",
    detail: "원치 않은 전환과 번역·인용 같은 정상 예외를 분리",
    href: "/cs/ai/qwen-korean-consistency#overview",
  },
  {
    label: "출력층 보정",
    detail: "token risk로 lm_head 행을 줄이는 논문 방법",
    href: "/cs/ai/smoothie-qwen-weight-editing#smoothie-qwen",
  },
  {
    label: "정책 재학습",
    detail: "한국어 SFT와 보상으로 생성 정책을 다시 학습",
    href: "/cs/ai/qwen-korean-reasoning-posttraining#rl-approach",
  },
  {
    label: "비교·배포",
    detail: "같은 질문에서 개선·회귀·비용을 함께 확인",
    href: "/cs/ai/qwen-korean-consistency#decision-matrix",
  },
] as const;

type Current = "현상 진단" | "출력층 보정" | "정책 재학습";

function Path({ current }: { current: Current }) {
  return (
    <div
      className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
      aria-label="Qwen 한국어 출력 문제를 진단하고 개입을 선택하는 경로"
    >
      {PATH.map((item, index) => {
        const selected = item.label === current;
        return (
          <Link
            key={item.label}
            to={item.href}
            aria-current={selected ? "step" : undefined}
            className={`min-w-0 bg-background px-3 py-3 ${selected ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
              {item.detail}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function Locator({
  current,
  track,
  question,
  anchor,
  anchorHref,
}: {
  current: Current;
  track: "실무" | "논문 읽기";
  question: string;
  anchor: string;
  anchorHref: string;
}) {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label={`Qwen 한국어 출력 지도에서 ${current} 글의 위치`}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/tokenizer#overview" className="hover:text-primary">다음 token 선택</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{current}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">{track}</span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">{question}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">시작할 개념 앵커</p>
          <Link to={anchorHref} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            {anchor} ↗
          </Link>
        </div>
      </div>

      <Path current={current} />
      <p className="mt-3 break-keep text-[10px] leading-5 text-muted-foreground">
        출력층 보정과 정책 재학습은 항상 차례대로 적용하는 단계가 아닙니다. 독립 후보로 비교할 수도 있고,
        여기서 읽는 한국어 RL 논문처럼 보정된 모델 위에 학습을 추가할 수도 있습니다.
      </p>
    </aside>
  );
}

export function QwenKoreanPracticeLocator() {
  return (
    <Locator
      current="현상 진단"
      track="실무"
      question="한국어 질문에서 다른 언어가 보였을 때, 정상 예외를 보존하면서 가장 작은 개입부터 어떻게 비교해야 합니까?"
      anchor="Tokenizer → lm_head → softmax"
      anchorHref="/cs/ai/transformer-architecture#output-head"
    />
  );
}

export function SmoothieQwenLocator() {
  return (
    <Locator
      current="출력층 보정"
      track="논문 읽기"
      question="Smoothie-Qwen은 token 위험도를 어떻게 lm_head 행의 배율로 바꾸며, 왜 생성 확률이 같은 비율로 줄지는 않습니까?"
      anchor="오류·정상 예외 분류"
      anchorHref="/cs/ai/qwen-korean-consistency#overview"
    />
  );
}

export function QwenPosttrainingLocator() {
  return (
    <Locator
      current="정책 재학습"
      track="논문 읽기"
      question="한국어 SFT와 oracle-guided Dr.GRPO는 각각 어떤 데이터를 만들고 어느 weight를 바꿉니까?"
      anchor="오류·정상 예외 분류"
      anchorHref="/cs/ai/qwen-korean-consistency#overview"
    />
  );
}

export function QwenKoreanPracticeReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="Qwen 한국어 출력 선택 결과">
      <p className="text-[10px] font-bold text-primary">선택 결과</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        외국 문자가 보였다는 사실만으로 모델을 고치지 않습니다. 출력 구간과 사용자의 의도를 먼저 표시하고,
        프롬프트·런타임 검사·출력층 보정·재학습을 같은 질문 묶음에서 비교한 뒤 정상 번역과 과제 품질까지 통과한 가장 작은 개입을 배포합니다.
      </p>
      <Link to="/cs/ai/openclaw-assistant#overview" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        다음 주제 · 모델을 실제 에이전트 실행 환경에 연결하기 →
      </Link>
    </aside>
  );
}

export function QwenCandidateReturn({ kind }: { kind: "출력층 보정" | "정책 재학습" }) {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label={`${kind} 결과를 Qwen 한국어 출력 판단에 되돌려 놓기`}>
      <p className="text-[10px] font-bold text-primary">상위 판단으로 돌아가기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {kind}은 전체 해결책이 아니라 서로 다른 상태를 바꾸는 후보입니다. 같은 기준 모델·질문·생성 설정에서 원치 않은 전환, 정상 번역 보존, 정답 품질과 비용을 다시 비교해야 합니다.
      </p>
      <Link to="/cs/ai/qwen-korean-consistency#decision-matrix" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        Qwen 한국어 출력 비교·배포 판단으로 돌아가기 →
      </Link>
    </aside>
  );
}
