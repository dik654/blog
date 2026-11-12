import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: measuring-risk 절 — 분산과 표준편차를 만드는 순서.
 * 용어 설명의 예시 그대로: 수익률 10%, 0%, −10% → 평균 0, 벗어난 정도 +10, 0, −10(%p)
 * 제곱 100, 0, 100 → 평균 200÷3 ≈ 66.7(%p²) = 0.0067 → 제곱근 ≈ 8.2%p.
 */
const DEVS = [10, 0, -10];
const SQUARES = DEVS.map((d) => d * d);
const VARIANCE = SQUARES.reduce<number>((a, b) => a + b, 0) / DEVS.length;
const SD = Math.sqrt(VARIANCE);
const BIG = 20;

const K = 3;
const MEAN_Y = 92;
const XS = [76, 150, 222];
const AVG_X = 292;

const SCENES = [
  {
    label: "평균에서 벗어난 정도",
    summary: "+10 · 0 · −10 (%p)",
    note: "세 해의 수익률이 10%, 0%, −10%라면 평균은 0%입니다. 각 해가 평균에서 벗어난 정도는 +10, 0, −10%포인트입니다.",
  },
  {
    label: "그대로 더하면 지워집니다",
    summary: "+10 + 0 − 10 = 0",
    note: "벗어난 정도를 그대로 더하면 위로 벗어난 10과 아래로 벗어난 10이 서로 지워져 0이 됩니다. 이렇게는 흩어진 정도를 잴 수 없습니다.",
  },
  {
    label: "제곱하면 정사각형이 됩니다",
    summary: "100 · 0 · 100 (%p²)",
    note: `제곱하면 부호가 사라져 둘 다 100이 됩니다. 크게 벗어날수록 무게가 더 커져, ${BIG}%포인트 벗어났다면(가정) 10의 두 배인데 제곱은 네 배인 ${BIG * BIG}입니다. 위와 아래의 정사각형이 같은 크기라는 점이 이 척도의 한계이기도 합니다.`,
  },
  {
    label: "넓이를 평균 내면 분산",
    summary: `200 ÷ 3 ≈ ${VARIANCE.toFixed(1)} (%p²)`,
    note: `정사각형 넓이를 평균 내면 (100 + 0 + 100) ÷ 3 ≈ ${VARIANCE.toFixed(1)}(%포인트의 제곱)이고, 소수로 쓰면 ${(VARIANCE / 10000).toFixed(4)}입니다. 이것이 분산이며 단위가 제곱이라 직접 읽기 어렵습니다.`,
  },
  {
    label: "한 변의 길이가 표준편차",
    summary: `√${VARIANCE.toFixed(1)} ≈ ${SD.toFixed(1)}%p`,
    note: `평균 낸 정사각형의 한 변이 표준편차입니다. √${VARIANCE.toFixed(1)} ≈ ${SD.toFixed(1)}이므로 표준편차는 약 ${SD.toFixed(1)}%포인트로, 수익률과 같은 단위로 돌아옵니다.`,
  },
];

const ACCENT = "#6366f1";
const WARN = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#64748b";

export default function VarianceStepsViz() {
  return (
    <StackedSceneShell
      eyebrow="분산을 만드는 순서"
      title="분산은 벗어난 정도로 만든 정사각형의 평균 넓이입니다"
      description="아래 용어 설명의 예시인 세 해 수익률 10%, 0%, −10%를 씁니다. 가로선이 평균(0%)이고, 세로 길이가 평균에서 벗어난 정도입니다."
      ariaLabel="벗어난 정도를 제곱해 평균 내고 제곱근으로 되돌리는 순서"
      scenes={SCENES}
      render={(s) => {
        const showSquares = s >= 2;
        const showAvg = s >= 3;
        const avgSide = SD * K;
        return (
          <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[s].label}: ${SCENES[s].summary}`}>
            <line x1={20} y1={MEAN_Y} x2={262} y2={MEAN_Y} stroke={MUTED} strokeWidth={1} />
            <text x={20} y={MEAN_Y - 4} fontSize={10} fill={MUTED}>평균 0%</text>
            {DEVS.map((d, i) => {
              const x = XS[i];
              const y = MEAN_Y - d * K;
              const side = Math.abs(d) * K;
              return (
                <g key={i} opacity={showAvg ? 0.35 : 1}>
                  {showSquares && side > 0 && (
                    <rect
                      x={x}
                      y={d > 0 ? MEAN_Y - side : MEAN_Y}
                      width={side}
                      height={side}
                      fill={ACCENT}
                      fillOpacity={0.18}
                      stroke={ACCENT}
                      strokeWidth={1}
                    />
                  )}
                  {d !== 0 && <line x1={x} y1={MEAN_Y} x2={x} y2={y} stroke={d > 0 ? ACCENT : WARN} strokeWidth={1.25} />}
                  <circle cx={x} cy={y} r={3} fill={d > 0 ? ACCENT : d < 0 ? WARN : INK} />
                  <text x={x + (showSquares && side > 0 ? side / 2 : 0)} y={d >= 0 ? y - 8 : y + 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={INK}>
                    {showSquares ? `${SQUARES[i]}` : `${d > 0 ? "+" : d < 0 ? "−" : ""}${Math.abs(d)}`}
                  </text>
                  <text x={x} y={166} textAnchor="middle" fontSize={10} fill={MUTED}>
                    {i + 1}년째 {d > 0 ? "" : d < 0 ? "−" : ""}{Math.abs(d)}%
                  </text>
                </g>
              );
            })}

            {s === 1 && (
              <text x={20} y={150} fontSize={10.5} fontWeight={700} fill={WARN}>합: +10 + 0 − 10 = 0</text>
            )}

            {s === 2 && (
              <g>
                <rect x={AVG_X} y={MEAN_Y - BIG * K} width={BIG * K} height={BIG * K} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="4 3" />
                <text x={AVG_X + (BIG * K) / 2} y={MEAN_Y - (BIG * K) / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={INK}>{BIG * BIG}</text>
                <text x={AVG_X + (BIG * K) / 2} y={MEAN_Y + 16} textAnchor="middle" fontSize={10} fill={INK}>{BIG}%p라면(가정)</text>
              </g>
            )}

            {showAvg && (
              <g>
                <rect x={AVG_X} y={MEAN_Y - avgSide} width={avgSide} height={avgSide} fill={ACCENT} fillOpacity={0.3} stroke={ACCENT} strokeWidth={1.25} />
                <text x={AVG_X + avgSide / 2} y={MEAN_Y - avgSide - 8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>
                  {s === 3 ? `평균 ${VARIANCE.toFixed(1)}` : `한 변 ${SD.toFixed(1)}`}
                </text>
                {s === 4 && (
                  <line x1={AVG_X} y1={MEAN_Y + 6} x2={AVG_X + avgSide} y2={MEAN_Y + 6} stroke={ACCENT} strokeWidth={1.25} />
                )}
                <text x={AVG_X + avgSide / 2} y={MEAN_Y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                  {s === 3 ? "분산" : "표준편차"}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
