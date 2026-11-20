import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 독일 관세동맹(촐페라인)은 한 번에 오지 않았다(Ploeckl 2010).
 * 1833년 3월 합병 합의 → 1834-01-01 발효 → 2년 뒤(1836) 바덴·나사우·프랑크푸르트
 * → 브라운슈바이크·룩셈부르크(1842) → 하노버·올덴부르크(1854). 1834~1854 = 20년.
 * 축은 1832~1856 연도 비례. 1833 표식은 1836 글자와 겹치지 않게 한 단 높이 둔다.
 */
const FROM = 1832;
const TO = 1856;
const W = 360;
const H = 104;
const PAD = 18;
const AXIS_Y = 60;
const x = (year: number) => PAD + ((year - FROM) / (TO - FROM)) * (W - 2 * PAD);

const MARKS = [
  { year: 1833, label: "1833.3 합의", above: true, reach: 30 },
  { year: 1834, label: "1834.1.1 발효", above: false, reach: 16 },
  { year: 1836, label: "1836", above: true, reach: 16 },
  { year: 1842, label: "1842", above: false, reach: 16 },
  { year: 1854, label: "1854", above: true, reach: 16 },
] as const;
const MARK_LIST: readonly { year: number }[] = MARKS;

const GROUPS = [
  { name: "프로이센 중심 관세권", joins: 1 },
  { name: "바이에른·뷔르템베르크 관세동맹", joins: 1 },
  { name: "바덴·나사우·프랑크푸르트", joins: 2 },
  { name: "브라운슈바이크·룩셈부르크", joins: 3 },
  { name: "하노버·올덴부르크", joins: 4 },
] as const;

const SCENES = [
  { label: "1833년 3월 합병 합의", summary: "두 관세권이 합치기로 함", note: "두 관세권이 합병에 합의했지만 아직 발효 전이라 따로 있습니다." },
  { label: "1834년 1월 1일 발효", summary: "독일 관세동맹 출발", note: "두 관세권이 하나로 묶였고 아래 세 줄은 아직 밖입니다." },
  { label: "2년 뒤, 1836년", summary: "바덴·나사우·프랑크푸르트", note: "발효 2년 뒤 바덴·나사우·프랑크푸르트가 들어왔습니다." },
  { label: "1842년", summary: "브라운슈바이크·룩셈부르크", note: "브라운슈바이크와 룩셈부르크가 둘 다 1842년에 들어왔습니다." },
  { label: "1854년", summary: "하노버·올덴부르크 · 발효 뒤 20년", note: "하노버·올덴부르크까지 발효 뒤 20년이 걸렸습니다. 시장 통합도 한 번에 오지 않았습니다." },
] as const;

export default function ZollvereinAccessionViz() {
  return (
    <SceneShell
      eyebrow="관세동맹의 확대"
      title="독일 관세동맹은 20년에 걸쳐 넓어졌습니다"
      description="관세동맹은 회원끼리 관세를 없애고 바깥에는 같은 관세를 매기는 묶음입니다. 위 선의 간격은 실제 연도 차이에 비례하고, 아래 줄은 각 권역이 언제 안으로 들어왔는지입니다(Ploeckl 2010)."
      ariaLabel="1833년 합의부터 1854년 하노버·올덴부르크 가입까지 독일 관세동맹 확대 연표"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={x(FROM)} x2={x(TO)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[1835, 1840, 1845, 1850, 1855].map((year) => (
              <line key={year} x1={x(year)} x2={x(year)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#cbd5e1" strokeWidth={1} />
            ))}
            <line x1={x(1834)} x2={x(MARK_LIST[Math.min(active, MARK_LIST.length - 1)].year)} y1={AXIS_Y} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1.25} opacity={active >= 1 ? 1 : 0} />
            {MARKS.map((mark, index) => {
              const done = index <= active;
              const current = index === active;
              return (
                <g key={mark.year}>
                  <circle cx={x(mark.year)} cy={AXIS_Y} r={current ? 6 : 4.5} fill={done ? "#2563eb" : "#ffffff"} stroke={done ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <line x1={x(mark.year)} x2={x(mark.year)} y1={mark.above ? AXIS_Y - 8 : AXIS_Y + 8} y2={mark.above ? AXIS_Y - mark.reach : AXIS_Y + mark.reach} stroke={done ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                  <text
                    x={x(mark.year)}
                    y={mark.above ? AXIS_Y - mark.reach - 5 : AXIS_Y + mark.reach + 12}
                    textAnchor={index === 0 ? "start" : "middle"}
                    fontSize={11}
                    fontWeight={current ? 700 : 400}
                    fill={done ? "#1d4ed8" : "#64748b"}
                  >
                    {mark.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <ul className="mt-3 space-y-1.5">
            {GROUPS.map((group) => {
              const inside = active >= group.joins;
              const agreed = active === 0 && group.joins === 1;
              const status = inside ? (active === group.joins ? "방금 가입" : "안에 있음") : agreed ? "합병 합의" : "아직 밖";
              return (
                <li key={group.name} className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-2 text-xs sm:text-sm">
                  <span className={inside ? "font-semibold" : "text-muted-foreground"}>
                    {group.name}
                    <span className="ml-1 font-mono text-[11px] text-muted-foreground">{MARK_LIST[group.joins].year}</span>
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-center text-[11px] sm:text-xs ${
                      inside ? "border-blue-600 bg-blue-600 text-white" : agreed ? "border-dashed border-blue-600 text-blue-700 dark:text-blue-300" : "border-dashed border-border text-muted-foreground"
                    }`}
                  >
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    />
  );
}
