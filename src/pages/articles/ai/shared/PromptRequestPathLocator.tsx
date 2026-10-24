import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "contract",
    label: "요청 계약",
    detail: "목표·근거·출력·검증 조건을 한 요청에 묶습니다.",
    href: "/cs/ai/prompt-engineering#overview",
  },
  {
    key: "reasoning",
    label: "풀이와 판정",
    detail: "여러 풀이 경로의 답을 모으고 외부 검증기로 판정합니다.",
    href: "/cs/ai/prompt-reasoning#overview",
  },
  {
    key: "few-shot",
    label: "예시 조건",
    detail: "이번 문맥에 넣을 예시와 순서·비용을 정합니다.",
    href: "/cs/ai/prompt-few-shot#overview",
  },
  {
    key: "structured",
    label: "출력 검증",
    detail: "문자열을 문법·스키마·업무 규칙으로 검증한 뒤 레코드로 넘깁니다.",
    href: "/cs/ai/prompt-structured-output#overview",
  },
] as const;

export type PromptRequestPathArticle = (typeof STEPS)[number]["key"];

const QUESTIONS: Record<PromptRequestPathArticle, string> = {
  contract: "모델에게 무엇을 맡기고, 어떤 근거와 형식으로 성공을 판정해야 합니까?",
  reasoning: "여러 풀이가 같은 답을 골랐을 때도 왜 외부 검증이 필요합니까?",
  "few-shot": "예시를 문맥에 넣으면 무엇이 바뀌고, 무엇은 바뀌지 않습니까?",
  structured: "JSON처럼 보이는 문자열을 언제 신뢰할 수 있는 레코드로 넘길 수 있습니까?",
};

const FINDINGS: Record<PromptRequestPathArticle, string> = {
  contract:
    "프롬프트는 멋진 문구가 아니라 요청 계약입니다. 목표·근거·출력 형식·거절 조건을 분리하고, 같은 시험 사례로 프롬프트·모델·검증기의 변경을 비교해야 합니다.",
  reasoning:
    "풀이 경로는 후보를 만드는 과정이고 답 집계는 후보를 고르는 과정입니다. 다수가 고른 답도 맞다는 보장은 없으므로 식·단위·근거를 외부 검증기가 다시 확인합니다.",
  "few-shot":
    "Few-shot 예시는 가중치를 갱신하지 않습니다. 매 요청의 문맥에 예시를 넣어 조건을 바꾸므로 선택·순서 민감도와 반복 토큰 비용을 함께 재야 합니다.",
  structured:
    "구조화 출력은 JSON 문법 통과로 끝나지 않습니다. 문법·스키마·업무 규칙 검증을 차례로 통과한 레코드만 사용하는 쪽에 넘기고, 실패는 정해진 횟수의 보정이나 타입이 분명한 미확인 값으로 끝냅니다.",
};

const INDEX: Record<PromptRequestPathArticle, number> = {
  contract: 0,
  reasoning: 1,
  "few-shot": 2,
  structured: 3,
};

export function PromptRequestPathLocator({
  current,
}: {
  current: PromptRequestPathArticle;
}) {
  const index = INDEX[current];
  const step = STEPS[index];
  const isFamilyRoot = current === "contract";

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Prompt 요청 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/prompt-engineering#overview" className="hover:text-primary">
          Prompt 요청 설계
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {step.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            {QUESTIONS[current]}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            직속 부모 지도
          </p>
          <Link
            to={isFamilyRoot ? "/cs/ai" : "/cs/ai/prompt-engineering#overview"}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {isFamilyRoot
              ? "Agent & Tools 전체 학습 지도 ↗"
              : "목표에서 검증까지 묶는 Prompt 요청 계약 ↗"}
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4"
        aria-label="Prompt 요청을 계약하고 풀이하고 예시를 붙이고 검증하는 네 단계"
      >
        {STEPS.map((item, position) => {
          const active = position <= index;
          const currentStep = item.key === current;
          return (
            <Link
              key={item.key}
              to={item.href}
              aria-current={currentStep ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(position + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {item.label}
              </strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">
                {item.detail}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function PromptRequestPathMapReturn({
  current,
}: {
  current: PromptRequestPathArticle;
}) {
  const next = STEPS[INDEX[current] + 1];
  return (
    <aside
      id="prompt-request-path-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 Prompt 요청 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next?.href ?? "/cs/ai/evaluation-datasets-and-pipelines"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next
          ? `다음 단계 · ${next.label}으로 이동 →`
          : "다음 묶음 · 평가 데이터와 파이프라인으로 이동 →"}
      </Link>
    </aside>
  );
}
