import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "dataset",
    label: "평가 표본",
    detail: "Golden set과 실패 슬라이스를 채우고 배포 관문을 정합니다.",
    href: "/cs/ai/evaluation-datasets-and-pipelines#problem",
  },
  {
    key: "measurement",
    label: "측정 계약",
    detail: "평가 기준·지표·비교 단위가 묻는 질문을 구분합니다.",
    href: "/cs/ai/llm-evaluation-criteria-and-methods#problem",
  },
  {
    key: "judge",
    label: "판정기 보정",
    detail: "순서·길이·자기 선호 편향을 재고 사람 판정과 맞춥니다.",
    href: "/cs/ai/llm-as-a-judge#problem",
  },
] as const;

export type EvaluationTrustArticle = (typeof STEPS)[number]["key"];

const QUESTIONS: Record<EvaluationTrustArticle, string> = {
  dataset: "평가 점수 하나를 믿기 전에 어떤 입력을 어디까지 통과시켜야 합니까?",
  measurement: "같은 출력이 실행 판정과 의미 유사도에서 다른 순위를 받는 이유는 무엇입니까?",
  judge: "판정 모델이 고른 승자가 답변 품질이 아니라 제시 순서 때문에 바뀌지 않았는지 어떻게 확인합니까?",
};

const FINDINGS: Record<EvaluationTrustArticle, string> = {
  dataset:
    "평가 표본은 운영 분포와 실패 경계를 함께 담아야 합니다. 전체 평균만 보지 않고 슬라이스를 나눈 뒤, 같은 평가 장치를 오프라인·그림자·A/B 관문에서 반복합니다.",
  measurement:
    "평가 기준은 무엇을 볼지, 지표는 그것을 어떤 값으로 바꿀지, 비교 방식은 어느 출력끼리 견줄지를 정합니다. 세 층을 고정하지 않으면 같은 숫자도 다른 결론을 뜻합니다.",
  judge:
    "LLM 판정기는 정답 그 자체가 아닙니다. 답변 순서를 바꾼 반복 판정과 사람이 매긴 표본을 함께 사용해 편향과 일치도를 계속 확인해야 합니다.",
};

const INDEX: Record<EvaluationTrustArticle, number> = {
  dataset: 0,
  measurement: 1,
  judge: 2,
};

export function EvaluationTrustPathLocator({
  current,
}: {
  current: EvaluationTrustArticle;
}) {
  const index = INDEX[current];
  const step = STEPS[index];
  return (
    <aside
      id="evaluation-trust-parent-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="평가 신뢰 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/evaluation-datasets-and-pipelines#problem" className="hover:text-primary">평가 신뢰 경로</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{step.label}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to={current === "dataset" ? "/cs/ai/prompt-structured-output#output-measurement" : "/cs/ai/evaluation-datasets-and-pipelines#problem"}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {current === "dataset" ? "검증된 출력을 어떻게 평가할지 묻는 지점 ↗" : "표본에서 배포까지 잇는 평가 파이프라인 ↗"}
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px" aria-label="평가 표본과 측정 계약과 판정기 보정의 세 단계">
        {STEPS.map((item, position) => {
          const active = position <= index;
          const currentStep = item.key === current;
          return (
            <Link
              key={item.key}
              to={item.href}
              aria-current={currentStep ? "step" : undefined}
              className={`min-w-0 bg-background px-2 py-3 sm:px-3 ${active ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}
            >
              <span className="font-mono text-[9px] font-black text-primary">{String(position + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{item.label}</strong>
              <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function EvaluationTrustPathMapReturn({
  current,
}: {
  current: EvaluationTrustArticle;
}) {
  const next = STEPS[INDEX[current] + 1];
  return (
    <aside
      id="evaluation-trust-map-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 평가 신뢰 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/ai/xml-prompting"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 단계 · ${next.label}으로 이동 →` : "다음 묶음 · XML 프롬프팅으로 이동 →"}
      </Link>
    </aside>
  );
}
