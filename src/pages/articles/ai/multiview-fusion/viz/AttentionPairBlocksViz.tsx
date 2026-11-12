import SceneShell from "./FusionSceneShell";

/**
 * 본문 대응: #attention-fusion 계산량 식 — 관측 4개 × 196토큰.
 * 칸 하나 = query 관측 196토큰 × key 관측 196토큰 = 38,416쌍.
 * 16칸 = 614,656(784²), 측면 누락 9칸 = 345,744(588²),
 * 정면 query → 밑창·위쪽 key만 두면 2칸 = 76,832(설명용 구성, 가정).
 */
const VIEWS = ["정면", "측면", "밑창", "위쪽"] as const;

type Mode = "full" | "drop" | "cross";

const SCENES = [
  {
    label: "관측 4개 모두",
    summary: "784² = 16칸 × 38,416 = 614,656쌍",
    mode: "full" as Mode,
    note: "칸 하나는 한 관측의 토큰 196개가 다른 관측(자기 자신 포함)의 토큰 196개와 점수를 하나씩 계산하는 구역으로, 196 × 196 = 38,416쌍입니다. 관측이 4개면 가로 4 × 세로 4 = 16칸입니다.",
  },
  {
    label: "측면이 빠진 묶음",
    summary: "588² = 9칸 × 38,416 = 345,744쌍",
    mode: "drop" as Mode,
    note: "측면 mask가 0이면 측면의 가로줄과 세로줄이 함께 사라집니다. 토큰은 4분의 1이 줄었지만 칸은 16개에서 9개로, 쌍은 268,912개(16칸 중 7칸) 줄어듭니다. 관측 수가 제곱에 들어간다는 뜻이 이것입니다.",
  },
  {
    label: "정면 query만 조회 (가정)",
    summary: "2칸 × 38,416 = 76,832쌍",
    mode: "cross" as Mode,
    note: "정면 패치가 query가 되어 밑창·위쪽의 key만 보는 cross-attention 구성을 가정하면 2칸만 계산합니다. 대신 밑창↔위쪽처럼 나머지 칸의 관계는 계산하지 않으므로, 비용을 줄인 방법마다 무엇을 줄였는지 함께 비교해야 합니다.",
  },
] as const;

const X0 = 64;
const Y0 = 44;
const CELL = 62;
const GAP = 4;
const W = X0 + 4 * CELL + 3 * GAP + 12;
const H = Y0 + 4 * CELL + 3 * GAP + 10;

function isActive(mode: Mode, row: number, col: number) {
  if (mode === "full") return true;
  if (mode === "drop") return row !== 1 && col !== 1;
  return row === 0 && (col === 2 || col === 3);
}

export default function AttentionPairBlocksViz() {
  return (
    <SceneShell
      eyebrow="점수 쌍 세기"
      title="관측 하나가 빠지면 점수 칸은 가로줄과 세로줄이 함께 사라집니다"
      description="왼쪽 이름은 query 토큰이 나온 관측, 위쪽 이름은 key 토큰이 나온 관측입니다. 관측마다 토큰 196개를 남긴다는 본문 예를 씁니다."
      ariaLabel="관측별 토큰 블록으로 나눈 attention 점수 행렬에서 관측 누락과 cross-attention의 쌍 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
                return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[330px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={X0 + (4 * CELL + 3 * GAP) / 2} y={14} textAnchor="middle" fontSize={11} fill="#64748b">key 관측 →</text>
              <text x={8} y={Y0 - 8} fontSize={11} fill="#64748b">query ↓</text>
              {VIEWS.map((name, index) => {
                const missing = scene.mode === "drop" && index === 1;
                const color = missing ? "#94a3b8" : "#64748b";
                return (
                  <g key={name}>
                    <text x={X0 + index * (CELL + GAP) + CELL / 2} y={34} textAnchor="middle" fontSize={12} fill={color} textDecoration={missing ? "line-through" : undefined}>{name}</text>
                    <text x={X0 - 8} y={Y0 + index * (CELL + GAP) + CELL / 2 + 4} textAnchor="end" fontSize={12} fill={color} textDecoration={missing ? "line-through" : undefined}>{name}</text>
                  </g>
                );
              })}
              {VIEWS.map((_, row) =>
                VIEWS.map((__, col) => {
                  const on = isActive(scene.mode, row, col);
                  const x = X0 + col * (CELL + GAP);
                  const y = Y0 + row * (CELL + GAP);
                  return (
                    <g key={`${row}-${col}`}>
                      <rect x={x} y={y} width={CELL} height={CELL} rx={4} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.14 : undefined} stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} />
                      {on && <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={10} fill="#2563eb">38,416</text>}
                    </g>
                  );
                }),
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
