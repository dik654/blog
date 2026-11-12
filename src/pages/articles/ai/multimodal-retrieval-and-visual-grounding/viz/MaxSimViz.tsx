import SceneShell from "./SceneShell";

/**
 * 본문 대응: #document-retrieval ColPali 문단 — page patch마다 128차원 벡터, query token마다 가장 잘 맞는
 * patch의 점수(MaxSim)를 골라 더해 페이지 순위를 정함.
 * patch 12개, query token 3개, 모든 점수와 페이지 2의 최댓값은 덧셈을 보이려는 가정입니다.
 * 페이지 1 = 0.9 + 0.7 + 0.6 = 2.2, 페이지 2 = 0.5 + 0.6 + 0.4 = 1.5.
 */
const COLS = 4;
const ROWS = 3;
const TOKEN_COLORS: readonly string[] = ["#2563eb", "#d97706", "#059669"];
const GRID = "#94a3b8";
const MUTED = "#64748b";

const SCORES: readonly (readonly number[])[] = [
  [0.1, 0.2, 0.9, 0.3, 0.2, 0.1, 0.4, 0.2, 0.1, 0.3, 0.2, 0.1],
  [0.2, 0.1, 0.3, 0.2, 0.7, 0.4, 0.2, 0.1, 0.3, 0.2, 0.1, 0.2],
  [0.1, 0.2, 0.1, 0.2, 0.3, 0.2, 0.1, 0.6, 0.2, 0.5, 0.3, 0.1],
];
const MAX_INDEX = SCORES.map((row) => row.reduce<number>((best, value, index) => (value > row[best] ? index : best), 0));
const MAXES = SCORES.map((row, token) => row[MAX_INDEX[token]]);
const PAGE1 = MAXES.reduce<number>((sum, value) => sum + value, 0);
const PAGE2_MAXES = [0.5, 0.6, 0.4] as const;
const PAGE2 = PAGE2_MAXES.reduce<number>((sum, value) => sum + value, 0);

const fmt = (value: number) => value.toFixed(1);

const SCENES = [
  { label: "페이지를 patch로", summary: "patch 12개 → 각각 128차원 벡터", note: "Patch는 페이지 이미지를 잘게 나눈 칸입니다. ColPali는 페이지를 벡터 하나로 줄이지 않고 patch마다 128차원 벡터를 하나씩 만듭니다. 여기서는 셀 수 있게 12칸이라고 가정합니다." },
  { label: "q1의 최댓값", summary: `q1 → 가장 잘 맞는 patch ${fmt(MAXES[0])}`, note: "Query도 token마다 벡터가 있습니다. 칸의 숫자는 token q1의 벡터와 각 patch 벡터의 similarity입니다(가정 값). 12칸 중 가장 큰 하나만 고르고 나머지는 버립니다." },
  { label: "q2의 최댓값", summary: `q2 → 다른 patch ${fmt(MAXES[1])}`, note: "q2는 q1과 다른 patch에서 가장 크게 맞습니다. Token마다 따로 고르므로 어느 query token이 페이지의 어느 영역과 맞았는지가 그대로 남습니다." },
  { label: "q3의 최댓값", summary: `q3 → 또 다른 patch ${fmt(MAXES[2])}`, note: "마지막 token q3도 같은 방식으로 최댓값 하나를 고릅니다. 한 patch를 여러 token이 함께 골라도 되고, 이 가정에서는 우연히 세 token이 서로 다른 patch를 골랐습니다." },
  { label: "더해서 페이지 점수", summary: `${MAXES.map(fmt).join(" + ")} = ${fmt(PAGE1)}`, note: `세 최댓값을 더한 ${fmt(PAGE1)}가 페이지 1의 점수입니다. 다른 페이지도 같은 계산을 거쳐, 예를 들어 페이지 2가 ${PAGE2_MAXES.map(fmt).join(" + ")} = ${fmt(PAGE2)}이면 페이지 1이 더 높은 순위가 됩니다(두 페이지의 값 모두 가정).` },
] as const;

const W = 360;
const H = 220;
const CW = 50;
const CH = 46;
const GX = 14;
const GY = 34;

export default function MaxSimViz() {
  return (
    <SceneShell
      eyebrow="ColPali · MaxSim"
      title="Query token마다 가장 잘 맞는 patch 하나를 골라 그 점수를 더합니다"
      description="왼쪽은 문서 페이지 한 장을 12개 patch로 나눈 그림, 오른쪽은 query token q1·q2·q3이 고른 최댓값과 그 합입니다. Patch 수·token 수·점수는 모두 가정입니다."
      ariaLabel="ColPali MaxSim에서 query token마다 최댓값 patch를 고르고 합해 페이지 점수를 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const token = active >= 1 && active <= 3 ? active - 1 : -1;
        const done = active === 4;
        const revealed = done ? 3 : Math.max(0, token + 1);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GX} y={22} fontSize={12} fontWeight={700} fill="currentColor">
              페이지 1 · patch 12개
            </text>
            {Array.from({ length: ROWS * COLS }, (_, index) => {
              const r = Math.floor(index / COLS);
              const c = index % COLS;
              const x = GX + c * CW;
              const y = GY + r * CH;
              const isMax = token >= 0 && MAX_INDEX[token] === index;
              const pickedBy = done ? MAX_INDEX.indexOf(index) : -1;
              const color = isMax ? TOKEN_COLORS[token] : pickedBy >= 0 ? TOKEN_COLORS[pickedBy] : GRID;
              return (
                <g key={index}>
                  <rect x={x} y={y} width={CW} height={CH} fill={color} fillOpacity={isMax || pickedBy >= 0 ? 0.18 : 0} stroke={GRID} strokeWidth={1} />
                  {(isMax || pickedBy >= 0) && <rect x={x + 3} y={y + 3} width={CW - 6} height={CH - 6} rx={3} fill="none" stroke={color} strokeWidth={1.25} />}
                  {active === 0 && (
                    <text x={x + CW / 2} y={y + CH / 2 + 4} textAnchor="middle" fontSize={11} fill={MUTED}>
                      128차원
                    </text>
                  )}
                  {token >= 0 && (
                    <text x={x + CW / 2} y={y + CH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={isMax ? 700 : 400} fill={isMax ? TOKEN_COLORS[token] : MUTED}>
                      {fmt(SCORES[token][index])}
                    </text>
                  )}
                  {pickedBy >= 0 && (
                    <text x={x + CW / 2} y={y + CH / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={TOKEN_COLORS[pickedBy]}>
                      q{pickedBy + 1}
                    </text>
                  )}
                </g>
              );
            })}

            <text x={236} y={22} fontSize={12} fontWeight={700} fill="currentColor">
              token별 최댓값
            </text>
            {MAXES.map((value, index) => {
              const shown = index < revealed;
              const current = index === token;
              return (
                <g key={index}>
                  <rect x={236} y={34 + index * 34} width={110} height={26} rx={4} fill={shown ? TOKEN_COLORS[index] : "none"} fillOpacity={shown ? 0.14 : 0} stroke={current ? TOKEN_COLORS[index] : GRID} strokeWidth={current ? 1.25 : 1} strokeDasharray={shown ? undefined : "3 3"} />
                  <text x={246} y={52 + index * 34} fontSize={12.5} fontWeight={700} fill={TOKEN_COLORS[index]}>
                    q{index + 1}
                  </text>
                  <text x={336} y={52 + index * 34} textAnchor="end" fontSize={12.5} fontWeight={700} fill={shown ? TOKEN_COLORS[index] : GRID}>
                    {shown ? `max ${fmt(value)}` : "?"}
                  </text>
                </g>
              );
            })}
            <line x1={236} x2={346} y1={140} y2={140} stroke={GRID} strokeWidth={1} />
            <text x={246} y={160} fontSize={12.5} fontWeight={700} fill="currentColor">
              합
            </text>
            <text x={336} y={160} textAnchor="end" fontSize={13} fontWeight={700} fill={done ? "#2563eb" : GRID}>
              {done ? fmt(PAGE1) : "?"}
            </text>
            {done && (
              <text x={236} y={186} fontSize={11.5} fill={MUTED}>
                페이지 2(가정): {fmt(PAGE2)}
              </text>
            )}
            {done && (
              <text x={236} y={204} fontSize={11.5} fontWeight={700} fill="#2563eb">
                → 페이지 1이 위
              </text>
            )}
            <text x={GX} y={H - 8} fontSize={11.5} fill={MUTED}>
              {token >= 0 ? `칸 숫자 = q${token + 1}와 각 patch의 similarity (가정)` : done ? "칸 표시 = 그 patch를 고른 token" : "patch 12개는 셀 수 있게 고른 가정"}
            </text>
          </svg>
        );
      }}
    />
  );
}
