import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 4시간은 이미 실제 일한 시간이므로 휴게라는 이름으로 다시 빼지 않는다.
 * 4 × 10,320 = 41,280, 3.5 × 10,320 = 36,120(잘못된 계산). 막대 전체 폭 = 4시간 30분.
 * 휴게를 근무 가운데에 둔 것은 그림을 위한 가정입니다. 글은 "근로 도중"까지만 정합니다.
 */
const TOTAL_MIN = 270;
const SEGMENTS = [
  { minutes: 120, kind: "work", text: "근로 2시간" },
  { minutes: 30, kind: "rest", text: "휴게" },
  { minutes: 120, kind: "work", text: "근로 2시간" },
] as const;

const SCENES = [
  {
    label: "이 사례의 기록",
    summary: "근로 4시간 · 휴게 30분 별도",
    hours: "4시간",
    pay: "41,280원",
    wrong: false,
    note: "휴게 30분은 4시간과 별도로 기록했습니다. 한국의 2026년 최저임금 시간급 10,320원만 단순 적용한 하한이 4 × 10,320 = 41,280원이며, 수당·공제·보험은 별도입니다.",
  },
  {
    label: "휴게를 또 빼면",
    summary: "4 − 0.5 = 3.5시간 · 잘못",
    hours: "3.5시간",
    pay: "36,120원",
    wrong: true,
    note: "4시간은 이미 실제 일한 시간으로 확인한 값이므로 휴게라는 이름으로 다시 빼지 않습니다. 빼면 일한 30분이 사라져 계산이 3.5 × 10,320 = 36,120원으로 내려갑니다.",
  },
] as const;

export default function ShiftRecordViz() {
  return (
    <SceneShell
      eyebrow="근무 기록"
      title="4시간 안에 휴게가 들어 있지 않습니다"
      description="막대 전체가 4시간 30분이고 파란 칸이 실제 근로, 빈 칸이 직원이 자유롭게 쓴 휴게입니다. 휴게를 가운데 둔 위치는 그림을 위한 가정이며 글은 근로 도중이라고만 정합니다."
      ariaLabel="실제 근로 4시간과 별도 휴게 30분의 기록, 휴게를 다시 뺐을 때의 잘못된 계산"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div>
            <div className="flex h-11 min-w-0 overflow-hidden rounded-sm border border-border" role="img" aria-label={item.summary}>
              {SEGMENTS.map((segment, index) => {
                const cut = item.wrong && index === 2;
                return (
                  <div
                    key={index}
                    className={`relative flex min-w-0 items-center justify-center border-r border-border text-xs font-semibold last:border-r-0 ${segment.kind === "work" ? "text-white" : "text-muted-foreground"}`}
                    style={{ width: `${(segment.minutes / TOTAL_MIN) * 100}%`, backgroundColor: segment.kind === "work" ? "#2563eb" : "transparent" }}
                  >
                    <span>{segment.text}</span>
                    {cut && (
                      <span
                        className="absolute inset-y-0 right-0 flex items-center justify-center border-l border-dashed border-white text-[10px] font-bold text-white"
                        style={{ width: "25%", backgroundColor: "#dc2626" }}
                      >
                        −30분
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm">
              <div className={`rounded-lg border p-2.5 ${item.wrong ? "border-dashed border-red-600" : "border-border"}`}>
                <p className="text-muted-foreground">계산에 쓴 근로</p>
                <p className="font-mono font-bold">{item.hours}</p>
              </div>
              <div className={`rounded-lg border p-2.5 ${item.wrong ? "border-dashed border-red-600" : "border-border"}`}>
                <p className="text-muted-foreground">최저임금 단순 계산</p>
                <p className="font-mono font-bold">{item.pay}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
