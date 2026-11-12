import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits (8절·11절 숫자) — 같은 기울기 −2.5에서 이동 크기만 바꾼다.
 * 자료 (1,2), (2,4)의 평균 ½제곱오차 = ½[½(θ−2)² + ½(2θ−4)²] = 1.25(θ−2)².
 * θ=1 → 1.25, θ=1.25 → 0.703125, θ=3.5 → 2.8125. 기울기 2.5(θ−2)는 θ=1에서 −2.5.
 */
const loss = (theta: number) => 1.25 * (theta - 2) ** 2;
const START = 1;
const GRAD = 2.5 * (START - 2);

const W = 360;
const H = 220;
const X0 = 30;
const X1 = 344;
const Y0 = 176;
const Y1 = 22;
const T_MIN = 0.4;
const T_MAX = 3.75;
const L_MAX = 4;
const sx = (theta: number) => X0 + ((theta - T_MIN) / (T_MAX - T_MIN)) * (X1 - X0);
const sy = (value: number) => Y0 - (value / L_MAX) * (Y0 - Y1);

const CURVE = Array.from({ length: 66 }, (_, i) => T_MIN + (i / 65) * (T_MAX - T_MIN))
  .map((theta, i) => `${i === 0 ? "M" : "L"}${sx(theta).toFixed(1)},${sy(loss(theta)).toFixed(1)}`)
  .join(" ");

const STEPS = [null, 0.1, 1] as const;

const SCENES = [
  {
    label: "θ=1에서 출발",
    summary: "평균 손실 1.25 · 기울기 −2.5",
    note: "가로축은 곱하는 수 θ, 세로축은 두 문제의 평균 ½제곱오차입니다. 두 자료로 계산하면 손실은 1.25×(θ−2)²이고 바닥은 θ=2입니다. 기울기(손실이 θ에 따라 변하는 비율) −2.5는 이 자리에서 θ를 키우면 손실이 준다는 뜻입니다.",
  },
  {
    label: "이동 크기 0.1",
    summary: "θ′ = 1 − 0.1×(−2.5) = 1.25 · 손실 0.703125",
    note: "기울기의 반대 방향으로 0.25만 움직였습니다. 아직 바닥 θ=2에 닿지 않았지만 손실은 1.25에서 0.703125로 내려갔습니다.",
  },
  {
    label: "이동 크기 1",
    summary: "θ′ = 1 − 1×(−2.5) = 3.5 · 손실 2.8125",
    note: "방향은 같고 거리만 열 배입니다. θ가 바닥 2를 지나쳐 3.5에 떨어지고, 손실 2.8125는 출발점 1.25보다 큽니다. 기울기의 반대 방향이라는 조건만으로 큰 이동 뒤의 손실 감소가 보장되지는 않습니다.",
  },
] as const;

const INK = "#475569";
const MUTED = "#94a3b8";
const CURVE_C = "#64748b";
const START_C = "#2563eb";
const GOOD = "#059669";
const BAD = "#dc2626";

export default function LossCurveStepViz() {
  return (
    <SceneShell
      eyebrow="이동 크기"
      title="같은 기울기라도 너무 멀리 가면 손실이 커집니다"
      description="곡선은 8절의 두 자료 (1, 2), (2, 4)로 계산한 평균 손실이고, 점은 θ=1에서 한 번 갱신한 위치입니다. 이동 크기 0.1과 1은 글의 예입니다(가정)."
      ariaLabel="평균 손실 곡선 위에서 이동 크기 0.1과 1로 θ를 한 번 갱신한 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const eta = (STEPS as readonly (number | null)[])[active];
        const next = eta === null ? null : START - eta * GRAD;
        const nextLoss = next === null ? null : loss(next);
        const worse = nextLoss !== null && nextLoss > loss(START);
        const color = worse ? BAD : GOOD;
        const ax = sx(START);
        const ay = sy(loss(START));
        const bx = next === null ? ax : sx(next);
        const by = nextLoss === null ? ay : sy(nextLoss);
        const lift = Math.min(ay, by) - (worse ? 46 : 22);
        const markerId = `loss-step-arrow-${active}`;
        return (
          <div className="min-w-0">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto h-auto w-full max-w-[440px]"
              role="img"
              aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
            >
              <defs>
                <marker id={markerId} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill={color} />
                </marker>
              </defs>
              <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke={MUTED} strokeWidth={1} />
              <line x1={X0} x2={X0} y1={Y0} y2={Y1 - 6} stroke={MUTED} strokeWidth={1} />
              <text x={X0 + 6} y={Y1 - 8} fontSize={14} fill={INK}>평균 손실</text>
              <text x={X1} y={Y0 + 36} textAnchor="end" fontSize={14} fill={INK}>θ (곱하는 수)</text>
              {[1, 2, 3].map((v) => (
                <text key={v} x={X0 - 7} y={sy(v) + 4} textAnchor="end" fontSize={14} fill={MUTED}>{v}</text>
              ))}
              {[1, 2, 3].map((t) => (
                <g key={t}>
                  <line x1={sx(t)} x2={sx(t)} y1={Y0} y2={Y0 + 4} stroke={MUTED} strokeWidth={1} />
                  <text x={sx(t)} y={Y0 + 19} textAnchor="middle" fontSize={14} fill={INK}>{t}</text>
                </g>
              ))}
              <path d={CURVE} fill="none" stroke={CURVE_C} strokeWidth={1.25} />
              <circle cx={sx(2)} cy={sy(0)} r={3} fill={CURVE_C} />
              <text x={sx(2) + 8} y={sy(0) - 6} fontSize={14} fill={CURVE_C}>바닥</text>

              {active === 0 && (
                <line
                  x1={sx(0.6)}
                  y1={sy(loss(START) + GRAD * (0.6 - START))}
                  x2={sx(1.5)}
                  y2={sy(loss(START) + GRAD * (1.5 - START))}
                  stroke={START_C}
                  strokeWidth={1.25}
                  strokeDasharray="4 3"
                />
              )}

              {next !== null && (
                <>
                  <path
                    d={`M${ax.toFixed(1)},${(ay - 6).toFixed(1)} Q${((ax + bx) / 2).toFixed(1)},${lift.toFixed(1)} ${bx.toFixed(1)},${(by - 6).toFixed(1)}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.25}
                    markerEnd={`url(#${markerId})`}
                  />
                  <line x1={bx} x2={bx} y1={by} y2={Y0} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={bx} cy={by} r={5} fill={color} />
                </>
              )}

              <line x1={ax} x2={ax} y1={ay} y2={Y0} stroke={START_C} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={ax} cy={ay} r={5} fill={START_C} />
            </svg>
            <div className="mt-2 grid gap-1 text-sm">
              <p className="flex items-center gap-2">
                <span aria-hidden className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: START_C }} />
                <span>출발 θ=1 · 손실 1.25{active === 0 ? " · 점선 = 기울기 −2.5" : ""}</span>
              </p>
              <p className={`flex items-center gap-2 ${next === null ? "text-muted-foreground" : ""}`}>
                <span aria-hidden className="inline-block h-3 w-3 shrink-0 rounded-full border" style={next === null ? { borderColor: MUTED } : { backgroundColor: color, borderColor: color }} />
                <span>{next === null ? "갱신 후 위치는 다음 장면" : `갱신 후 θ′=${next} · 손실 ${nextLoss}${worse ? " (출발보다 큼)" : " (출발보다 작음)"}`}</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
