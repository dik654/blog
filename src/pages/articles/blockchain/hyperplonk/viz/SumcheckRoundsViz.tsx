import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sumcheck — g(b₁,b₂)=b₁b₂의 네 corner 합 1을 두 round로 줄인다.
 * p₁(t)=g(t,0)+g(t,1)=t, p₁(0)+p₁(1)=1, r₁=2 → 새 claim p₁(2)=2
 * p₂(t)=g(2,t)=2t, p₂(0)+p₂(1)=2, r₂=3 → p₂(3)=6 = g(2,3).
 * 왼쪽 칸 = g의 값(열이 b₁, 행이 b₂), 오른쪽 = round polynomial 그래프.
 */
const SCENES = [
  {
    label: "처음 claim",
    summary: "0+0+0+1 = 1",
    claim: "1",
    note: "g(b₁,b₂)=b₁b₂는 corner 11에서만 1입니다. Prover의 첫 주장은 네 칸의 합이 1이라는 것입니다. 네 값을 그대로 보내는 대신 아래 두 round로 이 주장을 줄입니다.",
  },
  {
    label: "Round 1: 둘째 bit를 합침",
    summary: "p₁(0)+p₁(1) = 0+1 = 1 ✓",
    claim: "1",
    note: "각 열에서 b₂=0과 b₂=1을 더하면 b₁=0 열은 0, b₁=1 열은 1입니다. 이 두 값을 지나는 한 변수 식이 p₁(t)=t입니다. 두 끝값의 합 1이 직전 claim 1과 같으므로 통과합니다.",
  },
  {
    label: "r₁ = 2에서 새 claim",
    summary: "p₁(2) = 2",
    claim: "2",
    note: "p₁이 transcript에 들어간 뒤 r₁=2가 나옵니다. 선 위의 t=2 값 2가 다음 claim입니다. 이제 첫 변수는 2로 고정되고, 남은 변수는 b₂ 하나입니다.",
  },
  {
    label: "Round 2: 첫 변수를 2로 고정",
    summary: "p₂(0)+p₂(1) = 0+2 = 2 ✓",
    claim: "2",
    note: "점선 열 b₁=2에서 g(2,0)=0, g(2,1)=2입니다. 이를 지나는 식이 p₂(t)=g(2,t)=2t이고, 두 끝값의 합 2가 직전 claim 2와 같습니다.",
  },
  {
    label: "r₂ = 3: 한 점만 남음",
    summary: "p₂(3) = 6 = g(2,3)",
    claim: "6",
    note: "r₂=3을 넣은 p₂(3)=6이 마지막 claim입니다. 이것을 g(2,3)=2·3=6과 대조하면 끝납니다. 2²개 값 대신 두 round와 한 점을 확인했고, 2^μ행이라면 round는 μ개입니다.",
  },
] as const;

const COLS = [
  { b1: "0", x: 34 },
  { b1: "1", x: 82 },
  { b1: "2", x: 138 },
] as const;
const ROW_Y = [118, 72] as const; // b₂=0, b₂=1
const CELL = 38;

const PX = (t: number) => 196 + t * 44;
const PY = (v: number) => 190 - v * 24;

function cellValue(b1: string, row: number) {
  return Number(b1) * row;
}

export default function SumcheckRoundsViz() {
  return (
    <SceneShell
      eyebrow="Sumcheck 두 round"
      title="네 칸의 합 주장이 선 두 개를 거쳐 한 점으로 줄어듭니다"
      description="네모 칸은 g(b₁,b₂)=b₁b₂의 값(열이 b₁, 행이 b₂)이고, 선 그래프는 prover가 보내는 한 변수 식입니다. 본문 05절의 r₁=2, r₂=3을 그대로 씁니다."
      ariaLabel="g(b1,b2)=b1 b2의 합 1을 sumcheck 두 round로 g(2,3)=6 한 점까지 줄이는 장면"
      scenes={SCENES}
      render={(active) => {
        const showR1Col = active >= 3;
        const colSums = active === 1 || active === 2;
        return (
          <div className="grid min-w-0 grid-cols-1 items-center gap-2 sm:grid-cols-2 sm:gap-4">
            <svg
              viewBox="0 6 172 210"
              className="mx-auto block h-auto w-full max-w-[250px]"
              role="img"
              aria-label={`g의 네 칸 · ${SCENES[active].label}: ${SCENES[active].summary}`}
            >
              <text x={10} y={20} fontSize={11} fontWeight={700} fill="#64748b">g(b₁,b₂)</text>
              {COLS.map((col) => {
                const dashed = col.b1 === "2";
                if (dashed && !showR1Col) return null;
                const colActive = (active === 1 && !dashed) || (active >= 3 && dashed) || active === 0;
                return (
                  <g key={col.b1}>
                    <text x={col.x} y={44} textAnchor="middle" fontSize={10} fill={dashed ? "#d97706" : "#64748b"}>
                      b₁={col.b1}
                    </text>
                    {ROW_Y.map((y, row) => {
                      const v = cellValue(col.b1, row);
                      return (
                        <g key={row}>
                          <rect
                            x={col.x - CELL / 2}
                            y={y - CELL / 2 - 4}
                            width={CELL}
                            height={CELL}
                            rx={6}
                            fill={colActive ? (dashed ? "#d97706" : "#2563eb") : "#94a3b8"}
                            fillOpacity={colActive ? 0.12 : 0.06}
                            stroke={dashed ? "#d97706" : "#2563eb"}
                            strokeWidth={1}
                            strokeDasharray={dashed ? "3 3" : undefined}
                          />
                          <text x={col.x} y={y + 1} textAnchor="middle" fontSize={13} fontWeight={700} fill={dashed ? "#b45309" : "#1d4ed8"}>
                            {v}
                          </text>
                        </g>
                      );
                    })}
                    {colSums && !dashed && (
                      <text x={col.x} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
                        합 {cellValue(col.b1, 0) + cellValue(col.b1, 1)}
                      </text>
                    )}
                  </g>
                );
              })}
              {active === 4 && (
                <text x={COLS[2].x} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f766e">
                  g(2,3)=6
                </text>
              )}
              <text x={10} y={186} fontSize={9} fill="#64748b">위 행 b₂=1 · 아래 행 b₂=0</text>
              <text x={10} y={206} fontSize={12} fontWeight={700} fill="#0f766e">
                현재 claim = {SCENES[active].claim}
              </text>
            </svg>
            <svg
              viewBox="176 26 176 188"
              className="mx-auto block h-auto w-full max-w-[250px]"
              role="img"
              aria-label={`round polynomial 그래프 · ${SCENES[active].summary}`}
            >
              <line x1={PX(0)} x2={PX(3) + 8} y1={PY(0)} y2={PY(0)} stroke="#94a3b8" strokeWidth={1} />
              <line x1={PX(0)} x2={PX(0)} y1={PY(0)} y2={PY(6) - 8} stroke="#94a3b8" strokeWidth={1} />
              {[0, 1, 2, 3].map((t) => (
                <text key={`t-${t}`} x={PX(t)} y={PY(0) + 14} textAnchor="middle" fontSize={10} fill="#64748b">
                  {t}
                </text>
              ))}
              <text x={PX(3) + 12} y={PY(0) + 4} fontSize={10} fill="#64748b">t</text>
              {[2, 6].map((v) => (
                <g key={`v-${v}`}>
                  <line x1={PX(0) - 3} x2={PX(0)} y1={PY(v)} y2={PY(v)} stroke="#94a3b8" strokeWidth={1} />
                  <text x={PX(0) - 6} y={PY(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
                </g>
              ))}
              {active >= 1 && (
                <g>
                  <line x1={PX(0)} y1={PY(0)} x2={PX(3)} y2={PY(3)} stroke="#2563eb" strokeWidth={1.25} opacity={active >= 3 ? 0.35 : 1} />
                  <text x={PX(3)} y={PY(3) - 8} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb" opacity={active >= 3 ? 0.5 : 1}>p₁=t</text>
                  {active <= 2 && (
                    <>
                      <circle cx={PX(0)} cy={PY(0)} r={3.5} fill="#2563eb" />
                      <circle cx={PX(1)} cy={PY(1)} r={3.5} fill="#2563eb" />
                    </>
                  )}
                </g>
              )}
              {active === 2 && (
                <g>
                  <line x1={PX(2)} x2={PX(2)} y1={PY(0)} y2={PY(2)} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={PX(2)} cy={PY(2)} r={4.5} fill="none" stroke="#d97706" strokeWidth={1.25} />
                  <text x={PX(2) - 8} y={PY(2) - 8} textAnchor="end" fontSize={10} fontWeight={700} fill="#d97706">p₁(2)=2</text>
                </g>
              )}
              {active >= 3 && (
                <g>
                  <line x1={PX(0)} y1={PY(0)} x2={PX(3)} y2={PY(6)} stroke="#d97706" strokeWidth={1.25} />
                  <text
                    x={active === 4 ? PX(1) - 6 : PX(3) - 6}
                    y={active === 4 ? PY(2) - 6 : PY(6) - 2}
                    textAnchor="end"
                    fontSize={10}
                    fontWeight={700}
                    fill="#d97706"
                  >
                    p₂=2t
                  </text>
                  <circle cx={PX(0)} cy={PY(0)} r={3.5} fill="#d97706" />
                  <circle cx={PX(1)} cy={PY(2)} r={3.5} fill="#d97706" />
                </g>
              )}
              {active === 4 && (
                <g>
                  <line x1={PX(3)} x2={PX(3)} y1={PY(0)} y2={PY(6)} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={PX(3)} cy={PY(6)} r={5} fill="none" stroke="#0f766e" strokeWidth={1.25} />
                  <text x={PX(3) - 10} y={PY(6) + 4} textAnchor="end" fontSize={10} fontWeight={700} fill="#0f766e">p₂(3)=6</text>
                </g>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
