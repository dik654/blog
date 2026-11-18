import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 두 번째 문단 — 독일 1883 질병보험, 1884 산재보상, 1889 노령 사회보험, 1927 실업보험,
 * 미국 1935년 8월 14일 사회보장법 서명, 영국 1942년 11월 베버리지 보고서, 그리고 9절의 1952년 ILO 협약 102호.
 * 가로축은 연도에 비례한다(1880~1955). 전후 확대와 플랫폼 노동은 글에 연도가 없어 축 위에 찍지 않았다.
 */
const GER = "#2563eb";
const USUK = "#7c3aed";
const ILO = "#16a34a";
const MUTED = "#94a3b8";

const Y0 = 1880;
const Y1 = 1955;
const X0 = 16;
const X1 = 344;
const x = (year: number) => X0 + ((X1 - X0) * (year - Y0)) / (Y1 - Y0);
const AXIS_Y = 58;

const EVENTS = [
  { group: 0, year: 1883, when: "1883", text: "독일 질병보험", color: GER, row: 0 },
  { group: 0, year: 1884, when: "1884", text: "독일 산재보상", color: GER, row: 1 },
  { group: 0, year: 1889, when: "1889", text: "독일 노령 사회보험 — 세계 첫", color: GER, row: 2 },
  { group: 0, year: 1927, when: "1927", text: "독일 실업보험", color: GER, row: 0 },
  { group: 1, year: 1935, when: "1935.8.14", text: "미국 사회보장법 서명", color: USUK, row: 0 },
  { group: 1, year: 1942, when: "1942.11", text: "영국 베버리지 보고서", color: USUK, row: 1 },
  { group: 2, year: 1952, when: "1952", text: "ILO 협약 102호 — 아홉 분야의 최저선 (9절)", color: ILO, row: 2 },
] as const;

const SCENES = [
  { label: "독일: 위험마다 한 칸씩", summary: "1883 → 1927", note: "독일은 비스마르크 시기에 질병(1883)·산재(1884)·노령(1889)을 차례로 보험에 넣었고, 실업보험은 1927년에 더했습니다. 첫 칸에서 실업까지 44년이 걸렸습니다." },
  { label: "미국과 영국", summary: "1935 · 1942", note: "미국은 1935년 8월 14일 사회보장법에 서명했고, 영국의 1942년 11월 베버리지 보고서는 전후 제도의 설계도가 됐습니다. 독일의 첫 보험(1883)보다 52년, 59년 뒤입니다." },
  { label: "전후 확대와 국제 최저기준", summary: "1952 ILO 협약 102호", note: "제2차 세계대전 뒤 의료·연금·가족 급여가 확대됐고(글에 연도가 없어 축에 찍지 않음), 1952년 ILO 협약 102호가 최저선을 정했습니다. 그 뒤 파견·자영업·플랫폼 노동이 커지며 고용관계에 묶인 보호의 빈칸이 다시 드러났습니다." },
] as const;

export default function SocialInsuranceTimelineViz() {
  return (
    <SceneShell
      eyebrow="연표"
      title="사회보험은 나라마다 다른 해에 한 칸씩 생겼습니다"
      description="위 축은 1880~1955년을 햇수에 비례해 그렸습니다. 4절과 9절의 연도만 썼습니다."
      ariaLabel="독일 1883년부터 1952년 ILO 협약 102호까지의 사회보험 도입 연표"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 360 84" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
            {[1880, 1900, 1920, 1940].map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke={MUTED} strokeWidth={1} />
                <text x={x(year)} y={AXIS_Y + 17} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.7}>{year}</text>
              </g>
            ))}
            {active === 0 && (
              <>
                <line x1={x(1883)} x2={x(1927)} y1={AXIS_Y - 9} y2={AXIS_Y - 9} stroke={GER} strokeWidth={1.25} />
                <text x={(x(1889) + x(1927)) / 2} y={AXIS_Y - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={GER}>44년</text>
              </>
            )}
            {EVENTS.map((event) => {
              const on = event.group === active;
              const labelY = 12 + event.row * 12;
              return (
                <g key={event.when} opacity={on ? 1 : 0.35}>
                  <line x1={x(event.year)} x2={x(event.year)} y1={labelY + 3} y2={AXIS_Y} stroke={event.color} strokeWidth={1} strokeOpacity={0.5} />
                  <circle cx={x(event.year)} cy={AXIS_Y} r={3.5} fill={event.color} />
                  <text x={x(event.year) + 3} y={labelY} fontSize={10.5} fontWeight={on ? 700 : 500} fill={event.color}>{event.year}</text>
                </g>
              );
            })}
          </svg>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm leading-6 sm:grid-cols-2">
            {EVENTS.map((event) => {
              const on = event.group === active;
              return (
                <li key={event.when} className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2" style={{ opacity: on ? 1 : 0.4 }}>
                  <span className="font-mono text-xs leading-6 font-bold" style={{ color: event.color }}>{event.when}</span>
                  <span className={on ? "font-semibold" : ""}>{event.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    />
  );
}
