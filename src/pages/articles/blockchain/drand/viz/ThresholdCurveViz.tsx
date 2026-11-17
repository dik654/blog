import SceneShell from "./ExplainSceneShell";

/**
 * 본문 대응: #threshold-round — λ_i가 "secret polynomial의 0 지점 값"을 복원한다는 말을 실수 좌표 비유로 그린다.
 * 곡선 f(x) = 4 + 2x − 0.4x² (가정) → share f(1..5) = 5.6, 6.4, 6.4, 5.6, 4.0, 비밀 f(0) = 4.
 * 두 점(1, 3)만 지나는 다른 2차식: 5.5 + 0.1x² (f(0) = 5.5), 2.5 + 4x − 0.9x² (f(0) = 2.5).
 * {1,3,5}: λ = 15/8, −5/4, 3/8 → 10.5 − 8 + 1.5 = 4.  {2,3,4}: λ = 6, −8, 3 → 38.4 − 51.2 + 16.8 = 4.
 */
type Curve = (x: number) => number;

const F: Curve = (x) => 4 + 2 * x - 0.4 * x * x;
const ALT_HIGH: Curve = (x) => 5.5 + 0.1 * x * x;
const ALT_LOW: Curve = (x) => 2.5 + 4 * x - 0.9 * x * x;

const W = 360;
const H = 222;
const LEFT = 40;
const RIGHT = 326;
const BASE = 190;
const TOP = 36;
const Y_MAX = 8;
const px = (x: number) => LEFT + (x / 5) * (RIGHT - LEFT);
const py = (y: number) => BASE - (y / Y_MAX) * (BASE - TOP);

const SAMPLES = Array.from({ length: 51 }, (_, i) => i / 10);
const path = (curve: Curve) => SAMPLES.map((x) => `${px(x).toFixed(1)},${py(curve(x)).toFixed(1)}`).join(" ");

const INDICES = [1, 2, 3, 4, 5] as const;

const SCENES = [
  { label: "share는 한 곡선 위의 점", summary: "share i = f(i) · 비밀 = f(0)", have: [1, 2, 3, 4, 5], curves: ["hidden"], zero: "?", note: "문턱 t=3이면 점 3개가 있어야 모양이 하나로 정해지는 곡선(2차식)을 씁니다. Node i의 key share는 그 곡선의 x=i 값이고, 곡선이 x=0에서 갖는 값이 아무도 갖지 않는 전체 비밀입니다. DKG는 이 곡선 전체를 한곳에서 만들지 않으므로 어느 node도 f(0)을 모릅니다." },
  { label: "share 둘: 1·3", summary: "f(0) 후보 2.5 · 4 · 5.5 …", have: [1, 3], curves: ["f", "high", "low"], zero: "?", note: "두 점을 지나는 2차 곡선은 셀 수 없이 많습니다. 그림의 세 곡선 모두 x=1과 x=3을 지나지만 x=0 값은 2.5, 4, 5.5로 다릅니다. 그래서 shares 1·3만으로는 ‘아직 없음’이 올바른 결과입니다." },
  { label: "share 셋: 1·3·5", summary: "곡선 하나 → f(0) = 4", have: [1, 3, 5], curves: ["f"], zero: "4", note: "세 번째 점이 오면 세 점을 모두 지나는 2차 곡선은 하나뿐입니다. 그 곡선의 x=0 값 4가 정해집니다." },
  { label: "다른 셋: 2·3·4", summary: "같은 곡선 → 같은 f(0) = 4", have: [2, 3, 4], curves: ["f"], zero: "4", note: "어떤 세 node가 응답해도 같은 곡선이 복원됩니다. 2·3·4의 계수는 6, −8, 3이고 6×6.4 − 8×6.4 + 3×5.6 = 4로 값이 같습니다." },
  { label: "λ로 곡선 없이 계산", summary: "15/8·5.6 − 5/4·6.4 + 3/8·4 = 4", have: [1, 3, 5], curves: ["f"], zero: "4", note: "계수는 signer index만으로 정해집니다. λ1 = (0−3)(0−5) / ((1−3)(1−5)) = 15/8이고 같은 방식으로 λ3 = −5/4, λ5 = 3/8입니다. 비밀 f(0)을 꺼내지 않고 이 계수를 지수로 써서 σ = σ1^λ1 · σ3^λ3 · σ5^λ5를 만듭니다." },
] as const;


const LAMBDA: Record<number, string> = { 1: "λ1 = 15/8", 3: "λ3 = −5/4", 5: "λ5 = 3/8" };

const CURVE_STYLE = {
  hidden: { curve: F, color: "#94a3b8", dash: "3 4" },
  f: { curve: F, color: "#2563eb", dash: undefined },
  high: { curve: ALT_HIGH, color: "#d97706", dash: "5 3" },
  low: { curve: ALT_LOW, color: "#7c3aed", dash: "5 3" },
} as const;

export default function ThresholdCurveViz() {
  return (
    <SceneShell
      eyebrow="n=5 · t=3 · 보간"
      title="왜 shares 셋이면 값이 하나로 정해지고 둘이면 안 될까요?"
      description="가로축은 signer index, 세로축은 share 값입니다. 실수 좌표 곡선은 Lagrange 보간을 보이기 위한 비유이고 값은 가정입니다."
      note="곡선 4 + 2x − 0.4x²과 share 값은 설명용 가정입니다. 실제 shares와 partial signatures는 실수가 아니라 group 원소이며, 분수 계수도 실수 나눗셈이 아니라 정해진 유한한 수 체계 안의 연산으로 계산합니다."
      ariaLabel="문턱 3에서 shares 두 개와 세 개가 x=0 값을 정하는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const have = scene.have as readonly number[];
        const curves = scene.curves as readonly (keyof typeof CURVE_STYLE)[];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={LEFT} y1={TOP - 6} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {INDICES.map((i) => (
                <text key={i} x={px(i)} y={BASE + 16} textAnchor="middle" fontSize={12} fill="#64748b">{i}</text>
              ))}
              <text x={LEFT} y={BASE + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f766e">0</text>
              <text x={W - 4} y={BASE + 30} textAnchor="end" fontSize={12} fill="#64748b">signer index x</text>
              {curves.map((key) => {
                const style = CURVE_STYLE[key];
                return <polyline key={key} points={path(style.curve)} fill="none" stroke={style.color} strokeWidth={1.25} strokeDasharray={style.dash} />;
              })}
              {active === 1 && (
                <>
                  {(["high", "f", "low"] as const).map((key) => {
                    const style = CURVE_STYLE[key];
                    const y0 = style.curve(0);
                    return (
                      <g key={key}>
                        <circle cx={px(0)} cy={py(y0)} r={4} fill="#ffffff" stroke={style.color} strokeWidth={1.25} />
                        <text x={px(0) - 8} y={py(y0) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={style.color}>{y0}</text>
                      </g>
                    );
                  })}
                </>
              )}
              {active !== 1 && (
                <g>
                  <circle cx={px(0)} cy={py(4)} r={5} fill={scene.zero === "?" ? "#ffffff" : "#0f766e"} stroke="#0f766e" strokeWidth={1.25} />
                  <text x={px(0) + 9} y={py(4) + 4} fontSize={12} fontWeight={700} fill="#0f766e">f(0) = {scene.zero}</text>
                </g>
              )}
              {INDICES.map((i) => {
                const on = have.includes(i);
                const y = F(i);
                return (
                  <g key={i}>
                    <circle cx={px(i)} cy={py(y)} r={on ? 5 : 3.5} fill={on ? "#2563eb" : "#ffffff"} stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={1.25} />
                    {on && (
                      <text x={px(i)} y={py(y) - 10} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e3a8a">{y.toFixed(1)}</text>
                    )}
                    {active === 4 && on && LAMBDA[i] && (
                      <text x={px(i)} y={py(y) - 26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">{LAMBDA[i]}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
