import EmbeddingSceneShell from "./EmbeddingSceneShell";

/**
 * 본문 대응: #pooling — state (1,1)·(3,1)·(9,9), mask 1·1·0.
 * 합 (4,2), valid 수 2, 평균 (2,1). PAD를 넣으면 (13,11)/3 ≈ (4.33, 3.67).
 * 정규화: (2,1)/√5 ≈ (0.89, 0.45); PAD 포함 쪽은 ≈ (0.76, 0.65).
 */
const STATES = [
  { name: "h₁", x: 1, y: 1, mask: 1 },
  { name: "h₂", x: 3, y: 1, mask: 1 },
  { name: "PAD", x: 9, y: 9, mask: 0 },
] as const;

const VALID = STATES.filter((s) => s.mask === 1);
const SUM = VALID.reduce<[number, number]>((acc, s) => [acc[0] + s.x, acc[1] + s.y], [0, 0]);
const N = VALID.length;
const MEAN: [number, number] = [SUM[0] / N, SUM[1] / N];
const ALL_SUM = STATES.reduce<[number, number]>((acc, s) => [acc[0] + s.x, acc[1] + s.y], [0, 0]);
const ALL_MEAN: [number, number] = [ALL_SUM[0] / STATES.length, ALL_SUM[1] / STATES.length];
const unit = (v: [number, number]): [number, number] => {
  const norm = Math.hypot(v[0], v[1]);
  return [v[0] / norm, v[1] / norm];
};
const Z = unit(MEAN);
const Z_ALL = unit(ALL_MEAN);
const f2 = (n: number) => n.toFixed(2);

const SCENES = [
  { label: "State 세 개와 mask", summary: "mask = 1, 1, 0", note: "점 하나가 token 하나의 2차원 state입니다. 오른쪽 위 (9,9)는 실제 단어가 아니라 batch 길이를 맞추려고 넣은 PAD 칸이라 mask가 0입니다." },
  { label: "Mask를 곱해 더하기", summary: `(1,1)+(3,1) = (${SUM[0]},${SUM[1]}) · n = ${N}`, note: "PAD state에는 0이 곱해져 합에서 사라집니다. 나눌 수 n도 mask의 합이므로 3이 아니라 2입니다." },
  { label: "Valid token 평균", summary: `(${SUM[0]},${SUM[1]}) ÷ ${N} = (${MEAN[0]},${MEAN[1]})`, note: "평균 (2,1)은 실제 token 두 점의 한가운데에 놓입니다. PAD는 위치에 아무 영향도 주지 않았습니다." },
  { label: "PAD를 빼지 않으면", summary: `(${ALL_SUM[0]},${ALL_SUM[1]}) ÷ 3 ≈ (${f2(ALL_MEAN[0])}, ${f2(ALL_MEAN[1])})`, note: "같은 문장인데 평균점이 PAD 쪽으로 끌려가 방향까지 바뀝니다. PAD 칸이 몇 개 붙는지는 batch에서 가장 긴 문장이 정하므로, padding을 넣으면 같은 문장이 batch에 따라 다른 vector가 됩니다." },
  { label: "길이를 1로 맞추기", summary: `(2,1) ÷ √5 ≈ (${f2(Z[0])}, ${f2(Z[1])})`, note: "(2,1)의 길이 √5 ≈ 2.24로 나누면 사분원 위의 점 z가 됩니다. 회색 점선은 PAD를 넣었을 때의 방향 ≈ (0.76, 0.65)이라 정규화해도 z와 다릅니다." },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREY = "#94a3b8";
const TEXT = "#64748b";
const DARK = "#475569";

// 왼쪽 평면: 0..10을 20px 간격으로, 원점 (24, 214)
const OX = 24;
const OY = 214;
const S = 20;
const px = (x: number) => OX + x * S;
const py = (y: number) => OY - y * S;
// 오른쪽 사분원: 반지름 1을 86px로, 원점 (262, 214)
const IX = 262;
const IY = 214;
const R = 86;

export default function MaskPoolingPlotViz() {
  return (
    <EmbeddingSceneShell
      eyebrow="Mask pooling 계산"
      title="PAD를 빼고 평균한 점과 넣고 평균한 점"
      description="왼쪽은 아래 수식의 해석에 나오는 2차원 state 세 개를 평면에 찍은 것입니다. 실제 hidden state는 훨씬 많은 차원을 갖지만 계산 순서는 같습니다. 마지막 장면의 오른쪽은 길이 1인 점이 놓이는 사분원입니다."
      ariaLabel="state 세 개에서 mask pooling과 정규화로 sentence vector를 만드는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const showSum = active === 1;
        const showMean = active >= 2;
        const showAll = active === 3;
        const showUnit = active === 4;
        return (
          <svg viewBox="0 0 360 234" className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={OX} x2={px(10)} y1={OY} y2={OY} stroke={GREY} strokeWidth={1} />
            <line x1={OX} x2={OX} y1={OY} y2={py(10)} stroke={GREY} strokeWidth={1} />
            {[5, 10].map((t) => (
              <g key={t}>
                <text x={px(t)} y={OY + 11} textAnchor="middle" fontSize={9} fill={TEXT}>{t}</text>
                <text x={OX - 4} y={py(t) + 3} textAnchor="end" fontSize={9} fill={TEXT}>{t}</text>
              </g>
            ))}
            {STATES.map((s) => {
              const pad = s.mask === 0;
              const faded = pad && active >= 1 && !showAll;
              return (
                <g key={s.name} opacity={faded ? 0.35 : 1}>
                  <circle cx={px(s.x)} cy={py(s.y)} r={5} fill={pad ? "none" : DARK} stroke={pad ? RED : DARK} strokeWidth={1.25} strokeDasharray={pad ? "2 2" : undefined} />
                  {s.name === "h₁" && <line x1={px(s.x)} x2={px(s.x)} y1={py(s.y) - 6} y2={py(s.y) - 28} stroke={DARK} strokeWidth={1} />}
                  <text x={px(s.x) + (pad ? -8 : s.name === "h₁" ? -4 : 8)} y={py(s.y) + (pad ? 3 : s.name === "h₁" ? -32 : 16)} textAnchor={pad ? "end" : "start"} fontSize={10} fill={pad ? RED : DARK}>
                    {s.name} ({s.x},{s.y}) · m={s.mask}
                  </text>
                  {faded && <line x1={px(s.x) - 7} x2={px(s.x) + 7} y1={py(s.y) - 7} y2={py(s.y) + 7} stroke={RED} strokeWidth={1.25} />}
                </g>
              );
            })}
            {showSum && (
              <g>
                <line x1={OX} y1={OY} x2={px(SUM[0])} y2={py(SUM[1])} stroke={TEXT} strokeWidth={1} strokeDasharray="3 3" />
                <rect x={px(SUM[0]) - 4} y={py(SUM[1]) - 4} width={8} height={8} fill={TEXT} />
                <text x={px(SUM[0]) + 8} y={py(SUM[1]) - 4} fontSize={10} fontWeight={700} fill={DARK}>합 (4,2)</text>
              </g>
            )}
            {showMean && (
              <g opacity={showAll ? 0.5 : 1}>
                <line x1={OX} y1={OY} x2={px(MEAN[0])} y2={py(MEAN[1])} stroke={BLUE} strokeWidth={1.25} />
                <circle cx={px(MEAN[0])} cy={py(MEAN[1])} r={5} fill={BLUE} />
                <text x={px(MEAN[0])} y={OY + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={BLUE}>평균 (2,1)</text>
              </g>
            )}
            {showAll && (
              <g>
                <line x1={OX} y1={OY} x2={px(ALL_MEAN[0])} y2={py(ALL_MEAN[1])} stroke={RED} strokeWidth={1.25} />
                <circle cx={px(ALL_MEAN[0])} cy={py(ALL_MEAN[1])} r={5} fill={RED} />
                <text x={px(ALL_MEAN[0]) + 8} y={py(ALL_MEAN[1]) - 6} fontSize={10} fontWeight={700} fill={RED}>PAD 포함 ({f2(ALL_MEAN[0])}, {f2(ALL_MEAN[1])})</text>
              </g>
            )}
            {showUnit && (
              <g>
                <line x1={IX} x2={IX + R + 8} y1={IY} y2={IY} stroke={GREY} strokeWidth={1} />
                <line x1={IX} x2={IX} y1={IY} y2={IY - R - 8} stroke={GREY} strokeWidth={1} />
                <path d={`M ${IX + R} ${IY} A ${R} ${R} 0 0 0 ${IX} ${IY - R}`} fill="none" stroke={GREY} strokeWidth={1} />
                <text x={IX + R} y={IY + 11} textAnchor="middle" fontSize={9} fill={TEXT}>1</text>
                <text x={IX - 4} y={IY - R + 3} textAnchor="end" fontSize={9} fill={TEXT}>1</text>
                <line x1={IX} y1={IY} x2={IX + Z_ALL[0] * R} y2={IY - Z_ALL[1] * R} stroke={GREY} strokeWidth={1} strokeDasharray="3 3" />
                <line x1={IX} y1={IY} x2={IX + Z[0] * R} y2={IY - Z[1] * R} stroke={BLUE} strokeWidth={1.25} />
                <circle cx={IX + Z[0] * R} cy={IY - Z[1] * R} r={4} fill={BLUE} />
                <text x={IX + Z[0] * R - 4} y={IY - Z[1] * R + 16} textAnchor="end" fontSize={10} fontWeight={700} fill={BLUE}>z</text>
                <text x={IX + 2} y={IY - R - 14} fontSize={9} fill={TEXT}>길이 1인 점</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
