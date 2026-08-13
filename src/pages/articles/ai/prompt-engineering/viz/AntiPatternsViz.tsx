import VizFrame from "@/components/viz/VizFrame";

const smells = [
  ["Vague objective", "좋게·자세히·전문적으로", "Audience·artifact·criteria를 적기"],
  ["Rule collision", "같은 행동을 허용하면서 금지", "Priority와 one canonical rule"],
  ["Missing evidence", "Prompt 문장으로 지식을 보충", "RAG·tool·abstention"],
  ["Prompt-only safety", "금지 문구가 권한을 차단한다고 가정", "Runtime authorization"],
] as const;

export default function AntiPatternsViz() {
  return (
    <VizFrame eyebrow="Failure taxonomy" title="문장 스타일 대신 실패 원인과 수정 계층을 연결합니다" description="Prompt로 고칠 수 없는 문제를 prompt에 계속 쌓으면 충돌과 context cost만 늘어납니다.">
      <div className="divide-y divide-border/70">{smells.map(([failure, symptom, fix]) => <section key={failure} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr_1fr] sm:items-baseline"><h4 className="text-sm font-bold">{failure}</h4><p className="text-xs leading-5 text-muted-foreground">{symptom}</p><p className="text-xs font-semibold leading-5 text-primary">{fix}</p></section>)}</div>
    </VizFrame>
  );
}
