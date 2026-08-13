import VizFrame from "@/components/viz/VizFrame";

const formats = [
  ["JSON + Schema", "Typed API payload", "Parser·schema·domain validator"],
  ["XML tags", "긴 prompt의 section delimiter", "Instruction/data boundary 확인"],
  ["Markdown", "사람이 읽을 보고서", "Heading·citation·rubric"],
] as const;

export function StrategyViz() {
  return (
    <VizFrame eyebrow="Format choice" title="Format은 익숙함이 아니라 최종 consumer를 기준으로 고릅니다" description="같은 내용을 여러 format으로 중복 출력하면 오히려 불일치가 생길 수 있습니다.">
      <div className="grid gap-7 md:grid-cols-3">{formats.map(([name, fit, validation]) => <section key={name} className="min-w-0 border-t border-border/80 pt-4"><h4 className="text-sm font-bold">{name}</h4><p className="mt-3 text-xs font-semibold text-primary">{fit}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">검증 · {validation}</p></section>)}</div>
    </VizFrame>
  );
}

const failures = [
  ["Syntax fail", "Constrained decoding 또는 parse retry"], ["Schema fail", "Field별 validation feedback"],
  ["Unknown fact", "Typed abstention + evidence request"], ["Domain reject", "원인 code + human/tool fallback"],
] as const;

export function BestPracticesViz() {
  return (
    <VizFrame eyebrow="Recovery contract" title="실패 유형마다 retry할 것과 멈출 것을 다르게 정합니다" description="무제한 repair loop 대신 최대 횟수·typed error·fallback을 미리 둡니다.">
      <div className="divide-y divide-border/70">{failures.map(([failure, action]) => <section key={failure} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr] sm:items-baseline"><h4 className="text-sm font-bold">{failure}</h4><p className="text-xs leading-5 text-muted-foreground">{action}</p></section>)}</div>
    </VizFrame>
  );
}
