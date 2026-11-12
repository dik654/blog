import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retroactivity — 판례를 바꾼 사건, 진행 중인 비슷한 사건, 이미 확정된 사건은
 * 판례 변경 시점을 기준으로 서로 다른 시간대에 있다. 막대 길이는 순서만 나타내며, 진행 중 사건은 끝을 열어 둔다.
 */
const CASES = [
  { name: "판례를 바꾼 사건", start: 10, end: 50, endLabel: "새 판단으로 해결" },
  { name: "진행 중인 비슷한 사건", start: 25, end: 100, endLabel: "아직 재판 중 →" },
  { name: "이미 확정된 사건", start: 5, end: 32, endLabel: "확정" },
] as const;

const CHANGE = 50;

const SCENES = [
  {
    label: "세 사건의 시간대",
    summary: "판례 변경 시점 기준",
    note: "세 사건은 판례가 바뀌는 시점에 서로 다른 단계에 있습니다. 그래서 '판례가 바뀌었다'는 한 문장만으로 세 묶음의 결과를 모두 말할 수 없습니다.",
    focus: -1,
    verdict: "",
  },
  {
    label: "판례를 바꾼 사건",
    summary: "새 판단이 우선 해결",
    note: "새 판단은 우선 그 판단을 만든 현재 사건을 해결합니다.",
    focus: 0,
    verdict: "새 판단 적용",
  },
  {
    label: "진행 중인 사건",
    summary: "소급효 규칙을 확인",
    note: "진행 중인 다른 사건에 얼마나 적용되는지는 해당 국가와 법 분야의 소급효 규칙을 확인해야 합니다. 미국 연방법만 보아도 직접심이 끝나지 않은 사건과 이미 확정된 사건을 구분합니다.",
    focus: 1,
    verdict: "나라·법 분야의 규칙에 따라 다름",
  },
  {
    label: "이미 확정된 사건",
    summary: "자동으로 다시 열리지 않음",
    note: "확정판결은 판례 변경만으로 자동 취소되지 않습니다. 한국 민사소송에서도 확정판결의 효력을 없애려면 법이 정한 재심 사유가 필요하다는 것이 원칙입니다. 형사·헌법·조세처럼 분야가 달라지면 구제와 소급효 규칙도 달라집니다.",
    focus: 2,
    verdict: "판례 변경만으로는 자동 취소되지 않음",
  },
] as const;

export default function RetroactivityTimelineViz() {
  return (
    <SceneShell
      eyebrow="판례 변경과 시간"
      title="판례가 바뀌는 순간, 세 사건은 서로 다른 단계에 있습니다"
      description="가로축은 시간이고 세로 실선이 판례를 바꾼 판결 시점입니다. 막대 길이는 앞뒤 순서만 나타내며 실제 기간이 아닙니다(가정)."
      ariaLabel="판례 변경 시점을 기준으로 현재 사건, 진행 중인 사건, 확정된 사건의 위치를 보는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="relative min-w-0 space-y-4 py-2">
              <div
                aria-hidden
                className="absolute bottom-0 top-0 w-0 border-l-2 border-primary"
                style={{ left: `${CHANGE}%` }}
              />
              <p className="relative text-xs font-semibold text-primary" style={{ paddingLeft: `calc(${CHANGE}% + 0.4rem)` }}>
                판례 변경 판결
              </p>
              {CASES.map((c, i) => {
                const on = scene.focus === -1 || scene.focus === i;
                return (
                  <div key={c.name} className={`relative min-w-0 ${on ? "" : "opacity-35"}`}>
                    <p className="text-xs font-semibold">{c.name}</p>
                    <div className="relative mt-1 h-5 rounded-sm bg-muted/30">
                      <div
                        className={`absolute top-0 h-full rounded-sm ${i === 0 ? "bg-[#2563eb]" : i === 1 ? "bg-[#d97706]" : "bg-[#64748b]"}`}
                        style={{ left: `${c.start}%`, width: `${c.end - c.start}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-[11px] text-muted-foreground" style={{ width: `${Math.max(c.end, 30)}%` }}>
                      {c.endLabel}
                    </p>
                  </div>
                );
              })}
              <div className="relative flex justify-between text-[11px] text-muted-foreground">
                <span>과거</span>
                <span>미래 →</span>
              </div>
            </div>
            <p className={`mt-3 min-h-[2.5rem] rounded-md border px-3 py-2 text-sm font-semibold ${scene.verdict ? "border-primary/60" : "invisible"}`}>
              {scene.verdict || "-"}
            </p>
          </div>
        );
      }}
    />
  );
}
