import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째 문단과 #names의 전간기 정의.
 * 축은 본문의 연도(1914·1918·1929·1939·1945)만 비례로 놓습니다.
 * 어느 조직이 얼마나 남았는지는 본문에 없으므로 길이나 높이로 그리지 않습니다.
 * 본문의 불황은 1918~1939 전체를 가리키므로 네 수단의 확대를 1929년 뒤로 좁히지 않습니다.
 */
const START = 1914;
const END = 1945;
const W = 320;
const PAD = 14;
const x = (year: number) => PAD + ((year - START) / (END - START)) * (W - 2 * PAD);

const PERIODS = [
  { from: 1914, to: 1918, label: "1차대전", color: "#475569" },
  { from: 1918, to: 1939, label: "전간기", color: "#2563eb" },
  { from: 1939, to: 1945, label: "2차대전", color: "#475569" },
] as const;

const TICKS = [1914, 1918, 1929, 1939, 1945];
const TOOLS = ["식량 관리", "실업 통계", "사회보험", "중앙은행의 위기 대응"];

const SCENES = [
  { label: "전쟁 중", summary: "민간 생산까지 조절", from: 1914, to: 1918, note: "석탄·철강·화학·철도·해운·농업과 가계 소비를 함께 조절해야 했고, 국가는 기업·노동조합·지방정부와 협상하거나 명령했습니다." },
  { label: "전쟁 뒤", summary: "모두 사라지지는 않음", from: 1918, to: 1939, note: "전간기는 두 세계대전 사이(1918~1939)입니다. 무역·신용·고용이 불안정한 이 시기에도 전시 조직이 모두 사라지지는 않았습니다." },
  { label: "불황과 재무장 속에서", summary: "네 수단이 확대됨", from: 1918, to: 1939, note: "수단별 확대 연도는 이 글에 없습니다. 1929년 뒤 수축이 깊어졌지만, 모든 나라가 같은 해에 같은 깊이로 겪은 것은 아닙니다." },
  { label: "같은 수단, 다른 쓰임", summary: "권리와 강제가 달랐습니다", from: 1918, to: 1939, note: "복지국가·독재국가·식민 국가는 같은 행정 수단을 서로 다른 권리와 강제 아래 사용했습니다." },
] as const;

export default function CarryoverTimelineViz() {
  return (
    <SceneShell
      eyebrow="전쟁이 끝난 뒤"
      title="전쟁이 끝나도 동원의 조직은 다음 시기로 넘어갔습니다"
      description="가로축은 연도에 비례합니다. 막대 위의 파란 선이 지금 보는 시기입니다."
      ariaLabel="1914년부터 1945년까지의 시간축 위에서 전시 조직과 행정 수단이 이어지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 82`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.from}년부터 ${scene.to}년까지 강조`}>
              {PERIODS.map((period) => (
                <g key={period.label}>
                  <text x={period.from === 1914 ? PAD : period.from === 1939 ? W - PAD : (x(period.from) + x(period.to)) / 2} y={11} textAnchor={period.from === 1914 ? "start" : period.from === 1939 ? "end" : "middle"} fontSize={11} fontWeight={700} fill="currentColor">{period.label}</text>
                  <rect x={x(period.from) + 1} y={22} width={x(period.to) - x(period.from) - 2} height={18} rx={3} fill={period.color} opacity={0.14} stroke={period.color} strokeWidth={1} />
                </g>
              ))}
              <rect x={x(scene.from)} y={15} width={x(scene.to) - x(scene.from)} height={4} rx={2} fill="#2563eb" />
              {TICKS.map((year) => (
                <g key={year}>
                  <line x1={x(year)} x2={x(year)} y1={year === 1929 ? 22 : 40} y2={46} stroke={year === 1929 ? "#dc2626" : "#94a3b8"} strokeWidth={1} strokeDasharray={year === 1929 ? "3 2" : undefined} />
                  <text x={x(year)} y={60} textAnchor={year === 1914 || year === 1918 ? "start" : year === END ? "end" : "middle"} fontSize={11} fill={year === 1929 ? "#dc2626" : "#64748b"} fontWeight={year === 1929 ? 700 : 400}>{year}</text>
                </g>
              ))}
              <text x={x(1929)} y={76} textAnchor="middle" fontSize={11} fill="#dc2626">대공황 시작</text>
            </svg>
            <div className="mt-3 min-h-[7rem]">
              {active === 0 && (
                <div className="grid grid-cols-3 gap-2 text-center text-xs leading-5 sm:grid-cols-6 sm:text-sm">
                  {["석탄", "철강", "화학", "철도·해운", "농업", "가계 소비"].map((item) => (
                    <span key={item} className="rounded-lg border border-border bg-background px-1 py-2">{item}</span>
                  ))}
                  <span className="col-span-3 mt-1 text-muted-foreground sm:col-span-6">모두 군사 목표에 묶입니다</span>
                </div>
              )}
              {active === 1 && (
                <div className="grid grid-cols-2 gap-2 text-center text-xs leading-5 sm:grid-cols-4 sm:text-sm">
                  {TOOLS.map((item) => (
                    <span key={item} className="rounded-lg border border-dashed border-border px-1 py-3 text-muted-foreground">{item}</span>
                  ))}
                  <span className="col-span-2 mt-1 text-muted-foreground sm:col-span-4">점선 = 다음 장면에서 확대. 규모는 표시 안 함</span>
                </div>
              )}
              {active === 2 && (
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold leading-5 sm:grid-cols-4 sm:text-sm">
                  {TOOLS.map((item) => (
                    <span key={item} className="rounded-lg border px-1 py-3" style={{ borderColor: "#2563eb", backgroundColor: "#2563eb14" }}>{item}</span>
                  ))}
                  <span className="col-span-2 mt-1 font-normal text-muted-foreground sm:col-span-4">실선 = 확대된 수단. 규모는 표시 안 함</span>
                </div>
              )}
              {active === 3 && (
                <div className="text-center text-xs leading-5 sm:text-sm">
                  <div className="rounded-lg border px-2 py-2 font-semibold" style={{ borderColor: "#2563eb", backgroundColor: "#2563eb14" }}>같은 행정 수단</div>
                  <div className="py-1 font-mono text-muted-foreground" aria-hidden="true">↓ ↓ ↓</div>
                  <div className="grid grid-cols-3 gap-2">
                    {["복지국가", "독재국가", "식민 국가"].map((item) => (
                      <span key={item} className="rounded-lg border border-border bg-background px-1 py-2 font-semibold">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
