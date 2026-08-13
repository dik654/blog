const rows = [
  ["행 단위", "한 행이 무엇인가?", "row ID · label 단위", "중복·파생 행 count"],
  ["독립 단위", "무엇이 함께 움직이는가?", "entity · session · source", "fold 간 group 교집합"],
  ["시간 경계", "예측 때 알 수 있었나?", "cutoff · available time", "future/post-event 위반"],
  ["분포 이동", "test에서 무엇이 달라지나?", "category · 기간 · 장비", "train-only/test-only slice"],
  ["평가 단위", "오류를 어디서 집계하나?", "sample weight · group reducer", "metric 손계산 fixture"],
];

export default function EdaChecklistViz() {
  return (
    <div data-viz className="rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">EDA risk ledger</p>
      <h3 className="mt-1 text-lg font-semibold">분포를 그리기 전에 정보가 만들어지고 나뉘는 경로를 적습니다</h3>
      <div className="mt-5 divide-y divide-border/60 rounded-lg border border-border/60">
        {rows.map(([risk, question, fields, test]) => (
          <div key={risk} className="grid gap-2 px-4 py-4 md:grid-cols-[0.7fr_1.2fr_1fr_1fr] md:gap-5">
            <p className="text-sm font-semibold">{risk}</p>
            <p className="text-sm">{question}</p>
            <p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">필드</span> · {fields}</p>
            <p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">검사</span> · {test}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
