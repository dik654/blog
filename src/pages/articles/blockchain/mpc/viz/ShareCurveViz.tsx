import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multiplication — 직선 조각의 합은 직선, 곱은 이차식이라 두 점 복원이 틀린다.
 * 그래프는 mod 67로 줄이기 전의 정수값으로 그린다. 줄이면 본문 숫자와 같다.
 * 4+2X → 6,8,10 / 7+7X → 14,21,28 / q=35+56X+21X² → 112,231,392 (mod67: 45,30,57).
 * 두 점 직선: 2·112−231=−7 ≡ 60. 세 점 무게 3,−3,1: 3·112−3·231+392=35.
 */
type Poly = readonly number[];
type Curve = { poly: Poly; color: string; dashed?: boolean; faint?: boolean; label?: string };
type Scale = { min: number; max: number; ticks: readonly number[] };
type View = { scale: Scale; curves: readonly Curve[]; points: readonly Poly[]; target: number; targetLabel: string };

const evalPoly = (poly: Poly, x: number) => poly.reduce<number>((sum, c, k) => sum + c * x ** k, 0);

const SCENES = [
  {
    label: "입력 4의 직선",
    summary: "4+2X → 6, 8, 10",
    note: "상수항 4를 X=0 위치에 숨기고 기울기 2로 직선을 만듭니다. 주소 1·2·3에서 읽은 6·8·10이 세 참여자의 조각입니다. 한 사람은 자기 점 하나만 받습니다.",
  },
  {
    label: "더해도 직선",
    summary: "(4+2X)+(3+5X)=7+7X → 14, 21, 28",
    note: "각자 자기 주소의 두 조각을 더하면 14·21·28이 됩니다. 이 점들은 직선 7+7X 위에 있고, X=0에서 만나는 값이 숨긴 합 7입니다.",
  },
  {
    label: "곱하면 이차식",
    summary: "35+56X+21X² → 112, 231, 392",
    note: "합 조각에 셋째 입력 5+3X의 조각 8·11·14를 곱하면 점들이 직선이 아니라 이차식 위에 놓입니다. 정수값 112·231·392를 mod 67로 줄이면 본문의 45·30·57입니다.",
  },
  {
    label: "두 점으로 직선 복원",
    summary: "2·112−231=−7 ≡ 60 ≠ 35",
    note: "첫 두 점만 지나는 직선을 X=0까지 늘이면 −7에 닿습니다. mod 67에서 −7은 60이고, 본문이 말한 대로 원하는 35가 아닙니다. 곡선 위의 점을 직선으로 이었기 때문입니다.",
  },
  {
    label: "세 점으로 이차식 복원",
    summary: "3·112−3·231+392=35",
    note: "세 점을 모두 쓰면 이차식 자체가 정해지고, 무게 3·−3·1로 X=0의 값 35를 얻습니다. mod 67로 줄인 45·30·57에 같은 무게를 써도 102≡35입니다.",
  },
] as const;

const W = 360;
const H = 210;
const L = 44;
const R = 344;
const T = 16;
const B = 180;
const X_MAX = 3.3;
const sx = (x: number) => L + (x / X_MAX) * (R - L);

const SMALL: Scale = { min: 0, max: 32, ticks: [0, 10, 20, 30] };
const LARGE: Scale = { min: -40, max: 420, ticks: [0, 100, 200, 300, 400] };

const LINE4: Curve = { poly: [4, 2], color: "#2563eb" };
const LINE3: Curve = { poly: [3, 5], color: "#94a3b8", faint: true, label: "3+5X" };
const LINE4_FAINT: Curve = { poly: [4, 2], color: "#94a3b8", faint: true, label: "4+2X" };
const SUM: Curve = { poly: [7, 7], color: "#2563eb", label: "7+7X" };
const PRODUCT: Curve = { poly: [35, 56, 21], color: "#7c3aed" };
const TWO_POINT: Curve = { poly: [-7, 119], color: "#dc2626", dashed: true };

const VIEWS: readonly View[] = [
  { scale: SMALL, curves: [LINE4], points: [LINE4.poly], target: 4, targetLabel: "숨긴 값 4" },
  { scale: SMALL, curves: [LINE4_FAINT, LINE3, SUM], points: [SUM.poly], target: 7, targetLabel: "숨긴 합 7" },
  { scale: LARGE, curves: [PRODUCT], points: [PRODUCT.poly], target: 35, targetLabel: "원하는 35" },
  { scale: LARGE, curves: [PRODUCT, TWO_POINT], points: [PRODUCT.poly], target: -7, targetLabel: "직선이 닿는 −7 (≡60)" },
  { scale: LARGE, curves: [PRODUCT], points: [PRODUCT.poly], target: 35, targetLabel: "복원한 35" },
];

const SAMPLES = Array.from({ length: 34 }, (_, i) => (i / 33) * X_MAX);

export default function ShareCurveViz() {
  return (
    <SceneShell
      eyebrow="정수로 그린 조각의 모양"
      title="곱한 조각은 곡선 위에 있어서 두 점 직선으로는 35가 나오지 않습니다"
      description="가로축은 조각의 주소 X(1·2·3은 세 참여자), 세로축은 그 주소의 조각 값입니다. X=0에서의 값이 숨긴 상수항입니다. mod 67로 줄이기 전의 정수값으로 그렸고, 줄인 값은 본문의 숫자와 같습니다. 1·2장면과 3–5장면은 세로 눈금이 다릅니다."
      ariaLabel="직선 조각의 덧셈과 곱셈, 두 점과 세 점 복원 비교"
      scenes={SCENES}
      render={(active) => {
        const view = VIEWS[active];
        const { min, max, ticks } = view.scale;
        const sy = (y: number) => B - ((y - min) / (max - min)) * (B - T);
        const path = (poly: Poly) =>
          SAMPLES.map((x, i) => `${i === 0 ? "M" : "L"} ${sx(x).toFixed(1)} ${sy(evalPoly(poly, x)).toFixed(1)}`).join(" ");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={L} x2={R} y1={sy(tick)} y2={sy(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={L - 6} y={sy(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <line x1={L} x2={L} y1={T} y2={B} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={R} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2, 3].map((x) => (
              <text key={x} x={sx(x)} y={B + 16} textAnchor="middle" fontSize={11} fill="#64748b">X={x}</text>
            ))}
            {view.curves.map((curve, i) => (
              <g key={i}>
                <path
                  d={path(curve.poly)}
                  fill="none"
                  stroke={curve.color}
                  strokeWidth={curve.faint ? 1 : 1.25}
                  strokeDasharray={curve.dashed ? "4 3" : undefined}
                  opacity={curve.faint ? 0.7 : 1}
                />
                {curve.label && (
                  <text x={R - 2} y={sy(evalPoly(curve.poly, X_MAX)) - 4} textAnchor="end" fontSize={10} fontWeight={700} fill={curve.faint ? "#64748b" : curve.color}>
                    {curve.label}
                  </text>
                )}
              </g>
            ))}
            {view.points.map((poly) =>
              [1, 2, 3].map((x) => {
                const value = evalPoly(poly, x);
                const big = value > 67;
                return (
                  <g key={`${poly.join()}-${x}`}>
                    <circle cx={sx(x)} cy={sy(value)} r={3.5} fill="#ffffff" stroke="#0f172a" strokeWidth={1.25} />
                    <text x={x === 3 ? sx(x) - 7 : sx(x) + 6} y={sy(value) + (x === 3 ? 16 : -7)} textAnchor={x === 3 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#0f172a">
                      {big ? `${value} (≡${value % 67})` : value}
                    </text>
                  </g>
                );
              }),
            )}
            <circle cx={sx(0)} cy={sy(view.target)} r={4} fill={view.target < 0 ? "#dc2626" : "#16a34a"} />
            <text
              x={sx(0) + 8}
              y={sy(view.target) + (view.target < 0 ? 14 : -7)}
              fontSize={12}
              fontWeight={700}
              fill={view.target < 0 ? "#dc2626" : "#15803d"}
            >
              {view.targetLabel}
            </text>
          </svg>
        );
      }}
    />
  );
}
