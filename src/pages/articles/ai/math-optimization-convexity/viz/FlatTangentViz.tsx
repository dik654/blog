import SceneShell from "./SceneShell";

/**
 * 본문 대응: #convexity — 미분 가능한 볼록 함수에서는 접선이 전체 함수의 아래쪽 경계다.
 * x²의 x=1 접선 y=2x−1, x²의 x=0 접선 y=0(기울기 0 → 전역 최소),
 * −x²(볼록하지 않음)의 x=0 접선 y=0은 곡선 위에 놓여 주변이 더 낮다(5절의 가정 예).
 */
const SCENES = [
  { label: "x²의 x=1 접선", summary: "접선 y=2x−1 ≤ 곡선", note: "볼록한 x²에서는 x=1에서 그은 접선이 곡선 전체의 아래에 놓입니다. 한 점의 직선 예측이 모든 y에서 실제 점수보다 높지 않다는 뜻입니다." },
  { label: "x²의 x=0 · 기울기 0", summary: "f(y) ≥ 0 = f(0)", note: "기울기가 0인 x=0에서는 접선이 수평선 y=0입니다. 이 접선이 곡선 전체의 아래 경계이므로 어떤 y도 f(0)=0보다 낮을 수 없고, x=0이 전역 최소점입니다." },
  { label: "−x²의 x=0 · 기울기 0", summary: "기울기 0이지만 주변이 더 낮음", note: "5절의 −x²도 x=0에서 기울기가 0이고 접선은 같은 수평선입니다. 하지만 이 함수는 볼록하지 않아 접선이 아래 경계가 아니고, 곡선이 접선보다 아래로 내려가 주변 점수가 더 낮습니다." },
] as const;

const W = 320;
const H = 220;
const CX = 160;
const CY = 110;
const SX = 60;
const SY = 22;
const px = (x: number) => CX + x * SX;
const py = (y: number) => CY - y * SY;
const X_MIN = -2.2;
const X_MAX = 2.2;
const curve = (f: (x: number) => number) =>
  Array.from({ length: 89 }, (_, i) => {
    const x = X_MIN + (i / 88) * (X_MAX - X_MIN);
    return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)},${py(f(x)).toFixed(1)}`;
  }).join(" ");

const ACCENT = "#2563eb";
const WARN = "#dc2626";
const BASE = "#64748b";
const MUTED = "#94a3b8";

export default function FlatTangentViz() {
  return (
    <SceneShell
      eyebrow="기울기 0의 두 얼굴"
      title="볼록하면 수평 접선 아래에 더 낮은 점이 없습니다"
      description="곡선은 점수, 파란 직선은 한 점에서 기울기를 맞춘 접선입니다. 세로 눈금은 가로보다 촘촘하게 줄였습니다."
      ariaLabel="x제곱과 마이너스 x제곱에서 접선과 곡선의 위아래 비교"
      scenes={SCENES}
      render={(active) => {
        const concave = active === 2;
        const f = concave ? (x: number) => -x * x : (x: number) => x * x;
        const at = active === 0 ? 1 : 0;
        const slope = active === 0 ? 2 : 0;
        const tangent = (x: number) => f(at) + slope * (x - at);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <clipPath id="flat-tangent-clip">
                <rect x={8} y={8} width={W - 16} height={H - 16} />
              </clipPath>
            </defs>
            <line x1={8} x2={W - 8} y1={CY} y2={CY} stroke={MUTED} strokeWidth={1} />
            <line x1={CX} x2={CX} y1={8} y2={H - 8} stroke={MUTED} strokeWidth={1} />
            {[-2, -1, 1, 2].map((x) => (
              <text key={x} x={px(x)} y={CY + 14} textAnchor="middle" fontSize={10} fill={BASE}>{x}</text>
            ))}
            <g clipPath="url(#flat-tangent-clip)">
              <path d={curve(f)} fill="none" stroke={concave ? WARN : BASE} strokeWidth={1.25} />
              <line x1={px(X_MIN)} y1={py(tangent(X_MIN))} x2={px(X_MAX)} y2={py(tangent(X_MAX))} stroke={ACCENT} strokeWidth={1.25} strokeDasharray="5 3" />
            </g>
            <circle cx={px(at)} cy={py(f(at))} r={4.5} fill={ACCENT} />
            <text x={concave ? px(1.85) : px(-2.15)} y={concave ? py(-2.2) + 10 : py(2.2)} fontSize={11} fill={concave ? WARN : BASE}>{concave ? "−x²" : "x²"}</text>
            <text x={active === 0 ? px(0.2) : px(-2.1)} y={active === 0 ? py(-1.6) : CY - 8} fontSize={11} fill={ACCENT}>
              {active === 0 ? "접선 y=2x−1" : "접선 y=0"}
            </text>
            {concave && (
              <text x={CX + 8} y={196} fontSize={11} fontWeight={700} fill={WARN}>접선보다 낮은 점들</text>
            )}
          </svg>
        );
      }}
    />
  );
}
