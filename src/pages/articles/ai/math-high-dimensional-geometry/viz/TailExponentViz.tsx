import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source의 접은 설명 — 위쪽 꼬리 exp(−k[ε−ln(1+ε)]/2) ≤ exp(−kc/2), 아래쪽 꼬리 exp(−k[−ε−ln(1−ε)]/2) ≤ exp(−kε²/4).
 * 곡선은 네 지수 값을 계산한 산술입니다. c=ε²/2−ε³/3. 곡선이 높을수록 실패 상한이 작습니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 214;
const LEFT = 42;
const RIGHT = 78;
const TOP = 12;
const BASE = 172;
const MAX_E = 0.6;
const MAX_Y = 0.33;

const px = (e: number) => LEFT + (e / MAX_E) * (W - LEFT - RIGHT);
const py = (v: number) => BASE - (v / MAX_Y) * (BASE - TOP);
const curve = (fn: (e: number) => number) =>
  Array.from({ length: 61 }, (_, i) => {
    const e = (i / 60) * MAX_E;
    return `${px(e).toFixed(1)},${py(fn(e)).toFixed(1)}`;
  }).join(" ");

const CURVES = {
  lower: { name: "아래쪽 꼬리", color: AMBER, points: curve((e) => -e - Math.log(1 - e)), labelY: py(0.316) + 4 },
  half: { name: "ε²/2", color: AMBER, points: curve((e) => (e * e) / 2), labelY: py(0.18) + 4 },
  upper: { name: "위쪽 꼬리", color: BLUE, points: curve((e) => e - Math.log(1 + e)), labelY: py(0.13) + 1 },
  c: { name: "c", color: RED, points: curve((e) => (e * e) / 2 - (e * e * e) / 3), labelY: py(0.108) + 9 },
} as const;
type Key = keyof typeof CURVES;

const SCENES: readonly { label: string; summary: string; note: string; show: readonly Key[] }[] = [
  { label: "위쪽 꼬리", summary: "지수 ε − ln(1+ε)", show: ["upper"], note: "제곱 길이가 (1+ε)배 위로 나갈 상한은 exp(−k×이 값/2)입니다. 값이 클수록 상한이 작습니다." },
  { label: "c로 낮추기", summary: "ε − ln(1+ε) ≥ c", show: ["upper", "c"], note: "ln(1+ε)≤ε−ε²/2+ε³/3을 쓰면 c가 위쪽 곡선 아래에 놓입니다. 지수를 c로 바꾸면 상한은 exp(−kc/2)로 더 커지지만 여전히 성립합니다." },
  { label: "아래쪽 꼬리", summary: "−ε − ln(1−ε) ≥ ε²/2", show: ["lower", "half"], note: "(1−ε)배 아래로 나갈 상한의 지수는 주황 윗곡선입니다. ε²/2로 낮추면 상한이 exp(−kε²/4)입니다." },
  { label: "넷을 한 그림에", summary: "두 꼬리 합 ≤ 2exp(−kc/2)", show: ["lower", "half", "upper", "c"], note: "c가 가장 아래라 두 꼬리 모두 exp(−kc/2) 이하입니다. 둘을 더한 것이 10절의 2exp(−kc/2)입니다. ε=0.2에서 위부터 약 0.0231, 0.0200, 0.0177, 0.0173입니다." },
];

export default function TailExponentViz() {
  return (
    <SceneShell
      eyebrow="꼬리 확률의 지수"
      title="가장 아래 곡선 c가 두 꼬리의 상한을 함께 덮습니다"
      description="꼬리는 제곱 길이 비가 (1±ε) 밖으로 나가는 경우입니다. 세로축은 지수 안의 값(높을수록 실패 상한이 작음)이고, 상한은 exp(−k×세로값/2)입니다. c=ε²/2−ε³/3입니다."
      note="아래 접은 설명의 식을 계산한 곡선입니다. 고정한 한 쌍의 상한이며 측정값이 아닙니다."
      ariaLabel="위쪽과 아래쪽 꼬리의 지수 곡선과 c 비교"
      scenes={SCENES}
      render={(active) => {
        const show = SCENES[active].show;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.1, 0.2, 0.3].map((tick) => (
              <text key={tick} x={LEFT - 6} y={py(tick) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{tick}</text>
            ))}
            {[0, 0.2, 0.4, 0.6].map((tick) => (
              <g key={tick}>
                <line x1={px(tick)} x2={px(tick)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(tick)} y={BASE + 18} textAnchor="middle" fontSize={12} fill={GRAY}>{tick}</text>
              </g>
            ))}
            <text x={(LEFT + W - RIGHT) / 2} y={BASE + 36} textAnchor="middle" fontSize={12} fill={GRAY}>허용 오차 ε</text>
            <text transform={`translate(11 ${(TOP + BASE) / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill={GRAY}>지수 값</text>
            {show.map((key) => {
              const item = CURVES[key];
              return (
                <g key={key}>
                  <polyline points={item.points} fill="none" stroke={item.color} strokeWidth={1.25} strokeDasharray={key === "half" ? "4 3" : undefined} />
                  <text x={W - RIGHT + 6} y={item.labelY} fontSize={12} fontWeight={700} fill={item.color}>{item.name}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
