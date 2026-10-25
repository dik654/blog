import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";

const rows = [
  [
    "원문 revision·ACL",
    "문서·권한 원장",
    "문서 담당자·권한 서비스",
    "수집기·검색기",
    "철회·갱신 이벤트로 파생 데이터를 무효화",
  ],
  [
    "Chunk manifest",
    "Artifact registry",
    "수집 작업",
    "색인 builder·인용 검증기",
    "원문 digest에서 다시 생성",
  ],
  [
    "Index manifest·alias",
    "색인 registry",
    "색인 배포 제어기",
    "Query encoder·검색기",
    "이전 검증 manifest로 pointer 복귀",
  ],
  [
    "Query·context trace",
    "요청 추적 저장소",
    "검색·문맥 조립기",
    "생성기·평가기",
    "누락된 근거 단계에서 요청 실패 처리",
  ],
  [
    "Claim·citation receipt",
    "결과 저장소",
    "인용 검증기",
    "API·감사 작업",
    "지원되지 않는 주장은 제거하거나 답변 거절",
  ],
] as const;

export default function RagOwnershipViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          State ownership
        </p>
        <p className="mt-1 font-semibold">
          각 상태의 원장·작성자·독자·복구 경로를 한 곳씩 정합니다
        </p>
      </figcaption>
      <div className="mt-4 grid border-y border-border sm:hidden">
        {rows.map(([state, authority, writer, readers, recovery], index) => (
          <div
            key={state}
            className="grid grid-cols-[1.1rem_minmax(0,1fr)] gap-2 border-b border-border/70 py-2.5 last:border-b-0"
          >
            <span className="pt-0.5 font-mono text-[9px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="break-keep text-xs font-bold">{state}</p>
              <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">
                원장 {authority} · 작성 {writer} · 읽기 {readers}
              </p>
              <p className="mt-1 break-keep text-[11px] leading-5">
                실패하면 {recovery}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block">
        <ResponsiveVizTable
          columns={["상태", "권위 원장", "작성자", "읽는 쪽", "실패·복구"]}
          rows={rows}
          desktopMinWidthClassName="min-w-[58rem]"
        />
      </div>
    </figure>
  );
}
