import { Link } from "react-router-dom";

const CONCEPT_ANCHORS = [
  {
    label: "양자화",
    detail: "code·scale·kernel이 실제 실행 artifact를 어떻게 바꾸는지 봅니다.",
    href: "/cs/ai/quantized-model-deployment#overview",
  },
  {
    label: "가지치기",
    detail: "mask·shape·sparse tactic이 실제 계산 제거로 이어지는지 봅니다.",
    href: "/cs/ai/pruning-recovery-deployment#overview",
  },
  {
    label: "지식 증류",
    detail: "teacher 신호로 더 작은 student를 만드는 경계를 봅니다.",
    href: "/cs/ai/knowledge-distillation#release-gate",
  },
] as const;

const PRACTICE_STEPS = [
  { label: "기준 고정", href: "#overview" },
  { label: "메모리", href: "#budget" },
  { label: "단계 순서", href: "#order" },
  { label: "비교", href: "#benchmark" },
  { label: "승인·롤백", href: "#release" },
] as const;

export function CompressionPipelineLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="모델 경량화 개념에서 실무 파이프라인으로 이어지는 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <Link
          to="/cs/ai?sub=ai-practical-compression"
          className="hover:text-primary"
        >
          모델 경량화
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          배포 후보 선택
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            실무
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            양자화·가지치기·증류 중 무엇을 어떤 순서로 적용해야 배포 기준을
            통과하면서 운영 복잡도를 줄일 수 있을까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 글이 정하지 않는 것
          </p>
          <p className="mt-1 break-keep text-sm font-bold leading-6">
            실제 모델·GPU·SLO가 없으므로 최종 기법과 수치는 실험 전까지
            미측정입니다.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
        {CONCEPT_ANCHORS.map((anchor) => (
          <Link
            key={anchor.label}
            to={anchor.href}
            className="min-w-0 bg-background px-4 py-3 hover:text-primary"
          >
            <span className="text-[10px] font-bold text-primary">
              시작할 개념 앵커
            </span>
            <strong className="mt-1 block break-keep text-sm leading-5">
              {anchor.label}
            </strong>
            <span className="mt-1 block break-keep text-[11px] leading-5 text-muted-foreground">
              {anchor.detail}
            </span>
          </Link>
        ))}
      </div>

      <nav
        className="mt-4 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="모델 경량화 파이프라인의 다섯 단계"
      >
        {PRACTICE_STEPS.map((step, index) => (
          <a
            key={step.label}
            href={step.href}
            className="min-h-11 bg-background px-3 py-3 text-xs font-semibold hover:text-primary"
          >
            <span className="mr-2 font-mono text-[9px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export function CompressionPipelineReturn() {
  return (
    <aside
      id="compression-pipeline-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="모델 경량화 개념 지도에 실무 결론을 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">개념 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        각 기법은 서로 다른 실행 결과의 항을 바꿉니다. 그래서 먼저 병목과 필수
        기준을 고정하고, 같은 baseline에서 만든 단일·결합 후보를 동일한
        workload로 검증한 뒤 통과한 digest만 배포 대상으로
        승인합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/ai?sub=ai-practical-compression"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          모델 경량화 지도 ↗
        </Link>
        <Link
          to="/cs/ai/serving-benchmark-methodology#overview"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 실무 · Serving benchmark 설계 ↗
        </Link>
      </div>
    </aside>
  );
}
