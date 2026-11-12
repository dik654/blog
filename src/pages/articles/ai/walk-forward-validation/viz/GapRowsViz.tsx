import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-gap-count — TimeSeriesSplit의 gap은 표본(행) 수를 센다.
 * 하루 기록 수(가정)에 따라 37행이 덮는 날 수: 하루 1행 37일, 하루 2행 18.5일, 이틀에 1행 74일.
 * 가로축 = 평가 시작 전 날짜(0 = 평가 시작).
 */
const SPAN = 80;
const GAP_ROWS = 37;

const W = 360;
const H = 166;
const LEFT = 12;
const RIGHT = 44;
const BASE_Y = 104;
const x = (daysBefore: number) => W - RIGHT - (daysBefore / SPAN) * (W - LEFT - RIGHT);

const SCENES = [
  { label: "하루 1행", summary: "37행 = 37일", perDay: 1, every: 1, days: 37, note: "하루에 정확히 한 행이 쌓일 때만 표본 37개와 37일이 일치합니다. 이 경우에도 일치는 기록 규칙 덕분이지 gap이 날짜를 센 결과가 아닙니다." },
  { label: "하루 2행", summary: "37행 = 18.5일", perDay: 2, every: 1, days: 18.5, note: "하루에 두 행이 쌓이면 표본 37개는 18.5일치입니다. 37일 지연이 있는 사건의 정답이 아직 도착하지 않은 행이 학습 쪽에 남을 수 있습니다." },
  { label: "이틀에 1행", summary: "37행 = 74일", perDay: 1, every: 2, days: 74, note: "기록이 드물면 표본 37개가 74일을 덮습니다. 어느 쪽이든 gap은 행 수를 셀 뿐이므로, 10월 25일 행의 도착일 12월 1일을 예측 시작점과 비교하는 검사는 따로 해야 합니다." },
] as const;

interface Dot {
  day: number;
  level: number;
  inGap: boolean;
}

function dotsFor(perDay: number, every: number): Dot[] {
  const days = Array.from({ length: Math.floor(SPAN / every) }, (_, i) => (i + 1) * every);
  const rows = days.flatMap((day) => Array.from({ length: perDay }, (_, level) => ({ day, level })));
  return rows.map((row, index) => ({ ...row, inGap: index < GAP_ROWS }));
}

export default function GapRowsViz() {
  return (
    <SceneShell
      eyebrow="gap의 단위"
      title="gap=37은 행 37개를 뺄 뿐 37일을 세지 않습니다"
      description="점 하나가 기록 한 행이고, 가로축은 평가 구간이 시작하기 전의 날짜입니다. gap은 학습 구간 끝에서 빼는 표본(행)의 개수입니다. 장면마다 다른 하루 기록 수는 설명을 위한 가정입니다."
      ariaLabel="하루 기록 수에 따라 표본 37개가 덮는 날 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const dots = dotsFor(scene.perDay, scene.every);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={x(0)} y={60} width={W - RIGHT - x(0) + 30} height={52} fill="#dbeafe" />
            <text x={x(0) + 15} y={56} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1d4ed8">평가</text>

            <line x1={x(37)} x2={x(37)} y1={34} y2={BASE_Y + 8} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(37)} y={28} textAnchor="middle" fontSize={13} fill="#475569">37일 전</text>

            <rect x={x(scene.days + 0.5)} y={64} width={x(0) - x(scene.days + 0.5)} height={44} fill="#fde68a" opacity={0.55} />
            <text x={(x(scene.days) + x(0)) / 2} y={124} textAnchor="middle" fontSize={14} fontWeight={700} fill="#b45309">
              {`gap 37행 = ${scene.days}일`}
            </text>

            {dots.map((dot) => (
              <circle
                key={`${dot.day}-${dot.level}`}
                cx={x(dot.day)}
                cy={BASE_Y - 6 - dot.level * 7}
                r={1.7}
                fill={dot.inGap ? "#d97706" : "#64748b"}
              />
            ))}
            <line x1={LEFT} x2={W - RIGHT + 30} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {[80, 60, 40, 20, 0].map((day) => (
              <text key={day} x={x(day)} y={BASE_Y + 40} textAnchor={day === 80 ? "start" : "middle"} fontSize={13} fill="#64748b">
                {day === 0 ? "0" : `−${day}일`}
              </text>
            ))}
          </svg>
        );
      }}
    />
  );
}
