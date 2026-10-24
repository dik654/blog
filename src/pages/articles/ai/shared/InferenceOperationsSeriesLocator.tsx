import { Link } from "react-router-dom";

const STEPS = [
  {
    id: "contract",
    label: "운영 계약",
    track: "개념",
    detail: "보호할 요청과 지연·완료·비용 조건을 정하고, 관측과 제어가 같은 요청을 보게 합니다.",
    href: "/cs/ai/llm-serving-ops",
  },
  {
    id: "platform",
    label: "클러스터 실행",
    track: "실무",
    detail: "게이트웨이·선택기·복제본·스케줄러가 맡을 상태와 고정 GPU를 나누는 정책을 정합니다.",
    href: "/cs/ai/onprem-k8s-inference-platform",
  },
  {
    id: "failure",
    label: "장애 흡수",
    track: "개념",
    detail: "고장 난 계층과 요청 진행 상태를 함께 보고 재선택·재시도·중단 경계를 구분합니다.",
    href: "/cs/ai/inference-failure-absorption",
  },
  {
    id: "capacity",
    label: "용량 조달",
    track: "실무",
    detail: "예비 용량과 가동률을 포함한 같은 단위로 소유·상시 임대·탄력 임대를 비교합니다.",
    href: "/cs/ai/own-vs-rent-inference-capacity",
  },
] as const;

type InferenceOperationsStep = (typeof STEPS)[number]["id"];

const QUESTIONS: Record<InferenceOperationsStep, string> = {
  contract: "빠른 모델 서버를 사용자가 믿고 쓸 수 있는 서비스로 만들려면 무엇을 먼저 계약해야 합니까?",
  platform: "외부 API 대신 자체 Kubernetes에서 실행할 때 각 상태의 담당자는 누구여야 합니까?",
  failure: "한 GPU가 사라졌을 때 어떤 요청은 다시 보내고 어떤 요청은 중단해야 합니까?",
  capacity: "소유와 임대를 같은 조건으로 비교하려면 비용의 분자와 판매 가능한 용량의 분모를 어떻게 맞춰야 합니까?",
};

const FINDINGS: Record<InferenceOperationsStep, string> = {
  contract:
    "운영의 기준은 GPU 처리량 하나가 아니라 요청 종류별 TTFT·ITL·완료율·비용입니다. 이 계약을 같은 request ID의 경로·배포·용량 신호와 연결해야 제어가 사용자 경험을 개선했는지 확인할 수 있습니다.",
  platform:
    "자체 운영으로 옮기면 책임이 사라지지 않고 나뉩니다. 상위 게이트웨이는 사용자 정책을, 요청 선택기는 준비된 복제본을, 워크로드 API와 스케줄러는 복제본의 수명과 위치를 맡아야 하며 같은 상태를 둘이 쓰면 안 됩니다.",
  failure:
    "장애 결과는 고장 난 부품만으로 정해지지 않습니다. 아직 배정되지 않은 요청, 첫 출력 전 요청, 이미 출력 중인 요청은 복구 가능성이 다르며, 포화는 실패한 복제본처럼 풀에서 빼면 연쇄 장애를 만들 수 있습니다.",
  capacity:
    "유휴 시간이 청구되는 소유·상시 임대는 같은 식을 쓰고 탄력 임대만 사용 시간에 비례합니다. 비용은 전체 장비에 들지만 판매량은 한 대가 빠져도 지킬 수 있는 용량이므로 예비분을 분모에서 빼야 합니다.",
};

const NEXT: Record<InferenceOperationsStep, InferenceOperationsStep | null> = {
  contract: "platform",
  platform: "failure",
  failure: "capacity",
  capacity: null,
};

export function InferenceOperationsSeriesLocator({
  current,
}: {
  current: InferenceOperationsStep;
}) {
  const currentStep = STEPS.find((step) => step.id === current)!;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="추론 서비스를 운영하고 용량을 조달하는 지도"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/vllm-serving" className="hover:text-primary">
          모델 서빙
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/inference-stack-standard-levels" className="hover:text-primary">
          배포와 이식
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          운영과 용량 · {currentStep.label}
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

export function InferenceOperationsMapReturn({
  current,
}: {
  current: InferenceOperationsStep;
}) {
  const nextId = NEXT[current];
  const next = nextId ? STEPS.find((step) => step.id === nextId)! : null;

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 추론 운영 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      <Link
        to={next?.href ?? "/cs/gpu/cuda-basics"}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `다음 확대 · ${next.label} →` : "다음 영역 · GPU 실행 원리로 이동 →"}
      </Link>
    </aside>
  );
}
