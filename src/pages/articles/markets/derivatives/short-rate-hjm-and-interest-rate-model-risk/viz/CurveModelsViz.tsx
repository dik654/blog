import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 한 점 방식: 오늘 3%가 오르내리면 1년·2년·10년 금리가 정한 함수대로 함께 움직임.
 * 곡선 방식: 현재 시각 t에서 만기 T마다 앞선 금리를 따로 움직임(만기별 흔들림·상관 필요).
 * 곡선 모양과 움직임 크기는 본문에 없어 세로 눈금을 두지 않은 설명용 그림입니다(가정). 3%만 본문 숫자입니다.
 */
const W = 360;
const H = 176;
const LEFT = 30;
const RIGHT = 20;
const TOP = 20;
const BOTTOM = 142;
const MATURITIES = [0, 1, 2, 5, 10] as const;
const tx = (years: number) => LEFT + (years / 10) * (W - LEFT - RIGHT);

/** 오늘 곡선의 세로 위치(px, 작을수록 높음). 모양은 가정입니다. */
const TODAY: readonly number[] = [104, 88, 78, 62, 54];
/** 한 점 방식: 짧은 끝이 오르면 정한 함수대로 함께, 만기가 길수록 덜 움직인다고 둔 가정. */
const ONE_POINT_UP: readonly number[] = [-30, -22, -17, -10, -6];
/** 곡선 방식: 만기마다 따로 — 짧은 쪽은 오르고 긴 쪽은 내려 기울기가 바뀌는 가정. */
const CURVE_TWIST: readonly number[] = [-18, -14, -4, 10, 18];

const SCENES = [
  { label: "오늘 곡선", summary: "출발점은 같습니다", shift: null, handles: "none", note: "가로는 지급 만기, 세로는 금리입니다. 맨 왼쪽 점이 오늘의 가장 짧은 금리 3%입니다. 두 방식 모두 이 오늘 곡선에서 출발합니다. 곡선 모양은 설명용 가정입니다." },
  { label: "한 점 방식", summary: "손잡이 1개 → 곡선 전체", shift: ONE_POINT_UP, handles: "one", note: "움직이는 상태는 오늘 3% 한 점뿐입니다. 이 점이 오르면 1년·2년·10년 금리가 모형이 정한 함수대로 함께 움직입니다. 관리할 숫자가 적어 계산과 설명이 쉽습니다." },
  { label: "곡선 방식", summary: "만기마다 손잡이", shift: CURVE_TWIST, handles: "all", note: "만기 T마다 앞선 금리가 따로 움직이는 상태입니다. 짧은 쪽은 오르고 긴 쪽은 내리는 식의 기울기 변화도 그릴 수 있습니다(가정). 대신 만기별 흔들림과 상관 구조가 필요해 자료와 계산이 늘어납니다." },
] as const;

function path(points: readonly number[]) {
  return points.map((y, n) => `${n === 0 ? "M" : "L"}${tx(MATURITIES[n])},${y}`).join(" ");
}

export default function CurveModelsViz() {
  return (
    <SceneShell
      eyebrow="한 점과 곡선"
      title="손잡이 하나로 곡선을 끌지, 만기마다 따로 끌지"
      description="회색 점선은 오늘 곡선, 파란 선은 움직인 뒤의 곡선, 동그란 손잡이는 모형이 직접 움직이는 상태입니다. 곡선 모양과 움직임 크기는 본문에 없어 세로 눈금 없이 그린 가정입니다."
      ariaLabel="단기금리 한 점 모형과 만기별로 움직이는 곡선 모형의 상태 수 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const moved = scene.shift === null ? null : TODAY.map((y, n) => y + (scene.shift as readonly number[])[n]);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={W - RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT - 6} y={TOP + 4} textAnchor="end" fontSize={10} fill="#64748b">금리</text>
            {MATURITIES.map((years) => (
              <g key={years}>
                <line x1={tx(years)} x2={tx(years)} y1={BOTTOM} y2={BOTTOM + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={tx(years)} y={BOTTOM + 17} textAnchor="middle" fontSize={11} fill="#64748b">{years === 0 ? "단기" : `${years}년`}</text>
              </g>
            ))}
            <text x={W - RIGHT} y={BOTTOM + 31} textAnchor="end" fontSize={10} fill="#64748b">지급 만기 →</text>
            <path d={path(TODAY)} fill="none" stroke="#94a3b8" strokeWidth={1.25} strokeDasharray="4 3" />
            {moved ? <path d={path(moved)} fill="none" stroke="#2563eb" strokeWidth={1.25} /> : null}
            {(moved ?? TODAY).map((y, n) => {
              const isHandle = scene.handles === "all" || (scene.handles === "one" && n === 0);
              return isHandle ? (
                <g key={n}>
                  <line x1={tx(MATURITIES[n])} x2={tx(MATURITIES[n])} y1={TODAY[n]} y2={y} stroke="#2563eb" strokeWidth={1} />
                  <circle cx={tx(MATURITIES[n])} cy={y} r={6} fill="#ffffff" stroke="#2563eb" strokeWidth={1.25} />
                </g>
              ) : (
                <circle key={n} cx={tx(MATURITIES[n])} cy={y} r={2.5} fill={moved ? "#2563eb" : "#64748b"} />
              );
            })}
            <text x={tx(0) + 8} y={TODAY[0] + 16} fontSize={11} fontWeight={700} fill="#475569">오늘 3%</text>
          </svg>
        );
      }}
    />
  );
}
