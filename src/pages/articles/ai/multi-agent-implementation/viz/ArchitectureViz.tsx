const rows=[
  ["Coordinator–worker","서로 다른 범위·owner","typed artifact + receipt","coordinator 재독해 병목"],
  ["Parallel map–reduce","같은 schema의 독립 shard","collection + coverage","부분 실패·중복"],
  ["Actor–reviewer","작성/검증 context 분리","artifact + verdict","rubric 없는 재의견"],
  ["Debate","근거 있는 관점 충돌","claims + adjudication","무제한 round·비용"],
] as const;
export default function ArchitectureViz(){return <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5"><figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pattern–join matrix</p><p className="mt-1 font-semibold">분해 이름보다 join이 소비할 artifact를 먼저 정합니다</p></figcaption><ResponsiveVizTable columns={["Pattern", "분리 조건", "Join input", "주요 실패"]} rows={rows} desktopMinWidthClassName="min-w-[44rem]" /><div className="mt-5 border-l border-primary pl-4 text-sm leading-6"><span className="font-semibold">공통 receipt</span><span className="text-muted-foreground"> · task/input hash · artifact URI/checksum · evidence · validation · uncertainty · idempotency key</span></div></figure>}
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
