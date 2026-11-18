import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 두 번째 문단 — 호출과 결제가 같은 날이면 응답을
 * 증권시장 마감 1시간 전·현금 마감 2시간 전까지 받도록 권고.
 * 증권 마감 16시, 현금 마감 17시(글의 가정) → 16−1=15, 17−2=15.
 */
const START = 13;
const END = 18;
const HOURS = [13, 14, 15, 16, 17, 18] as const;

const ROWS = [
  { key: "securities", title: "증권 담보", close: 16, lead: 1, color: "#64748b" },
  { key: "cash", title: "현금 담보", close: 17, lead: 2, color: "#16a34a" },
] as const;

const SCENES = [
  { label: "증권시장 마감 기준", summary: "16시 − 1시간 = 15시", rows: 1, joined: false, note: "증권시장이 16시에 마감한다고 가정하면 마감 1시간 전은 15시입니다. 증권 담보라면 늦어도 이 시각까지 응답을 받으라는 권고입니다." },
  { label: "현금 마감 기준", summary: "17시 − 2시간 = 15시", rows: 2, joined: false, note: "현금 마감이 17시라고 가정하면 2시간 전인 15시가 한계입니다. 마감은 한 시간 늦지만 앞당기는 폭도 한 시간 더 깁니다." },
  { label: "두 기준이 같은 시각에 닿습니다", summary: "응답 한계 15시(가정)", rows: 2, joined: true, note: "이 가정에서는 두 기준 모두 15시가 응답 한계입니다. 권고는 호출을 받은 뒤 가능한 한 빨리 답하라는 것이고, 15시는 늦어도 지킬 선입니다." },
] as const;

const x = (hour: number) => `${((hour - START) / (END - START)) * 100}%`;

export default function ResponseDeadlineViz() {
  return (
    <SceneShell
      eyebrow="응답 마감 계산"
      title="마감 시각에서 거꾸로 세면 응답 한계가 나옵니다"
      description="가로축은 같은 날의 시각입니다. 증권시장 16시·현금 17시 마감은 글이 든 가정입니다."
      ariaLabel="증권시장 마감 16시에서 1시간, 현금 마감 17시에서 2시간을 거꾸로 세어 응답 한계 15시를 구하는 시간축"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 px-1">
            <div className="relative ml-[4.5rem] mr-3">
              <div className="relative h-5 text-[11px] text-muted-foreground">
                {HOURS.map((hour) => (
                  <span key={hour} className="absolute -translate-x-1/2" style={{ left: x(hour) }}>{hour}시</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {ROWS.map((row, index) => {
                const on = index < scene.rows;
                return (
                  <div key={row.key} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center">
                    <span className={`text-xs font-semibold ${on ? "" : "text-muted-foreground/50"}`}>{row.title}</span>
                    <div className="relative mr-3 h-12 border-b border-border">
                      {HOURS.map((hour) => (
                        <div key={hour} className="absolute top-0 h-full border-l" style={{ left: x(hour), borderColor: "#e2e8f0" }} />
                      ))}
                      {on ? (
                        <>
                          <div className="absolute top-3 h-4 rounded-sm" style={{ left: x(row.close - row.lead), width: `${(row.lead / (END - START)) * 100}%`, backgroundColor: row.color, opacity: 0.35 }} />
                          <div className="absolute top-1 h-8 border-l-2" style={{ left: x(row.close), borderColor: row.color }} />
                          <span className="absolute top-3 whitespace-nowrap pl-1 text-[11px] font-semibold" style={{ left: x(row.close) }}>마감</span>
                          <span className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground" style={{ left: x(row.close - row.lead / 2) }}>−{row.lead}시간</span>
                          <div className="absolute top-1 h-8 border-l-2 border-dashed" style={{ left: x(row.close - row.lead), borderColor: "#d97706" }} />
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative ml-[4.5rem] mr-3 mt-2 h-6">
              <span
                className="absolute -translate-x-1/2 whitespace-nowrap rounded-sm border px-1.5 text-[11px] font-bold"
                style={{ left: x(15), borderColor: "#d97706", color: "#b45309", opacity: scene.joined ? 1 : 0 }}
              >
                응답 한계 15시
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
