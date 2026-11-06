import LedgerStrip from "./LedgerStrip";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 위협으로 정한 회의와 이유를 설명하고 합의한 회의.
 * 최종 장부는 둘 다 50·20·20·10이고, 다른 것은 과정과 다음 위기에 협력할 이유입니다.
 */
const SCENES = [
  { label: "첫 회의", summary: "위협 → 50·20·20·10", note: "관리가 늦게 온 가구를 벌주겠다고 위협해 네 몫을 정합니다." },
  { label: "둘째 회의", summary: "설명·합의 → 50·20·20·10", note: "관리는 자신이 먼저 운영 몫을 줄일 가능성을 열고 이유와 역할을 설명한 뒤 같은 숫자에 합의합니다. 가능성을 열었을 뿐, 합의한 운영 몫은 여전히 10입니다." },
  { label: "결과표만 비교", summary: "두 장부 모두 합계 100", note: "네 몫이 하나하나 같습니다. 장부만 보면 어느 회의에서 나온 숫자인지 알 수 없습니다." },
  { label: "다음 위기", summary: "협력할 이유가 다릅니다", note: "최종 배분은 같아도 다음 위기에서 협력할 이유는 다릅니다. 앞 회의는 벌을 피하는 쪽에, 뒤 회의는 이유와 역할을 듣고 내리는 도덕적 판단 쪽에 놓입니다." },
] as const;

const MEETINGS = [
  { name: "첫 회의", opensAt: 0, process: ["늦게 온 가구를 벌주겠다고 위협", "그 위협 아래 네 몫을 정함"], reason: "벌을 피하려는 이유" },
  { name: "둘째 회의", opensAt: 1, process: ["운영 몫을 먼저 줄일 가능성을 엶", "이유와 역할을 설명하고 합의"], reason: "스스로 내리는 도덕적 판단" },
] as const;

export default function TwoMeetingsViz() {
  return (
    <SceneShell
      eyebrow="같은 장부, 다른 회의"
      title="숫자가 같아도 두 회의는 같은 회의가 아닙니다"
      description="띠의 폭이 곡물 100자루입니다. 장부와 두 회의는 판단 구조를 보려는 글의 예(가정)이며 특정 고대 국가의 통계가 아닙니다."
      ariaLabel="위협으로 정한 회의와 설명 후 합의한 회의가 같은 장부에 이르지만 다음 위기에 협력할 이유는 다름"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <MeetingLegend />
          <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
            {MEETINGS.map((meeting) => {
              const open = active >= meeting.opensAt;
              const processFaded = active === 2;
              return (
                <div key={meeting.name} className={`min-w-0 rounded-lg border bg-background p-3 ${open ? "border-border" : "border-dashed border-border/40"}`}>
                  <p className={`text-sm font-bold ${open ? "" : "text-muted-foreground/50"}`}>{meeting.name}</p>
                  <ol className={`mt-2 space-y-1 text-xs leading-5 ${open ? "" : "invisible"} ${processFaded ? "opacity-40" : ""}`}>
                    {meeting.process.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <div className={`mt-3 ${open ? "" : "invisible"}`}>
                    <LedgerStrip />
                  </div>
                  <p className={`mt-3 border-t border-border/60 pt-2 text-xs leading-5 ${active === 3 ? "font-bold text-primary" : "invisible"}`}>
                    다음 위기: {meeting.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}

function MeetingLegend() {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {[["#2563eb", "공통 식량 50"], ["#16a34a", "추가 돌봄 20"], ["#b45309", "다음 철 씨앗 20"], ["#475569", "운영 10"]].map(([color, label]) => (
        <li key={label} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
          {label}
        </li>
      ))}
    </ul>
  );
}
