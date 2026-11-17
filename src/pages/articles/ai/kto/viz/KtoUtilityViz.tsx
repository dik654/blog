import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — log-ratio r, batch KL 기준점 z0, z = r − z0,
 * v_D = λ_D·σ(βz), v_U = λ_U·σ(−βz), loss = λ_y − v_y.
 * 예시 숫자는 모두 가정: log π_θ = −2.0, log π_ref = −2.5 → r = +0.5, z0 = 0.3 → z = +0.2,
 * β = 1, λ_D = λ_U = 1. σ(0.2) = 0.55, σ(−0.2) = 0.45, σ(3) = 0.95, σ(−2) = 0.12.
 */
const Z0 = 0.3;
const R_MIN = -3;
const R_MAX = 4;
const X_LEFT = 44;
const X_RIGHT = 456;
const Y_ZERO = 176;
const Y_ONE = 36;

type Curve = "none" | "D" | "U";
type Dot = { r: number; tag: string };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  showZ0: boolean;
  curve: Curve;
  dots: readonly Dot[];
}[] = [
  {
    label: "log-ratio r",
    summary: "r = −2.0 − (−2.5) = +0.5",
    note: "log π(y|x)는 model이 prompt x에서 response y를 낼 확률의 log입니다. 현재 policy π_θ의 −2.0이 reference π_ref의 −2.5보다 크므로(가정), reference보다 이 response를 더 선호한다는 r = +0.5가 찍힙니다.",
    showZ0: false,
    curve: "none",
    dots: [{ r: 0.5, tag: "r = +0.5" }],
  },
  {
    label: "기준점 z₀",
    summary: "z = r − z₀ = 0.5 − 0.3 = +0.2",
    note: "z₀는 batch에서 추정한 policy와 reference 사이의 KL입니다(0.3으로 가정). Stop-gradient로 다루는 이 기준점에서 얼마나 위·아래인지를 z로 읽습니다.",
    showZ0: true,
    curve: "none",
    dots: [{ r: 0.5, tag: "z = +0.2" }],
  },
  {
    label: "좋아요(desirable)",
    summary: "v_D = σ(0.2) = 0.55 · loss 0.45",
    note: "σ는 값을 0~1로 누르는 S자 함수(sigmoid)이고 utility v는 여기에 class weight λ를 곱한 값입니다(β = 1, λ_D = 1 가정). 곡선이 오른쪽으로 갈수록 1에 다가가므로 loss λ_D − v_D를 줄이는 방향은 r을 기준점 위로 올리는 쪽입니다.",
    showZ0: true,
    curve: "D",
    dots: [{ r: 0.5, tag: "v 0.55 · loss 0.45" }],
  },
  {
    label: "싫어요(undesirable)",
    summary: "v_U = σ(−0.2) = 0.45 · loss 0.55",
    note: "부호를 뒤집은 σ(−βz)라 곡선도 좌우로 뒤집힙니다(λ_U = 1 가정). 같은 z = +0.2인데 loss는 0.55로 더 크고, 이를 줄이는 방향은 r을 기준점 아래로 내리는 쪽입니다.",
    showZ0: true,
    curve: "U",
    dots: [{ r: 0.5, tag: "v 0.45 · loss 0.55" }],
  },
  {
    label: "먼 두 좋아요",
    summary: "z +3.0 → loss 0.05 · z −2.0 → loss 0.88",
    note: "좋아요 두 개를 r = 3.3과 −1.7에 두었습니다(가정). 기준점보다 한참 위인 쪽은 v = 0.95라 부족분이 0.05뿐이고, 기준점 아래인 쪽은 v = 0.12라 0.88이 남습니다. λ_y − v_y는 class 최대치에서 모자란 만큼을 뜻합니다.",
    showZ0: true,
    curve: "D",
    dots: [
      { r: 3.3, tag: "loss 0.05" },
      { r: -1.7, tag: "loss 0.88" },
    ],
  },
];

const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));
const xOf = (r: number) => X_LEFT + ((r - R_MIN) / (R_MAX - R_MIN)) * (X_RIGHT - X_LEFT);
const yOf = (utility: number) => Y_ZERO - utility * (Y_ZERO - Y_ONE);
const utilityOf = (curve: Curve, r: number) => sigmoid((curve === "U" ? -1 : 1) * (r - Z0));

const SAMPLES = Array.from({ length: 71 }, (_, index) => R_MIN + index * 0.1);
const pathOf = (curve: Curve) =>
  SAMPLES.map((r, index) => `${index === 0 ? "M" : "L"}${xOf(r).toFixed(1)},${yOf(utilityOf(curve, r)).toFixed(1)}`).join(" ");
const PATH_D = pathOf("D");
const PATH_U = pathOf("U");
const TICKS = [-3, -2, -1, 0, 1, 2, 3, 4];

const COLOR_D = "#16a34a";
const COLOR_U = "#dc2626";
const COLOR_AXIS = "#64748b";
const COLOR_DOT = "#2563eb";

export default function KtoUtilityViz() {
  return (
    <SceneShell
      eyebrow="KTO · 기준점 양쪽의 utility"
      title="좋아요와 싫어요는 같은 기준점에서 반대 방향으로 당깁니다"
      description="가로축은 response의 policy/reference log-ratio r입니다. 세로축은 utility(0~λ)이고, 점선 z₀가 batch KL 기준점입니다. 숫자는 모두 설명용 가정입니다."
      ariaLabel="KTO에서 log-ratio, KL 기준점, desirable과 undesirable utility 곡선, loss를 차례로 보는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const color = scene.curve === "U" ? COLOR_U : COLOR_D;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 216" className="mx-auto block h-auto w-full max-w-[26rem]" role="img" aria-label={scene.summary}>
              <line x1={X_LEFT} y1={Y_ZERO} x2={X_RIGHT} y2={Y_ZERO} stroke={COLOR_AXIS} strokeWidth={1} />
              <line x1={X_LEFT} y1={Y_ONE} x2={X_RIGHT} y2={Y_ONE} stroke={COLOR_AXIS} strokeWidth={1} strokeDasharray="2 4" opacity={scene.curve === "none" ? 0.25 : 0.8} />
              <text x={X_LEFT - 6} y={Y_ONE + 4} textAnchor="end" fontSize={13} fill={COLOR_AXIS}>λ=1</text>
              <text x={X_LEFT - 6} y={Y_ZERO + 4} textAnchor="end" fontSize={13} fill={COLOR_AXIS}>0</text>
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={xOf(tick)} y1={Y_ZERO} x2={xOf(tick)} y2={Y_ZERO + 4} stroke={COLOR_AXIS} strokeWidth={1} />
                  <text x={xOf(tick)} y={Y_ZERO + 17} textAnchor="middle" fontSize={13} fill={COLOR_AXIS}>{tick > 0 ? `+${tick}` : tick}</text>
                </g>
              ))}
              <text x={X_RIGHT} y={Y_ZERO + 34} textAnchor="end" fontSize={13} fill={COLOR_AXIS}>r = log π_θ − log π_ref</text>

              {scene.showZ0 && (
                <g>
                  <line x1={xOf(Z0)} y1={Y_ONE - 18} x2={xOf(Z0)} y2={Y_ZERO} stroke={COLOR_AXIS} strokeWidth={1.25} strokeDasharray="5 4" />
                  <text x={xOf(Z0) + 5} y={Y_ONE - 8} fontSize={13} fontWeight={700} fill={COLOR_AXIS}>z₀ = 0.3</text>
                  <text x={xOf(Z0) - 6} y={Y_ONE - 8} textAnchor="end" fontSize={13} fill={COLOR_AXIS}>← 기준 아래</text>
                  <text x={xOf(Z0) + 70} y={Y_ONE - 8} fontSize={13} fill={COLOR_AXIS}>기준 위 →</text>
                </g>
              )}

              {scene.curve !== "none" && (
                <path d={scene.curve === "U" ? PATH_U : PATH_D} fill="none" stroke={color} strokeWidth={1.25} />
              )}

              {scene.dots.map((dot) => {
                const utility = scene.curve === "none" ? 0 : utilityOf(scene.curve, dot.r);
                const cx = xOf(dot.r);
                const cy = yOf(utility);
                const right = dot.r < 2;
                return (
                  <g key={dot.r}>
                    {scene.curve !== "none" && (
                      <line x1={cx} y1={cy} x2={cx} y2={Y_ONE} stroke={COLOR_DOT} strokeWidth={1.25} strokeDasharray="3 3" />
                    )}
                    <circle cx={cx} cy={cy} r={5} fill={COLOR_DOT} />
                    <text
                      x={right ? cx + 9 : cx - 9}
                      y={scene.curve === "none" ? cy - 10 : cy - Y_ONE < 28 ? cy + 18 : (cy + Y_ONE) / 2 + 4}
                      textAnchor={right ? "start" : "end"}
                      fontSize={13}
                      fontWeight={700}
                      fill={COLOR_DOT}
                    >
                      {dot.tag}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground sm:text-xs">
              <span className="flex items-center gap-2">
                <span className="inline-block h-0.5 w-5" style={{ backgroundColor: COLOR_D, opacity: scene.curve === "D" ? 1 : 0.3 }} />
                좋아요 λ_D·σ(βz)
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-0.5 w-5" style={{ backgroundColor: COLOR_U, opacity: scene.curve === "U" ? 1 : 0.3 }} />
                싫어요 λ_U·σ(−βz)
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-px w-5 border-t border-dashed" style={{ borderColor: COLOR_DOT }} />
                점선 = loss λ − v
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
