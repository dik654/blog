import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — OnCalendar 6:00 + RandomizedDelaySec 60m은 서버를 한 시간 안에 흩을 뿐,
 * fleet 전체로는 같은 창이다. 상관관계를 끊으려면 묶음마다 다른 OnCalendar가 필요하다.
 * 점의 자리와 날짜 배정은 설명용 가정이다.
 */
const X0 = 50;
const X1 = 352;
const REGIONS = [0, 1, 2, 3, 4] as const;
const DOTS = Array.from({ length: 9 }, (_, i) => i);
const rowY = (region: number) => 24 + region * 24;
const hourX = (hour: number) => X0 + ((hour - 5) / 3) * (X1 - X0); // 05:00~08:00
const dayX = (day: number) => X0 + (day / 5) * (X1 - X0); // 1~5일차
const fraction = (region: number, dot: number) => ((region + 1) * 0.37 + (dot + 1) * 0.618) % 1;

const SCENES = [
  { label: "서버 한 대", summary: "06:00 + 0~60분", note: "OnCalendar는 시작 시각, RandomizedDelaySec는 무작위 지연의 상한입니다. 이 설정이 서버 한 대의 실행 시각을 주황 띠 안의 어딘가로 정합니다." },
  { label: "한 지역", summary: "띠 안에서 흩어짐", note: "무작위 지연은 서버들을 한 시간 안에 흩어 놓습니다. 여기까지 보면 분산입니다." },
  { label: "fleet 전체", summary: "모두 같은 한 시간", note: "지역을 넓혀도 띠는 그대로입니다. 지역 사이에 연결이 없어도 모든 점이 같은 한 시간 창에 들어옵니다." },
  { label: "묶음마다 다른 OnCalendar", summary: "창이 서로 갈라짐", note: "가로축이 날짜로 바뀌었습니다. 지연을 늘리는 대신 시각 자체를 다르게 두면 묶음 사이의 상관관계가 끊기고, 그것이 곧 단계적 롤아웃입니다." },
] as const;

export default function RandomWindowViz() {
  return (
    <SceneShell
      eyebrow="무작위 지연의 범위"
      title="60분 지연은 한 시간 안에서만 흩어 놓습니다"
      description="줄 하나가 지역, 점 하나가 서버입니다. 점의 자리는 가정입니다. 띠는 업그레이드가 돌 수 있는 시간입니다."
      note="마지막 장면의 날짜 배정은 설명용 가정이고, 가로축이 시각에서 날짜로 바뀝니다."
      ariaLabel="무작위 지연이 만드는 한 시간 창과 묶음별로 다른 시작 시각의 비교"
      scenes={SCENES}
      render={(active) => {
        const byDay = active === 3;
        const visibleRegions = active === 0 || active === 1 ? 1 : REGIONS.length;
        const visibleDots = active === 0 ? 1 : DOTS.length;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {!byDay && <rect x={hourX(6)} y={12} width={hourX(7) - hourX(6)} height={124} fill="#d97706" opacity={0.2} />}
            {REGIONS.map((region) => (
              <g key={region}>
                <text x={0} y={rowY(region) + 4} fontSize={11} fill="#64748b">{byDay ? `묶음 ${region + 1}` : `지역 ${region + 1}`}</text>
                <line x1={X0} x2={X1} y1={rowY(region)} y2={rowY(region)} stroke="#94a3b8" strokeWidth={1} opacity={0.5} />
                {byDay && <rect x={dayX(region) + 2} y={rowY(region) - 8} width={dayX(1) - dayX(0) - 4} height={16} rx={2} fill="#d97706" opacity={0.2} />}
                {byDay && <circle cx={dayX(region) + (dayX(1) - dayX(0)) / 2} cy={rowY(region)} r={4} fill="#2563eb" />}
                {!byDay && region < visibleRegions && DOTS.slice(0, visibleDots).map((dot) => (
                  <circle key={dot} cx={hourX(6 + fraction(region, dot))} cy={rowY(region)} r={3.5} fill="#2563eb" />
                ))}
              </g>
            ))}
            <line x1={X0} x2={X1} y1={140} y2={140} stroke="#94a3b8" strokeWidth={1} />
            {byDay
              ? [0, 1, 2, 3, 4].map((day) => (
                  <text key={day} x={dayX(day) + (dayX(1) - dayX(0)) / 2} y={156} textAnchor="middle" fontSize={11} fill="#64748b">{`${day + 1}일차`}</text>
                ))
              : [5, 6, 7, 8].map((hour) => (
                  <text key={hour} x={hourX(hour)} y={156} textAnchor={hour === 8 ? "end" : "middle"} fontSize={11} fill="#64748b">{`0${hour}:00`}</text>
                ))}
          </svg>
        );
      }}
    />
  );
}
