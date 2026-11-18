import SceneShell from "./SceneShell";

/**
 * 본문 대응: #split — T의 계수(낮은 차수부터) 59,38,62,86,53,69,75,15,76 (mod 97).
 * T = T₀ + X⁴T₁ + X⁸T₂. r=5: T₀*=T₀+5X⁴, T₁*=T₁−5+7X⁴ (s=7), T₂*=T₂−7.
 * X⁴ 칸: 5 + (53−5) = 53, X⁸ 칸: 7 + (76−7) = 76. ζ=5: (36,74,76) → (57,79,69), 둘 다 85.
 */
const T: readonly number[] = [59, 38, 62, 86, 53, 69, 75, 15, 76];
const R_BLIND = 5;
const S_BLIND = 7;

type Piece = { name: string; start: number; color: string };
const PIECES: readonly Piece[] = [
  { name: "T₀", start: 0, color: "#2563eb" },
  { name: "X⁴T₁", start: 4, color: "#059669" },
  { name: "X⁸T₂", start: 8, color: "#7c3aed" },
];

const SCENES = [
  { label: "몫 T의 계수", summary: "차수 0~8, 계수 9개", note: "칸 하나가 X의 한 차수 자리이고, 칸 안의 수는 그 자리의 계수입니다." },
  { label: "세 조각으로", summary: "T = T₀ + X⁴T₁ + X⁸T₂", note: "T₀는 0~3차, X⁴T₁은 4~7차, X⁸T₂는 8차 자리를 맡습니다. 자리를 옮겨 더하면 원래 T입니다." },
  { label: "r=5를 더하고 빼기", summary: "X⁴ 자리: 5 + 48 = 53", note: "T₀에 5X⁴를 더하고 T₁의 상수항에서 5를 뺍니다. 두 변화가 X⁴ 자리에서 만나 상쇄됩니다." },
  { label: "s=7을 더하고 빼기", summary: "X⁸ 자리: 7 + 69 = 76", note: "T₁에 7X⁴를 더하고 T₂에서 7을 빼면 X⁸ 자리에서 상쇄됩니다. 아래 합 줄은 그대로입니다." },
  { label: "ζ=5에서 확인", summary: "(36,74,76) → (57,79,69), 둘 다 85", note: "X=5에서 세 조각 값은 바뀌지만 5⁴=43으로 합치면 둘 다 85입니다. r=5, s=7은 계산용으로 고정한 값입니다." },
] as const;

function cellsFor(piece: number, active: number): readonly (number | null)[] {
  const r = active >= 2 ? R_BLIND : 0;
  const s = active >= 3 ? S_BLIND : 0;
  return Array.from({ length: 9 }, (_, d) => {
    if (piece === 0) return d < 4 ? T[d] : d === 4 && r ? r : null;
    if (piece === 1) return d === 4 ? (T[4] - r + 97) % 97 : d > 4 && d < 8 ? T[d] : d === 8 && s ? s : null;
    return d === 8 ? (T[8] - s + 97) % 97 : null;
  });
}

const W = 372;
const H = 226;
const LEFT = 52;
const CELL = 34;
const cx = (d: number) => LEFT + d * CELL;
const ROW_Y = [56, 98, 140, 182];

export default function QuotientSplitViz() {
  return (
    <SceneShell
      eyebrow="몫 분할과 무작위화"
      title="이웃 조각에 더하고 뺀 값은 같은 차수 자리에서 만납니다"
      description="맨 위 숫자는 X의 차수 0~8입니다. 각 줄은 자리를 옮긴 조각 하나이고, 맨 아래 줄은 같은 열을 더한 값입니다. 모든 수는 97로 나눈 나머지입니다."
      ariaLabel="몫 T를 세 조각으로 나누고 r, s를 더하고 빼도 각 차수 자리의 합이 유지되는 과정"
      scenes={SCENES}
      render={(active) => {
        const split = active >= 1;
        const blindCols = new Set<number>([...(active >= 2 ? [4] : []), ...(active >= 3 ? [8] : [])]);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT - 6} y={22} textAnchor="end" fontSize={11} fill="#64748b">차수</text>
            {T.map((_, d) => (
              <text key={d} x={cx(d) + CELL / 2} y={22} textAnchor="middle" fontSize={12} fill={blindCols.has(d) ? "#b45309" : "#64748b"} fontWeight={blindCols.has(d) ? 700 : 400}>{d}</text>
            ))}
            {[...blindCols].map((d) => (
              <rect key={d} x={cx(d) + 1} y={32} width={CELL - 2} height={170} rx={4} fill="#fef3c7" opacity={0.6} />
            ))}
            {split
              ? PIECES.map((p, i) => {
                  const cells = cellsFor(i, active);
                  return (
                    <g key={p.name}>
                      <text x={LEFT - 6} y={ROW_Y[i] + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={p.color}>{p.name}{active >= 2 && i < 2 ? "*" : active >= 3 && i === 2 ? "*" : ""}</text>
                      {cells.map((v, d) =>
                        v === null ? null : (
                          <g key={d}>
                            <rect x={cx(d) + 2} y={ROW_Y[i] - 14} width={CELL - 4} height={28} rx={4} fill="#ffffff" stroke={p.color} strokeWidth={1} />
                            <text x={cx(d) + CELL / 2} y={ROW_Y[i] + 4} textAnchor="middle" fontSize={11} fill="#0f172a">{v}</text>
                          </g>
                        ),
                      )}
                    </g>
                  );
                })
              : (
                  <g>
                    <text x={LEFT - 6} y={ROW_Y[0] + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">T</text>
                    {T.map((v, d) => (
                      <g key={d}>
                        <rect x={cx(d) + 2} y={ROW_Y[0] - 14} width={CELL - 4} height={28} rx={4} fill="#ffffff" stroke="#475569" strokeWidth={1} />
                        <text x={cx(d) + CELL / 2} y={ROW_Y[0] + 4} textAnchor="middle" fontSize={11} fill="#0f172a">{v}</text>
                      </g>
                    ))}
                  </g>
                )}
            <line x1={LEFT} x2={cx(9)} y1={ROW_Y[3] - 22} y2={ROW_Y[3] - 22} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT - 6} y={ROW_Y[3] + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">합</text>
            {T.map((v, d) => (
              <text key={d} x={cx(d) + CELL / 2} y={ROW_Y[3] + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={split ? "#0f172a" : "#cbd5e1"}>{v}</text>
            ))}
            {active === 4 && (
              <text x={W - 4} y={H - 4} textAnchor="end" fontSize={12} fill="#047857">X=5: 57 + 43·79 + 43²·69 ≡ 85</text>
            )}
          </svg>
        );
      }}
    />
  );
}
