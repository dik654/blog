import SceneShell from "./SceneShell";

/**
 * 본문 대응: #attention-logit-matrix — query 2번째("사람을") 위치의 scaled score 1.0, 2.0, 3.0.
 * causal mask가 3번째(미래) key에 −∞를 더함 → [1, 2, −∞] → softmax ≈ [0.269, 0.731, 0].
 * 다른 row의 score는 본문에 없으므로 숫자를 적지 않는다.
 */
const N = 3;
const LOGITS: readonly number[] = [1, 2, 3];
const PROB: readonly number[] = [Math.E / (Math.E + Math.E ** 2), Math.E ** 2 / (Math.E + Math.E ** 2), 0];

const SCENES = [
  {
    label: "Logit 한 줄",
    summary: "row 2 = [1.0, 2.0, 3.0]",
    note: "칸 하나가 (query 위치, key 위치) 한 쌍입니다. 가로줄이 query 하나, 세로줄이 key 하나입니다. 두 번째 query(\"사람을\")가 세 key와 만든 scaled score, 곧 softmax 전의 logit이 1.0, 2.0, 3.0입니다. 다른 줄의 값은 본문에 없어 비워 둡니다.",
  },
  {
    label: "Mask가 미래 칸에 −∞",
    summary: "row 2 = [1.0, 2.0, −∞]",
    note: "Causal mask는 자기 위치보다 뒤에 있는 key를 가립니다. 대각선 위쪽 칸이 모두 그 자리입니다. 두 번째 줄에서는 세 번째 key 하나만 가려져 −∞가 더해집니다.",
  },
  {
    label: "Row마다 softmax",
    summary: "≈ [0.269, 0.731, 0]",
    note: "같은 줄 안에서만 softmax를 적용해 합이 1인 확률로 바꿉니다. e^−∞ = 0이라 세 번째 칸은 정확히 0이고, 앞의 두 칸이 1을 나눠 가집니다: e¹/(e¹+e²) ≈ 0.269, e²/(e¹+e²) ≈ 0.731.",
  },
  {
    label: "Value를 그 비율로 섞음",
    summary: "y₂ = 0.269·v₁ + 0.731·v₂ + 0·v₃",
    note: "이 확률로 value vector를 섞어 두 번째 위치의 출력을 만듭니다. 세 번째 value는 0을 곱받으므로 출력에 조금도 섞이지 않습니다. Mask가 softmax 앞 logit 단계에서 개입했기 때문입니다.",
  },
] as const;

const W = 360;
const H = 226;
const CELL = 46;
const GX = 74;
const GY = 34;
const KEY_COLOR = "#2563eb";
const MASK_COLOR = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

function fmt(value: number) {
  return value === 0 ? "0" : value.toFixed(3);
}

export default function CausalMaskRowViz() {
  return (
    <SceneShell
      eyebrow="Logit → mask → 확률표"
      title="두 번째 query가 미래 key를 읽지 못하게 되는 순서"
      description="3×3 칸이 같은 [n,n] tensor입니다. 가로줄 = query 위치, 세로줄 = key 위치. 본문 예의 두 번째 줄만 숫자로 따라갑니다."
      ariaLabel="Causal mask가 logit에 음의 무한대를 더하고 softmax가 확률 0을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const masked = active >= 1;
        const showProb = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: N }, (_, k) => (
              <text key={`k${k}`} x={GX + k * CELL + CELL / 2} y={GY - 10} textAnchor="middle" fontSize={11} fill={MUTED}>
                key {k + 1}
              </text>
            ))}
            {Array.from({ length: N }, (_, q) => (
              <text key={`q${q}`} x={GX - 8} y={GY + q * CELL + CELL / 2 + 4} textAnchor="end" fontSize={11} fill={q === 1 ? "#0f172a" : MUTED} fontWeight={q === 1 ? 700 : 400}>
                {q === 1 ? "q2 사람을" : `q${q + 1}`}
              </text>
            ))}
            {Array.from({ length: N * N }, (_, index) => {
              const q = Math.floor(index / N);
              const k = index % N;
              const future = k > q;
              const focus = q === 1;
              const hidden = masked && future;
              // softmax 뒤에는 가린 칸이 −∞가 아니라 확률 0이다(e^−∞ = 0). 다른 줄도 같은 규칙.
              const value = focus
                ? showProb
                  ? fmt(PROB[k])
                  : hidden
                    ? "−∞"
                    : LOGITS[k].toFixed(1)
                : hidden
                  ? showProb
                    ? "0"
                    : "−∞"
                  : "·";
              return (
                <g key={index}>
                  <rect
                    x={GX + k * CELL}
                    y={GY + q * CELL}
                    width={CELL}
                    height={CELL}
                    fill={hidden ? "#fee2e2" : focus ? "#dbeafe" : "#f8fafc"}
                    stroke={focus ? KEY_COLOR : LINE}
                    strokeWidth={focus ? 1.25 : 1}
                  />
                  <text
                    x={GX + k * CELL + CELL / 2}
                    y={GY + q * CELL + CELL / 2 + 4}
                    textAnchor="middle"
                    fontSize={focus ? 12 : 11}
                    fontWeight={focus ? 700 : 400}
                    fill={hidden ? MASK_COLOR : focus ? "#1e3a8a" : MUTED}
                  >
                    {value}
                  </text>
                </g>
              );
            })}
            {/* 오른쪽: 두 번째 줄의 확률 막대 또는 상태 설명 */}
            <g>
              <text x={228} y={GY - 10} fontSize={11} fill={MUTED}>
                {showProb ? "row 2 확률 (합 1)" : masked ? "row 2에 더하는 mask" : "row 2 logit"}
              </text>
              {LOGITS.map((logit, k) => {
                const y = GY + 8 + k * 30;
                const width = showProb ? PROB[k] * 80 : 0;
                const label = showProb ? fmt(PROB[k]) : masked ? (k === 2 ? "+(−∞)" : "+0") : logit.toFixed(1);
                return (
                  <g key={k}>
                    <text x={228} y={y + 12} fontSize={11} fill={MUTED}>
                      k{k + 1}
                    </text>
                    <rect x={248} y={y} width={80} height={16} fill="#f1f5f9" />
                    {showProb && <rect x={248} y={y} width={width} height={16} fill={KEY_COLOR} opacity={0.85} />}
                    <text x={showProb ? 248 + width + 4 : 254} y={y + 12} fontSize={11} fontWeight={700} fill={k === 2 && masked ? MASK_COLOR : "#1e3a8a"}>
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
            <text x={GX} y={GY + N * CELL + 22} fontSize={11} fill={active === 3 ? "#0f172a" : MUTED} fontWeight={active === 3 ? 700 : 400}>
              {active === 3 ? "y₂ = 0.269·v₁ + 0.731·v₂ + 0·v₃" : "빨간 칸 = causal mask가 가린 미래 key"}
            </text>
            <text x={GX} y={GY + N * CELL + 40} fontSize={10} fill={MUTED}>
              {active === 3 ? "v₃(미래 token의 value)는 출력에 섞이지 않습니다" : showProb ? "softmax 뒤 빨간 칸 = 확률 0" : masked ? "대각선 위쪽 = query보다 뒤에 있는 key" : "·  = 본문에 값이 없는 칸"}
            </text>
          </svg>
        );
      }}
    />
  );
}
