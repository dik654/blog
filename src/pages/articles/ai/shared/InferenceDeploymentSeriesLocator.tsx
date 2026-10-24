import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "measurement",
    label: "측정 사례",
    track: "참고",
    detail: "특정 모델과 장비의 수치를 병목·구현·측정 조건으로 나누어 읽습니다.",
    href: "/cs/ai/sionic-glm-b300",
  },
  {
    id: "long-context",
    label: "배포 범위",
    track: "실무",
    detail: "긴 입력을 위치 표현·메모리 수용·정보 회수로 나누고 승인 단위를 정합니다.",
    href: "/cs/ai/qwen36-long-context-deployment",
  },
  {
    id: "regions",
    label: "요청 경로",
    track: "개념",
    detail: "모델·리전·클러스터·복제본을 고르는 책임과 실패 경계를 한 요청으로 추적합니다.",
    href: "/cs/ai/region-agnostic-inference-routing",
  },
  {
    id: "portability",
    label: "이식 경계",
    track: "개념",
    detail: "표준 API·요청 경로 구현·운영 매니페스트 가운데 실제로 옮겨지는 층을 구분합니다.",
    href: "/cs/ai/inference-stack-standard-levels",
  },
] as const;

type InferenceDeploymentStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<InferenceDeploymentStep, string> = {
  measurement: "특정 장비에서 나온 처리 속도를 어떤 병목과 측정 조건으로 나누어 읽어야 합니까?",
  "long-context": "긴 입력을 지원한다는 주장을 실제 배포 승인으로 바꾸려면 어떤 증거가 필요합니까?",
  regions: "사용자가 모델 버전과 리전을 고르지 않을 때 그 선택을 누가 어떤 순서로 맡습니까?",
  portability: "추론 스택을 다른 클러스터나 공급자로 옮길 때 무엇이 유지되고 무엇을 다시 만들어야 합니까?",
};

const FINDINGS: Record<InferenceDeploymentStep, string> = {
  measurement:
    "처리 속도 하나에는 활성 가중치 전송, 커널 실행, 런타임 겹침과 한 번에 확정하는 토큰 수가 함께 들어갑니다. 수치는 장비·정밀도·배치·커밋 조건과 떨어뜨려 읽을 수 없습니다.",
  "long-context":
    "긴 입력은 최대 길이 설정 하나로 승인할 수 없습니다. 위치 표현, 가중치와 요청 상태의 메모리 하한, 실제 런타임 최고점, 위치별 정보 회수를 같은 릴리스 단위로 검증해야 합니다.",
  regions:
    "사용자에게서 숨긴 선택은 엣지·모델·리전·클러스터·복제본으로 옮겨 갑니다. 요청마다 필요한 판단과 느리게 갱신해도 되는 결정을 분리해야 제어 계층이 멈춰도 마지막 설정으로 요청이 흐릅니다.",
  portability:
    "파드 집합을 표현하는 API와 복제본을 고르는 인터페이스는 옮길 수 있지만, 용량 확보·인증·배포 선언은 환경마다 다릅니다. 이식성은 다른 층만 어댑터로 분리할 때 생깁니다.",
};

const NEXT: Record<InferenceDeploymentStep, InferenceDeploymentStep | null> = {
  measurement: "long-context",
  "long-context": "regions",
  regions: "portability",
  portability: null,
};

export function InferenceDeploymentSeriesLocator({
  current,
}: {
  current: InferenceDeploymentStep;
}) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="측정 사례에서 이식 가능한 추론 배포로 가는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/vllm-serving" className="hover:text-primary">
          모델 서빙
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai/inference-cost-and-capacity-planning"
          className="hover:text-primary"
        >
          측정과 용량
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          배포와 이식 · {currentStep.label}
        </strong>
      </nav>

      <div className="mt-4 grid gap-x-3 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
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
                step.id === current
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <strong className="break-keep text-sm leading-5">
                  {step.label}
                </strong>
                <span className="text-[9px] font-bold text-primary">
                  {step.track}
                </span>
              </span>
              <span className="mt-1 block break-keep text-[11px] leading-5">
                {step.detail}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[9px] font-bold text-primary">이 글이 답할 질문</p>
        <p className="mt-1 break-keep text-sm font-bold leading-6">
          {QUESTIONS[current]}
        </p>
      </div>
    </aside>
  );
}

export function InferenceDeploymentMapReturn({
  current,
}: {
  current: InferenceDeploymentStep;
}) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 추론 배포 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {FINDINGS[current]}
      </p>
      <Link
        to={next?.href ?? "/cs/ai/llm-serving-ops"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next
          ? `다음 확대 · ${next.label} →`
          : "다음 주제 · 이 구조를 운영 계약으로 바꾸기 →"}
      </Link>
    </aside>
  );
}
