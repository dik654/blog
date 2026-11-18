import SceneShell from "./SceneShell";

/**
 * 본문 대응: 00절 "왜 leaf weight는 −G를 H+λ로 나눌까요?"
 * leaf에 상수 w를 더할 때의 2차 근사 loss 변화 f(w) = G·w + ½(H+λ)·w².
 * G=−6, H=2 고정. λ=0(가정)·1(본문)·4(가정).
 * 바닥 위치 w* = −G/(H+λ) = 6/2=3, 6/3=2, 6/6=1. 바닥 깊이 −G²/(2(H+λ)) = −9, −6, −3.
 */
const G = -6;
const HESS = 2;
const LAMBDAS: readonly number[] = [0, 1, 4];
const CURVE_COLORS: readonly string[] = ["#94a3b8", "#2563eb", "#d97706"];

const W = 360;
const H = 220;
const PAD_L = 34;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 34;
const W_MIN = -0.5;
const W_MAX = 4;
const Y_MIN = -10;
const Y_MAX = 4;

const sx = (w: number) => PAD_L + ((w - W_MIN) / (W_MAX - W_MIN)) * (W - PAD_L - PAD_R);
const sy = (y: number) => PAD_T + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (H - PAD_T - PAD_B);
const loss = (w: number, lambda: number) => G * w + 0.5 * (HESS + lambda) * w * w;

const SAMPLES = Array.from({ length: 91 }, (_, i) => W_MIN + (i * (W_MAX - W_MIN)) / 90);
const PATHS = LAMBDAS.map((lambda) =>
  SAMPLES.map((w, i) => `${i === 0 ? "M" : "L"}${sx(w).toFixed(1)},${sy(loss(w, lambda)).toFixed(1)}`).join(" "),
);
const OPT = LAMBDAS.map((lambda) => {
  const w = -G / (HESS + lambda);
  return { w, y: loss(w, lambda) };
});

const SCENES = [
  {
    label: "λ=0 (가정)",
    summary: "w* = 6/2 = 3",
    note: "Penalty가 없으면 분모는 H=2뿐입니다. 그릇이 가장 완만해서 바닥이 w=3까지 밀려나고, 깊이는 −9입니다. H가 더 작으면 바닥은 더 멀리 갑니다.",
  },
  {
    label: "λ=1 (본문의 예)",
    summary: "w* = 6/(2+1) = 2",
    note: "분모가 H+λ=3이 되어 그릇이 가팔라지고 바닥이 w=2로 당겨집니다. 바닥 깊이 −6의 크기 6은 ½·G²/(H+λ)=½·36/3입니다. 01절 split gain 식에 들어가는 이 leaf의 항 G²/(H+λ)=12는 이 깊이 크기의 두 배입니다.",
  },
  {
    label: "λ=4 (가정)",
    summary: "w* = 6/(2+4) = 1",
    note: "같은 G와 H에서도 λ를 키우면 분모가 6이 되어 바닥이 w=1, 깊이 −3으로 줄어듭니다. 예측 질문 2의 답처럼 update의 절댓값이 작아집니다.",
  },
] as const;

export default function LeafWeightCurveViz() {
  return (
    <SceneShell
      eyebrow="Leaf 하나의 2차 근사"
      title="H+λ가 클수록 그릇이 가팔라지고 바닥이 0 쪽으로 당겨집니다"
      description="가로축은 이 leaf의 모든 row에 똑같이 더할 상수 w, 세로축은 그때의 근사 loss 변화 G·w + ½(H+λ)·w²입니다. 1차 항 G·w가 내려가는 방향을, 2차 항이 휘어짐과 L2 penalty를 담습니다. G=−6, H=2는 본문 값이고 λ=0과 λ=4는 비교용 가정입니다."
      ariaLabel="G가 음수 6이고 H가 2일 때 lambda 0, 1, 4에 따른 근사 loss 곡선과 최저점"
      scenes={SCENES}
      render={(active) => {
        const opt = OPT[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${(SCENES as readonly { label: string; summary: string }[])[active].label}: ${(SCENES as readonly { label: string; summary: string }[])[active].summary}`}>
            <defs>
              <clipPath id="xgb-leaf-plot">
                <rect x={PAD_L} y={PAD_T} width={W - PAD_L - PAD_R} height={H - PAD_T - PAD_B} />
              </clipPath>
            </defs>
            {[-9, -6, -3, 0].map((y) => (
              <g key={y}>
                <line x1={PAD_L} x2={W - PAD_R} y1={sy(y)} y2={sy(y)} stroke={y === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} />
                <text x={PAD_L - 5} y={sy(y) + 4} textAnchor="end" fontSize={10} fill="#64748b">{y}</text>
              </g>
            ))}
            {[0, 1, 2, 3, 4].map((w) => (
              <g key={w}>
                <line x1={sx(w)} x2={sx(w)} y1={H - PAD_B} y2={H - PAD_B + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(w)} y={H - PAD_B + 15} textAnchor="middle" fontSize={10} fill="#64748b">{w}</text>
              </g>
            ))}
            <line x1={sx(0)} x2={sx(0)} y1={PAD_T} y2={H - PAD_B} stroke="#94a3b8" strokeWidth={1} />
            <text x={W - PAD_R} y={H - 4} textAnchor="end" fontSize={10} fill="#64748b">w (leaf update)</text>
            <text x={sx(0) + 5} y={PAD_T + 10} fontSize={10} fill="#64748b">근사 loss 변화</text>
            <text x={PAD_L} y={H - 4} fontSize={10} fill="#64748b">점선 = 다른 장면의 λ</text>
            <g clipPath="url(#xgb-leaf-plot)">
              {PATHS.map((d, i) => (
                <path
                  key={LAMBDAS[i]}
                  d={d}
                  fill="none"
                  stroke={CURVE_COLORS[i]}
                  strokeWidth={i === active ? 1.25 : 1}
                  strokeDasharray={i === active ? undefined : "3 3"}
                  opacity={i === active ? 1 : 0.45}
                />
              ))}
            </g>
            {OPT.map((o, i) => (
              <text
                key={`lam-${LAMBDAS[i]}`}
                x={sx(o.w)}
                y={sy(o.y) - 8}
                textAnchor="middle"
                fontSize={10}
                fontWeight={i === active ? 700 : 400}
                fill={CURVE_COLORS[i]}
                opacity={i === active ? 1 : 0.8}
              >
                λ={LAMBDAS[i]}
              </text>
            ))}
            <line x1={sx(opt.w)} x2={sx(opt.w)} y1={sy(opt.y)} y2={H - PAD_B}stroke={CURVE_COLORS[active]} strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={sx(opt.w)} cy={sy(opt.y)} r={4} fill={CURVE_COLORS[active]} />
            <text x={sx(opt.w) + 7} y={sy(opt.y) + 4} fontSize={11} fontWeight={700} fill={CURVE_COLORS[active]}>
              w*={opt.w}, {opt.y}
            </text>
          </svg>
        );
      }}
    />
  );
}
