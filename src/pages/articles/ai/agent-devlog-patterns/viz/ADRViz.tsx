import { JournalFrame, LinkRule } from "./JournalPrimitives";

const fields = [
  {
    label: "CONTEXT",
    title: "문제와 제약",
    question: "왜 지금 결정해야 했는가?",
    example: "Single JSON 갱신이 빈 compaction 한 건으로 기존 profile 전체를 잃게 할 수 있었습니다.",
  },
  {
    label: "OPTIONS",
    title: "현실적인 대안",
    question: "무엇을 비교했고 왜 제외했는가?",
    example: "기존 구조+rollback 강화와 profile별 파일 분리를 복구 범위·migration 비용으로 비교했습니다.",
  },
  {
    label: "DECISION",
    title: "선택과 범위",
    question: "무엇을 어디까지 적용하는가?",
    example: "Profile별 파일이 source of truth를 소유하고 index는 파생 데이터로 둡니다.",
  },
  {
    label: "CONSEQUENCES",
    title: "비용과 재검토",
    question: "무엇을 얻고 언제 다시 볼 것인가?",
    example: "부분 복구는 쉬워지지만 파일·migration이 늘며 원자적 갱신 요구가 바뀌면 재검토합니다.",
  },
] as const;

export default function ADRViz() {
  return (
    <JournalFrame
      label="DECISION RECORD"
      title="최종 선택뿐 아니라 검토한 대안과 다시 볼 조건까지"
      description="ADR은 구현 상태를 추적하는 문서가 아니라, 나중에 결정을 안전하게 재검토할 수 있도록 당시의 판단을 보존합니다."
      note="accepted는 구현 완료가 아니라 결정 채택을 뜻합니다. rollout과 migration은 issue나 task에서 별도로 추적합니다."
    >
      <ol className="grid min-w-0 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field, index) => (
          <li key={field.label} className="min-w-0 border-l border-border pl-4">
            <p className="font-mono text-[11px] font-semibold text-primary">
              {String(index + 1).padStart(2, "0")} · {field.label}
            </p>
            <h5 className="mt-3 text-sm font-bold leading-5 text-foreground">
              {field.title}
            </h5>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {field.question}
            </p>
            <p className="mt-4 border-t border-border/70 pt-3 text-xs leading-5 text-foreground/85">
              {field.example}
            </p>
          </li>
        ))}
      </ol>
      <LinkRule>
        <strong>역사 보존:</strong> 결정이 바뀌면 기존 ADR을 삭제하지 않고
        superseded로 표시한 뒤 새 ADR을 연결합니다.
      </LinkRule>
    </JournalFrame>
  );
}
