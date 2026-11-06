import SceneShell from "./SceneShell";

/**
 * 본문 대응: #probability — n=4의 쌍별 실패 상한 2/16, 여섯 쌍 합 3/4, 성공 하한 1/4, 강한 조건의 (n−1)/n²=3/16.
 * 전체를 64칸으로 그립니다. 2/16=8칸(한 줄), 6ln(n)/c 조건의 쌍별 상한 2/n³=2/64=2칸(유도: 2exp(−kc/2)에 k=6ln(n)/c 대입).
 */
const RED = "#dc2626";
const BLUE = "#2563eb";
const GRAY = "#64748b";
const W = 340;
const H = 214;
const CELL = 21;
const GAP = 3;
const X0 = 58;
const Y0 = 8;
const PAIRS = ["1–2", "1–3", "1–4", "2–3", "2–4", "3–4", "", ""] as const;

const SCENES = [
  { label: "한 쌍의 실패 상한", summary: "2/n² = 2/16 = 8칸", note: "전체 64칸 중 한 쌍이 틀어질 가능성의 상한 2/16이 한 줄입니다. 실제 빈도가 아니라 증명에서 얻은 상한입니다." },
  { label: "여섯 쌍을 합치기", summary: "6 × 2/16 = 3/4", note: "n=4면 n(n−1)/2=6쌍입니다. 실패가 겹칠 수 있어도 겹치지 않는다고 치고 더하므로 전체 실패 상한은 여섯 줄, 곧 48칸입니다." },
  { label: "남은 칸이 성공 하한", summary: "1/4 = 1/n", note: "남은 두 줄 16칸이 한 번 뽑아 성공할 확률의 하한 1/4입니다. 1−1/n=3/4는 실패 상한이지 성공 하한이 아닙니다." },
  { label: "4를 6으로 바꾼 조건", summary: "실패 3/16 → 성공 13/16 이상", note: "k≥6ln(n)/c이면 쌍별 상한이 2칸으로 줄어 합이 12칸, (n−1)/n²=3/16입니다. 남은 52칸은 3/4인 48칸보다 많아 성공 1−1/n 이상을 말할 수 있습니다." },
] as const;

export default function UnionBoundGridViz() {
  return (
    <SceneShell
      eyebrow="실패 확률을 칸으로 더하기"
      title="쌍마다의 실패 상한을 더하면 남는 칸이 성공 하한입니다"
      description="64칸이 확률 전체입니다. 한 줄이 점 쌍 하나이고 빨간 칸이 그 쌍의 실패 상한입니다."
      note="n=4의 네 점을 대입한 증명의 상한이며 실제 성공 빈도를 측정한 값이 아닙니다."
      ariaLabel="네 점의 여섯 쌍 실패 상한을 칸으로 더한 합집합 계산"
      scenes={SCENES}
      render={(active) => {
        const rows = active === 0 ? 1 : 6;
        const perRow = active === 3 ? 2 : 8;
        const failed = rows * perRow;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PAIRS.map((pair, row) => (
              <g key={row}>
                <text x={X0 - 8} y={Y0 + row * (CELL + GAP) + 15} textAnchor="end" fontSize={12} fill={GRAY}>{pair ? `쌍 ${pair}` : ""}</text>
                {Array.from({ length: 8 }, (_, col) => {
                  const isFail = row < rows && col < perRow;
                  const isSuccess = active >= 2 && !isFail;
                  return (
                    <rect
                      key={col}
                      x={X0 + col * (CELL + GAP)}
                      y={Y0 + row * (CELL + GAP)}
                      width={CELL}
                      height={CELL}
                      rx={2}
                      fill={isFail ? RED : isSuccess ? BLUE : "none"}
                      fillOpacity={isFail ? 0.65 : isSuccess ? 0.22 : 0}
                      stroke={isFail ? RED : isSuccess ? BLUE : "#94a3b8"}
                      strokeWidth={1}
                    />
                  );
                })}
              </g>
            ))}
            <text x={W - 2} y={40} textAnchor="end" fontSize={13} fontWeight={700} fill={RED}>{`${failed}칸`}</text>
            <text x={W - 2} y={58} textAnchor="end" fontSize={12} fill={RED}>실패 상한</text>
            {active >= 2 && <text x={W - 2} y={150} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>{`${64 - failed}칸`}</text>}
            {active >= 2 && <text x={W - 2} y={168} textAnchor="end" fontSize={12} fill={BLUE}>성공 하한</text>}
          </svg>
        );
      }}
    />
  );
}
