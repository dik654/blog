import SceneShell from "./SceneShell";

/**
 * 본문 대응: #output-layer — (가정) 은닉값 합×4−6 = 로짓 [−2,2,2,−2],
 * 시그모이드 → 약 [0.119,0.881,0.881,0.119], 0.5 기준 판정 → [0,1,1,0].
 * z=2의 손실: 정답 1이면 −log(0.881)≈0.127, 정답 0이면 −log(0.119)≈2.127.
 * 은닉값 A₁은 5절 의사코드의 [(0,1),(1,1),(1,1),(1,0)]입니다.
 */
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

const ROWS = [
  { input: "(0,0)", hidden: "(0,1)", sum: 1 },
  { input: "(1,0)", hidden: "(1,1)", sum: 2 },
  { input: "(0,1)", hidden: "(1,1)", sum: 2 },
  { input: "(1,1)", hidden: "(1,0)", sum: 1 },
].map((row) => {
  const logit = 4 * row.sum - 6;
  const p = sigmoid(logit);
  return { ...row, logit, p, label: p > 0.5 ? 1 : 0 };
});

const LOSS_IF_ONE = -Math.log(sigmoid(2));
const LOSS_IF_ZERO = -Math.log(1 - sigmoid(2));

const SCENES = [
  {
    label: "은닉값 합에서 로짓으로",
    summary: "4 × 합 − 6",
    note: "(가정) 5절에서 만든 은닉값 두 개를 더하고 4를 곱한 뒤 6을 뺍니다. 합이 1이면 −2, 합이 2이면 2입니다. 이 값은 아직 범위 제한이 없는 점수, 곧 로짓입니다.",
  },
  {
    label: "시그모이드로 0과 1 사이에",
    summary: "−2 → 0.119 · 2 → 0.881",
    note: "시그모이드는 어떤 로짓이든 0과 1 사이로 누르는 S자 함수입니다. 로짓 0이 0.5에 놓이고, 로짓이 클수록 1에, 작을수록 0에 다가갑니다.",
  },
  {
    label: "0.5를 기준으로 판정",
    summary: "[0, 1, 1, 0]",
    note: "0.5보다 큰 두 열만 1로 판정하면 XOR 답과 같습니다. 다만 이 수를 확률로 읽으려면 0/1 사건과 베르누이 손실이라는 계약까지 맞아야 합니다.",
  },
  {
    label: "같은 점수, 다른 정답의 손실",
    summary: "0.127 vs 2.127",
    note: "로짓이 2로 같아도 정답이 1이면 손실은 −log(0.881)≈0.127로 작습니다. 정답이 0이면 정답에 준 값이 0.119뿐이라 −log(0.119)≈2.127로 커집니다. 손실은 정답 쪽에 준 값이 작을수록 커지는 벌점입니다.",
  },
] as const;

/* 시그모이드 그래프 좌표: z ∈ [−6, 6], p ∈ [0, 1] */
const PX0 = 34;
const PX1 = 262;
const PY0 = 168;
const PY1 = 22;
const zx = (z: number) => PX0 + ((z + 6) / 12) * (PX1 - PX0);
const py = (p: number) => PY0 - p * (PY0 - PY1);
const CURVE = Array.from({ length: 61 }, (_, i) => -6 + i * 0.2)
  .map((z, i) => `${i === 0 ? "M" : "L"} ${zx(z).toFixed(1)} ${py(sigmoid(z)).toFixed(1)}`)
  .join(" ");

/* 손실 막대 좌표 */
const LB_BASE = 168;
const LB_TOP = 40;
const LOSS_MAX = 2.5;
const lh = (loss: number) => (loss / LOSS_MAX) * (LB_BASE - LB_TOP);

const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const INK = "#475569";
const AMBER = "#d97706";
const RED = "#dc2626";

export default function SigmoidReadoutViz() {
  return (
    <SceneShell
      eyebrow="출력층 읽기"
      title="로짓을 0과 1 사이로 누르고 0.5에서 판정합니다"
      description="열 하나가 XOR 상태 하나입니다. 아래 그래프의 가로축은 로짓, 세로축은 시그모이드 값입니다."
      note="4와 6은 본문이 정한 예시 숫자(가정)입니다. 학습된 신경망의 실제 값이 아닙니다."
      ariaLabel="XOR 네 상태의 로짓, 시그모이드 값, 판정과 손실"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {ROWS.map((row, index) => {
              const focus = active === 3 && index === 1;
              return (
                <div
                  key={row.input}
                  className={`min-w-0 rounded-lg border px-1.5 py-2 text-center text-[11px] leading-5 sm:text-xs ${
                    focus ? "border-blue-600" : "border-border/70"
                  } bg-background`}
                >
                  <span className="block font-semibold">입력 {row.input}</span>
                  <span className="block text-muted-foreground">은닉 {row.hidden}</span>
                  <span className="block text-muted-foreground">합 {row.sum}</span>
                  <span className="block font-mono font-bold">
                    z={row.logit > 0 ? row.logit : `−${Math.abs(row.logit)}`}
                  </span>
                  <span className={`block font-mono ${active >= 1 ? "text-blue-700 dark:text-blue-400" : "invisible"}`}>
                    p≈{row.p.toFixed(3)}
                  </span>
                  <span className={`block font-bold ${active >= 2 ? "" : "invisible"}`}>판정 {row.label}</span>
                </div>
              );
            })}
          </div>
          <svg
            viewBox="0 0 400 196"
            className="mx-auto mt-4 h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke={GRAY} strokeWidth={1} />
            <line x1={zx(0)} x2={zx(0)} y1={PY0} y2={PY1} stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />
            {[-6, -2, 0, 2, 6].map((z) => (
              <text key={z} x={zx(z)} y={PY0 + 14} textAnchor="middle" fontSize={13} fill={INK}>
                {z < 0 ? `−${Math.abs(z)}` : z}
              </text>
            ))}
            <text x={PX1} y={PY0 + 26} textAnchor="end" fontSize={13} fill={INK}>로짓 z</text>
            <text x={PX0 - 4} y={py(1) + 4} textAnchor="end" fontSize={13} fill={INK}>1</text>
            <text x={PX0 - 4} y={py(0) + 4} textAnchor="end" fontSize={13} fill={INK}>0</text>
            <path d={CURVE} fill="none" stroke={active >= 1 ? BLUE : GRAY} strokeWidth={1.25} />
            {active >= 2 && (
              <>
                <line x1={PX0} x2={PX1} y1={py(0.5)} y2={py(0.5)} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                <text x={PX0 + 4} y={py(0.5) - 5} fontSize={13} fill={AMBER}>0.5 기준</text>
              </>
            )}
            {[-2, 2].map((z) => {
              const p = sigmoid(z);
              const show = active >= 1;
              return (
                <g key={z}>
                  <line x1={zx(z)} x2={zx(z)} y1={PY0} y2={show ? py(p) : PY0} stroke={show ? BLUE : GRAY} strokeWidth={1} />
                  <circle cx={zx(z)} cy={show ? py(p) : PY0} r={4} fill={show ? BLUE : INK} />
                  {show && (
                    <text x={zx(z) + (z < 0 ? -6 : 6)} y={py(p) + (z < 0 ? -8 : 14)} textAnchor={z < 0 ? "end" : "start"} fontSize={13} fontWeight={700} fill={BLUE}>
                      {p.toFixed(3)}
                    </text>
                  )}
                </g>
              );
            })}
            {active === 3 ? (
              <g>
                <text x={331} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>z = 2의 손실</text>
                <line x1={290} x2={384} y1={LB_BASE} y2={LB_BASE} stroke={GRAY} strokeWidth={1} />
                <rect x={298} y={LB_BASE - lh(LOSS_IF_ONE)} width={30} height={lh(LOSS_IF_ONE)} fill={BLUE} />
                <rect x={346} y={LB_BASE - lh(LOSS_IF_ZERO)} width={30} height={lh(LOSS_IF_ZERO)} fill={RED} />
                <text x={313} y={LB_BASE - lh(LOSS_IF_ONE) - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>
                  {LOSS_IF_ONE.toFixed(3)}
                </text>
                <text x={361} y={LB_BASE - lh(LOSS_IF_ZERO) - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>
                  {LOSS_IF_ZERO.toFixed(3)}
                </text>
                <text x={313} y={LB_BASE + 14} textAnchor="middle" fontSize={13} fill={INK}>정답 1</text>
                <text x={361} y={LB_BASE + 14} textAnchor="middle" fontSize={13} fill={INK}>정답 0</text>
              </g>
            ) : (
              <text x={331} y={100} textAnchor="middle" fontSize={13} fill={GRAY}>
                {active === 0 ? "로짓은 범위 없음" : active === 1 ? "모든 로짓이 0~1로" : "두 값만 기준 위"}
              </text>
            )}
          </svg>
        </div>
      )}
    />
  );
}
