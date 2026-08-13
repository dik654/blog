const rows = [
  ["01", "평가 계약", "한 행 · cutoff · metric", "metric 예제 3개가 손계산과 일치"],
  ["02", "정보 경계", "group · available time · shift", "split 간 entity·미래 정보 교집합 없음"],
  ["03", "Baseline", "OOF · test prediction · manifest", "동일 명령과 revision으로 재생성"],
  ["04", "실험", "가설 · 한 변경 · paired delta", "채택 기준과 비용까지 실행 전에 기록"],
  ["05", "선택·제출", "후보표 · feedback log · checksum", "schema·row order·range 검사 통과"],
];

export default function TimelineViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Decision path</p>
      <h3 className="mt-1 text-lg font-semibold">각 단계는 다음 모델이 아니라 다음 검증 가능한 산출물을 만듭니다</h3>
      <div className="mt-5 overflow-hidden rounded-lg border border-border/60">
        <div className="hidden grid-cols-[3rem_0.8fr_1.1fr_1.35fr] gap-4 border-b border-border/60 bg-muted/35 px-4 py-2 text-xs font-semibold text-muted-foreground sm:grid">
          <span>순서</span><span>판단</span><span>남기는 기록</span><span>통과 조건</span>
        </div>
        {rows.map(([n, decision, artifact, gate]) => (
          <div key={n} className="grid gap-2 border-b border-border/50 px-4 py-4 last:border-b-0 sm:grid-cols-[3rem_0.8fr_1.1fr_1.35fr] sm:gap-4 sm:py-3">
            <span className="text-xs font-semibold text-muted-foreground">{n}</span>
            <span className="text-sm font-semibold">{decision}</span>
            <span className="text-sm text-muted-foreground">{artifact}</span>
            <span className="text-sm leading-6">{gate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
