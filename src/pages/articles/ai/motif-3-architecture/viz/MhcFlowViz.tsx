import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mhc — X_{l+1} = H_res X_l + H_post^T F(H_pre X_l).
 * 설명용 가정: 줄마다 d차원 state를 숫자 하나로 대신, X = [1,2,3,4], H_pre = [0.4,0.3,0.2,0.1],
 * F 출력 0.5, H_post = [0.5,0.2,0.2,0.1], H_res는 행·열 합이 모두 1인 4×4 행렬.
 * u = 2.0, post = [0.25,0.10,0.10,0.05], res = [1.6,2.3,2.7,3.4](합 10 유지), 합 = [1.85,2.40,2.80,3.45].
 */
const X: readonly number[] = [1, 2, 3, 4];
const PRE: readonly number[] = [0.4, 0.3, 0.2, 0.1];
const F_OUT = 0.5;
const POST: readonly number[] = [0.5, 0.2, 0.2, 0.1];
const RES: readonly (readonly number[])[] = [
  [0.7, 0.1, 0.1, 0.1],
  [0.1, 0.6, 0.2, 0.1],
  [0.1, 0.2, 0.6, 0.1],
  [0.1, 0.1, 0.1, 0.7],
];
const U = PRE.reduce<number>((sum, weight, index) => sum + weight * X[index], 0);
const POST_PART = POST.map((weight) => weight * F_OUT);
const RES_PART = RES.map((row) => row.reduce<number>((sum, weight, index) => sum + weight * X[index], 0));
const NEXT = RES_PART.map((value, index) => value + POST_PART[index]);
const fmt = (value: number, digits = 2) => (Math.round(value * 100) / 100).toFixed(digits);

const SCENES = [
  { label: "H_pre: 네 줄을 하나로", summary: `u = ${fmt(U, 1)}`, note: "가운데 F는 attention이나 FFN 같은 sublayer입니다. 네 stream에 0.4·0.3·0.2·0.1을 곱해 더하면 F의 입력 하나가 됩니다. 0.4×1 + 0.3×2 + 0.2×3 + 0.1×4 = 2.0입니다." },
  { label: "H_post: 다시 네 줄로", summary: "0.5 → 0.25 · 0.10 · 0.10 · 0.05", note: "Attention이나 FFN인 F가 낸 update(여기서는 0.5로 가정)를 0.5·0.2·0.2·0.1 비율로 네 stream에 다시 씁니다." },
  { label: "H_res: 기존 줄끼리 섞음", summary: "행 합 1 · 열 합 1", note: "기존 네 stream은 4×4 행렬로 섞습니다. 모든 행과 열의 합이 1이라서 이 예에서는 섞기 전 합 1+2+3+4 = 10이 섞은 뒤 1.6+2.3+2.7+3.4 = 10으로 그대로입니다." },
  { label: "두 경로를 더함", summary: "다음 층의 네 stream", note: "섞은 기존 정보와 나눠 받은 update를 줄마다 더한 값이 다음 층의 네 stream이 됩니다. 일반 residual은 줄 하나에 update를 더하지만, 여기서는 네 줄이 각자 받습니다." },
] as const;

const W = 360;
const H = 236;
const ROW_Y: readonly number[] = [30, 74, 118, 162];
const BOX_H = 28;
const LX = 6;
const RX = 302;
const BOX_W = 52;
const F_BOX = { x: 150, y: 90, w: 64, h: 44 };

export default function MhcFlowViz() {
  return (
    <SceneShell
      eyebrow="네 residual stream"
      title="sublayer 하나가 네 줄에서 읽고 네 줄로 씁니다"
      description="왼쪽이 이번 층의 네 stream, 오른쪽이 다음 층의 네 stream입니다. 계산을 따라가기 쉽게 줄마다 벡터 대신 숫자 하나를 두었고, 모든 계수와 F의 출력은 설명용 가정입니다."
      ariaLabel="mHC의 pre 축약, post 배분, residual 행렬 혼합과 합"
      scenes={SCENES}
      render={(active) => {
        const rightValues = active === 1 ? POST_PART : active === 2 ? RES_PART : active === 3 ? NEXT : null;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LX + BOX_W / 2} y={16} textAnchor="middle" fontSize={11} fill="#64748b">이번 층</text>
            <text x={RX + BOX_W / 2} y={16} textAnchor="middle" fontSize={11} fill="#64748b">다음 층</text>
            {ROW_Y.map((y, index) => (
              <g key={y}>
                <rect x={LX} y={y} width={BOX_W} height={BOX_H} rx={4} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                <text x={LX + BOX_W / 2} y={y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{X[index]}</text>
                <rect x={RX} y={y} width={BOX_W} height={BOX_H} rx={4} fill="#ffffff" stroke={rightValues ? "#2563eb" : "#cbd5e1"} strokeWidth={1} strokeDasharray={rightValues ? undefined : "3 3"} />
                <text x={RX + BOX_W / 2} y={y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={rightValues ? "#2563eb" : "#94a3b8"}>
                  {rightValues ? fmt(rightValues[index], active === 2 ? 1 : 2) : "?"}
                </text>
              </g>
            ))}

            {active <= 1 && (
              <g>
                <rect x={F_BOX.x} y={F_BOX.y} width={F_BOX.w} height={F_BOX.h} rx={6} fill="#ffffff" stroke="#0f172a" strokeWidth={1} />
                <text x={F_BOX.x + F_BOX.w / 2} y={F_BOX.y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">F</text>
                <text x={F_BOX.x + F_BOX.w / 2} y={F_BOX.y + 34} textAnchor="middle" fontSize={11} fill="#475569">
                  {active === 0 ? `입력 ${fmt(U, 1)}` : `출력 ${F_OUT}`}
                </text>
                {ROW_Y.map((y, index) =>
                  active === 0 ? (
                    <g key={y}>
                      <line x1={LX + BOX_W} x2={F_BOX.x} y1={y + BOX_H / 2} y2={F_BOX.y + F_BOX.h / 2} stroke="#2563eb" strokeWidth={1} />
                      <text x={LX + BOX_W + 6} y={y + BOX_H / 2 - 3} fontSize={11} fontWeight={700} fill="#2563eb">×{PRE[index]}</text>
                    </g>
                  ) : (
                    <g key={y}>
                      <line x1={F_BOX.x + F_BOX.w} x2={RX} y1={F_BOX.y + F_BOX.h / 2} y2={y + BOX_H / 2} stroke="#d97706" strokeWidth={1} />
                      <text x={RX - 6} y={y + BOX_H / 2 - 3} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">×{POST[index]}</text>
                    </g>
                  ),
                )}
                <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11} fill="#64748b">
                  {active === 0 ? "H_pre는 0 이상의 계수 4개" : "F 출력 0.5는 설명용 가정"}
                </text>
              </g>
            )}

            {active === 2 && (
              <g>
                {RES.map((row, r) =>
                  row.map((weight, c) => (
                    <g key={`${r}-${c}`}>
                      <rect x={110 + c * 34} y={ROW_Y[r]} width={32} height={BOX_H} rx={3} fill={r === c ? "#dbeafe" : "#f8fafc"} stroke="#cbd5e1" strokeWidth={1} />
                      <text x={110 + c * 34 + 16} y={ROW_Y[r] + 18} textAnchor="middle" fontSize={11} fill="#0f172a">{weight}</text>
                    </g>
                  )),
                )}
                {ROW_Y.map((y) => (
                  <text key={y} x={254} y={y + 18} fontSize={11} fill="#16a34a">합 1</text>
                ))}
                {[0, 1, 2, 3].map((c) => (
                  <text key={c} x={110 + c * 34 + 16} y={ROW_Y[3] + BOX_H + 14} textAnchor="middle" fontSize={11} fill="#16a34a">합 1</text>
                ))}
                <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11} fill="#64748b">네 값의 합: 섞기 전 10 → 섞은 뒤 10</text>
              </g>
            )}

            {active === 3 &&
              ROW_Y.map((y, index) => (
                <text key={y} x={W / 2} y={y + 18} textAnchor="middle" fontSize={12} fill="#0f172a">
                  <tspan fill="#475569">{fmt(RES_PART[index], 1)}</tspan>
                  <tspan> + </tspan>
                  <tspan fill="#b45309">{fmt(POST_PART[index])}</tspan>
                  <tspan> = </tspan>
                  <tspan fontWeight={700} fill="#2563eb">{fmt(NEXT[index])}</tspan>
                </text>
              ))}
            {active === 3 && (
              <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11} fill="#64748b">H_res로 섞은 값 + H_post로 받은 update</text>
            )}
          </svg>
        );
      }}
    />
  );
}
