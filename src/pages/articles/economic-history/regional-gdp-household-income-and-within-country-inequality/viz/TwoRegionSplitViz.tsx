import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 인구 300 = 도시 100 + 나머지 200.
 * 생산(GDP) 300 = 180 + 120 → 1인당 1.8·0.6, 비율 3.
 * 설명용 처분가능소득 300 = 120 + 180 → 1인당 1.2·0.9, 비율 약 1.33.
 * 국가 전체 300÷300 = 1. 모든 숫자는 글의 설명용 가정이다.
 */
const CITY = "#2563eb";
const REST = "#d97706";
const AVG = "#64748b";

const ROWS = [
  { key: "pop", label: "주민 수", city: 100, rest: 200 },
  { key: "gdp", label: "생산(지역 GDP)", city: 180, rest: 120 },
  { key: "inc", label: "처분가능소득", city: 120, rest: 180 },
] as const;

const SCENES = [
  { label: "주민 300을 나눕니다", summary: "도시 100 · 나머지 200", rows: 1, note: "국가 주민 300명 가운데 도시에 100명, 나머지 지역에 200명이 삽니다. 아래 두 줄의 나눗셈은 모두 이 분모를 씁니다." },
  { label: "생산 300을 나눕니다", summary: "1.8 ÷ 0.6 = 3배", rows: 2, note: "지역 GDP는 그 지역 사업장이 만든 생산(부가가치)입니다. 도시가 180, 나머지가 120을 만들어 1인당 1.8과 0.6, 격차는 세 배입니다." },
  { label: "소득 300을 나눕니다", summary: "1.2 ÷ 0.9 ≈ 1.33배", rows: 3, note: "처분가능소득은 주민이 세금을 내고 연금 같은 이전을 받은 뒤 쓸 수 있는 소득입니다. 설명용으로 도시 120, 나머지 180을 놓으면 1인당 1.2와 0.9, 격차는 약 1.33배입니다. 7절이 그 경로를 따라갑니다." },
  { label: "국가 평균만 보면", summary: "300 ÷ 300 = 1", rows: 3, note: "나라 전체로 합치면 생산 300을 주민 300으로 나눈 1 하나만 남습니다. 3배와 약 1.33배라는 두 격차가 이 평균 안에서는 보이지 않습니다." },
] as const;

const TOTAL = 300;

const W = 360;
const H = 170;
const BASE_Y = 140;
const TOP_Y = 22;
const MAX = 2;
const y = (value: number) => BASE_Y - (value / MAX) * (BASE_Y - TOP_Y);
const BAR_W = 46;
const GROUPS = [
  { key: "gdp", label: "1인당 생산", x: 36, city: 1.8, rest: 0.6, from: 1 },
  { key: "inc", label: "1인당 소득", x: 186, city: 1.2, rest: 0.9, from: 2 },
] as const;

export default function TwoRegionSplitViz() {
  return (
    <SceneShell
      eyebrow="같은 300, 다른 분모"
      title="생산 격차 3배가 주민소득에서는 약 1.33배가 됩니다"
      description="위 띠 하나가 국가 전체 300이고 파란 칸이 도시, 주황 칸이 나머지 지역입니다. 아래 막대는 각 칸을 그 지역 주민 수로 나눈 값입니다. 숫자는 모두 글의 설명용 가정입니다."
      ariaLabel="주민, 생산, 처분가능소득 300을 두 지역에 나눈 몫과 1인당 값 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showAvg = active === 3;
        return (
          <div className="min-w-0">
            <div className="space-y-2">
              {ROWS.map((row, index) => {
                const on = index < scene.rows;
                return (
                  <div key={row.key} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
                    <span className={on ? "font-semibold" : "text-muted-foreground/50"}>{row.label}</span>
                    <div className={`flex h-7 min-w-0 overflow-hidden rounded-md border ${on ? "border-border" : "border-dashed border-border/50"}`}>
                      {on ? (
                        <>
                          <div className="flex items-center justify-center text-white" style={{ width: `${(row.city / TOTAL) * 100}%`, backgroundColor: CITY }}>
                            <span className="truncate px-1 font-mono font-bold">도시 {row.city}</span>
                          </div>
                          <div className="flex items-center justify-center text-white" style={{ width: `${(row.rest / TOTAL) * 100}%`, backgroundColor: REST }}>
                            <span className="truncate px-1 font-mono font-bold">나머지 {row.rest}</span>
                          </div>
                        </>
                      ) : (
                        <span className="m-auto text-muted-foreground/50">다음 장면</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 1, 2].map((tick) => (
                <g key={tick}>
                  <line x1={28} x2={W - 6} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={tick === 0 ? 1 : 0.5} opacity={tick === 0 ? 1 : 0.5} />
                  <text x={22} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
                </g>
              ))}
              {GROUPS.map((group) => {
                const on = active >= group.from;
                return (
                  <g key={group.key} opacity={on ? 1 : 0.18}>
                    {[
                      { value: group.city, color: CITY, dx: 0, name: "도시" },
                      { value: group.rest, color: REST, dx: BAR_W + 8, name: "나머지" },
                    ].map((bar) => (
                      <g key={bar.name}>
                        <rect x={group.x + bar.dx} y={y(bar.value)} width={BAR_W} height={BASE_Y - y(bar.value)} rx={2} fill={bar.color} opacity={0.85} />
                        <text x={group.x + bar.dx + BAR_W / 2} y={y(bar.value) - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={bar.color}>{on ? bar.value : ""}</text>
                      </g>
                    ))}
                    <text x={group.x + BAR_W + 4} y={BASE_Y + 18} textAnchor="middle" fontSize={11} fill="currentColor">{group.label}</text>
                    <text x={group.x + BAR_W * 2 + 14} y={y(group.city) + 4} fontSize={11} fontWeight={700} fill="currentColor">{on ? (group.key === "gdp" ? "3배" : "≈1.33배") : ""}</text>
                  </g>
                );
              })}
              {showAvg && (
                <>
                  <line x1={28} x2={W - 6} y1={y(1)} y2={y(1)} stroke={AVG} strokeWidth={1.25} strokeDasharray="5 3" />
                  <text x={W - 6} y={y(1) + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#475569">국가 평균</text>
                  <text x={W - 6} y={y(1) + 29} textAnchor="end" fontSize={11} fontWeight={700} fill="#475569">300÷300=1</text>
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
